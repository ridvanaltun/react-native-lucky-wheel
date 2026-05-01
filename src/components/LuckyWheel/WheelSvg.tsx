import React from 'react';
import { G } from 'react-native-svg';

import type {
  ILuckyWheelOptionalProps,
  IWheelText,
  TextAngleType,
} from '../../types';

import type { WheelSlicePayload } from './buildSlicePayload';
import { AnimatedSvg } from './constants';
import { WheelSliceGroup } from './WheelSliceGroup';

type WheelSvgProps = {
  size: number;
  sliceAngleCenter: number;
  slicePayload: WheelSlicePayload[];
  sliceCount: number;
  sliceAngle: number;
  outerRadius: number;
  innerRadius: number;
  textAngle: TextAngleType;
  textStyle: ILuckyWheelOptionalProps['textStyle'];
  customText?: (params: IWheelText) => React.ReactNode;
  enableOuterDots: boolean;
  dotColor: ILuckyWheelOptionalProps['dotColor'];
};

export function WheelSvg({
  size,
  sliceAngleCenter,
  slicePayload,
  sliceCount,
  sliceAngle,
  outerRadius,
  innerRadius,
  textAngle,
  textStyle,
  customText,
  enableOuterDots,
  dotColor,
}: WheelSvgProps) {
  return (
    <AnimatedSvg
      pointerEvents="none"
      style={{
        transform: [{ rotate: `-${sliceAngleCenter}deg` }],
      }}
    >
      <G y={size / 2} x={size / 2}>
        {slicePayload.map((payload, index) => (
          <WheelSliceGroup
            key={`arc-${index}`}
            index={index}
            payload={payload}
            size={size}
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
          />
        ))}
      </G>
    </AnimatedSvg>
  );
}
