import { Animated, Dimensions } from 'react-native';
import Svg from 'react-native-svg';

import type { ILuckyWheelOptionalProps } from '../../types';
import { TextAngles, EasingTypes, GestureTypes } from '../../types';

export const ONE_TURN = 360;

export const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const { width } = Dimensions.get('screen');

export const DEFAULT_PROPS: ILuckyWheelOptionalProps = {
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
