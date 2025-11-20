import { Injectable } from '@nestjs/common';
import { CreateGarantDto } from './dto/create-garant.dto';
import { UpdateGarantDto } from './dto/update-garant.dto';

@Injectable()
export class GarantService {
  create(createGarantDto: CreateGarantDto) {
    return 'This action adds a new garant';
  }

  findAll() {
    return `This action returns all garant`;
  }

  findOne(id: number) {
    return `This action returns a #${id} garant`;
  }

  update(id: number, updateGarantDto: UpdateGarantDto) {
    return `This action updates a #${id} garant`;
  }

  remove(id: number) {
    return `This action removes a #${id} garant`;
  }
}
