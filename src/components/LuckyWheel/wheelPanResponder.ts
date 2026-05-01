import type { MutableRefObject } from 'react';
import { PanResponder } from 'react-native';

import type { GestureType } from '../../types';
import { GestureTypes } from '../../types';

export type WheelPanResponderDeps = {
  enableGesture: boolean;
  isSpinning: boolean;
  size: number;
  gestureType: GestureType;
  minimumSpinVelocity: number;
  rotate: { setValue: (v: number) => void };
  rotateValue: MutableRefObject<number>;
  spinVelocityValue: MutableRefObject<number>;
  px: MutableRefObject<number>;
  py: MutableRefObject<number>;
  setVelocity: (value: number) => void;
  startSpinning: () => void;
};

export function createWheelPanResponder({
  enableGesture,
  isSpinning,
  size,
  gestureType,
  minimumSpinVelocity,
  rotate,
  rotateValue,
  spinVelocityValue,
  px,
  py,
  setVelocity,
  startSpinning,
}: WheelPanResponderDeps): ReturnType<typeof PanResponder.create> {
  const canPan = enableGesture && !isSpinning;

  return PanResponder.create({
    onStartShouldSetPanResponder: () => canPan,
    onStartShouldSetPanResponderCapture: () => canPan,
    onMoveShouldSetPanResponder: () => canPan,
    onMoveShouldSetPanResponderCapture: () => canPan,
    onPanResponderMove: (_, gestureState) => {
      if (!enableGesture || isSpinning) {
        return;
      }

      const mappedX = gestureState.moveX - px.current;
      const mappedY = gestureState.moveY - py.current;

      const x = mappedX < 0 ? 0 : mappedX > size ? size : mappedX;
      const y = mappedY < 0 ? 0 : mappedY > size ? size : mappedY;

      const top = y < size / 2;
      const bottom = y > size / 2;
      const left = x < size / 2;
      const right = x > size / 2;

      const isMoveRight = gestureState.vx > 0;
      const isMoveLeft = gestureState.vx < 0;
      const isMoveUp = gestureState.vy < 0;
      const isMoveBottom = gestureState.vy > 0;

      const isSpinRight =
        (top && isMoveRight) ||
        (bottom && isMoveLeft) ||
        (top && right && isMoveBottom) ||
        (bottom && left && isMoveUp);
      const isSpinLeft =
        ((top && isMoveLeft) ||
          (bottom && isMoveRight) ||
          (top && left && isMoveBottom) ||
          (bottom && right && isMoveUp)) &&
        !isSpinRight;

      const isSingleTouch = gestureState.numberActiveTouches === 1;

      const isClockwiseEnabled =
        gestureType === GestureTypes.CLOCKWISE ||
        gestureType === GestureTypes.MULTIDIRECTIONAL;
      const isAntiClockwiseEnabled =
        gestureType === GestureTypes.ANTI_CLOCKWISE ||
        gestureType === GestureTypes.MULTIDIRECTIONAL;

      if (
        (isSpinRight && isClockwiseEnabled) ||
        (isSpinLeft && isAntiClockwiseEnabled)
      ) {
        if (rotateValue.current === 0) {
          setVelocity(gestureState.vx);
        } else {
          setVelocity((gestureState.vx + spinVelocityValue.current) / 2);
        }
      }

      const slowDivider = 15;

      if (isClockwiseEnabled && isSingleTouch && isSpinRight) {
        rotate.setValue((rotateValue.current + x / slowDivider) % 360);
      }

      if (isAntiClockwiseEnabled && isSingleTouch && isSpinLeft) {
        rotate.setValue((rotateValue.current - x / slowDivider) % 360);
      }
    },
    onPanResponderRelease: () => {
      if (!enableGesture || isSpinning) {
        return;
      }

      const isVelocityFastEnough =
        Math.abs(spinVelocityValue.current) > minimumSpinVelocity;

      if (isVelocityFastEnough) {
        startSpinning();
      }
    },
  });
}
