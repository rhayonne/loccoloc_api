import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail, isIBAN, IsIBAN, Validate, validate } from 'class-validator';
import { HydratedDocument, Types } from 'mongoose';

export type GarantDocument = HydratedDocument<Garant>;

const isIbanValid = (iban: string) => {
  return iban.startsWith('FR') && iban.length > 10;
};

@Schema()
export class Garant {
  @Prop({})
  firstName: string;

  @Prop({})
  lastName: string;

  @Prop({})
  phone: string;

  @IsEmail({
    ignore_max_length: false,
    require_tld: true,
    require_display_name: true,
  })
  @Prop({})
  email: string;

  @Prop({})
  rib: string;

  @Prop({ type: Types.ObjectId, ref: 'Use', required: true })
  owner: Types.ObjectId;
}

export const GarantSchema = SchemaFactory.createForClass(Garant);
