import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { Property, PropertyDocument } from './schemas/property.schemas';
import { RoomsService } from '../rooms/rooms.service';

@Injectable()
export class PropertyService {
  constructor(
    @InjectModel(Property.name) private propertyModel: Model<PropertyDocument>,
    private roomsService: RoomsService, // Inject RoomsService
  ) {}

  async create(createPropertyDto: CreatePropertyDto): Promise<Property> {
    const { roomIds, ...propertyData } = createPropertyDto;

    // Create the property
    const createdProperty = new this.propertyModel(propertyData);
    const savedProperty = await createdProperty.save();

    // If there are selected rooms, attach them to the property
    if (roomIds && roomIds.length > 0) {
      await Promise.all(
        roomIds.map((roomId) =>
          this.roomsService.attachToProperty(
            roomId,
            savedProperty._id.toString(),
          ),
        ),
      );
    }

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

  async findOne(id: string): Promise<Property> {
    const property = await this.propertyModel
      .findById(id)
      .populate('typeProperty')
      .populate('owner')
      .populate('rooms')
      .exec();

    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }

    return property;
  }

  async update(
    id: string,
    updatePropertyDto: UpdatePropertyDto,
  ): Promise<Property> {
    const { roomIds, ...propertyData } = updatePropertyDto;

    // Update property data
    const updatedProperty = await this.propertyModel
      .findByIdAndUpdate(id, propertyData, { new: true })
      .exec();

    if (!updatedProperty) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }

    // If there are new rooms to attach
    if (roomIds && roomIds.length > 0) {
      // First, detach all old rooms from this property
      const oldRooms = await this.roomsService.findAll();
      const roomsToDetach = oldRooms.filter(
        (room) => room.property?.toString() === id,
      );

      await Promise.all(
        roomsToDetach.map((room) =>
          this.roomsService.detachFromProperty((room as any)._id.toString()),
        ),
      );

      // Then, attach the new rooms
      await Promise.all(
        roomIds.map((roomId) => this.roomsService.attachToProperty(roomId, id)),
      );
    }

    return updatedProperty;
  }

  async remove(id: string): Promise<void> {
    const property = await this.propertyModel.findById(id);

    if (!property) {
      throw new NotFoundException(
        `Erreur dans la tentative de supprimer la proprieté`,
      );
    }

    // Detach all rooms before deleting the property
    const rooms = await this.roomsService.findAll();
    const roomsToDetach = rooms.filter(
      (room) => room.property?.toString() === id,
    );

    await Promise.all(
      roomsToDetach.map((room) =>
        this.roomsService.detachFromProperty((room as any)._id.toString()),
      ),
    );

    // Delete the property
    await this.propertyModel.findByIdAndDelete(id).exec();
  }
}
