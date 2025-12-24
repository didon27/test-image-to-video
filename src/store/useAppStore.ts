import { create } from 'zustand';

import {
  createImagesSlice,
  createSettingsSlice,
  createRenderingSlice,
  ImagesSlice,
  SettingsSlice,
  RenderingSlice,
} from './slices';

export type AppStore = ImagesSlice & SettingsSlice & RenderingSlice;

export const useAppStore = create<AppStore>()((...args) => ({
  ...createImagesSlice(...args),
  ...createSettingsSlice(...args),
  ...createRenderingSlice(...args),
}));

// Selectors for state (use these for reactive data)
export const useImages = () => useAppStore((state) => state.images);
export const useSettings = () => useAppStore((state) => state.settings);
export const useRendering = () => useAppStore((state) => state.rendering);
