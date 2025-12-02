import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type EquipementsDocument = HydratedDocument<Equipements>;

@Schema()
export class Equipements {
  @Prop({})
  name: string;

  @Prop({})
  desciption: string;

  @Prop({})
  dateAquisition: Date;
}

export const EquiementsSchema = SchemaFactory.createForClass(Equipements);
