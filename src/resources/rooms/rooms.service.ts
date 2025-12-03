import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Rooms, RoomsDocument } from './schemas/rooms.schemas';
import { StatusRoomContract, UserRole } from '../support/enum';
import { Contract } from 'src/contract/schemas/contract.schemas';

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel(Rooms.name) private roomsModel: Model<RoomsDocument>,
    @InjectModel(Contract.name) private contractModel: Model<Contract>,
  ) {}

  async create(
    createRoomDto: CreateRoomDto,
    propertyId: string,
    userId: string,
  ): Promise<Rooms> {
    const createdRoom = new this.roomsModel({
      ...createRoomDto,
      statusRoom: StatusRoomContract.FREE, // By default, the room is available
      property: propertyId, // Not yet attached to any property
      owner: userId,
    });
    return createdRoom.save();
  }

  //find with filters
  async findRoomsByRole(
    userId: string,
    userRole: UserRole,
    filters: { filter?: string; propertyId?: string; [key: string]: any },
  ): Promise<Rooms[]> {
    const query: any = {};
    const populatedFields = ['property', 'owner'];

    if (userRole === UserRole.PROPRIETAIRE) {
      // Proprietário: Vê SOMENTE seus quartos
      query.owner = userId;

      // Filtro Opcional: Se o proprietário estiver filtrando por um imóvel específico
      if (filters.propertyId) {
        query.property = filters.propertyId;
      }
    } else if (
      userRole === UserRole.LOCATAIRE ||
      userRole === UserRole.ANONYMOUS
    ) {
      query.isDisponible = true;
    } else {
      // Outras Roles (ex: SUPER_ADMIN) - Retorna vazio ou implemente lógica específica
      //TRABALHAR NESSA LOGICA
      return [];
    }
    if (
      userRole !== UserRole.PROPRIETAIRE &&
      filters.filter === 'no_contract'
    ) {
      const occupiedRoomIds = await this.getOccupiedRoomIds();

      //permete o locatario procurar por quartos que nao tem contrato nenhum
      query._id = { $nin: occupiedRoomIds };
    }

    return this.roomsModel.find(query).populate(populatedFields).exec();
  }

  //Auxiliates to bring rooms with actives contract
  private async getOccupiedRoomIds(): Promise<Types.ObjectId[]> {
    const today = new Date();

    const occupiedContracts = await this.contractModel
      .find({
        //verify the contracts active or pending
        status: {
          $in: [StatusRoomContract.ACTIVE, StatusRoomContract.PENDING],
        },
        endDate: { $gte: today },
      })
      .select('roomId')
      .exec();
    return occupiedContracts.map((c) => c.roomId);
  }

  // ESSENTIAL method: returns only available rooms (not attached)
  async findAvailable(): Promise<Rooms[]> {
    return this.roomsModel.find({ isAvailable: true, property: null }).exec();
  }

  async findOne(id: string, ownerId: string): Promise<Rooms> {
    const room = await this.roomsModel
      .findOne({ _id: id, owner: ownerId })
      .populate('property')
      .exec();
    if (!room) {
      throw new NotFoundException(`Room non trouvé ou accès refusé.`);
    }
    return room;
  }

  async update(
    id: string,
    ownerId: string,
    updateRoomDto: UpdateRoomDto,
  ): Promise<Rooms> {
    const updatedRoom = await this.roomsModel
      .findOneAndUpdate(
        { _id: id, owner: ownerId }, //  Double safety filter
        updateRoomDto,
        { new: true, runValidators: true },
      )
      .exec();

    if (!updatedRoom) {
      throw new NotFoundException(`Chambre non trouvé ou accès refusé.`);
    }
    return updatedRoom;
  }

  // 6. DELETE (Filter by Owner + Check Contract)
  async remove(id: string, ownerId: string): Promise<void> {
    // Verify actives contracts
    const activeContract = await this.contractModel
      .findOne({
        roomId: id,
        status: {
          $in: [StatusRoomContract.ACTIVE, StatusRoomContract.PENDING],
        },
        endDate: { $gte: new Date() },
      })
      .exec();

    if (activeContract) {
      throw new BadRequestException(
        `Il est impossible de supprimer une chambre dont le contrat est actif ou en cours de traitement. Contract ID ${activeContract._id} .`,
      );
    }

    // Deleta usando o filtro de segurança (ID E Dono)
    const delRoom = await this.roomsModel
      .findOneAndDelete({ _id: id, owner: ownerId })
      .exec();

    if (!delRoom) {
      throw new NotFoundException(
        `Erreur au supprimer, chambre non trouvé ou accès refusé.`,
      );
    }
  }
}
