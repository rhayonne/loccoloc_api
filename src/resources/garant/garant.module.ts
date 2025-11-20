import { Module } from '@nestjs/common';
import { GarantService } from './garant.service';
import { GarantController } from './garant.controller';

@Module({
  controllers: [GarantController],
  providers: [GarantService],
})
export class GarantModule {}
