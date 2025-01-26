import {useTheme} from '@react-navigation/native';
import {StyleSheet, Text, View} from 'react-native';
import {Widths} from './Widths';
import React from 'react';
import {Style_LiftText} from '../Common';

export function PersistedSetHeader() {
  const {colors} = useTheme();
  const labels = ['Set', 'Weight', '', 'Reps', '1RM'];

  return (
    <View style={{flexDirection: 'row'}}>
      {labels.map((label, index) => (
        <Text
          key={index}
          style={[
            styles.liftHeader,
            {width: Widths[index], color: colors.text},
          ]}>
          {label}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  liftText: Style_LiftText,
  liftHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  menuContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    flexDirection: 'column',
  },
});
