import { date } from 'quasar';

export const formatDateForDisplay = (dateString: Date) => {
  if (!dateString) return 'No disponible';
  return date.formatDate(dateString, 'DD/MM/YYYY HH:mm');
};

export const formatDateToLongString = (date: Date): string => {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'Hoy';
  } else if (diffDays === 1) {
    return 'Ayer';
  } else if (diffDays < 30) {
    return `Hace ${diffDays} días`;
  } else if (diffDays < 365) {
    const diffMonths = Math.floor(diffDays / 30);
    return `Hace ${diffMonths} ${diffMonths === 1 ? 'mes' : 'meses'}`;
  } else {
    const diffYears = Math.floor(diffDays / 365);
    return `Hace ${diffYears} ${diffYears === 1 ? 'año' : 'años'}`;
  }
};
