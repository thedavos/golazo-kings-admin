import type { Role } from 'src/modules/auth/domain/entities/role.entity';
import type { RefreshToken } from 'src/modules/auth/domain/entities/refreshToken.entity';

export class User {
  public readonly id: number;
  public readonly email: string;
  public readonly roles: Role[];
  public readonly refreshTokens: RefreshToken[];
  public readonly managedTeamId: number | null;
  public readonly lastLogin: Date | null;
  public readonly failedLoginAttempts: number;
  public readonly isBlocked: boolean;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(
    id: number,
    email: string,
    roles: Role[],
    refreshTokens: RefreshToken[],
    managedTeamId: number | null,
    lastLogin: string | null,
    failedLoginAttempts: number,
    isBlocked: boolean,
    createdAt: string,
    updatedAt: string,
  ) {
    this.id = id;
    this.email = email;
    this.roles = roles;
    this.refreshTokens = refreshTokens || [];
    this.managedTeamId = managedTeamId;
    this.failedLoginAttempts = failedLoginAttempts;
    this.isBlocked = isBlocked;
    this.lastLogin = lastLogin ? new Date(lastLogin) : null;
    this.createdAt = new Date(createdAt);
    this.updatedAt = new Date(updatedAt);
  }
}
