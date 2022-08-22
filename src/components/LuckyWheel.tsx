import React, {
  useRef,
  useState,
  useMemo,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from 'react';
import {
  View,
  Animated,
  PanResponder,
  Easing,
  Dimensions,
  StyleSheet,
} from 'react-native';
import * as d3Shape from 'd3-shape';
import randomColor from 'randomcolor';

import Svg, { G, Text, Path, Circle } from 'react-native-svg';

import Knob from './Knob';

import Utils from '../utils';

import {
  ILuckyWheel,
  LuckyWheelHandle,
  GestureTypes,
  TextAngles,
  EasingTypes,
  ILuckyWheelOptionalProps,
  Color,
  IWheelText,
} from '../index';

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const { width } = Dimensions.get('screen');

const ONE_TURN = 360;

const LuckyWheel = forwardRef<LuckyWheelHandle, ILuckyWheel>((props, ref) => {
  const rotate = useRef<any>(new Animated.Value(0)).current;
  const spinVelocity = useRef<any>(new Animated.Value(0)).current;
  const containerRef = useRef<any>(null);

  const [isSpinning, setIsSpinning] = useState(false);
  const [spinCount, setSpinCount] = useState(1);
  const [winnerLastOffset, setWinnerLastOffset] = useState(0);

  const [px, setPx] = useState(0);
  const [py, setPy] = useState(0);

  const rotateInterpolated = rotate.interpolate({
    inputRange: [-ONE_TURN, 0, ONE_TURN],
    outputRange: [`-${ONE_TURN}deg`, '0deg', `${ONE_TURN}deg`],
  });

  const outerRadius = useMemo(
    () => props.size / 2 - props.outerRadius,
    [props.size, props.outerRadius]
  );

  const DURATION_IN_MS = useMemo(() => props.duration * 1000, [props.duration]);

  const SLICE_COUNT = useMemo(() => props.slices.length, [props.slices]);

  const SLICE_ANGLE = useMemo(() => ONE_TURN / SLICE_COUNT, [SLICE_COUNT]);
  const SLICE_ANGLE_CENTER = useMemo(() => SLICE_ANGLE / 2, [SLICE_ANGLE]);

  const SLICE_PAYLOAD = useMemo(() => {
    const data: any = Array.from({ length: SLICE_COUNT }).fill(1);
    const arcs = d3Shape.pie()(data);
    const instance = d3Shape
      .arc()
      .padAngle(props.padAngle)
      .outerRadius(outerRadius)
      .innerRadius(props.innerRadius);

    const colors = randomColor({
      ...props.backgroundColorOptions,
      count: SLICE_COUNT,
    });

    return arcs.map((arc: any, index: number) => {
      return {
        path: instance(arc),
        color: props.slices[index].color ?? colors[index % colors.length],
        text: props.slices[index].text,
        textStyle: props.slices[index].textStyle,
        centroid: instance.centroid(arc),
      };
    });
  }, [
    props.padAngle,
    props.innerRadius,
    outerRadius,
    props.backgroundColorOptions,
    props.slices,
    SLICE_COUNT,
  ]);

  const knobAnim = Animated.modulo(
    Animated.divide(
      Animated.modulo(Animated.subtract(rotate, SLICE_ANGLE_CENTER), ONE_TURN),
      new Animated.Value(SLICE_ANGLE)
    ),
    1
  );

  const knobInterpolated = knobAnim.interpolate({
    inputRange: [-1, -0.5, -0.0001, 0.0001, 0.5, 1],
    outputRange: ['0deg', '0deg', '35deg', '-35deg', '0deg', '0deg'],
  });

  const startSpinning = useCallback(() => {
    setIsSpinning(true);

    const isGestureSpinning = spinVelocity._value !== 0;
    const isSpinningValid = Math.abs(spinVelocity._value) >= 1;
    const velocity =
      isGestureSpinning && props.enablePhysics && isSpinningValid
        ? Math.round(Math.abs(spinVelocity._value))
        : 1;

    const WINNER_INDEX =
      props.winnerIndex ?? Math.floor(Math.random() * SLICE_COUNT);
    const WINNER = props.slices[WINNER_INDEX];

    const WINNER_ANGLE = WINNER_INDEX * (ONE_TURN / SLICE_COUNT);
    const WINNER_ANGLE_OFFSET = Utils.randomNumber(
      -SLICE_ANGLE_CENTER + SLICE_ANGLE / 3,
      SLICE_ANGLE_CENTER - SLICE_ANGLE / 3
    );

    const EXTRA_SPIN_DEGREE = ONE_TURN * props.duration * spinCount * velocity;

    const TARGET_ANGLE =
      ONE_TURN -
      WINNER_ANGLE +
      EXTRA_SPIN_DEGREE -
      winnerLastOffset +
      WINNER_ANGLE_OFFSET;

    const isEndlessSpinning = props.waitWinner && !props.winnerIndex;

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
          props.easing === 'out'
            ? Easing.out(Easing.cubic)
            : Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }).start(() => {
        setIsSpinning(false);
        spinVelocity.setValue(0);

        if (props.onSpinningEnd) props.onSpinningEnd(WINNER);
      });
    }

    if (props.onSpinningStart) props.onSpinningStart();

    setWinnerLastOffset(WINNER_ANGLE_OFFSET);
    setSpinCount(spinCount + 1);
  }, [
    DURATION_IN_MS,
    SLICE_ANGLE,
    SLICE_ANGLE_CENTER,
    SLICE_COUNT,
    props,
    rotate,
    spinCount,
    spinVelocity,
    winnerLastOffset,
  ]);

  useEffect(() => {
    if (isSpinning && props.waitWinner && props.winnerIndex) {
      rotate.resetAnimation(() => {
        startSpinning();
      });
    }
  }, [isSpinning, props.waitWinner, props.winnerIndex, rotate, startSpinning]);

  useEffect(() => {
    if (props.onKnobTick) {
      knobAnim.addListener(({ value }) => {
        if (value > 0.7) {
          if (props.onKnobTick) props.onKnobTick();
        }
      });
    } else {
      knobAnim.removeAllListeners();
    }
  }, [knobAnim, props]);

  useImperativeHandle(ref, () => ({
    start: () => {
      startSpinning();
    },
    stop: () => {
      rotate.stopAnimation();
    },
    reset: () => {
      rotate.resetAnimation();
    },
  }));

  const _panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponderCapture: () => true,
    onPanResponderMove: (_, gestureState) => {
      if (!props.enableGesture || isSpinning) {
        return;
      }

      const mappedX = gestureState.moveX - px;
      const mappedY = gestureState.moveY - py;

      const x = mappedX < 0 ? 0 : mappedX > 300 ? props.size : mappedX;
      const y = mappedY < 0 ? 0 : mappedY > 300 ? props.size : mappedY;

      const top = y < props.size / 2;
      const bottom = y > props.size / 2;
      const left = x < props.size / 2;
      const right = x > props.size / 2;

      // console.log({x, y, top, bottom, left, right});

      const isMoveRight = gestureState.vx > 0;
      const isMoveLeft = gestureState.vx < 0;
      const isMoveUp = gestureState.vy < 0;
      const isMoveBottom = gestureState.vy > 0;

      // console.log({isMoveRight, isMoveLeft, isMoveUp, isMoveBottom});

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

      // console.log({isSpinRight, isSpinLeft});

      const isSingleTouch = gestureState.numberActiveTouches === 1;
      // const isRightMove = gestureState.vx < 0;

      const isClockwiseEnabled =
        props.gestureType === GestureTypes.CLOCKWISE ||
        props.gestureType === GestureTypes.MULTIDIRECTIONAL;
      const isAntiClockwiseEnabled =
        props.gestureType === GestureTypes.ANTI_CLOCKWISE ||
        props.gestureType === GestureTypes.MULTIDIRECTIONAL;

      // set spin velocity
      if (
        (isSpinRight && isClockwiseEnabled) ||
        (isSpinLeft && isAntiClockwiseEnabled)
      ) {
        if (rotate._value === 0) {
          spinVelocity.setValue(gestureState.vx);
        } else {
          spinVelocity.setValue((gestureState.vx + spinVelocity._value) / 2);
        }
      }

      const slowDivider = 15;

      if (isClockwiseEnabled && isSingleTouch && isSpinRight) {
        rotate.setValue((rotate._value + x / slowDivider) % 360);
      }

      if (isAntiClockwiseEnabled && isSingleTouch && isSpinLeft) {
        rotate.setValue((rotate._value - x / slowDivider) % 360);
      }
    },
    onPanResponderRelease: () => {
      if (!props.enableGesture || isSpinning) {
        return;
      }

      const isVelocityFastEnough =
        Math.abs(spinVelocity._value) > props.minimumSpinVelocity;

      if (isVelocityFastEnough) {
        startSpinning();
      }
    },
  });

  const _renderKnob = () => {
    return (
      <Animated.View
        style={[
          styles.knob,
          {
            transform: [
              {
                rotate: knobInterpolated,
              },
            ],
          },
        ]}
      >
        {props.customKnob ? (
          props.customKnob({ size: props.knobSize, color: props.knobColor })
        ) : (
          <Knob size={props.knobSize} color={props.knobColor} />
        )}
      </Animated.View>
    );
  };

  const _renderText = (params: IWheelText) => {
    if (props.source) return null;

    if (props.customText) {
      return props.customText(params);
    }

    if (props.textAngle === TextAngles.VERTICAL) {
      return (
        <G
          rotation={
            (params.i * ONE_TURN) / SLICE_COUNT + SLICE_ANGLE_CENTER + 90
          }
          origin={`${params.x}, ${params.y}`}
        >
          <Text
            x={params.x - props.size / 7}
            y={params.y}
            fill={
              params.payload.textStyle?.color ??
              props.textStyle?.color ??
              styles.text.color
            }
            {...props.textStyle}
            {...params.payload.textStyle}
          >
            {params.payload.text}
          </Text>
        </G>
      );
    }

    return (
      <G
        rotation={(params.i * ONE_TURN) / SLICE_COUNT + SLICE_ANGLE_CENTER}
        origin={`${params.x}, ${params.y}`}
      >
        <Text
          x={params.x - params.payload.text.length * 5}
          y={params.y - props.size / 8}
          fill={
            params.payload.textStyle?.color ??
            props.textStyle?.color ??
            styles.text.color
          }
          {...props.textStyle}
          {...params.payload.textStyle}
        >
          {params.payload.text}
        </Text>
      </G>
    );
  };

  const _renderOuterDots = (x: number, y: number, i: number) => {
    if (!props.enableOuterDots) {
      return null;
    }

    return (
      <Circle
        origin={`${x}, ${y}`}
        rotation={(i * ONE_TURN) / SLICE_COUNT + SLICE_ANGLE_CENTER}
        cx={x + outerRadius + 2.5}
        cy={
          y +
          SLICE_ANGLE -
          SLICE_COUNT * 2 +
          props.innerRadius / 2 +
          props.innerRadius / 100
        }
        r="4"
        fill={props.dotColor}
      />
    );
  };

  const _renderSlice = (path: any, color: Color) => {
    return <Path d={path} strokeWidth={2} fill={color} />;
  };

  const _renderCircle = () => {
    if (!props.enableInnerShadow) return false;

    return (
      <Animated.View
        style={{
          ...styles.wheel,
          ...styles.circle,
          width: props.size - (props.size - outerRadius * 2),
          height: props.size - (props.size - outerRadius * 2),
          borderRadius: props.size / 2,
        }}
      />
    );
  };

  const _renderWheel = () => {
    if (props.source) {
      return (
        <Animated.Image
          ref={containerRef}
          onLayout={() => {
            containerRef?.current?.measure(
              (
                _fx: number,
                _fy: number,
                _wheelWidth: number,
                _wheelHeight: number,
                pxSize: number,
                pySize: number
              ) => {
                setPx(pxSize);
                setPy(pySize);
              }
            );
          }}
          style={{
            ...styles.wheel,
            width: props.size,
            height: props.size,
            transform: [{ rotate: rotateInterpolated }],
          }}
          source={props.source}
          {..._panResponder.panHandlers}
        />
      );
    }

    return (
      <Animated.View
        ref={containerRef}
        onLayout={() => {
          if (containerRef.current) {
            containerRef.current.measure(
              (
                _fx: number,
                _fy: number,
                _wheelWidth: number,
                _wheelHeight: number,
                pxSize: number,
                pySize: number
              ) => {
                setPx(pxSize);
                setPy(pySize);
              }
            );
          }
        }}
        style={{
          ...styles.wheel,
          transform: [
            {
              rotate: rotateInterpolated,
            },
          ],
          backgroundColor: props.backgroundColor,
          width: props.size,
          height: props.size,
          borderRadius: props.size / 2,
        }}
        {..._panResponder.panHandlers}
      >
        <AnimatedSvg
          style={{
            transform: [{ rotate: `-${SLICE_ANGLE_CENTER}deg` }],
          }}
        >
          <G y={props.size / 2} x={props.size / 2}>
            {SLICE_PAYLOAD.map((payload, i) => {
              const [x, y] = payload.centroid;
              return (
                <G key={`arc-${i}`}>
                  {_renderSlice(payload.path, payload.color)}
                  {_renderText({ x, y, payload, i })}
                  {_renderOuterDots(x, y, i)}
                </G>
              );
            })}
          </G>
        </AnimatedSvg>
        {_renderCircle()}
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {_renderKnob()}
      <View
        style={{
          transform: [
            {
              rotate: `${props.offset}deg`,
            },
          ],
        }}
      >
        {_renderWheel()}
      </View>
    </View>
  );
});

const defaultProps: ILuckyWheelOptionalProps = {
  duration: 4,
  innerRadius: 30,
  outerRadius: 13,
  padAngle: 0.01,
  backgroundColor: '#FFF',
  size: width - 40,
  textAngle: TextAngles.VERTICAL,
  backgroundColorOptions: {
    luminosity: 'dark',
    hue: 'random',
  },
  knobSize: 30,
  knobColor: '#FF0000',
  textStyle: {},
  easing: EasingTypes.OUT,
  dotColor: '#000',
  minimumSpinVelocity: 1,
  enableGesture: false,
  enableOuterDots: true,
  enablePhysics: false,
  gestureType: GestureTypes.CLOCKWISE,
  offset: 0,
  waitWinner: false,
  enableInnerShadow: true,
};

LuckyWheel.defaultProps = defaultProps;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  wheel: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    position: 'absolute',
    backgroundColor: 'transparent',
    borderColor: '#000',
    borderWidth: 15,
    opacity: 0.3,
  },
  knob: {
    justifyContent: 'flex-end',
    zIndex: 1,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
});

export default LuckyWheel;
