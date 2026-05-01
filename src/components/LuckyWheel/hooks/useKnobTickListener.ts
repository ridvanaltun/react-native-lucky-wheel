import { useEffect } from 'react';
import type { Animated } from 'react-native';

type ListenableAnimated = Pick<
  Animated.Value,
  'addListener' | 'removeListener'
>;

export function useKnobTickListener(
  knobAnim: ListenableAnimated,
  onKnobTick?: () => void
) {
  useEffect(() => {
    if (!onKnobTick) {
      return;
    }
    const id = knobAnim.addListener(({ value }: { value: number }) => {
      if (value > 0.7) onKnobTick();
    });
    return () => {
      knobAnim.removeListener(id);
    };
  }, [knobAnim, onKnobTick]);
}
