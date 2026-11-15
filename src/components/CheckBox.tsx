import { useTheme } from '@react-navigation/native';
import React from 'react';
import { Pressable } from 'react-native';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';

export function CheckBox(props: {
  value?: boolean;
  onValueChange: (value: boolean) => void;
}) {
  const { colors } = useTheme();

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: !!props.value }}
      hitSlop={8}
      onPress={() => props.onValueChange(!props.value)}
    >
      <MaterialDesignIcons
        name={props.value ? 'checkbox-marked' : 'checkbox-blank-outline'}
        size={26}
        color={props.value ? colors.primary : colors.text}
      />
    </Pressable>
  );
}
