import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { Types } from 'mongoose';
import { StatusRoomContract } from 'src/resources/support/enum';

export class CreateRoomDto {
  @IsString()
  name: string;

  @IsString()
  propertyId: string;

  @IsString()
  description: string;

  @IsNumber()
  surface: number;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsEnum(StatusRoomContract)
  statusRoom?: StatusRoomContract;

  @IsOptional()
  @IsBoolean()
  isDisponible?: boolean;
}
