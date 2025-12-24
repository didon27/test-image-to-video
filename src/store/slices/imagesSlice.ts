import { StateCreator } from 'zustand';

import { SelectedImage } from '@/types';
import { MAX_IMAGES } from '@/constants';

export interface ImagesSlice {
  images: SelectedImage[];
  addImages: (newImages: SelectedImage[]) => void;
  removeImage: (id: string) => void;
  reorderImages: (fromIndex: number, toIndex: number) => void;
  clearImages: () => void;
}

export const createImagesSlice: StateCreator<ImagesSlice> = (set) => ({
  images: [],

  addImages: (newImages) =>
    set((state) => {
      const availableSlots = MAX_IMAGES - state.images.length;
      const imagesToAdd = newImages.slice(0, availableSlots);
      return { images: [...state.images, ...imagesToAdd] };
    }),

  removeImage: (id) =>
    set((state) => ({
      images: state.images.filter((img) => img.id !== id),
    })),

  reorderImages: (fromIndex, toIndex) =>
    set((state) => {
      const newImages = [...state.images];
      const [removed] = newImages.splice(fromIndex, 1);
      newImages.splice(toIndex, 0, removed);
      return { images: newImages };
    }),

  clearImages: () => set({ images: [] }),
});
