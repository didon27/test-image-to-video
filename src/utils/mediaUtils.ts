import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';

export const requestMediaLibrarySavePermission = async (): Promise<boolean> => {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  return status === 'granted';
};

export const saveVideoToGallery = async (videoUri: string): Promise<boolean> => {
  try {
    const hasPermission = await requestMediaLibrarySavePermission();
    if (!hasPermission) {
      throw new Error('Media library permission not granted');
    }

    await MediaLibrary.saveToLibraryAsync(videoUri);
    return true;
  } catch (error) {
    console.error('Failed to save video to gallery:', error);
    return false;
  }
};

export const shareVideo = async (videoUri: string): Promise<void> => {
  const isAvailable = await Sharing.isAvailableAsync();
  if (!isAvailable) {
    throw new Error('Sharing is not available on this device');
  }

  await Sharing.shareAsync(videoUri, {
    mimeType: 'video/mp4',
    dialogTitle: 'Share your slideshow',
  });
};
