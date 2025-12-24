// Image types
export interface SelectedImage {
  uri: string;
  id: string;
  width: number;
  height: number;
  fileName?: string;
}

// Export settings types
export type Resolution = '720p' | '1080p';
export type ImageDuration = 2 | 3 | 4;
export type TransitionType = 'crossfade' | 'kenburns' | 'slide';

export interface ExportSettings {
  resolution: Resolution;
  imageDuration: ImageDuration;
  transitionType: TransitionType;
}

export interface ResolutionConfig {
  width: number;
  height: number;
  label: string;
}

// Rendering types
export type RenderingStatus = 'idle' | 'preparing' | 'rendering' | 'completed' | 'cancelled' | 'error';

export interface RenderingState {
  status: RenderingStatus;
  progress: number;
  outputUri: string | null;
  error: string | null;
}

// Navigation types
export type RootStackParamList = {
  ImageSelection: undefined;
  ExportSettings: undefined;
  Rendering: undefined;
  Result: undefined;
};
