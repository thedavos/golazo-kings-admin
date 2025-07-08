import type { TokenResponseDto } from 'src/modules/auth/dtos/token-response.dto';
import { User } from 'src/modules/auth/domain/entities/user.entity';

export class LoginMapper {
  static fromDto(tokenResponseDto: TokenResponseDto) {
    return {
      user: new User(
        tokenResponseDto.user.id,
        tokenResponseDto.user.email,
        tokenResponseDto.user.roles,
        tokenResponseDto.user.refreshTokens,
        tokenResponseDto.user.managedTeamId,
        tokenResponseDto.user.lastLogin,
        tokenResponseDto.user.failedLoginAttempts,
        tokenResponseDto.user.isBlocked,
        tokenResponseDto.user.createdAt,
        tokenResponseDto.user.updatedAt,
      ),
      accessToken: tokenResponseDto.accessToken,
      refreshToken: tokenResponseDto.refreshToken,
      expiresIn: tokenResponseDto.expiresIn,
    };
  }

  static toDto(login: {
    user: User;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }): TokenResponseDto {
    return {
      user: {
        id: login.user.id,
        email: login.user.email,
        roles: login.user.roles,
        refreshTokens: login.user.refreshTokens,
        managedTeamId: login.user.managedTeamId,
        lastLogin: login.user.lastLogin ? login.user.lastLogin.toISOString() : null,
        failedLoginAttempts: login.user.failedLoginAttempts,
        isBlocked: login.user.isBlocked,
        createdAt: login.user.createdAt.toISOString(),
        updatedAt: login.user.updatedAt.toISOString(),
      },
      accessToken: login.accessToken,
      refreshToken: login.refreshToken,
      expiresIn: login.expiresIn,
    };
  }

  static fromDtos(tokenResponseDtos: TokenResponseDto[]) {
    return tokenResponseDtos.map((dto) => this.fromDto(dto));
  }
}
