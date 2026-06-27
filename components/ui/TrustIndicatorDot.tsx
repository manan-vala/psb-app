import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../../constants/theme';

interface TrustIndicatorDotProps {
  score: number;
}

export function TrustIndicatorDot({ score }: TrustIndicatorDotProps) {
  let color = Colors.error; // < 20

  if (score > 80) {
    color = '#4ade80'; // green-400 equivalent
  } else if (score >= 20) {
    color = '#facc15'; // yellow-400 equivalent
  }

  return (
    <View style={[styles.dot, { backgroundColor: color }]} />
  );
}

const styles = StyleSheet.create({
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: Colors.surfaceContainerLowest, // white border
    position: 'absolute',
    bottom: -2,
    right: -2,
    zIndex: 10,
  },
});
