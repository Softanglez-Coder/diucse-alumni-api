import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Public decorator to mark routes as public.
 * This decorator sets a metadata key that indicates the route is public
 * and does not require authentication.
 *
 * Usage:
 * ```typescript
 * @Public()
 * @Get('public-endpoint')
 * async publicEndpoint() {
 *   return 'This is a public endpoint';
 * }
 * ```
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
