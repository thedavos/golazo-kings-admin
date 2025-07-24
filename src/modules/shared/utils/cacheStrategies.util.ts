/**
 * Estrategias de caché predefinidas para @pinia/colada
 * Centraliza la configuración de staleTime y gcTime
 */

// 🏷️ Tipos de estrategia disponibles
export type CacheStrategy =
  | 'realtime' // Datos en tiempo real
  | 'frequent' // Datos que cambian frecuentemente
  | 'moderate' // Datos que cambian moderadamente
  | 'stable' // Datos estables
  | 'static' // Datos muy estables/configuración
  | 'aggressive' // Cache muy agresivo
  | 'minimal'; // Cache mínimo

// ⏰ Constantes de tiempo (en milisegundos)
const TIME_CONSTANTS = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
} as const;

// 📊 Configuración de estrategias
const CACHE_STRATEGIES: Record<
  CacheStrategy,
  { staleTime: number; gcTime: number; description: string }
> = {
  // 🔴 Tiempo Real - Chat, notificaciones, métricas en vivo
  realtime: {
    staleTime: 0, // Siempre obsoleto
    gcTime: 2 * TIME_CONSTANTS.MINUTE, // 2 minutos en cache
    description: 'Datos en tiempo real que cambian constantemente',
  },

  // 🟠 Frecuente - Posts, comentarios, actividad reciente
  frequent: {
    staleTime: 30 * TIME_CONSTANTS.SECOND, // 30 segundos
    gcTime: 5 * TIME_CONSTANTS.MINUTE, // 5 minutos en cache
    description: 'Datos que cambian frecuentemente',
  },

  // 🟡 Moderado - Listas de usuarios, equipos, proyectos
  moderate: {
    staleTime: TIME_CONSTANTS.MINUTE, // 1 minuto
    gcTime: 10 * TIME_CONSTANTS.MINUTE, // 10 minutos en cache
    description: 'Datos que cambian moderadamente',
  },

  // 🟢 Estable - Perfiles, configuración de usuario, catálogos
  stable: {
    staleTime: 5 * TIME_CONSTANTS.MINUTE, // 5 minutos
    gcTime: 30 * TIME_CONSTANTS.MINUTE, // 30 minutos en cache
    description: 'Datos estables que cambian ocasionalmente',
  },

  // 🔵 Estático - Configuración del sistema, constantes, roles
  static: {
    staleTime: 30 * TIME_CONSTANTS.MINUTE, // 30 minutos
    gcTime: 2 * TIME_CONSTANTS.HOUR, // 2 horas en cache
    description: 'Datos muy estables o configuración del sistema',
  },

  // 🟣 Agresivo - Para optimizar performance extrema
  aggressive: {
    staleTime: 15 * TIME_CONSTANTS.MINUTE, // 15 minutos
    gcTime: TIME_CONSTANTS.DAY, // 1 día en caché
    description: 'Cache muy agresivo para datos raramente modificados',
  },

  // ⚪ Mínimo - Para datos muy sensibles o debugging
  minimal: {
    staleTime: 0, // Siempre obsoleto
    gcTime: TIME_CONSTANTS.MINUTE, // 1 minuto en cache
    description: 'Cache mínimo para datos muy sensibles',
  },
};

/**
 * Obtiene la configuración de caché para una estrategia específica
 */
export function getCacheStrategy(strategy: CacheStrategy) {
  const config = CACHE_STRATEGIES[strategy];

  if (!config) {
    console.warn(`⚠️ Estrategia de cache desconocida: ${strategy}. Usando 'moderate' por defecto.`);
    return CACHE_STRATEGIES.moderate;
  }

  return config;
}

/**
 * Crea una configuración de caché personalizada
 */
export function createCustomCacheStrategy(
  staleMinutes: number,
  gcMinutes: number,
  description?: string,
) {
  return {
    staleTime: staleMinutes * TIME_CONSTANTS.MINUTE,
    gcTime: gcMinutes * TIME_CONSTANTS.MINUTE,
    description: description || `Custom: ${staleMinutes}min stale, ${gcMinutes}min gc`,
  };
}

/**
 * Configuraciones temáticas para diferentes tipos de datos
 */
export const THEME_STRATEGIES = {
  // 👥 Gestión de usuarios
  users: {
    list: getCacheStrategy('moderate'), // Lista de usuarios
    profile: getCacheStrategy('stable'), // Perfil individual
    currentUser: getCacheStrategy('frequent'), // Usuario actual
  },

  // 🏢 Gestión de equipos/organizaciones
  teams: {
    list: getCacheStrategy('moderate'), // Lista de equipos
    detail: getCacheStrategy('moderate'), // Detalle de equipo
  },

  // ⚙️ Configuración del sistema
  system: {
    config: getCacheStrategy('static'), // Configuración global
    permissions: getCacheStrategy('stable'), // Permisos
    roles: getCacheStrategy('static'), // Roles del sistema
  },

  // 📊 Analytics y métricas
  analytics: {
    realtime: getCacheStrategy('realtime'), // Métricas en tiempo real
    daily: getCacheStrategy('moderate'), // Reportes diarios
    historical: getCacheStrategy('aggressive'), // Datos históricos
  },

  // 💬 Comunicación
  communication: {
    messages: getCacheStrategy('realtime'), // Mensajes de chat
    notifications: getCacheStrategy('frequent'), // Notificaciones
    announcements: getCacheStrategy('stable'), // Anuncios
  },
} as const;

/**
 * Utilidad para debugging - muestra todas las estrategias disponibles
 */
export function logCacheStrategies() {
  console.group('🗂️ Estrategias de Cache Disponibles');

  Object.entries(CACHE_STRATEGIES).forEach(([name, config]) => {
    const staleMin = Math.round((config.staleTime / TIME_CONSTANTS.MINUTE) * 100) / 100;
    const gcMin = Math.round((config.gcTime / TIME_CONSTANTS.MINUTE) * 100) / 100;

    console.log(
      `📋 ${name.padEnd(10)} | Stale: ${staleMin}min | GC: ${gcMin}min | ${config.description}`,
    );
  });

  console.groupEnd();
}

// 🚨 Validación de configuración (solo en desarrollo)
if (import.meta.env.DEV) {
  // Verificar que staleTime < gcTime en todas las estrategias
  Object.entries(CACHE_STRATEGIES).forEach(([name, config]) => {
    if (config.staleTime > config.gcTime) {
      console.error(
        `❌ Error en estrategia '${name}': staleTime (${config.staleTime}) debe ser menor que gcTime (${config.gcTime})`,
      );
    }
  });
}
