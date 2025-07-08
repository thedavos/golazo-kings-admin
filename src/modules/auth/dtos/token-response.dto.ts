import type { UserDto } from './user.dto';

export interface TokenResponseDto {
  user: UserDto;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
