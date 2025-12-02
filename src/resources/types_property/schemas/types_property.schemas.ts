import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TypesPropertyDocument = HydratedDocument<TypesProperty>;

// types property : Appartement - Maison etc.

@Schema()
export class TypesProperty {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;
}

export const TypesPropertySchema = SchemaFactory.createForClass(TypesProperty);
