import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type GarantDocument = HydratedDocument<Garant>;

@Schema()
export class Garant {
  @Prop({})
  firstName: string;

  @Prop({})
  lastName: string;

  @Prop({})
  phone: string;

  @Prop({})
  email: string;

  @Prop({})
  rib: string;
}

export const GarantSchema = SchemaFactory.createForClass(Garant);
