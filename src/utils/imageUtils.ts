import * as ImagePicker from 'expo-image-picker';

import { SelectedImage } from '@/types';

export const generateImageId = (): string => {
  return `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const pickImages = async (maxCount: number): Promise<SelectedImage[]> => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsMultipleSelection: true,
    selectionLimit: maxCount,
    quality: 0.9,
    exif: false,
    // Force JPEG output to avoid HEIC format issues with FFmpeg
    legacy: true,
  });

  if (result.canceled || !result.assets) {
    return [];
  }

  return result.assets.map((asset) => ({
    uri: asset.uri,
    id: generateImageId(),
    width: asset.width,
    height: asset.height,
    fileName: asset.fileName ?? undefined,
  }));
};

export const requestMediaLibraryPermissions = async (): Promise<boolean> => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  return status === 'granted';
};
