export interface ComparisonResult<T> {
  hasChanges: boolean;
  changes: {
    added: Partial<T>;
    deleted: Partial<T>;
    modified: { [K in keyof T]?: { oldValue: T[K]; newValue: T[K] } };
  };
}

/**
 * Utilidad para comparar dos objetos y detectar cambios.
 * Realiza una comparación superficial (shallow comparison).
 */
export const objectComparer = {
  /**
   * Compara dos objetos y devuelve un informe detallado de las diferencias.
   * @param originalObject El objeto original o "viejo".
   * @param updatedObject El objeto nuevo con los posibles cambios.
   * @returns Un objeto `ComparisonResult` con los detalles de los cambios.
   */
  compare<T extends object>(originalObject: T, updatedObject: T): ComparisonResult<T> {
    const result: ComparisonResult<T> = {
      hasChanges: false,
      changes: {
        added: {},
        deleted: {},
        modified: {},
      },
    };

    // Obtener todas las claves únicas de ambos objetos para no omitir ninguna
    const allKeys = new Set([...Object.keys(originalObject), ...Object.keys(updatedObject)]);

    for (const key of allKeys) {
      const keyTyped = key as keyof T;

      const inOriginal = Object.prototype.hasOwnProperty.call(originalObject, keyTyped);
      const inUpdated = Object.prototype.hasOwnProperty.call(updatedObject, keyTyped);

      const originalValue = originalObject[keyTyped];
      const updatedValue = updatedObject[keyTyped];

      if (inUpdated && !inOriginal) {
        // --- Clave Añadida ---
        result.hasChanges = true;
        result.changes.added[keyTyped] = updatedValue;
      } else if (inOriginal && !inUpdated) {
        // --- Clave Eliminada ---
        result.hasChanges = true;
        result.changes.deleted[keyTyped] = originalValue;
      } else if (inOriginal && inUpdated && originalValue !== updatedValue) {
        // --- Clave Modificada ---
        result.hasChanges = true;
        result.changes.modified[keyTyped] = {
          oldValue: originalValue,
          newValue: updatedValue,
        };
      }
    }

    return result;
  },
};
