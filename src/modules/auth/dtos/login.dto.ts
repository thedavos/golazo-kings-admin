import type { User } from 'src/modules/auth/domain/entities/user.entity';

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
