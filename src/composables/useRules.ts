import { computed } from 'vue';

export const useRules = () => {
  const required =
    (message = 'This field is required') =>
    (val: string) =>
      !!val || message;

  const minLength = (min: number, message?: string) => (val: string) =>
    val.length >= min || message || `Must be at least ${min} characters`;

  const maxLength = (max: number, message?: string) => (val: string) =>
    val.length <= max || message || `Must be at most ${max} characters`;

  const email =
    (message = 'Please enter a valid email') =>
    (val: string) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || message;

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

    passwordRules,

    emailRules,
    strongPasswordRules,
  };
};
