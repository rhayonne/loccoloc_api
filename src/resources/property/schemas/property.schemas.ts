import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
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

  // ref 1 x 1
  @Prop({ type: Types.ObjectId, ref: 'TypesProperty' })
  typeProperty: TypesProperty;

  @Prop({})
  location: string;

  @Prop({ required: true })
  imagesProperty: string[];

  @Prop({ required: true, type: [{ type: Types.ObjectId, ref: 'Room' }] })
  rooms: Types.ObjectId[];

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  owner: User;
}

export const PropertySchema = SchemaFactory.createForClass(Property);
