export interface SegmentedControlOption<T extends string> {
  label: string;
  value: T;
}

export interface SegmentedControlProps<T extends string> {
  label?: string;

  options: SegmentedControlOption<T>[];

  value: T;

  onValueChange: (value: T) => void;
}
