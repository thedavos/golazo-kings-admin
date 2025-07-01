import { ApiClient } from 'src/modules/shared/api/client.api';
import type { LoginDto } from 'src/modules/auth/dtos/login.dto';
import type { TokenResponseDto } from 'src/modules/auth/dtos/token-response.dto';
import type { RegisterDto } from 'src/modules/auth/dtos/register.dto';
import type { AuthResponseDto } from 'src/modules/auth/dtos/auth-response.dto';
import type { UserResponseDto } from 'src/modules/auth/dtos/user-response.dto';

export class AuthService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient();
  }

  async login(loginDto: LoginDto): Promise<TokenResponseDto> {
    const loginResponse = await this.apiClient.post<TokenResponseDto>('/auth/login', loginDto);
    return loginResponse.data;
  }

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const registerResponse = await this.apiClient.post<AuthResponseDto>(
      '/auth/register',
      registerDto,
    );

    return registerResponse.data;
  }

  async refreshToken(refreshToken: string): Promise<TokenResponseDto> {
    const refreshResponse = await this.apiClient.post<TokenResponseDto>('/auth/refresh', {
      refreshToken,
    });
    return refreshResponse.data;
  }

  async logout(refreshToken: string): Promise<void> {
    await this.apiClient.post('/auth/logout', { refreshToken });
  }

  async getProfile(): Promise<UserResponseDto> {
    const profileResponse = await this.apiClient.get<UserResponseDto>('/auth/profile');
    return profileResponse.data;
  }
}
