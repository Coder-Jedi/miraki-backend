import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../interfaces/common.interface';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);