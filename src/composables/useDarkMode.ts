import { computed } from 'vue';
import { Dark, LocalStorage } from 'quasar';

export function useDarkMode() {
  const isDark = computed(() => Dark.isActive);

  const toggleDarkMode = () => {
    Dark.toggle();
    LocalStorage.set('darkMode', Dark.isActive);
  };

  const setDarkMode = (value: boolean) => {
    Dark.set(value);
    LocalStorage.set('darkMode', value);
  };

  const setAutoDarkMode = () => {
    Dark.set('auto');
    LocalStorage.remove('darkMode');
  };

  return {
    isDark,
    toggleDarkMode,
    setDarkMode,
    setAutoDarkMode,
  };
}
