import React from 'react';
import { Animated } from 'react-native';

import Knob from '../Knob';

import type { Color } from '../../types';
import { luckyWheelStyles as styles } from './styles';

type WheelKnobProps = {
  knobInterpolated: Animated.AnimatedInterpolation<string | number>;
  knobSize: number;
  knobColor: Color;
  customKnob?: (params: { size: number; color: Color }) => React.ReactNode;
};

export function WheelKnob({
  knobInterpolated,
  knobSize,
  knobColor,
  customKnob,
}: WheelKnobProps) {
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.knob,
        {
          transform: [{ rotate: knobInterpolated }],
        },
      ]}
    >
      {customKnob ? (
        customKnob({ size: knobSize, color: knobColor })
      ) : (
        <Knob size={knobSize} color={knobColor} />
      )}
    </Animated.View>
  );
}
