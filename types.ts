
export enum AppState {
  INITIAL = 'INITIAL',
  PERSUADING = 'PERSUADING'
}

export interface HeartProps {
  id: number;
  left: string;
  size: string;
  duration: string;
  delay: string;
}
