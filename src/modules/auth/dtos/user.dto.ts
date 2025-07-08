import type { Role } from 'src/modules/auth/domain/entities/role.entity';
import type { RefreshToken } from 'src/modules/auth/domain/entities/refreshToken.entity';

export interface UserDto {
  id: number;
  email: string;
  roles: Role[];
  refreshTokens: RefreshToken[];
  managedTeamId: number | null;
  lastLogin: string | null;
  failedLoginAttempts: number;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}
