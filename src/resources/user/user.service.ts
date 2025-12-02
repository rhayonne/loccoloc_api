import { BadRequestException, Injectable, Type } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schemas';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserRole } from '../support/enum';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: string): Promise<UserDocument | null> {
    return this.userModel.findById({ id }).exec();
  }
  findOneByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).select('+password').exec();
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }

  async addGarantToUser(
    userId: string,
    garantId: Types.ObjectId,
  ): Promise<UserDocument | null> {
    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      throw new BadRequestException('Utilisateur non trouvé');
    }
    if (user.role !== UserRole.LOCATAIRE) {
      throw new BadRequestException(
        `Seulement utilisateurs avec les Locataires, peuvent ajouter des garants`,
      );
    }

    //verifys if garants exists in user
    const userGarantexists = user.garants.some(
      (existingGarantId) =>
        existingGarantId.toString() === garantId.toHexString(),
    );

    return this.userModel
      .findByIdAndUpdate(
        userId,
        {
          $push: { garants: garantId },
        },
        { new: true }, //returns the document updated
      )
      .exec();
  }
}
