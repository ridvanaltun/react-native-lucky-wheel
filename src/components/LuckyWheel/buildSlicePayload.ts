import * as d3Shape from 'd3-shape';
import randomColor from 'randomcolor';

import type { Color, ILuckyWheel, ILuckyWheelOptionalProps } from '../../types';

export type WheelSlicePayload = {
  path: string | null;
  color: Color;
  text: string;
  textStyle?: ILuckyWheel['slices'][number]['textStyle'];
  centroid: [number, number];
};

type BuildArgs = {
  slices: ILuckyWheel['slices'];
  padAngle: number;
  outerRadius: number;
  innerRadius: number;
  backgroundColorOptions: ILuckyWheelOptionalProps['backgroundColorOptions'];
};

export function buildSlicePayload({
  slices,
  padAngle,
  outerRadius,
  innerRadius,
  backgroundColorOptions,
}: BuildArgs): WheelSlicePayload[] {
  const sliceCount = slices.length;
  const data = Array.from({ length: sliceCount }).fill(1) as number[];
  const arcs = d3Shape.pie<number>()(data);
  const arcGenerator = d3Shape
    .arc<d3Shape.PieArcDatum<number>>()
    .padAngle(padAngle)
    .outerRadius(outerRadius)
    .innerRadius(innerRadius);

  const colors = randomColor({
    ...backgroundColorOptions,
    count: sliceCount,
  }) as string[];

  return arcs.map((arc, index) => ({
    path: arcGenerator(arc),
    color: (slices[index]?.color ?? colors[index % colors.length]) as Color,
    text: slices[index]?.text ?? '',
    textStyle: slices[index]?.textStyle,
    centroid: arcGenerator.centroid(arc) as [number, number],
  }));
}
