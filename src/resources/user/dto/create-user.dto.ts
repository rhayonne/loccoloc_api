import { Garant } from 'src/resources/garant/entities/garant.entity';
import {
  IsEmail,
  IsEnum,
  IsIBAN,
  IsNotEmpty,
  MinLength,
} from 'class-validator';
import { UserRole } from 'src/resources/support/enum';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Le champ email est obligatoire.' })
  @IsEmail({
    ignore_max_length: false,
    require_tld: true,
    require_display_name: true,
  })
  email: string;

  @IsNotEmpty({ message: 'Le champ password est obligatoire.' })
  @MinLength(6, {
    message: 'Le mot de passe doit avoir au minimum 6 caractères.',
  })
  password: string;

  @IsNotEmpty({ message: 'Le champ Role est obligatoire.' })
  @IsEnum(UserRole, {
    message: ` La valeur du champ Role doit être un valeur connu.`,
  })
  role: UserRole;

  @IsNotEmpty({ message: 'Le champ prè-nom est obligatoire.' })
  firstName: string;

  @IsNotEmpty({ message: 'Le champ Nom est obligatoire.' })
  lastName: string;

  @IsIBAN()
  iban: string;

  phone: string;

  dateOfBirth: Date;

  adress: string;

  garants: Garant[];
}
