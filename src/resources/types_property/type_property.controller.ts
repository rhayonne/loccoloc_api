import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TypePropertyService } from './type_property.service';
import { CreateTypePropertyDto } from './dto/create-type_property.dto';
import { UpdateTypePropertyDto } from './dto/update-type_property.dto';

@Controller('type-property')
export class TypePropertyController {
  constructor(private readonly typePropertyService: TypePropertyService) {}

  @Post()
  create(@Body() createTypePropertyDto: CreateTypePropertyDto) {
    return this.typePropertyService.create(createTypePropertyDto);
  }

  @Get()
  findAll() {
    return this.typePropertyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.typePropertyService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTypePropertyDto: UpdateTypePropertyDto) {
    return this.typePropertyService.update(+id, updateTypePropertyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.typePropertyService.remove(+id);
  }
}
