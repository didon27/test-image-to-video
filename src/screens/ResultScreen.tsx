import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useVideoPlayer, VideoView } from 'expo-video';

import { Button } from '@/components';
import { colors } from '@/constants';
import { useRendering, useAppStore } from '@/store';
import { RootStackParamList } from '@/types';
import { saveVideoToGallery, shareVideo } from '@/utils';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Result'>;

export const ResultScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const rendering = useRendering();
  const clearImages = useAppStore((s) => s.clearImages);
  const resetRendering = useAppStore((s) => s.resetRendering);
  const [isSaving, setIsSaving] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [savedToGallery, setSavedToGallery] = useState(false);

  const player = useVideoPlayer(rendering.outputUri ?? '', (player) => {
    player.loop = true;
    player.play();
  });

  const handleSaveToGallery = useCallback(async () => {
    if (!rendering.outputUri) return;

    setIsSaving(true);
    try {
      const success = await saveVideoToGallery(rendering.outputUri);
      if (success) {
        setSavedToGallery(true);
        Alert.alert('Success', 'Video saved to your gallery!');
      } else {
        Alert.alert('Error', 'Failed to save video to gallery. Please check permissions.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save video to gallery.');
    } finally {
      setIsSaving(false);
    }
  }, [rendering.outputUri]);

  const handleShare = useCallback(async () => {
    if (!rendering.outputUri) return;

    setIsSharing(true);
    try {
      await shareVideo(rendering.outputUri);
    } catch (error) {
      if (error instanceof Error && !error.message.includes('cancelled')) {
        Alert.alert('Error', 'Failed to share video.');
      }
    } finally {
      setIsSharing(false);
    }
  }, [rendering.outputUri]);

  const handleCreateNew = useCallback(() => {
    Alert.alert(
      'Create New Video',
      'This will clear all current selections. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes',
          onPress: () => {
            clearImages();
            resetRendering();
            navigation.reset({
              index: 0,
              routes: [{ name: 'ImageSelection' }],
            });
          },
        },
      ]
    );
  }, [clearImages, resetRendering, navigation]);

  if (!rendering.outputUri) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorState}>
          <Text style={styles.errorText}>No video available</Text>
          <Button title="Go Back" onPress={() => navigation.goBack()} variant="secondary" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.content}>
        <Text style={styles.title}>Your Video</Text>
        <Text style={styles.subtitle}>Preview and save your creation</Text>

        <View style={styles.videoContainer}>
          <VideoView
            player={player}
            style={styles.video}
            contentFit="contain"
            nativeControls
          />
        </View>
      </View>

      <View style={styles.actions}>
        <Button
          title={savedToGallery ? 'Saved!' : 'Save to Gallery'}
          onPress={handleSaveToGallery}
          loading={isSaving}
          disabled={savedToGallery}
          variant={savedToGallery ? 'secondary' : 'primary'}
        />
        <Button
          title="Share"
          onPress={handleShare}
          loading={isSharing}
          variant="secondary"
        />
        <Button title="Create New" onPress={handleCreateNew} variant="secondary" />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
    marginTop: 8,
    marginBottom: 24,
  },
  videoContainer: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.backgroundCard,
  },
  video: {
    flex: 1,
  },
  actions: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    gap: 12,
    backgroundColor: colors.backgroundCard,
  },
  errorState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: colors.white,
    marginBottom: 20,
  },
});
