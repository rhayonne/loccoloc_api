import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { TypesProperty } from 'src/resources/types_property/schemas/types_property.schemas';

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
  images: string[];

  @Prop({ required: true })
  owner: Types.ObjectId;
}

export const PropertySchema = SchemaFactory.createForClass(Property);
