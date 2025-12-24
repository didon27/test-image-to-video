import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Text } from 'react-native';

import { colors } from '@/constants';
import { SelectedImage } from '@/types';

interface ImageThumbnailProps {
  image: SelectedImage;
  index: number;
  onRemove: (id: string) => void;
  size?: number;
}

export const ImageThumbnail: React.FC<ImageThumbnailProps> = ({
  image,
  index,
  onRemove,
  size = 100,
}) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Image source={{ uri: image.uri }} style={styles.image} resizeMode="cover" />
      <View style={styles.indexBadge}>
        <Text style={styles.indexText}>{index + 1}</Text>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => onRemove(image.id)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={styles.removeText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.backgroundTertiary,
    margin: 4,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  indexBadge: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: colors.overlay,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indexText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: colors.errorLight,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});
