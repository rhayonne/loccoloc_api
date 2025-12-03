import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { UserRole } from '../support/enum';

@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Post()
  create(@Body() createPropertyDto: CreatePropertyDto, @Request() req: any) {
    const ownerId = req.user.userId;

    return this.propertyService.create(createPropertyDto, ownerId);
  }

  @Get()
  findAll() {
    return this.propertyService.findAll();
  }

  @Get(':propertyId')
  findOne(@Param('propertyId') propertyId: string, @Request() req: any) {
    const ownerId = req.user.userId;
    const userRole = req.user.role as UserRole;

    return this.propertyService.findOne(propertyId, ownerId, userRole);
  }

  @Patch(':propertyId')
  update(
    @Param('id') id: string,
    @Request() req: any,
    @Body() updatePropertyDto: UpdatePropertyDto,
  ) {
    const ownerId = req.user.userId;
    return this.propertyService.update(id, updatePropertyDto, ownerId);
  }

  @Delete(':propertyId')
  remove(@Param('propertyId') propertyId: string, @Request() req: any) {
    const ownerId = req.user.userId;
    return this.propertyService.remove(propertyId, ownerId);
  }
}
