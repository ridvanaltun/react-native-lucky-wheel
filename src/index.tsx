import type { ImageSourcePropType } from 'react-native';
import type { TextProps } from 'react-native-svg';

import { LuckyWheel } from './components';

type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;

export type Color = RGB | RGBA | HEX | string;

export enum GestureTypes {
  CLOCKWISE = 'clockwise',
  ANTI_CLOCKWISE = 'anti-clockwise',
  MULTIDIRECTIONAL = 'multidirectional',
}

export type GestureType =
  | GestureTypes
  | GestureTypes.CLOCKWISE
  | GestureTypes.ANTI_CLOCKWISE
  | GestureTypes.MULTIDIRECTIONAL;

export enum EasingTypes {
  OUT = 'out',
  IN_OUT = 'in_out',
}

export type EasingType = EasingTypes | EasingTypes.IN_OUT | EasingTypes.OUT;

export enum TextAngles {
  VERTICAL = 'vertical',
  HORIZONTAL = 'horizontal',
}

export type TextAngleType =
  | TextAngles
  | TextAngles.HORIZONTAL
  | TextAngles.VERTICAL;

interface ITextStyle extends TextProps {
  color?: Color;
}

interface RandomColorOptionsSingle {
  hue?: number | string | undefined;
  luminosity?: 'bright' | 'light' | 'dark' | 'random' | undefined;
  seed?: number | string | undefined;
  format?:
    | 'hsvArray'
    | 'hslArray'
    | 'hsl'
    | 'hsla'
    | 'rgbArray'
    | 'rgb'
    | 'rgba'
    | 'hex'
    | undefined;
  alpha?: number | undefined;
}

type ISlice = {
  text: string;
  color?: Color;
  textStyle?: ITextStyle;
};

export interface IWheelText {
  x: number;
  y: number;
  payload: ISlice;
  i: number;
}

interface ICustomKnob {
  color: Color;
  size: number;
}

interface ILuckyWheelRequiredProps {
  slices: ISlice[];
}

export interface ILuckyWheelOptionalProps {
  padAngle: number;
  outerRadius: number;
  innerRadius: number;
  duration: number;
  enableGesture: boolean;
  enablePhysics: boolean;
  enableOuterRing: boolean;
  gestureType: GestureType;
  size: number;
  winnerIndex?: number;
  minimumSpinVelocity: number;
  textStyle: ITextStyle;
  textAngle: TextAngleType;
  backgroundColorOptions: RandomColorOptionsSingle;
  offset: number;
  backgroundColor: Color;
  knobSize: number;
  knobColor: Color;
  easing: EasingType;
  dotColor: Color;
  onKnobTick?: () => void;
  onSpinningEnd?: (winner: ISlice) => void;
  source?: ImageSourcePropType;
  customKnob?: (params: ICustomKnob) => React.ReactChild;
  customText?: (params: IWheelText) => React.ReactChild;
  waitWinner: boolean;
}

export interface ILuckyWheel
  extends ILuckyWheelRequiredProps,
    ILuckyWheelOptionalProps {}

export type LuckyWheelHandle = {};

export default LuckyWheel;
