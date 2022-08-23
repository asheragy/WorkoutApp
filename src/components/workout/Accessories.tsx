import {useTheme} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {AccessoryGroup} from '../../types/types';

export function AccessoryView(props: {accessories: AccessoryGroup[]}) {
  const {colors} = useTheme();

  return (
    <View style={styles.main}>
      {props.accessories.map(group => (
        <View key={group.name} style={styles.section}>
          <Text style={[styles.header, {color: colors.text}]}>
            {group.name}
          </Text>
          {group.lifts.map(x => (
            <Text key={x} style={{color: colors.text}}>
              {x}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  section: {
    padding: 20,
  },
  header: {
    fontWeight: 'bold',
  },
});
