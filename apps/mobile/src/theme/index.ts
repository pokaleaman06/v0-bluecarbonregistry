import { MD3LightTheme } from 'react-native-paper';

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#2E7D32', // Green for nature/blue carbon
    primaryContainer: '#C8E6C9',
    secondary: '#1976D2', // Blue for water/ocean
    secondaryContainer: '#BBDEFB',
    tertiary: '#FF6F00', // Orange for mangrove
    tertiaryContainer: '#FFE0B2',
    surface: '#FFFFFF',
    surfaceVariant: '#F5F5F5',
    background: '#FAFAFA',
    error: '#D32F2F',
    errorContainer: '#FFCDD2',
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onTertiary: '#FFFFFF',
    onSurface: '#212121',
    onBackground: '#212121',
    onError: '#FFFFFF',
    outline: '#BDBDBD',
    outlineVariant: '#E0E0E0',
  },
  roundness: 12,
};
