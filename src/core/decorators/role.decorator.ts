import { SetMetadata } from '@nestjs/common';
import { Role } from '../role';

export const ROLES_KEY = 'roles';

/**
 * Roles decorator to assign roles to routes.
 * This decorator sets a metadata key that indicates the roles required to access the route.
 *
 * Usage:
 * ```typescript
 * @Roles(Role.Admin, Role.User)
 * @Get('admin-endpoint')
 * async adminEndpoint() {
 *   return 'This is an admin endpoint';
 * }
 * ```
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
