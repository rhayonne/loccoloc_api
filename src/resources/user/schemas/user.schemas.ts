import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Garant } from 'src/resources/garant/schema/garant.schema';
// import { Garant } from 'src/resources/garant/schema/garant.schema';

export enum UserRole {
  LOCATAIRE = 'locataire',
  PROPRIETAIRE = 'proprietaire',
  SUPER_ADMIN = 'super_adimn',
}

// export interface Garant {
//   name: string;
//   phone: string;
//   rib: string;
// }

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ enum: UserRole, default: UserRole.LOCATAIRE })
  role: UserRole;

  @Prop({})
  firstName: string;

  @Prop({})
  lastName: string;

  @Prop({})
  phone: string;

  @Prop({})
  dateOfBirth: Date;

  @Prop({})
  adress: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Garant' }] })
  garants: Garant[];
}

export const DocumentNameSchema = SchemaFactory.createForClass(User);
