import React, { useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Alert, BackHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, ProgressBar } from '@/components';
import { colors } from '@/constants';
import { videoRenderer } from '@/services';
import { useImages, useSettings, useRendering, useAppStore } from '@/store';
import { RootStackParamList } from '@/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Rendering'>;

export const RenderingScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const images = useImages();
  const settings = useSettings();
  const rendering = useRendering();
  const setRenderingStatus = useAppStore((s) => s.setRenderingStatus);
  const setRenderingProgress = useAppStore((s) => s.setRenderingProgress);
  const setOutputUri = useAppStore((s) => s.setOutputUri);
  const setRenderingError = useAppStore((s) => s.setRenderingError);
  const resetRendering = useAppStore((s) => s.resetRendering);

  const isRenderingRef = useRef(false);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (!hasStartedRef.current) {
      hasStartedRef.current = true;
      startRendering();
    }

    return () => {
      if (isRenderingRef.current) {
        videoRenderer.cancelRendering();
      }
    };
  }, []);

  // Handle back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (rendering.status === 'rendering' || rendering.status === 'preparing') {
        handleCancel();
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [rendering.status]);

  // Navigate to result when completed
  useEffect(() => {
    if (rendering.status === 'completed' && rendering.outputUri) {
      navigation.replace('Result');
    }
  }, [rendering.status, rendering.outputUri, navigation]);

  const startRendering = useCallback(async () => {
    if (isRenderingRef.current) return;

    isRenderingRef.current = true;
    resetRendering();
    setRenderingStatus('preparing');

    try {
      setRenderingStatus('rendering');

      await videoRenderer.renderVideo(images, settings, {
        onProgress: (progress) => {
          setRenderingProgress(progress);
        },
        onComplete: (outputUri) => {
          isRenderingRef.current = false;
          setOutputUri(outputUri);
          setRenderingStatus('completed');
        },
        onError: (error) => {
          isRenderingRef.current = false;
          setRenderingError(error);
        },
      });
    } catch (error) {
      isRenderingRef.current = false;
      setRenderingError(error instanceof Error ? error.message : 'Unknown error');
    }
  }, [images, settings]);

  const handleCancel = useCallback(() => {
    Alert.alert(
      'Cancel Rendering',
      'Are you sure you want to cancel the video rendering?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            await videoRenderer.cancelRendering();
            isRenderingRef.current = false;
            setRenderingStatus('cancelled');
            navigation.goBack();
          },
        },
      ]
    );
  }, [navigation, setRenderingStatus]);

  const handleRetry = useCallback(() => {
    hasStartedRef.current = false;
    startRendering();
  }, [startRendering]);

  const getStatusMessage = (): string => {
    switch (rendering.status) {
      case 'preparing':
        return 'Preparing images...';
      case 'rendering':
        return 'Creating your video...';
      case 'completed':
        return 'Video created successfully!';
      case 'cancelled':
        return 'Rendering cancelled';
      case 'error':
        return 'An error occurred';
      default:
        return 'Starting...';
    }
  };

  const isActive = rendering.status === 'preparing' || rendering.status === 'rendering';
  const isError = rendering.status === 'error';

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.content}>
        <Text style={styles.title}>
          {isError ? 'Rendering Failed' : 'Creating Video'}
        </Text>

        <View style={styles.progressContainer}>
          <ProgressBar progress={rendering.progress} height={12} />
          <Text style={styles.statusText}>{getStatusMessage()}</Text>
        </View>

        {isError && rendering.error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{rendering.error}</Text>
          </View>
        )}

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            {images.length} images • {settings.resolution} • {settings.transitionType}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        {isActive && (
          <Button title="Cancel" onPress={handleCancel} variant="danger" />
        )}
        {isError && (
          <>
            <Button title="Go Back" onPress={() => navigation.goBack()} variant="secondary" />
            <Button title="Retry" onPress={handleRetry} style={styles.retryButton} />
          </>
        )}
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
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 40,
  },
  progressContainer: {
    paddingHorizontal: 20,
  },
  statusText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
  },
  errorContainer: {
    backgroundColor: colors.backgroundError,
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    marginHorizontal: 20,
  },
  errorText: {
    fontSize: 14,
    color: colors.error,
    textAlign: 'center',
  },
  infoContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: colors.textTertiary,
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  retryButton: {
    flex: 1,
  },
});
