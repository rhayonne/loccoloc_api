import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GarantService } from '../garant/garant.service';
import { CreateGarantDto } from '../garant/dto/create-garant.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly garantService: GarantService,
  ) {}

  @Post()
  create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Post(':userId/garant')
  async addGarant(
    @Param('userId') userId: string,
    //This veriofys if user is  "Locataire"
    @Body(ValidationPipe) createGarantDto: CreateGarantDto,
  ) {
    const newGarant = await this.garantService.create(createGarantDto);
    return this.userService.addGarantToUser(userId, newGarant._id);
  }
}
