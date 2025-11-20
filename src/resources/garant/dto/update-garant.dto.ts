import { PartialType } from '@nestjs/mapped-types';
import { CreateGarantDto } from './create-garant.dto';

export class UpdateGarantDto extends PartialType(CreateGarantDto) {}
