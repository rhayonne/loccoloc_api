import { Injectable } from '@nestjs/common';
import { UserService } from 'src/resources/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userservice: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userservice.findOneByEmail(email);
    if (!user) {
      return null;
    }
    const isMatch = await bcrypt.compare(pass, user.password);

    if (isMatch) {
      const { password, ...result } = user.toObject();

      return result;
    }
    return null;
  }
  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user._id,
      role: user.role,
    };
    return { acces_token: this.jwtService.sign(payload) };
  }
}
