import { computed } from 'vue';
import { Dark, LocalStorage } from 'quasar';

const DARK_MODE_STORAGE_KEY = 'darkMode';

export function useDarkMode() {
  if (LocalStorage.has(DARK_MODE_STORAGE_KEY))
    Dark.set(LocalStorage.getItem(DARK_MODE_STORAGE_KEY) as boolean);

  const isDark = computed(() => Dark.isActive);

  const toggleDarkMode = () => {
    Dark.toggle();
    LocalStorage.set(DARK_MODE_STORAGE_KEY, Dark.isActive);
  };

  const setDarkMode = (value: boolean) => {
    Dark.set(value);
    LocalStorage.set(DARK_MODE_STORAGE_KEY, value);
  };

  const setAutoDarkMode = () => {
    Dark.set('auto');
    LocalStorage.remove(DARK_MODE_STORAGE_KEY);
  };

  return {
    isDark,
    toggleDarkMode,
    setDarkMode,
    setAutoDarkMode,
  };
}
