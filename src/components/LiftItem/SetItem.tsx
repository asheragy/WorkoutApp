import {NormalizedSet, PlateCount} from '../../types/types';
import {useTheme} from '@react-navigation/native';
import {StyleProp, Text, TextStyle, View} from 'react-native';
import Utils from '../Utils';
import React from 'react';

export default function SetItem(props: {
  set: NormalizedSet;
  plates?: PlateCount;
  showPlateCount: boolean;
}) {
  const {colors} = useTheme();
  const weight = props.set.weight;
  const weightWidth = props.showPlateCount ? '30%' : '60%';

  const textStyle: StyleProp<TextStyle> = {
    color: colors.text,
    opacity: props.set.completed ? 0.5 : undefined,
    textDecorationLine: props.set.completed ? 'line-through' : undefined,
    textDecorationStyle: props.set.completed ? 'solid' : undefined,
  };

  return (
    <View style={{flexDirection: 'row'}}>
      <Text
        style={{
          width: '20%',
          textAlign: 'center',
          ...textStyle,
        }}>
        {props.set.label}
      </Text>
      <Text
        style={{
          width: weightWidth,
          textAlign: 'center',
          ...textStyle,
        }}>
        {weight}
      </Text>
      {props.showPlateCount && (
        <Text style={{width: '30%', textAlign: 'left', ...textStyle}}>
          {props.plates ? Utils.platesToString(props.plates) : ''}
        </Text>
      )}
      <Text
        style={{
          width: '20%',
          textAlign: 'center',
          ...textStyle,
        }}>
        {props.set.reps}
      </Text>
    </View>
  );
}
