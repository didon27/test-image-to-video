import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { colors } from '@/constants';

interface ProgressBarProps {
  progress: number;
  showPercentage?: boolean;
  height?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  showPercentage = true,
  height = 8,
}) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <View style={styles.container}>
      <View style={[styles.track, { height }]}>
        <View
          style={[
            styles.fill,
            {
              width: `${clampedProgress}%`,
              height,
            },
          ]}
        />
      </View>
      {showPercentage && (
        <Text style={styles.percentage}>{Math.round(clampedProgress)}%</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  track: {
    backgroundColor: colors.track,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  percentage: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textInfo,
    textAlign: 'center',
    marginTop: 8,
  },
});
