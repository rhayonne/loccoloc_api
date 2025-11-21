import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Prend les metadatas (roles necessaires) de la route
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(), // Prend les roles du methode - ex : @Get('admin')
      context.getClass(), // prend les roles de la classe - ex: @Controller
    ]);

    /* !!IMPORTANT pour le requiredRoles
        true = > permettre l'accès 
        false = > ne permettre pas l'accès
    */
    if (!requiredRoles) {
      return true;
    }
    // Prend l'utilisateur de la requisition (JwtStrategy)
    const { user } = context.switchToHttp().getRequest();
    // Verifie si le role de l'utisisateur a les role necessaire pour accèder la route
    return requiredRoles.some((role) => user.role === role);
  }
}
