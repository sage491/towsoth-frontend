export type ProgressTooltipEntry = {
  name: string;
  value: string | number;
};

export type ProgressTooltipProps = {
  active?: boolean;
  payload?: ProgressTooltipEntry[];
  label?: string | number;
};
