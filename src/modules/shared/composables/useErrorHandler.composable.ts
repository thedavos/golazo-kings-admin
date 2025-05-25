import { ref } from 'vue';
import { useQuasarNotifications } from 'src/composables/useQuasarNotifications';

export interface ErrorState {
  hasError: boolean;
  message: string;
  details?: any;
}

export function useErrorHandler() {
  const { notifyError } = useQuasarNotifications();

  const errorState = ref<ErrorState>({
    hasError: false,
    message: '',
    details: null,
  });

  const handleError = (error: any, context?: string) => {
    console.error(`[ERROR${context ? ` - ${context}` : ''}]`, error);

    let message = 'Ha ocurrido un error inesperado';

    if (error.response?.data?.errors) {
      message = Array.isArray(error.response.data.errors)
        ? error.response.data.errors.join(', ')
        : error.response.data.errors;
    } else if (error.message) {
      message = error.message;
    }

    errorState.value = {
      hasError: true,
      message,
      details: error,
    };

    notifyError(message);
  };

  const clearError = () => {
    errorState.value = {
      hasError: false,
      message: '',
      details: null,
    };
  };

  return {
    errorState,
    handleError,
    clearError,
  };
}
