import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail, isIBAN, IsIBAN, Validate, validate } from 'class-validator';
import { HydratedDocument, Types } from 'mongoose';
import { IsFrIBANConstraint } from 'src/resources/support/support';

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
  @IsIBAN({ message: `Le RIB doit suivre le format inernational IBAN.` })
  @Validate(IsFrIBANConstraint)
  rib: string;
}

export const GarantSchema = SchemaFactory.createForClass(Garant);
