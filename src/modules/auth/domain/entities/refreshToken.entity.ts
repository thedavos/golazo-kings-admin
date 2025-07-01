import type { User } from 'src/modules/auth/domain/entities/user.entity';

export class RefreshToken {
  public readonly id: number;
  public readonly token: string;
  public readonly expiresAt: Date;
  public readonly userId: number;
  public readonly revoked: boolean;
  public readonly revokedAt: Date;
  public readonly userAgent: string;
  public readonly ipAddress: string;
  public readonly user: User;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(
    id: number,
    token: string,
    expiresAt: Date,
    userId: number,
    revoked: boolean,
    revokedAt: Date,
    userAgent: string,
    ipAddress: string,
    user: User,
    createdAt: string,
    updatedAt: string,
  ) {
    this.id = id;
    this.token = token;
    this.expiresAt = expiresAt;
    this.userId = userId;
    this.revoked = revoked;
    this.revokedAt = revokedAt;
    this.userAgent = userAgent;
    this.ipAddress = ipAddress;
    this.user = user;
    this.createdAt = new Date(createdAt);
    this.updatedAt = new Date(updatedAt);
  }

  fromJson(data: any): RefreshToken {
    return new RefreshToken(
      data.id,
      data.token,
      data.expiresAt,
      data.userId,
      data.revoked,
      data.revokedAt,
      data.userAgent,
      data.ipAddress,
      data.user,
      data.createdAt,
      data.updatedAt,
    );
  }
}
