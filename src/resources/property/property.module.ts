import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PropertyService } from './property.service';
import { PropertyController } from './property.controller';
import { Property, PropertySchema } from './schemas/property.schemas';
import { RoomsModule } from '../rooms/rooms.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Property.name, schema: PropertySchema },
    ]),
    RoomsModule, // Import RoomsModule to use RoomsService
  ],
  controllers: [PropertyController],
  providers: [PropertyService],
})
export class PropertyModule {}
