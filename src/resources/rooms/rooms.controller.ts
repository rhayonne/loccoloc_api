import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  Request,
  Query,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post(':propertyId')
  createRoomInProperty(
    @Body(ValidationPipe) createRoomDto: CreateRoomDto,
    @Param('porpertyId') propertyId: string,
    @Request() req: any,
  ) {
    return this.roomsService.create(createRoomDto, propertyId, req.user.userId);
  }

  @Get()
  findAll(
    @Request() req: any,
    @Query() filters: { filter?: string; [key: string]: any },
  ) {
    const userId = req.user.userId;
    const userRole = req.user.role;
    return this.roomsService.findRoomsByRole(userId, userRole, filters);
  }

  // ESSENTIAL ENDPOINT: returns only available rooms for frontend select
  @Get('available')
  findAvailable() {
    return this.roomsService.findAvailable();
  }

  //find by room id
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.roomsService.findOne(id, req.user.userId);
  }
  //update room by property
  @Patch(':id')
  update(
    @Body() updateRoomDto: UpdateRoomDto,
    @Param('id') id: string,
    @Request() req: any,
  ) {
    return this.roomsService.update(id, req.user.userId, updateRoomDto);
  }

  // // Endpoint to detach a room from a property
  // @Patch(':roomId/detach')
  // detachFromProperty(@Param('roomId') roomId: string) {
  //   return this.roomsService.detachFromProperty(roomId);
  // }

  @Delete(':id')
  remove(@Param('id') id: string, ownerId: string) {
    return this.roomsService.remove(id, ownerId);
  }
}
