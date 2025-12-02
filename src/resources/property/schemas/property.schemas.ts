import { Rooms } from './../../rooms/schemas/rooms.schemas';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Equipements } from 'src/resources/equipements/schemas/equipemenst.schema';
import { TypesProperty } from 'src/resources/types_property/schemas/types_property.schemas';
import { User } from 'src/resources/user/schemas/user.schemas';

export type PropertyDocument = HydratedDocument<Property>;

@Schema()
export class Property {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  surfaceTotal: number;

  @Prop({ required: true })
  price: number;

  // ref 1 x n
  @Prop({ type: Types.ObjectId, ref: 'TypesProperty' })
  typeProperty: TypesProperty;

  // Equipements Commons
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Equipements' }] })
  commonEquipements: Equipements[] | Types.ObjectId[];

  @Prop({})
  mapLocalisation: string;

  @Prop({})
  imagesProperty: string[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Rooms' }] })
  rooms: Rooms[] | Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'User' })
  owner: User;
}

export const PropertySchema = SchemaFactory.createForClass(Property);
