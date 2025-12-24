import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, OptionSelector } from '@/components';
import { RESOLUTIONS, IMAGE_DURATIONS, TRANSITION_TYPES, colors } from '@/constants';
import { useSettings, useImages, useAppStore } from '@/store';
import { RootStackParamList, Resolution, ImageDuration, TransitionType } from '@/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ExportSettings'>;

export const ExportSettingsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const settings = useSettings();
  const images = useImages();
  const setResolution = useAppStore((s) => s.setResolution);
  const setImageDuration = useAppStore((s) => s.setImageDuration);
  const setTransitionType = useAppStore((s) => s.setTransitionType);

  const resolutionOptions = Object.entries(RESOLUTIONS).map(([key, value]) => ({
    value: key as Resolution,
    label: value.label,
  }));

  const durationOptions = IMAGE_DURATIONS.map((duration) => ({
    value: duration,
    label: `${duration}s`,
  }));

  const transitionOptions = TRANSITION_TYPES.map((t) => ({
    value: t.value,
    label: t.label,
  }));

  const handleStartRendering = useCallback(() => {
    navigation.navigate('Rendering');
  }, [navigation]);

  const totalDuration = images.length * settings.imageDuration;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Export Settings</Text>
        <Text style={styles.subtitle}>Configure your video output</Text>

        <View style={styles.previewInfo}>
          <Text style={styles.previewLabel}>Video Preview</Text>
          <Text style={styles.previewText}>
            {images.length} images • ~{totalDuration}s duration
          </Text>
        </View>

        <OptionSelector<Resolution>
          label="Resolution"
          options={resolutionOptions}
          selectedValue={settings.resolution}
          onSelect={setResolution}
        />

        <OptionSelector<ImageDuration>
          label="Image Duration"
          options={durationOptions}
          selectedValue={settings.imageDuration}
          onSelect={setImageDuration}
        />

        <OptionSelector<TransitionType>
          label="Transition Effect"
          options={transitionOptions}
          selectedValue={settings.transitionType}
          onSelect={setTransitionType}
        />

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Resolution:</Text>
            <Text style={styles.summaryValue}>{RESOLUTIONS[settings.resolution].label}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Duration:</Text>
            <Text style={styles.summaryValue}>~{totalDuration} seconds</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Transition:</Text>
            <Text style={styles.summaryValue}>
              {TRANSITION_TYPES.find((t) => t.value === settings.transitionType)?.label}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.actions}>
        <Button title="Back" onPress={() => navigation.goBack()} variant="secondary" />
        <Button title="Create Video" onPress={handleStartRendering} style={styles.createButton} />
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
  previewInfo: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  previewLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  previewText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 4,
  },
  summaryCard: {
    backgroundColor: colors.backgroundInfo,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  createButton: {
    flex: 1,
  },
});
