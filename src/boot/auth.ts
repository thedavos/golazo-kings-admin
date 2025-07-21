import { defineBoot } from '#q-app/wrappers';
import { useAuthStore } from 'src/modules/auth/stores/auth.store';

export default defineBoot(async ({ router }) => {
  const authStore = useAuthStore();

  try {
    await authStore.initializeAuth();
  } catch (e) {
    const error = e as Error;
    console.error('Error initializing auth:', error);
  }

  router.beforeEach(async (to, from, next) => {
    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

    if (!requiresAuth) {
      return next();
    }

    if (!authStore.isAuthenticated) {
      const isSuccess = await authStore.refreshTokenAsync();

      if (isSuccess) {
        next();
      } else {
        next('/login');
      }
    } else {
      next();
    }
  });
});
