import { IsString, IsNumber, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class CreateRoomDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  surface: number;

  @IsNumber()
  price: number;

  @IsOptional()
  property?: Types.ObjectId;

  @IsOptional()
  isAvailable?: boolean;
}
