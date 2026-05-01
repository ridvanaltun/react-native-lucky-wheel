import React from 'react';
import { G, Text, Path, Circle } from 'react-native-svg';

import type {
  Color,
  ILuckyWheelOptionalProps,
  IWheelText,
  TextAngleType,
} from '../../types';
import { TextAngles } from '../../types';

import type { WheelSlicePayload } from './buildSlicePayload';
import { ONE_TURN } from './constants';
import { luckyWheelStyles as styles } from './styles';

type WheelSliceGroupProps = {
  index: number;
  payload: WheelSlicePayload;
  size: number;
  sliceCount: number;
  sliceAngle: number;
  sliceAngleCenter: number;
  outerRadius: number;
  innerRadius: number;
  textAngle: TextAngleType;
  textStyle: ILuckyWheelOptionalProps['textStyle'];
  customText?: (params: IWheelText) => React.ReactNode;
  enableOuterDots: boolean;
  dotColor: Color;
};

function renderSlice(path: string | null, color: Color) {
  return <Path d={path ?? undefined} strokeWidth={2} fill={color} />;
}

export function WheelSliceGroup({
  index,
  payload,
  size,
  sliceCount,
  sliceAngle,
  sliceAngleCenter,
  outerRadius,
  innerRadius,
  textAngle,
  textStyle,
  customText,
  enableOuterDots,
  dotColor,
}: WheelSliceGroupProps) {
  const [x, y] = payload.centroid;

  const renderLabel = () => {
    if (customText) {
      return customText({ x, y, payload, i: index });
    }

    if (textAngle === TextAngles.VERTICAL) {
      return (
        <G
          rotation={(index * ONE_TURN) / sliceCount + sliceAngleCenter + 90}
          origin={`${x}, ${y}`}
        >
          <Text
            x={x - size / 7}
            y={y}
            fill={
              payload.textStyle?.color ?? textStyle?.color ?? styles.text.color
            }
            {...textStyle}
            {...payload.textStyle}
          >
            {payload.text}
          </Text>
        </G>
      );
    }

    return (
      <G
        rotation={(index * ONE_TURN) / sliceCount + sliceAngleCenter}
        origin={`${x}, ${y}`}
      >
        <Text
          x={x - payload.text.length * 5}
          y={y - size / 8}
          fill={
            payload.textStyle?.color ?? textStyle?.color ?? styles.text.color
          }
          {...textStyle}
          {...payload.textStyle}
        >
          {payload.text}
        </Text>
      </G>
    );
  };

  const renderOuterDots = () => {
    if (!enableOuterDots) return null;

    return (
      <Circle
        origin={`${x}, ${y}`}
        rotation={(index * ONE_TURN) / sliceCount + sliceAngleCenter}
        cx={x + outerRadius + 2.5}
        cy={
          y + sliceAngle - sliceCount * 2 + innerRadius / 2 + innerRadius / 100
        }
        r="4"
        fill={dotColor}
      />
    );
  };

  return (
    <G>
      {renderSlice(payload.path, payload.color)}
      {renderLabel()}
      {renderOuterDots()}
    </G>
  );
}
