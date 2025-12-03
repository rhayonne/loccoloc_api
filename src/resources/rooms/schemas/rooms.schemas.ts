import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { StatusRoomContract } from 'src/resources/support/enum';

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

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: Types.ObjectId;

  @Prop({ enum: StatusRoomContract, default: StatusRoomContract.FREE })
  statusRoom: StatusRoomContract;

  // // Flag to control if the room has already been attached to a locataire
  // @Prop({ default: true })
  // isAvailable: boolean;

  //The owner can choose whether or not the property is available for rent, which will also determine whether or not the property will be listed for viewing.
  @Prop({ default: true })
  isDisponible: boolean;
}

export const RoomsSchema = SchemaFactory.createForClass(Rooms);
