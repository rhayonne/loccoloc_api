import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './resources/user/user.module';
import { GarantModule } from './resources/garant/garant.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        `.env.${process.env.NODE_ENV}.local`,
        `.env.${process.env.NODE_ENV}`,
      ],
    }),
    MongooseModule.forRoot(`${process.env.MONGO_URI}`),
    AuthModule,
    UserModule,
    GarantModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
