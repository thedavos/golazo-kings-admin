import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { useMutation, useQueryCache } from '@pinia/colada';
import { LocalStorage } from 'quasar';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { useQuasarNotifications } from 'src/composables/useQuasarNotifications';
import { MESSAGES } from 'src/modules/shared/constants/messages.constant';
import type { LoginDto } from 'src/modules/auth/dtos/login.dto';
import type { Role } from 'src/modules/auth/domain/enums/role.enum';
import type { TokenResponseDto } from 'src/modules/auth/dtos/token-response.dto';

const CACHE_KEYS = {
  LOGIN: ['login'] as const,
} as const;

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  EXPIRES_IN: 'expires_in',
  ROLES: 'user_roles',
} as const;

export const useAuthStore = defineStore('auth', () => {
  const notifications = useQuasarNotifications();
  const queryCache = useQueryCache();

  // Services
  const authService = new AuthService();

  // State - inicializar desde localStorage
  const roles = ref<Role[]>(getStoredRoles());
  const accessToken = ref<string | null>(getStoredAccessToken());
  const refreshToken = ref<string | null>(getStoredRefreshToken());
  const expiresIn = ref<number | null>(getStoredExpiresIn());

  // Computed
  const isAuthenticated = computed(() => {
    return !!accessToken.value && !isTokenExpired();
  });

  const isTokenExpired = () => {
    if (!expiresIn.value) return true;
    return Date.now() >= expiresIn.value;
  };

  function getStoredAccessToken(): string | null {
    try {
      return LocalStorage.getItem<string>(STORAGE_KEYS.ACCESS_TOKEN);
    } catch {
      return null;
    }
  }

  function getStoredRefreshToken(): string | null {
    try {
      return LocalStorage.getItem<string>(STORAGE_KEYS.REFRESH_TOKEN);
    } catch {
      return null;
    }
  }

  function getStoredExpiresIn(): number | null {
    try {
      const stored = LocalStorage.getItem<string>(STORAGE_KEYS.EXPIRES_IN);
      return stored ? parseInt(stored, 10) : null;
    } catch {
      return null;
    }
  }

  function getStoredRoles(): Role[] {
    try {
      const stored = LocalStorage.getItem<string>(STORAGE_KEYS.ROLES);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  function saveTokensToStorage(tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    roles: Role[];
  }) {
    try {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
      localStorage.setItem(STORAGE_KEYS.EXPIRES_IN, tokens.expiresIn.toString());
      localStorage.setItem(STORAGE_KEYS.ROLES, JSON.stringify(tokens.roles));
    } catch (error) {
      console.error('Error saving tokens to storage:', error);
    }
  }

  function clearTokensFromStorage() {
    try {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.EXPIRES_IN);
      localStorage.removeItem(STORAGE_KEYS.ROLES);
    } catch (error) {
      console.error('Error clearing tokens from storage:', error);
    }
  }

  const setTokens = (loginData: TokenResponseDto) => {
    const expirationTime = Date.now() + loginData.expiresIn * 1000;

    roles.value = loginData.user.role;
    accessToken.value = loginData.accessToken;
    refreshToken.value = loginData.refreshToken;
    expiresIn.value = expirationTime;

    saveTokensToStorage({
      accessToken: loginData.accessToken,
      refreshToken: loginData.refreshToken,
      expiresIn: expirationTime,
      roles: loginData.user.role,
    });
  };

  const clearTokens = () => {
    roles.value = [];
    accessToken.value = null;
    refreshToken.value = null;
    expiresIn.value = null;
    clearTokensFromStorage();
  };

  const logout = async () => {
    try {
      if (refreshToken.value) {
        await authService.logout(refreshToken.value);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      clearTokens();
      await invalidateLoginCache();
    }
  };

  const refreshTokenMutation = useMutation({
    mutation: () => {
      if (!refreshToken.value) {
        throw new Error('No refresh token available');
      }
      return authService.refreshToken(refreshToken.value);
    },
    onSuccess(refreshData) {
      setTokens(refreshData);
    },
    onError(error) {
      console.error('Token refresh failed:', error);
      clearTokens();
    },
  });

  const refreshTokenAsync = async (): Promise<boolean> => {
    if (!refreshToken.value) return false;

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
    if (!refreshToken.value) return false;

    // Refrescar si el token expira en los próximos 5 minutos
    const fiveMinutesFromNow = Date.now() + 5 * 60 * 1000;

    if (expiresIn.value && expiresIn.value <= fiveMinutesFromNow) {
      return await refreshTokenAsync();
    }

    return true;
  };

  const invalidateLoginCache = async () => {
    const promises = [];
    promises.push(queryCache.invalidateQueries({ key: CACHE_KEYS.LOGIN }));
    await Promise.all(promises);
  };

  const loginMutation = useMutation({
    mutation: (loginDto: LoginDto) => authService.login(loginDto),
    async onSuccess(loginData) {
      setTokens(loginData);
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
    refreshToken,
    expiresIn,

    // Computed
    isAuthenticated,

    // Actions
    login: loginMutation.mutateAsync,
    logout,
    refreshTokenIfNeeded,
    refreshTokenAsync,
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
