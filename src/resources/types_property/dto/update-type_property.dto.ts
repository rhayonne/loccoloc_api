import { PartialType } from '@nestjs/mapped-types';
import { CreateTypePropertyDto } from './create-type_property.dto';

export class UpdateTypePropertyDto extends PartialType(CreateTypePropertyDto) {}
