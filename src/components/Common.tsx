import React from 'react';
import {TextStyle} from 'react-native';
import {HeaderButton} from 'react-navigation-header-buttons';
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons';

// MaterialDesignIcons - https://pictogrammers.com/library/mdi/

export const MaterialHeaderButton = (props: any) => (
  <HeaderButton
    {...props}
    iconSize={23}
    color="white"
    IconComponent={MaterialDesignIcons}
  />
);

// TODO maybe can be shared StyleSheet that is merged with others?
export const Style_LiftText: TextStyle = {
  fontSize: 16,
  fontWeight: 'bold',
  textAlign: 'center',
  textDecorationLine: 'underline',
};
