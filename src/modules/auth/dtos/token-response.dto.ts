import type { Role } from 'src/modules/auth/domain/enums/role.enum';

export interface TokenResponseDto {
  user: {
    id: number;
    email: string;
    role: Role[];
  }
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
