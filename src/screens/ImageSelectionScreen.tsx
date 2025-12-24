import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, ImageThumbnail } from '@/components';
import { MIN_IMAGES, MAX_IMAGES, colors } from '@/constants';
import { useImages, useAppStore } from '@/store';
import { RootStackParamList, SelectedImage } from '@/types';
import { pickImages, requestMediaLibraryPermissions } from '@/utils';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ImageSelection'>;

export const ImageSelectionScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const images = useImages();
  const addImages = useAppStore((s) => s.addImages);
  const removeImage = useAppStore((s) => s.removeImage);
  const clearImages = useAppStore((s) => s.clearImages);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    const granted = await requestMediaLibraryPermissions();
    setHasPermission(granted);
    if (!granted) {
      Alert.alert(
        'Permission Required',
        'Please grant access to your photo library to select images.',
        [{ text: 'OK' }]
      );
    }
  };

  const handlePickImages = useCallback(async () => {
    if (!hasPermission) {
      await checkPermissions();
      return;
    }

    const remainingSlots = MAX_IMAGES - images.length;
    if (remainingSlots <= 0) {
      Alert.alert('Maximum Reached', `You can select up to ${MAX_IMAGES} images.`);
      return;
    }

    const selectedImages = await pickImages(remainingSlots);
    if (selectedImages.length > 0) {
      addImages(selectedImages);
    }
  }, [hasPermission, images.length, addImages]);

  const handleRemoveImage = useCallback(
    (id: string) => {
      removeImage(id);
    },
    [removeImage]
  );

  const handleContinue = useCallback(() => {
    if (images.length < MIN_IMAGES) {
      Alert.alert(
        'Not Enough Images',
        `Please select at least ${MIN_IMAGES} images to continue.`
      );
      return;
    }
    navigation.navigate('ExportSettings');
  }, [images.length, navigation]);

  const handleClear = useCallback(() => {
    Alert.alert('Clear All', 'Are you sure you want to remove all selected images?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: clearImages },
    ]);
  }, [clearImages]);

  const renderItem = useCallback(
    ({ item, index }: { item: SelectedImage; index: number }) => (
      <ImageThumbnail image={item} index={index} onRemove={handleRemoveImage} />
    ),
    [handleRemoveImage]
  );

  const canContinue = images.length >= MIN_IMAGES;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.content}>
        <Text style={styles.title}>Select Images</Text>
        <Text style={styles.subtitle}>
          Choose {MIN_IMAGES}-{MAX_IMAGES} images for your slideshow
        </Text>

        {images.length > 0 ? (
          <FlatList
            data={images}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={3}
            contentContainerStyle={styles.gridContent}
            style={styles.grid}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No images selected</Text>
            <Text style={styles.emptySubtext}>Tap the button below to add images</Text>
          </View>
        )}

        <View style={styles.counter}>
          <Text style={styles.counterText}>
            {images.length} / {MAX_IMAGES} images selected
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        {images.length > 0 && (
          <Button
            title="Clear All"
            onPress={handleClear}
            variant="danger"
            style={styles.clearButton}
          />
        )}
        <Button
          title={images.length >= MAX_IMAGES ? 'Maximum Reached' : 'Add Images'}
          onPress={handlePickImages}
          variant="secondary"
          disabled={images.length >= MAX_IMAGES}
        />
        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={!canContinue}
          style={styles.continueButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 8,
    marginBottom: 24,
  },
  grid: {
    flex: 1,
  },
  gridContent: {
    paddingBottom: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textTertiary,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textPlaceholder,
    marginTop: 8,
  },
  counter: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  counterText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  actions: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  clearButton: {
    marginBottom: 4,
  },
  continueButton: {
    marginTop: 4,
  },
});
