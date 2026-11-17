import React from 'react';
import { TextStyle } from 'react-native';
import { useTheme } from '@react-navigation/native';
import {
  HeaderButton,
  HeaderButtonProps,
} from 'react-navigation-header-buttons';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';

// MaterialDesignIcons - https://pictogrammers.com/library/mdi/

export const MaterialHeaderButton = (props: HeaderButtonProps) => (
  <HeaderButton
    {...props}
    iconSize={23}
    color="white"
    IconComponent={MaterialDesignIcons}
  />
);

// Vertical "..." used as the trigger for overflow / popup menus
export const MoreIcon = (props: { color?: string }) => {
  const { colors } = useTheme();

  return (
    <MaterialDesignIcons
      name="dots-vertical"
      size={24}
      color={props.color ?? colors.text}
    />
  );
};

// TODO maybe can be shared StyleSheet that is merged with others?
export const Style_LiftText: TextStyle = {
  fontSize: 16,
  fontWeight: 'bold',
  textAlign: 'center',
  textDecorationLine: 'underline',
};
