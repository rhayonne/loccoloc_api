import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './resources/user/user.module';
import { GarantModule } from './resources/garant/garant.module';
import { AuthController } from './auth/controllers/auth.controller';
import { AuthService } from './auth/services/auth.service';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
// import { AuthGuard } from '@nestjs/passport';
import { HttpExceptionFilter } from './util/errors/http-exceptions';
import { EquipementsModule } from './resources/equipements/equipements.module';
import { Guard } from './auth/guards/jwt-auth-guard';

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
    EquipementsModule,
  ],
  controllers: [AppController, AuthController],
  providers: [
    AppService,
    AuthService,
    // Bloq l'accès à tous les route! Utiliser @Public() pour transformer la route en une route ouverte.
    { provide: APP_GUARD, useClass: Guard },

    // Traiter les erreurs (customisatin des erreurs)
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
