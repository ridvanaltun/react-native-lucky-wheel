import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { Animated, View } from 'react-native';

import type { ILuckyWheel, LuckyWheelHandle } from '../../types';

import { buildSlicePayload } from './buildSlicePayload';
import { DEFAULT_PROPS, ONE_TURN } from './constants';
import { useAnimatedValueMirrors } from './hooks/useAnimatedValueMirrors';
import { useKnobTickListener } from './hooks/useKnobTickListener';
import { useLuckyWheelSpin } from './hooks/useLuckyWheelSpin';
import { luckyWheelStyles as styles } from './styles';
import type { AnimatedValueExtended } from './types';
import { createWheelPanResponder } from './wheelPanResponder';
import { WheelFace } from './WheelFace';
import { WheelKnob } from './WheelKnob';

const LuckyWheel = forwardRef<LuckyWheelHandle, ILuckyWheel>(
  (
    {
      slices,
      duration = DEFAULT_PROPS.duration,
      innerRadius = DEFAULT_PROPS.innerRadius,
      outerRadius: outerRadiusProp = DEFAULT_PROPS.outerRadius,
      padAngle = DEFAULT_PROPS.padAngle,
      backgroundColor = DEFAULT_PROPS.backgroundColor,
      size = DEFAULT_PROPS.size,
      textAngle = DEFAULT_PROPS.textAngle,
      backgroundColorOptions = DEFAULT_PROPS.backgroundColorOptions,
      knobSize = DEFAULT_PROPS.knobSize,
      knobColor = DEFAULT_PROPS.knobColor,
      textStyle = DEFAULT_PROPS.textStyle,
      easing = DEFAULT_PROPS.easing,
      dotColor = DEFAULT_PROPS.dotColor,
      minimumSpinVelocity = DEFAULT_PROPS.minimumSpinVelocity,
      enableGesture = DEFAULT_PROPS.enableGesture,
      enableOuterDots = DEFAULT_PROPS.enableOuterDots,
      enablePhysics = DEFAULT_PROPS.enablePhysics,
      gestureType = DEFAULT_PROPS.gestureType,
      offset = DEFAULT_PROPS.offset,
      waitWinner = DEFAULT_PROPS.waitWinner,
      enableInnerShadow = DEFAULT_PROPS.enableInnerShadow,
      winnerIndex,
      onKnobTick,
      onSpinningStart,
      onSpinningEnd,
      source,
      customKnob,
      customText,
    },
    ref
  ) => {
    const rotate = useRef(new Animated.Value(0))
      .current as AnimatedValueExtended;
    const spinVelocity = useRef(new Animated.Value(0)).current;
    const containerRef = useRef<any>(null);

    const rotateValue = useRef(0);
    const spinVelocityValue = useRef(0);

    const px = useRef(0);
    const py = useRef(0);

    const outerRadius = useMemo(
      () => size / 2 - outerRadiusProp,
      [size, outerRadiusProp]
    );

    const DURATION_IN_MS = useMemo(() => duration * 1000, [duration]);

    const sliceCount = useMemo(() => slices.length, [slices]);

    const sliceAngle = useMemo(() => ONE_TURN / sliceCount, [sliceCount]);
    const sliceAngleCenter = useMemo(() => sliceAngle / 2, [sliceAngle]);

    const slicePayload = useMemo(
      () =>
        buildSlicePayload({
          slices,
          padAngle,
          outerRadius,
          innerRadius,
          backgroundColorOptions,
        }),
      [padAngle, innerRadius, outerRadius, backgroundColorOptions, slices]
    );

    const rotateInterpolated = useMemo(
      () =>
        rotate.interpolate({
          inputRange: [-ONE_TURN, 0, ONE_TURN],
          outputRange: [`-${ONE_TURN}deg`, '0deg', `${ONE_TURN}deg`],
        }),
      [rotate]
    );

    const knobAnim = useMemo(
      () =>
        Animated.modulo(
          Animated.divide(
            Animated.modulo(
              Animated.subtract(rotate, sliceAngleCenter),
              ONE_TURN
            ),
            new Animated.Value(sliceAngle)
          ),
          1
        ),
      [rotate, sliceAngle, sliceAngleCenter]
    );

    const knobInterpolated = useMemo(
      () =>
        knobAnim.interpolate({
          inputRange: [-1, -0.5, -0.0001, 0.0001, 0.5, 1],
          outputRange: ['0deg', '0deg', '35deg', '-35deg', '0deg', '0deg'],
        }),
      [knobAnim]
    );

    useAnimatedValueMirrors(
      rotate,
      spinVelocity,
      rotateValue,
      spinVelocityValue
    );

    const setVelocity = useCallback(
      (value: number) => {
        spinVelocity.setValue(value);
        spinVelocityValue.current = value;
      },
      [spinVelocity]
    );

    const { isSpinning, startSpinning } = useLuckyWheelSpin({
      rotate,
      spinVelocityValue,
      setVelocity,
      DURATION_IN_MS,
      SLICE_ANGLE: sliceAngle,
      SLICE_ANGLE_CENTER: sliceAngleCenter,
      SLICE_COUNT: sliceCount,
      enablePhysics,
      winnerIndex,
      slices,
      waitWinner,
      duration,
      easing,
      onSpinningEnd,
      onSpinningStart,
    });

    useKnobTickListener(knobAnim, onKnobTick);

    useImperativeHandle(ref, () => ({
      start: startSpinning,
      stop: () => rotate.stopAnimation(),
      reset: () => rotate.resetAnimation(),
    }));

    const panResponder = useMemo(
      () =>
        createWheelPanResponder({
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
        }),
      [
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
      ]
    );

    return (
      <View style={styles.container}>
        <WheelKnob
          knobInterpolated={knobInterpolated}
          knobSize={knobSize}
          knobColor={knobColor}
          customKnob={customKnob}
        />
        <View
          style={{
            transform: [{ rotate: `${offset}deg` }],
          }}
        >
          <WheelFace
            source={source}
            size={size}
            rotateInterpolated={rotateInterpolated}
            backgroundColor={backgroundColor}
            containerRef={containerRef}
            panHandlers={panResponder.panHandlers}
            slicePayload={slicePayload}
            sliceCount={sliceCount}
            sliceAngle={sliceAngle}
            sliceAngleCenter={sliceAngleCenter}
            outerRadius={outerRadius}
            innerRadius={innerRadius}
            textAngle={textAngle}
            textStyle={textStyle}
            customText={customText}
            enableOuterDots={enableOuterDots}
            dotColor={dotColor}
            enableInnerShadow={enableInnerShadow}
            px={px}
            py={py}
          />
        </View>
      </View>
    );
  }
);

export default LuckyWheel;
