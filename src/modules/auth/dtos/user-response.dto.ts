import type { Role } from 'src/modules/auth/domain/enums/role.enum';
import type { Permission } from 'src/modules/auth/domain/enums/permission.enum';

export interface UserResponseDto {
  id: string;
  email: string;
  roles: Role[];
  permissions: Permission[];
  managedTeamId?: number;
  createdAt: Date;
  updatedAt: Date;
}
