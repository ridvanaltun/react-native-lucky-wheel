import React, { useCallback } from 'react';
import type { MutableRefObject, RefObject } from 'react';
import { Animated, PanResponder, type ImageSourcePropType } from 'react-native';

import type {
  Color,
  ILuckyWheelOptionalProps,
  IWheelText,
  TextAngleType,
} from '../../types';

import type { WheelSlicePayload } from './buildSlicePayload';
import { luckyWheelStyles as styles } from './styles';
import { WheelSvg } from './WheelSvg';

type PanHandlers = ReturnType<typeof PanResponder.create>['panHandlers'];

type WheelFaceProps = {
  source?: ImageSourcePropType;
  size: number;
  rotateInterpolated: Animated.AnimatedInterpolation<string | number>;
  backgroundColor: Color;
  containerRef: RefObject<any>;
  panHandlers: PanHandlers;
  slicePayload: WheelSlicePayload[];
  sliceCount: number;
  sliceAngle: number;
  sliceAngleCenter: number;
  outerRadius: number;
  innerRadius: number;
  textAngle: TextAngleType;
  textStyle: ILuckyWheelOptionalProps['textStyle'];
  customText?: (params: IWheelText) => React.ReactNode;
  enableOuterDots: boolean;
  dotColor: ILuckyWheelOptionalProps['dotColor'];
  enableInnerShadow: boolean;
  px: MutableRefObject<number>;
  py: MutableRefObject<number>;
};

function WheelInnerShadowRing({
  size,
  outerRadius,
}: {
  size: number;
  outerRadius: number;
}) {
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.wheel,
        styles.circle,
        {
          width: size - (size - outerRadius * 2),
          height: size - (size - outerRadius * 2),
          borderRadius: size / 2,
        },
      ]}
    />
  );
}

export function WheelFace({
  source,
  size,
  rotateInterpolated,
  backgroundColor,
  containerRef,
  panHandlers,
  slicePayload,
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
  enableInnerShadow,
  px,
  py,
}: WheelFaceProps) {
  const measureLayout = useCallback(() => {
    const node = containerRef.current;
    if (node && typeof node.measureInWindow === 'function') {
      node.measureInWindow((x: number, y: number) => {
        px.current = x;
        py.current = y;
      });
    }
  }, [containerRef, px, py]);

  if (source) {
    return (
      <Animated.Image
        ref={containerRef as RefObject<any>}
        onLayout={measureLayout}
        style={[
          styles.wheel,
          {
            width: size,
            height: size,
            transform: [{ rotate: rotateInterpolated }],
          },
        ]}
        source={source}
        {...panHandlers}
      />
    );
  }

  return (
    <Animated.View
      ref={containerRef}
      onLayout={measureLayout}
      style={[
        styles.wheel,
        {
          transform: [{ rotate: rotateInterpolated }],
          backgroundColor,
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
      {...panHandlers}
    >
      <WheelSvg
        size={size}
        sliceAngleCenter={sliceAngleCenter}
        slicePayload={slicePayload}
        sliceCount={sliceCount}
        sliceAngle={sliceAngle}
        outerRadius={outerRadius}
        innerRadius={innerRadius}
        textAngle={textAngle}
        textStyle={textStyle}
        customText={customText}
        enableOuterDots={enableOuterDots}
        dotColor={dotColor}
      />
      {enableInnerShadow ? (
        <WheelInnerShadowRing size={size} outerRadius={outerRadius} />
      ) : null}
    </Animated.View>
  );
}
