import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Validate,
  validate,
} from 'class-validator';
import { ValidationRIB } from 'src/resources/support/support';

export class CreateGarantDto {
  @IsEmail({
    ignore_max_length: false,
    require_tld: true,
    require_display_name: true,
  })
  email: string;

  @IsNotEmpty({ message: 'Le RIB est Obligatorie' })
  @IsString({ message: 'Le RIB doit être une chaîne de caractères' })
  @Validate(ValidationRIB)
  rib: string;

  owner: string;
}
