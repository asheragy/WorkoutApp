import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const legs = ['Lunges / Step ups', 'Calf Raises', '1-leg DL', 'RDL'];
const core = ['Planks', 'Hip Thrusts', 'Hanging leg raises'];
const push = [
  'Overhead Press',
  'Pushups',
  'Band Triceps',
  'Lat Raises',
  'Skull crushers',
];
const pull = [
  'Curls',
  'Band face pulls',
  'Dumbell Rows',
  'Barbell Rows',
  'Upright rows',
];

export function Accessories() {
  return (
    <View style={styles.main}>
      <View style={styles.section}>
        <Text style={styles.header}>Legs</Text>
        {legs.map(x => (
          <Text>{x}</Text>
        ))}
      </View>
      <View style={styles.section}>
        <Text style={styles.header}>Core</Text>
        {core.map(x => (
          <Text>{x}</Text>
        ))}
      </View>
      <View style={styles.section}>
        <Text style={styles.header}>Push</Text>
        {push.map(x => (
          <Text>{x}</Text>
        ))}
      </View>
      <View style={styles.section}>
        <Text style={styles.header}>Pull</Text>
        {pull.map(x => (
          <Text>{x}</Text>
        ))}
      </View>
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
