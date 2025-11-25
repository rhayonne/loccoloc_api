import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.create(createRoomDto);
  }

  @Get()
  findAll() {
    return this.roomsService.findAll();
  }

  // ESSENTIAL ENDPOINT: returns only available rooms for frontend select
  @Get('available')
  findAvailable() {
    return this.roomsService.findAvailable();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomsService.update(id, updateRoomDto);
  }

  // Endpoint to attach a room to a property
  @Patch(':roomId/attach/:propertyId')
  attachToProperty(
    @Param('roomId') roomId: string,
    @Param('propertyId') propertyId: string,
  ) {
    return this.roomsService.attachToProperty(roomId, propertyId);
  }

  // Endpoint to detach a room from a property
  @Patch(':roomId/detach')
  detachFromProperty(@Param('roomId') roomId: string) {
    return this.roomsService.detachFromProperty(roomId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomsService.remove(id);
  }
}
