import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuth0Guard extends AuthGuard('jwt-auth0') {}
