import { useEffect } from 'react';
import type { MutableRefObject } from 'react';
import type { Animated } from 'react-native';

export function useAnimatedValueMirrors(
  rotate: Animated.Value,
  spinVelocity: Animated.Value,
  rotateValue: MutableRefObject<number>,
  spinVelocityValue: MutableRefObject<number>
) {
  useEffect(() => {
    const rotateId = rotate.addListener(({ value }) => {
      rotateValue.current = value;
    });
    const velocityId = spinVelocity.addListener(({ value }) => {
      spinVelocityValue.current = value;
    });
    return () => {
      rotate.removeListener(rotateId);
      spinVelocity.removeListener(velocityId);
    };
  }, [rotate, spinVelocity, rotateValue, spinVelocityValue]);
}
