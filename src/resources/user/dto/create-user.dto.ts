import { Garant } from 'src/resources/garant/entities/garant.entity';
import { UserRole } from '../schemas/user.schemas';
import { IsEmail, IsNotEmpty, MinLength, minLength } from 'class-validator';

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
  role: UserRole;

  @IsNotEmpty({ message: 'Le champ prè-nom est obligatoire.' })
  firstName: string;

  @IsNotEmpty({ message: 'Le champ Nom est obligatoire.' })
  lastName: string;

  phone: string;

  dateOfBirth: Date;

  adress: string;

  garants: Garant[];
}
