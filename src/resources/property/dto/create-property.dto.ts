import { IsString, IsNumber, IsArray, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class CreatePropertyDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  address: string;

  @IsNumber()
  surfaceTotal: number;

  @IsNumber()
  price: number;

  @IsOptional()
  typeProperty?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsArray()
  @IsString({ each: true })
  imagesProperty: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roomIds?: string[]; // IDs of rooms to be attached

  @IsString()
  owner: string;
}
