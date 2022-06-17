import {useTheme} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {RootStackParamList} from '../App';
import LiftRepository from '../data/LiftRepository';
import {PersistedLift, PersistedLiftHistory} from '../types/types';
import {ProgressChart} from './ProgressChart';

type Props = StackScreenProps<RootStackParamList, 'Lift'>;

export function LiftScreen({route, navigation}: Props) {
  const [entries, setEntries] = useState<PersistedLiftHistory[]>([]);
  const {colors} = useTheme();

  function loadState() {
    LiftRepository.getHistory(route.params.lift.key).then(result => {
      setEntries(result);
    });
  }

  useEffect(loadState, []);

  var dates = entries.map(x => x.date);
  var values = entries.map(x => calculateEstimated1RM(x.lift));

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ProgressChart dates={dates} values={values}></ProgressChart>
    </View>
  );
}

function calculateEstimated1RM(lift: PersistedLift): number {
  var sum = 0;
  for (var i = 0; i < lift.sets.length; i++) {
    var set = lift.sets[i];
    sum += set.weight + set.weight * 0.0333 * set.reps;
  }

  return Math.round(sum / lift.sets.length);
}

const styles = StyleSheet.create({
  entryRow: {
    flexDirection: 'row',
  },
});
