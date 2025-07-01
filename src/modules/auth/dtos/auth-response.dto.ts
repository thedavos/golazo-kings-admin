import type { Role } from 'src/modules/auth/domain/enums/role.enum';

export interface AuthResponseDto {
  access_token: string;
  user: {
    id: number;
    email: string;
    role: Role[];
  };
}
