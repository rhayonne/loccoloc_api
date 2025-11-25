import { Module } from '@nestjs/common';
import { TypePropertyService } from './type_property.service';
import { TypePropertyController } from './type_property.controller';

@Module({
  controllers: [TypePropertyController],
  providers: [TypePropertyService],
})
export class TypePropertyModule {}
