export type WinnerChipOption = { label: string; value: number | undefined };

export const SVG_WINNER_OPTIONS: WinnerChipOption[] = [
  { label: 'None', value: undefined },
  { label: '1', value: 0 },
  { label: '2', value: 1 },
  { label: '3', value: 2 },
  { label: '4', value: 3 },
  { label: '5', value: 4 },
  { label: '6', value: 5 },
  { label: '7', value: 6 },
];

const imageOpts: WinnerChipOption[] = Array.from({ length: 12 }, (_, i) => ({
  label: String(i + 1),
  value: i,
}));
imageOpts.unshift({ label: 'None', value: undefined });

export const IMAGE_WINNER_OPTIONS = imageOpts;
