import { StateCreator } from 'zustand';

import { ExportSettings, Resolution, ImageDuration, TransitionType } from '@/types';
import { DEFAULT_EXPORT_SETTINGS } from '@/constants';

export interface SettingsSlice {
  settings: ExportSettings;
  setResolution: (resolution: Resolution) => void;
  setImageDuration: (duration: ImageDuration) => void;
  setTransitionType: (type: TransitionType) => void;
  resetSettings: () => void;
}

export const createSettingsSlice: StateCreator<SettingsSlice> = (set) => ({
  settings: DEFAULT_EXPORT_SETTINGS,

  setResolution: (resolution) =>
    set((state) => ({
      settings: { ...state.settings, resolution },
    })),

  setImageDuration: (duration) =>
    set((state) => ({
      settings: { ...state.settings, imageDuration: duration },
    })),

  setTransitionType: (type) =>
    set((state) => ({
      settings: { ...state.settings, transitionType: type },
    })),

  resetSettings: () => set({ settings: DEFAULT_EXPORT_SETTINGS }),
});
