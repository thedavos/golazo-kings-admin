import { Notify } from 'quasar';

export interface UseQuasarNotificationReturn {
  notifySuccess: (message: string) => void;
  notifyError: (message: string) => void;
  notifyInfo: (message: string) => void;
  notifyWarning: (message: string) => void;
}

export function useQuasarNotifications(): UseQuasarNotificationReturn {
  const notifyError = (message: string) => {
    Notify.create({
      type: 'negative',
      message,
      position: 'top',
      timeout: 5000,
      actions: [{ icon: 'close', color: 'white' }],
    });
  };

  const notifySuccess = (message: string) => {
    Notify.create({
      type: 'positive',
      message,
      position: 'top',
      timeout: 3000,
      actions: [{ icon: 'close', color: 'white' }],
    });
  };

  const notifyWarning = (message: string) => {
    Notify.create({
      type: 'warning',
      message,
      position: 'top',
      timeout: 4000,
      actions: [{ icon: 'close', color: 'white' }],
    });
  };

  const notifyInfo = (message: string) => {
    Notify.create({
      type: 'info',
      message,
      position: 'top',
      timeout: 3000,
      actions: [{ icon: 'close', color: 'white' }],
    });
  };

  return {
    notifySuccess,
    notifyWarning,
    notifyInfo,
    notifyError,
  };
}
