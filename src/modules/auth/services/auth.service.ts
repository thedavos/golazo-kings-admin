import { ApiClient } from 'src/modules/shared/api/client.api';
import { LoginMapper } from 'src/modules/auth/mappers/login.mapper';
import type { LoginDto, LoginResponseDto } from 'src/modules/auth/dtos/login.dto';
import type { TokenResponseDto } from 'src/modules/auth/dtos/token-response.dto';
import type { RegisterDto } from 'src/modules/auth/dtos/register.dto';
import type { AuthResponseDto } from 'src/modules/auth/dtos/auth-response.dto';
import type { UserResponseDto } from 'src/modules/auth/dtos/user-response.dto';

export class AuthService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient();
  }

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const loginResponse = await this.apiClient.post<TokenResponseDto>('/auth/login', loginDto);
    return LoginMapper.fromDto(loginResponse.data);
  }

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const registerResponse = await this.apiClient.post<AuthResponseDto>(
      '/auth/register',
      registerDto,
    );

    return registerResponse.data;
  }

  async refreshToken(): Promise<TokenResponseDto> {
    const refreshResponse = await this.apiClient.post<TokenResponseDto>('/auth/refresh');

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
