import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGarantDto } from './dto/create-garant.dto';
import { UpdateGarantDto } from './dto/update-garant.dto';
import { Garant, GarantDocument } from './schemas/garant.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class GarantService {
  constructor(
    @InjectModel(Garant.name) private GarantModel: Model<GarantDocument>,
  ) {}

  async create(
    createGarantDto: CreateGarantDto,
    ownerId: string,
  ): Promise<GarantDocument> {
    const creatNewGarant = new this.GarantModel({
      ...createGarantDto,
      ownerId: ownerId,
    });
    return creatNewGarant.save();
  }

  //rever isso
  findAll(ownerId: string) {
    return this.GarantModel.find({ owner: ownerId }).exec();
  }

  async findOne(garantId: string, ownerId: string): Promise<Garant | null> {
    const garant = await this.GarantModel.findOne({
      _id: garantId,
      owner: ownerId,
    }).exec();
    if (!garant) {
      throw new NotFoundException(`Garant non trouvé ou accès refusé`);
    }
    return garant;
  }

  async update(
    id: string,
    ownerId: string,
    updateGarantDto: UpdateGarantDto,
  ): Promise<Garant | null> {
    const updateGarant = await this.GarantModel.findOneAndUpdate(
      { _id: id, owner: ownerId },
      UpdateGarantDto,
      {
        new: true,
        runValidators: true, // do the validations on UpdateGarantDto
      },
    ).exec();
    if (!updateGarant) {
      throw new NotFoundException(`Garant non trouvé ou accès refusé`);
    }
    return updateGarant;
  }

  async remove(id: string, ownerId: string): Promise<string | null> {
    const delGarant = await this.GarantModel.findOneAndDelete({
      _id: id,
      owner: ownerId,
    })
      .select({ firstName: 1 })
      .exec();

    if (!delGarant) {
      throw new NotFoundException(`Garant non trouvé ou accès refusé.`);
    }
    return delGarant.firstName;
  }
}
