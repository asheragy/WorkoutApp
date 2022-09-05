import {useTheme} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {RootStackParamList} from '../App';
import LiftRepository, {PersistedLiftHistory} from '../data/LiftRepository';
import {PersistedSet} from '../types/types';
import {ProgressChart} from './ProgressChart';

type Props = StackScreenProps<RootStackParamList, 'Lift'>;

export function LiftScreen({route, navigation}: Props) {
  const [entries, setEntries] = useState<PersistedLiftHistory[]>([]);
  const {colors} = useTheme();

  function loadState() {
    LiftRepository.getHistory(route.params.lift.def.id).then(result => {
      setEntries(result);
    });
  }

  useEffect(loadState, []);

  var dates = entries.map(x => x.date);
  var values = entries.map(x => calculateEstimated1RM(x.sets));
  var volume = entries.map(x => calculateVolume(x.sets));

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ProgressChart title="1RM" dates={dates} values={values}></ProgressChart>
      <ProgressChart
        title="Volume"
        dates={dates}
        values={volume}></ProgressChart>
    </View>
  );
}

function calculateEstimated1RM(sets: PersistedSet[]): number {
  var sum = 0;
  for (var i = 0; i < sets.length; i++) {
    var set = sets[i];
    sum += set.weight + set.weight * 0.0333 * set.reps;
  }

  return Math.round(sum / sets.length);
}

function calculateVolume(sets: PersistedSet[]): number {
  var sum = 0;
  for (var i = 0; i < sets.length; i++) {
    var set = sets[i];
    sum += set.weight * set.reps;
  }

  return sum;
}

const styles = StyleSheet.create({
  entryRow: {
    flexDirection: 'row',
  },
});
