import { ResolutionConfig, Resolution, ImageDuration, TransitionType } from '@/types';

export * from './colors';

export const MIN_IMAGES = 3;
export const MAX_IMAGES = 5;

export const RESOLUTIONS: Record<Resolution, ResolutionConfig> = {
  '720p': {
    width: 1280,
    height: 720,
    label: '720p (1280x720)',
  },
  '1080p': {
    width: 1920,
    height: 1080,
    label: '1080p (1920x1080)',
  },
};

export const IMAGE_DURATIONS: ImageDuration[] = [2, 3, 4];

export const TRANSITION_TYPES: { value: TransitionType; label: string }[] = [
  { value: 'crossfade', label: 'Crossfade' },
  { value: 'kenburns', label: 'Ken Burns' },
  { value: 'slide', label: 'Slide' },
];

export const DEFAULT_EXPORT_SETTINGS = {
  resolution: '720p' as Resolution,
  imageDuration: 3 as ImageDuration,
  transitionType: 'crossfade' as TransitionType,
};

export const TRANSITION_DURATION = 0.5; // seconds
export const VIDEO_FPS = 30;
export const VIDEO_BITRATE = '4M';
