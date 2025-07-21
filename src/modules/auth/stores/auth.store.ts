import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { useMutation, useQueryCache } from '@pinia/colada';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { useQuasarNotifications } from 'src/composables/useQuasarNotifications';
import { LoginMapper } from 'src/modules/auth/mappers/login.mapper';
import { MESSAGES } from 'src/modules/shared/constants/messages.constant';
import type { LoginDto } from 'src/modules/auth/dtos/login.dto';
import type { Role } from 'src/modules/auth/domain/enums/role.enum';
import type { TokenResponseDto } from 'src/modules/auth/dtos/token-response.dto';

const CACHE_KEYS = {
  LOGIN: ['login'] as const,
} as const;

export const useAuthStore = defineStore('auth', () => {
  const notifications = useQuasarNotifications();
  const queryCache = useQueryCache();

  // Services
  const authService = new AuthService();

  const roles = ref<Role[]>();
  const accessToken = ref<string | null>();
  const tokenExpiry = ref<number | null>(null);
  const hasRefreshToken = ref<boolean>(false); // Flag para saber si hay cookie

  // Computed
  const isAuthenticated = computed(() => {
    return !!accessToken.value && !isTokenExpired();
  });

  const hasValidRefreshToken = computed(() => {
    return hasRefreshToken.value;
  });

  const isTokenExpired = () => {
    if (!tokenExpiry.value) return true;
    return Date.now() >= tokenExpiry.value;
  };

  const setTokens = (loginData: TokenResponseDto) => {
    const expirationTime = Date.now() + loginData.expiresIn * 1000;

    roles.value = loginData.user.roles.map((role) => role.name) as Role[];
    accessToken.value = loginData.accessToken;
    tokenExpiry.value = expirationTime;
    hasRefreshToken.value = true;
  };

  const clearTokens = () => {
    roles.value = [];
    accessToken.value = null;
    tokenExpiry.value = null;
    hasRefreshToken.value = false;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      clearTokens();
      await invalidateLoginCache();
    }
  };

  const refreshTokenMutation = useMutation({
    mutation: () => authService.refreshToken(),
    onSuccess(refreshData) {
      setTokens(refreshData);
    },
    onError(error) {
      console.error('Token refresh failed:', error);
      clearTokens();
    },
  });

  const refreshTokenAsync = async (): Promise<boolean> => {
    try {
      await refreshTokenMutation.mutateAsync();
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      clearTokens();
      return false;
    }
  };

  const refreshTokenIfNeeded = async () => {
    if (!hasValidRefreshToken.value) return false;

    // Refrescar si el token expira en los próximos 5 minutos
    const fiveMinutesFromNow = Date.now() + 5 * 60 * 1000;

    if (tokenExpiry.value && tokenExpiry.value <= fiveMinutesFromNow) {
      return await refreshTokenAsync();
    }

    return true;
  };

  const initializeAuth = async () => {
    try {
      await refreshTokenAsync();
    } catch (e) {
      const error = e as Error;
      console.error('Failed to initialize auth:', error);
      clearTokens();
    }
  };

  const invalidateLoginCache = async () => {
    const promises = [];
    promises.push(queryCache.invalidateQueries({ key: CACHE_KEYS.LOGIN }));
    await Promise.all(promises);
  };

  const loginMutation = useMutation({
    mutation: (loginDto: LoginDto) => authService.login(loginDto),
    async onSuccess(loginData) {
      setTokens(LoginMapper.toDto(loginData));
      await invalidateLoginCache();
    },
    onError(error) {
      notifications.notifyError(MESSAGES.ERROR.GENERIC);
      throw error;
    },
  });

  return {
    // State
    roles,
    accessToken,
    tokenExpiry,

    // Computed
    isAuthenticated,
    hasValidRefreshToken,

    // Actions
    login: loginMutation.mutateAsync,
    logout,
    refreshTokenIfNeeded,
    refreshTokenAsync,
    initializeAuth,
    clearTokens,

    // Loading states
    loginLoading: loginMutation.isLoading,
    refreshLoading: refreshTokenMutation.isLoading,

    // Errors
    loginError: loginMutation.error,
    refreshError: refreshTokenMutation.error,

    // Data
    loginData: loginMutation.data,
  };
});
