import { computed } from 'vue';
import { isValidUrl } from 'src/modules/shared/utils/isValidUrl.util';

export const useRules = () => {
  const required =
    (message = 'This field is required') =>
    (val: string) =>
      !!val || message;

  const minLength = (min: number, message?: string) => (val: string) =>
    val.length >= min || message || `Must be at least ${min} characters`;

  const maxLength = (max: number, message?: string) => (val: string) =>
    val.length <= max || message || `Must be at most ${max} characters`;

  const between =
    (min: number, max: number, message?: string) => (val: number | null | undefined) =>
      val == null ||
      (val >= min && val <= max) ||
      message ||
      `El valor debe estar entre ${min} y ${max}.`;

  const email =
    (message = 'Please enter a valid email') =>
    (val: string) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || message;

  const validUrl =
    (message = 'Please enter a valid URL') =>
    (val: string) =>
      isValidUrl(val) || message;

  const passwordRules = {
    hasUppercase:
      (message = 'Password must contain at least one uppercase letter') =>
      (val: string) =>
        /[A-Z]/.test(val) || message,

    hasLowercase:
      (message = 'Password must contain at least one lowercase letter') =>
      (val: string) =>
        /[a-z]/.test(val) || message,

    hasNumber:
      (message = 'Password must contain at least one number') =>
      (val: string) =>
        /[0-9]/.test(val) || message,

    hasSpecialChar:
      (message = 'Password must contain at least one special character') =>
      (val: string) =>
        /[^A-Za-z0-9]/.test(val) || message,
  };

  const nameRules = computed(() => [
    required('El nombre es requerido'),
    minLength(3, 'Mínimo 3 caractéres'),
    maxLength(100, 'Máximo 100 caractéres'),
  ]);
  const firstNameRules = computed(() => [
    required('El nombre es requerido'),
    minLength(2, 'El nombre debe tener al menos 2 caracteres'),
  ]);
  const lastNameRules = computed(() => [
    required('El apellido es requerido'),
    minLength(2, 'El apellido debe tener al menos 2 caracteres'),
  ]);
  const abbrRules = computed(() => [
    required('La abreviación es requerida'),
    maxLength(5, 'Máximo 5 caractéres'),
  ]);
  const cityRules = computed(() => [required('La ciudad es requerida')]);
  const countryRules = computed(() => [required('El país es requerido')]);
  const numberOfTeamsRules = computed(() => [
    minLength(2, 'Mínimo 2 equipos'),
    maxLength(64, 'Máximo 64 equipos'),
  ]);
  const statusRules = computed(() => [required('El estado es requerido')]);
  const foundationYearRules = computed(() => {
    const currentYear = new Date().getFullYear();

    return [between(1800, currentYear, `Año entre 1800 y ${currentYear}`)];
  });
  const logoUrlRules = computed(() => [
    required('URL del logo es requerida'),
    validUrl('URL inválida'),
  ]);
  const websiteRules = computed(() => [
    required('La website es requerida'),
    (val: string) => isValidUrl(`https://${val}`) || 'URL inválida',
  ]);
  const emailRules = computed(() => [required('Email is required'), email()]);

  const strongPasswordRules = computed(() => [
    required('Password is required'),
    minLength(8, 'Password must be at least 8 characters'),
    passwordRules.hasUppercase(),
    passwordRules.hasLowercase(),
    passwordRules.hasNumber(),
    passwordRules.hasSpecialChar(),
  ]);

  const numeric =
    (message = 'Only numbers are allowed') =>
    (val: string) =>
      /^\d+$/.test(val) || message;

  const phoneNumber =
    (message = 'Please enter a valid phone number') =>
    (val: string) =>
      /^\+?[\d\s\-/()]+$/.test(val) || message;

  const url =
    (message = 'Please enter a valid URL') =>
    (val: string) =>
      /^https?:\/\/.+/.test(val) || message;

  return {
    required,
    minLength,
    maxLength,
    email,
    numeric,
    phoneNumber,
    url,

    nameRules,
    firstNameRules,
    lastNameRules,
    abbrRules,
    cityRules,
    countryRules,
    numberOfTeamsRules,
    statusRules,
    foundationYearRules,
    logoUrlRules,
    websiteRules,

    passwordRules,

    emailRules,
    strongPasswordRules,
  };
};
