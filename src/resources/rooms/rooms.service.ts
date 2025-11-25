import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Rooms, RoomsDocument } from './schemas/rooms.schemas';

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel(Rooms.name) private roomsModel: Model<RoomsDocument>,
  ) {}

  async create(createRoomDto: CreateRoomDto): Promise<Rooms> {
    const createdRoom = new this.roomsModel({
      ...createRoomDto,
      isAvailable: true, // By default, the room is available
      property: null, // Not yet attached to any property
    });
    return createdRoom.save();
  }

  async findAll(): Promise<Rooms[]> {
    return this.roomsModel.find().populate('property').exec();
  }

  // ESSENTIAL method: returns only available rooms (not attached)
  async findAvailable(): Promise<Rooms[]> {
    return this.roomsModel.find({ isAvailable: true, property: null }).exec();
  }

  async findOne(id: string): Promise<Rooms> {
    const room = await this.roomsModel.findById(id).populate('property').exec();
    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }
    return room;
  }

  async update(id: string, updateRoomDto: UpdateRoomDto): Promise<Rooms> {
    const room = await this.roomsModel.findById(id);
    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }

    // Does not allow updating if already attached (except to detach)
    if (
      !room.isAvailable &&
      updateRoomDto.property !== undefined &&
      updateRoomDto.property !== null
    ) {
      throw new BadRequestException(
        'This room is already attached to a property and cannot be modified',
      );
    }

    const updatedRoom = await this.roomsModel
      .findByIdAndUpdate(id, updateRoomDto, { new: true })
      .exec();

    if (!updatedRoom) {
      throw new NotFoundException(`Room with ID ${id} not found after update`);
    }

    return updatedRoom;
  }

  // Method to attach a room to a property
  async attachToProperty(roomId: string, propertyId: string): Promise<Rooms> {
    const room = await this.roomsModel.findById(roomId);

    if (!room) {
      throw new NotFoundException(`Room with ID ${roomId} not found`);
    }

    if (!room.isAvailable) {
      throw new BadRequestException(
        'This room is already attached to another property',
      );
    }

    room.property = propertyId as any;
    room.isAvailable = false;
    return room.save();
  }

  // Method to detach a room from a property (if needed)
  async detachFromProperty(roomId: string): Promise<Rooms> {
    const room = await this.roomsModel.findById(roomId);

    if (!room) {
      throw new NotFoundException(`Room with ID ${roomId} not found`);
    }

    room.property = undefined as any;
    room.isAvailable = true;
    return room.save();
  }

  async remove(id: string): Promise<void> {
    const room = await this.roomsModel.findById(id);
    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }

    // Does not allow deletion if attached
    if (!room.isAvailable) {
      throw new BadRequestException(
        'Cannot delete a room that is attached to a property',
      );
    }

    await this.roomsModel.findByIdAndDelete(id).exec();
  }
}
