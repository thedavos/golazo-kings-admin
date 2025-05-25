export const MESSAGES = {
  SUCCESS: {
    LEAGUE_CREATED: 'Liga creada exitosamente',
    LEAGUE_UPDATED: 'Liga actualizada exitosamente',
    LEAGUE_DELETED: 'Liga eliminada exitosamente',
    LEAGUE_ACTIVATED: 'Liga activada exitosamente',
    LEAGUE_DEACTIVATED: 'Liga desactivada exitosamente',
    LEAGUE_VISIBLE: 'Liga visible exitosamente',
    LEAGUE_HIDDEN: 'Liga oculta exitosamente',
  },

  ERROR: {
    GENERIC: 'Ha ocurrido un error inesperado',
    NETWORK: 'Error de conexión. Verifica tu conexión a internet',
    LEAGUE_NOT_FOUND: 'Liga no encontrada',
    VALIDATION: 'Por favor corrige los errores en el formulario',
    UNAUTHORIZED: 'No tienes permisos para realizar esta acción',
  },

  VALIDATION: {
    REQUIRED: 'Este campo es requerido',
    MIN_LENGTH: 'Debe tener al menos {min} caracteres',
    MAX_LENGTH: 'No puede tener más de {max} caracteres',
    INVALID_EMAIL: 'Email no válido',
    INVALID_URL: 'URL no válida',
    POSITIVE_NUMBER: 'Debe ser un número positivo',
  },

  CONFIRM: {
    DELETE_LEAGUE: '¿Estás seguro de que deseas eliminar esta liga?',
    UNSAVED_CHANGES: 'Tienes cambios sin guardar. ¿Deseas continuar?',
  },
} as const;
