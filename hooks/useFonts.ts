import { useFonts as useExpoFonts } from 'expo-font';

export function useFonts() {
  const [fontsLoaded] = useExpoFonts({
    'Manrope-Regular': 'https://github.com/google/fonts/raw/main/ofl/manrope/Manrope-Regular.ttf',
    'Manrope-SemiBold': 'https://github.com/google/fonts/raw/main/ofl/manrope/Manrope-SemiBold.ttf',
    'Manrope-Bold': 'https://github.com/google/fonts/raw/main/ofl/manrope/Manrope-Bold.ttf',
    'WorkSans-Regular': 'https://github.com/google/fonts/raw/main/ofl/worksans/WorkSans-Regular.ttf',
    'WorkSans-Medium': 'https://github.com/google/fonts/raw/main/ofl/worksans/WorkSans-Medium.ttf',
    'WorkSans-SemiBold': 'https://github.com/google/fonts/raw/main/ofl/worksans/WorkSans-SemiBold.ttf',
  });

  return fontsLoaded;
}
