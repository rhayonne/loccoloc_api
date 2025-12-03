import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { Property, PropertyDocument } from './schemas/property.schemas';
import { RoomsService } from '../rooms/rooms.service';
import { UserRole } from '../support/enum';

@Injectable()
export class PropertyService {
  constructor(
    @InjectModel(Property.name) private propertyModel: Model<PropertyDocument>,
    private roomsService: RoomsService, // Inject RoomsService
  ) {}

  async create(
    createPropertyDto: CreatePropertyDto,
    ownerId: string,
  ): Promise<Property> {
    const { roomIds, ...propertyData } = createPropertyDto;

    // Create the property
    const createdProperty = new this.propertyModel({
      ...propertyData,
      owner: ownerId,
    });
    const savedProperty = await createdProperty.save();

    return savedProperty;
  }

  async findAll(): Promise<Property[]> {
    return this.propertyModel
      .find()
      .populate('typeProperty')
      .populate('owner')
      .populate('rooms')
      .exec();
  }

  async findOne(
    propertyId: string,
    ownerId: string,
    userRole: UserRole,
  ): Promise<Property | null> {
    if (userRole === UserRole.PROPRIETAIRE) {
      return this.checkOwnership(propertyId, ownerId);
    }
    return this.propertyModel.findById(propertyId).exec();
  }

  async findPropertiesByRole(
    userId: string,
    userRole: UserRole,
  ): Promise<Property[]> {
    const query: any = {};
    if (userRole === UserRole.PROPRIETAIRE) {
      query.owner = userId;
      return this.propertyModel
        .find(query)
        .populate('owner')
        .populate('typeProperty')
        .populate('rooms')
        .exec();
    } else {
      query.isDisponible = true;

      const ownerProjection = {
        path: 'owner',
        select: 'firstName LastName phone email',
      };
      const roomsProjection = {
        path: 'rooms',
      };

      return this.propertyModel
        .find(query)
        .populate('typeProperty')
        .populate(ownerProjection)
        .populate(roomsProjection)
        .exec();
    }
  }

  async update(
    propertyId: string,
    updatePropertyDto: UpdatePropertyDto,
    ownerId: string,
  ): Promise<Property | null> {
    await this.checkOwnership(propertyId, ownerId);

    return this.propertyModel
      .findByIdAndUpdate(propertyId, { $set: updatePropertyDto }, { new: true })
      .exec();
  }

  async remove(propertyId: string, ownerId: string): Promise<any> {
    await this.checkOwnership(propertyId, ownerId);

    return this.propertyModel.deleteOne({ _id: propertyId });
  }

  // auxiliates to verify property
  private async checkOwnership(propertyId: string, ownerId: string) {
    const property = await this.propertyModel.findById(propertyId).exec();
    if (!property) {
      throw new NotFoundException(
        ` Proprieté avec Id ${propertyId}, non trouvée`,
      );
    }

    if (property.owner.toString() !== ownerId) {
      throw new ForbiddenException(
        `Accès refusé. Vous n'êtes pas proprietaire de cette proprieté`,
      );
    }
    return property;
  }
}
