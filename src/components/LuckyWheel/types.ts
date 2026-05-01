import type { Animated } from 'react-native';

/** resetAnimation exists at runtime but is missing from the official TypeScript types */
export type AnimatedValueExtended = Animated.Value & {
  resetAnimation: (callback?: (value: number) => void) => void;
};
