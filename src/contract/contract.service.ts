import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { Contract } from './schemas/contract.schemas';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StatusContract } from 'src/resources/support/enum';
import {
  Rooms,
  RoomsDocument,
} from 'src/resources/rooms/schemas/rooms.schemas';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AuditContractLog } from 'src/resources/audit/schemas/auditCronContractLog.schemas';

@Injectable()
export class ContractService {
  constructor(
    @InjectModel(Contract.name) private contractModel: Model<Contract>,
    @InjectModel(Rooms.name) private roomsModel: Model<RoomsDocument>,
    @InjectModel(AuditContractLog.name)
    private auditContractLogModel: Model<AuditContractLog>,
  ) {}

  create(
    createContractDto: CreateContractDto,
    locataireId: string,
  ): Promise<Contract> {
    const createdContract = new this.contractModel({
      ...createContractDto,
      locataireId: locataireId,
      statusRoom: StatusContract.PENDING,
    });
    return createdContract.save();
  }

  findAll() {
    return `This action returns all contract`;
  }

  findOne(id: number) {
    return `This action returns a #${id} contract`;
  }

  update(id: number, updateContractDto: UpdateContractDto) {
    return `This action updates a #${id} contract`;
  }

  remove(id: number) {
    return `This action removes a #${id} contract`;
  }

  //!! important - Owner accept the contract
  async acceptedContract(
    contractId: string,
    propertyOwnerId: string,
  ): Promise<Contract> {
    const contract = await this.contractModel.findById(contractId).exec();

    if (!contract || contract.statusRoom !== StatusContract.PENDING) {
      throw new BadRequestException('Contrat non valide ou non pendent ');
    }
    const hasConflict = await this.checkLocataireConflict(
      contract.locataireId.toString(),
      contract.startDate,
      contract.endDate,
      contractId,
    );

    const room = await this.roomsModel.findById(contract.roomId).exec();

    if (!room || room.owner.toString() !== propertyOwnerId) {
      throw new ForbiddenException(
        `Vous n'avez pas les droits pour accepter ce contrat, vous n'êtes pas proprietaire de ce contrat`,
      );
    }

    if (hasConflict) {
      throw new BadRequestException(
        ' Le locataire a déjà un contrat pour les dates sélectionnées.',
      );
    }

    contract.statusRoom = StatusContract.ACTIVE;

    return contract.save();
  }

  async checkLocataireConflict(
    locataireId: string,
    newStartDate: Date,
    newEndDate: Date,
    excludeContractId: string,
  ): Promise<boolean> {
    const query: any = {
      locataireId: locataireId,
      statusRoom: StatusContract.ACTIVE,
      startDate: { $lt: newEndDate },
      endDate: { $gt: newStartDate },
    };

    //exclude the actuel contract if is update method
    if (excludeContractId) {
      query._id = { $ne: excludeContractId };
    }
    const conflictContracts = await this.contractModel
      .find(query)
      .limit(1)
      .exec();

    return conflictContracts.length > 0;
  }

  // CRON MIDNIGHT
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleContractExpiration() {
    console.log('Début du mise à jour des contrats...');

    const contractsToTerminate = await this.contractModel
      .find({
        statusRoom: StatusContract.ACTIVE,
        endDate: { $lte: new Date() },
      })
      .select('_id statusRoom')
      .exec();
    if (contractsToTerminate.length === 0) return;

    //modify all contracts
    await this.contractModel
      .updateMany(
        { _id: { $in: contractsToTerminate.map((c) => c._id) } },
        {
          $set: {
            statusRoom: StatusContract.TERMINATED,
            statusLastChangedDate: new Date(),
            lastModifiedBy: 'SYSTEM (Cron Job)',
          },
        },
      )
      .exec();

    // make logs to each modification

    const logEntries = contractsToTerminate.map((c) => ({
      documentId: c._id,
      collectionName: 'Contract',
      action: 'STATUS_UPDATE_TERMINATED',
      oldStatus: c.statusRoom,
      newStatus: StatusContract.TERMINATED,
      userId: 'SYSTEM (Cron Job)',
    }));
    console.log(
      `[CRON]: ${contractsToTerminate.length} Contrats - Les modifications ont été enregistrés dan le Log`,
    );
  }
}
