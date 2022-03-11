import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import { AccessoryGroup } from '../types/types';

export function AccessoryView(props: {accessories: AccessoryGroup[]}) {
  return (
    <View style={styles.main}>
      {props.accessories.map(group => (
        <View style={styles.section}>
          <Text style={styles.header}>{group.name}</Text>
            {group.lifts.map(x => (
              <Text>{x}</Text>
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
