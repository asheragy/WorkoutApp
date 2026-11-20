import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@react-navigation/native';

// TODO placeholder, overall workout history
export function WorkoutsTab() {
  const { colors } = useTheme();

  return <View style={{ flex: 1, backgroundColor: colors.background }} />;
}
