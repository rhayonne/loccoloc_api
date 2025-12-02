import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type RoomsDocument = HydratedDocument<Rooms>;

@Schema()
export class Rooms {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  surface: number;

  @Prop({ required: true })
  price: number;

  // ref 1 x 1 - A room can only belong to one property
  @Prop({ type: Types.ObjectId, ref: 'Property', default: null })
  property: Types.ObjectId;

  // Flag to control if the room has already been attached to a property
  @Prop({ default: true })
  isAvailable: boolean;
}

export const RoomsSchema = SchemaFactory.createForClass(Rooms);
