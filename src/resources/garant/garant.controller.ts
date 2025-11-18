import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
} from '@nestjs/common';
import { GarantService } from './garant.service';
import { CreateGarantDto } from './dto/create-garant.dto';
import { UpdateGarantDto } from './dto/update-garant.dto';

@Controller('garant')
export class GarantController {
  constructor(private readonly garantService: GarantService) {}

  @Post()
  create(@Body(ValidationPipe) createGarantDto: CreateGarantDto) {
    return this.garantService.create(createGarantDto);
  }

  @Get()
  findAll() {
    return this.garantService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.garantService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateGarantDto: UpdateGarantDto,
  ) {
    return this.garantService.update(+id, updateGarantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.garantService.remove(+id);
  }
}
