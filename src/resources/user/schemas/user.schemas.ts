import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, ValidatorProps } from 'mongoose';
import { UserRole } from 'src/resources/support/enum';
import { Garant } from 'src/resources/garant/schema/garant.schema';
import { emailRegex } from 'src/resources/support/support';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({
    required: true,
    unique: true,
    index: true,
    validate: {
      validator: (v: string) => emailRegex.test(v),
      message: (props: ValidatorProps) =>
        `${props.value} Ce n'est pas un format d'adresse e-mail valide.`,
    },
  })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ enum: UserRole, default: UserRole.LOCATAIRE })
  role: UserRole;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
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
