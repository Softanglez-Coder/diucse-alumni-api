import { Request } from 'express';
import { Role } from '../role';

export interface RequestExtension extends Request {
  user?: {
    id?: string;
    email?: string;
    roles?: Role[];
  };
}
