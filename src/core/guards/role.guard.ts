import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../role';
import { ROLES_KEY } from '../decorators';

/**
 * RolesGuard
 * 
 * This guard checks if the user has the required roles to access a route.
 * It retrieves the required roles from the route metadata using the ROLES_KEY.
 * If the user has at least one of the required roles, access is granted.
 * If no roles are specified, access is granted by default.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}
