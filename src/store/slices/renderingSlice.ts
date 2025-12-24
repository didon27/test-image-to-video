import { StateCreator } from 'zustand';

import { RenderingState, RenderingStatus } from '@/types';

export interface RenderingSlice {
  rendering: RenderingState;
  setRenderingStatus: (status: RenderingStatus) => void;
  setRenderingProgress: (progress: number) => void;
  setOutputUri: (uri: string) => void;
  setRenderingError: (error: string) => void;
  resetRendering: () => void;
}

const initialRenderingState: RenderingState = {
  status: 'idle',
  progress: 0,
  outputUri: null,
  error: null,
};

export const createRenderingSlice: StateCreator<RenderingSlice> = (set) => ({
  rendering: initialRenderingState,

  setRenderingStatus: (status) =>
    set((state) => ({
      rendering: { ...state.rendering, status },
    })),

  setRenderingProgress: (progress) =>
    set((state) => ({
      rendering: { ...state.rendering, progress },
    })),

  setOutputUri: (uri) =>
    set((state) => ({
      rendering: { ...state.rendering, outputUri: uri },
    })),

  setRenderingError: (error) =>
    set((state) => ({
      rendering: { ...state.rendering, status: 'error', error },
    })),

  resetRendering: () => set({ rendering: initialRenderingState }),
});
