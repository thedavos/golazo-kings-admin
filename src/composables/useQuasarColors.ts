import { computed } from 'vue';
import { Dark, colors } from 'quasar';

const { getPaletteColor } = colors;

export function useQuasarColors() {
  const isDark = computed(() => Dark.isActive);

  const getCSSVariable = (variableName: string) => {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(`--q-${variableName}`)
      .trim();
  };

  const getColor = (colorName: string) => {
    const paletteColor = getPaletteColor(colorName);
    if (paletteColor) return paletteColor;

    return getCSSVariable(colorName) || null;
  };

  const baseColors = computed(() => ({
    primary: getColor('primary') || '#f5b840',
    secondary: getColor('secondary') || '#26A69A',
    accent: getColor('accent') || '#9C27B0',
    dark: getColor('dark') || '#2b2c40',
    'dark-page': '#232333',
    'white-page': '#f3f3f7',
    positive: getColor('positive') || '#21BA45',
    negative: getColor('negative') || '#C10015',
    info: getColor('info') || '#31CCEC',
    warning: getColor('warning') || '#F2C037',
  }));

  const getComplementaryColors = (baseColor: string) => {
    const { luminosity } = colors;
    const lum = luminosity(baseColor);

    return {
      text: lum > 0.5 ? '#000000' : '#FFFFFF',
      background: lum > 0.5 ? '#FFFFFF' : '#000000',
      border: lum > 0.5 ? '#E0E0E0' : '#424242',
    };
  };

  const getPageColor = () => {
    return isDark.value ? baseColors.value['dark-page'] : baseColors.value['white-page'];
  };

  const getAdaptiveColors = () => {
    return {
      surface: isDark.value ? baseColors.value.dark : '#FFFFFF',
      onSurface: isDark.value ? '#FFFFFF' : '#000000',
      page: getPageColor(),
      border: isDark.value ? '#424242' : '#E0E0E0',
      separator: isDark.value ? '#424242' : '#E0E0E0',
    };
  };

  return {
    // Estado
    isDark,
    baseColors,

    // Métodos principales
    getColor,
    getPageColor,
    getAdaptiveColors,

    // Utilidades
    getComplementaryColors,
    getCSSVariable,
  };
}
