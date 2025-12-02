import { Injectable } from '@nestjs/common';
import { CreateEquipementDto } from './dto/create-equipement.dto';
import { UpdateEquipementDto } from './dto/update-equipement.dto';

@Injectable()
export class EquipementsService {
  create(createEquipementDto: CreateEquipementDto) {
    return 'This action adds a new equipement';
  }

  findAll() {
    return `This action returns all equipements`;
  }

  findOne(id: number) {
    return `This action returns a #${id} equipement`;
  }

  update(id: number, updateEquipementDto: UpdateEquipementDto) {
    return `This action updates a #${id} equipement`;
  }

  remove(id: number) {
    return `This action removes a #${id} equipement`;
  }
}
