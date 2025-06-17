import { getCacheStrategy, THEME_STRATEGIES } from 'src/modules/shared/utils/cacheStrategies.util';

export function useCacheConfig() {
  /**
   * Obtiene configuración para un tipo de dato específico
   */
  const getThemeStrategy = (theme: keyof typeof THEME_STRATEGIES, subtype: string) => {
    const themeConfig = THEME_STRATEGIES[theme];
    if (!themeConfig || !(subtype in themeConfig)) {
      console.warn(`⚠️ Configuración no encontrada: ${theme}.${subtype}`);
      return getCacheStrategy('moderate');
    }
    return (themeConfig as any)[subtype];
  };

  /**
   * Configuración reactiva para diferentes contextos
   */
  const getContextualStrategy = (context: 'mobile' | 'desktop' | 'slow-network') => {
    const baseStrategy = getCacheStrategy('moderate');

    switch (context) {
      case 'mobile':
        // Menos caché en móvil para ahorrar memoria
        return {
          staleTime: baseStrategy.staleTime,
          gcTime: Math.floor(baseStrategy.gcTime * 0.5),
        };

      case 'slow-network':
        // Más cache con conexión lenta
        return {
          staleTime: baseStrategy.staleTime * 2,
          gcTime: baseStrategy.gcTime * 2,
        };

      default:
        return baseStrategy;
    }
  };

  return {
    getCacheStrategy,
    getThemeStrategy,
    getContextualStrategy,
    themes: THEME_STRATEGIES,
  };
}
