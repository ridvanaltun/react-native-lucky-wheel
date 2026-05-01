import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';

import Utils from '../../../utils';

import type { AnimatedValueExtended } from '../types';
import type { EasingType, ILuckyWheel } from '../../../types';
import { EasingTypes } from '../../../types';

type UseLuckyWheelSpinArgs = {
  rotate: AnimatedValueExtended;
  spinVelocityValue: React.MutableRefObject<number>;
  setVelocity: (value: number) => void;
  DURATION_IN_MS: number;
  SLICE_ANGLE: number;
  SLICE_ANGLE_CENTER: number;
  SLICE_COUNT: number;
  enablePhysics: boolean;
  winnerIndex?: number;
  slices: ILuckyWheel['slices'];
  waitWinner: boolean;
  duration: number;
  easing: EasingType;
  onSpinningEnd?: (winner: ILuckyWheel['slices'][number]) => void;
  onSpinningStart?: () => void;
};

export function useLuckyWheelSpin({
  rotate,
  spinVelocityValue,
  setVelocity,
  DURATION_IN_MS,
  SLICE_ANGLE,
  SLICE_ANGLE_CENTER,
  SLICE_COUNT,
  enablePhysics,
  winnerIndex,
  slices,
  waitWinner,
  duration,
  easing,
  onSpinningEnd,
  onSpinningStart,
}: UseLuckyWheelSpinArgs) {
  const [isSpinning, setIsSpinning] = useState(false);
  const spinCount = useRef(1);
  const winnerLastOffset = useRef(0);

  const ONE_TURN = 360;

  const startSpinning = useCallback(() => {
    if (!isSpinning) setIsSpinning(true);

    const currentVelocity = spinVelocityValue.current;
    const isGestureSpinning = currentVelocity !== 0;
    const isSpinningValid = Math.abs(currentVelocity) >= 1;
    const velocity =
      isGestureSpinning && enablePhysics && isSpinningValid
        ? Math.round(Math.abs(currentVelocity))
        : 1;

    const WINNER_INDEX = winnerIndex ?? Math.floor(Math.random() * SLICE_COUNT);
    const WINNER = slices[WINNER_INDEX]!;

    const WINNER_ANGLE = WINNER_INDEX * (ONE_TURN / SLICE_COUNT);
    const WINNER_ANGLE_OFFSET = Utils.randomNumber(
      -SLICE_ANGLE_CENTER + SLICE_ANGLE / 3,
      SLICE_ANGLE_CENTER - SLICE_ANGLE / 3
    );

    const EXTRA_SPIN_DEGREE =
      ONE_TURN * duration * spinCount.current * velocity;

    const TARGET_ANGLE =
      ONE_TURN -
      WINNER_ANGLE +
      EXTRA_SPIN_DEGREE -
      winnerLastOffset.current +
      WINNER_ANGLE_OFFSET;

    const isEndlessSpinning = waitWinner && winnerIndex === undefined;

    if (isEndlessSpinning) {
      Animated.loop(
        Animated.timing(rotate, {
          toValue: EXTRA_SPIN_DEGREE * 4,
          duration: DURATION_IN_MS,
          useNativeDriver: true,
          easing: Easing.linear,
        })
      ).start();
    } else {
      Animated.timing(rotate, {
        toValue: TARGET_ANGLE,
        duration: DURATION_IN_MS,
        easing:
          easing === EasingTypes.OUT
            ? Easing.out(Easing.cubic)
            : Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }).start(() => {
        setIsSpinning(false);
        setVelocity(0);
        if (onSpinningEnd) onSpinningEnd(WINNER);
      });
    }

    if (onSpinningStart) onSpinningStart();

    winnerLastOffset.current = WINNER_ANGLE_OFFSET;
    spinCount.current += 1;
  }, [
    DURATION_IN_MS,
    SLICE_ANGLE,
    SLICE_ANGLE_CENTER,
    SLICE_COUNT,
    isSpinning,
    enablePhysics,
    winnerIndex,
    slices,
    waitWinner,
    duration,
    easing,
    rotate,
    setVelocity,
    onSpinningEnd,
    onSpinningStart,
    spinVelocityValue,
  ]);

  useEffect(() => {
    if (isSpinning && waitWinner && winnerIndex !== undefined) {
      rotate.resetAnimation(() => {
        startSpinning();
      });
    }
  }, [isSpinning, waitWinner, winnerIndex, rotate, startSpinning]);

  return { isSpinning, startSpinning };
}
