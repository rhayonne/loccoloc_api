import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../decorators/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { Public } from '../decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req: any) {
    return this.authService.login(req.user);
  }

  //accessible ifs admin and need a jwt (guard)
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Get('admin-data')
  getAdminData(@Request() req: any) {
    return {
      message: 'Youre admin',
      user: req.user,
    };
  }
}
