import React from 'react';

import Svg, { Path } from 'react-native-svg';

import type { Color } from '../index';

interface IKnob {
  size: number;
  color: Color;
}

const Knob = ({ size, color }: IKnob) => {
  return (
    <Svg
      width={size}
      height={(size * 100) / 57}
      viewBox="0 0 57 100"
      style={{
        transform: [{ translateY: 8 }],
      }}
    >
      <Path
        d="M28.034,0C12.552,0,0,12.552,0,28.034S28.034,100,28.034,100s28.034-56.483,28.034-71.966S43.517,0,28.034,0z   M28.034,40.477c-6.871,0-12.442-5.572-12.442-12.442c0-6.872,5.571-12.442,12.442-12.442c6.872,0,12.442,5.57,12.442,12.442  C40.477,34.905,34.906,40.477,28.034,40.477z"
        fill={color}
        // @ts-ignore
        style={{
          width: size,
          height: (size * 100) / 57,
        }}
      />
    </Svg>
  );
};

export default Knob;
