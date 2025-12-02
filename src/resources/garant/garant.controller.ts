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
} from '@nestjs/common';
import { GarantService } from './garant.service';
import { CreateGarantDto } from './dto/create-garant.dto';
import { UpdateGarantDto } from './dto/update-garant.dto';

@Controller('garant')
export class GarantController {
  constructor(private readonly garantService: GarantService) {}

  @Post()
  create(
    @Body(ValidationPipe) createGarantDto: CreateGarantDto,
    @Request() req: any,
  ) {
    return this.garantService.create(createGarantDto, req.user.userId);
  }

  @Get()
  findAll(@Request() req: any) {
    return this.garantService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.garantService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateGarantDto: UpdateGarantDto,
    @Request() req: any,
  ) {
    return this.garantService.update(id, req.user.userID, updateGarantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.garantService.remove(id, req.user.userID);
  }
}
