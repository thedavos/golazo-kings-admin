import { computed } from 'vue';
import { useQuasar } from 'quasar';

interface UseTeamDialogOptions {
  mode: 'create' | 'edit';
  hasChanges?: () => boolean;
}

/**
 * Composable for managing team dialog UI and interactions
 * @param options Configuration options
 * @returns Dialog UI properties and methods
 */
export function useTeamDialog(options: UseTeamDialogOptions) {
  const { mode, hasChanges } = options;
  const $q = useQuasar();

  // Computed properties for dialog UI
  const dialogTitle = computed(() =>
    mode === 'create' ? 'Nuevo Equipo' : 'Editar Equipo'
  );

  const dialogIcon = computed(() =>
    mode === 'create' ? 'add' : 'edit'
  );

  const submitButtonLabel = computed(() =>
    mode === 'create' ? 'Crear Equipo' : 'Guardar Cambios'
  );

  /**
   * Confirms cancellation with a dialog if there are unsaved changes
   * @returns Promise that resolves to true if cancellation is confirmed, false otherwise
   */
  const confirmCancel = (): Promise<boolean> => {
    if (mode === 'edit' && hasChanges && hasChanges()) {
      return new Promise((resolve) => {
        $q.dialog({
          title: 'Confirmar',
          message: '¿Estás seguro de que quieres cancelar? Se perderán los cambios no guardados.',
          cancel: true,
          persistent: true
        }).onOk(() => {
          resolve(true);
        }).onCancel(() => {
          resolve(false);
        });
      });
    }
    return Promise.resolve(true);
  };

  return {
    dialogTitle,
    dialogIcon,
    submitButtonLabel,
    confirmCancel,
  };
}
