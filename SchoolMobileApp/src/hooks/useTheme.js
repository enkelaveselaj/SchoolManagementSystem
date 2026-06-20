import { useThemeStore } from '../store/themeStore';
import { lightColors, darkColors } from '../styles/colors';

export const useTheme = () => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const toggleDarkMode = useThemeStore((state) => state.toggleDarkMode);

  const colors = isDarkMode ? darkColors : lightColors;

  return {
    isDarkMode,
    toggleDarkMode,
    colors,
  };
};
