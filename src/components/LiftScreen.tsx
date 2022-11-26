import {useTheme} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {RootStackParamList} from '../App';
import LiftRepository, {PersistedLiftHistory} from '../data/LiftRepository';
import {LiftDef, PersistedSet} from '../types/types';
import {ProgressChart} from './ProgressChart';
import Utils from './Utils';

type Props = StackScreenProps<RootStackParamList, 'Lift'>;

export function LiftScreen({route, navigation}: Props) {
  const [entries, setEntries] = useState<PersistedLiftHistory[]>([]);
  const {colors} = useTheme();
  const def = route.params.lift;

  function loadState() {
    LiftRepository.getHistory(def.id).then(result => {
      setEntries(result);
    });
  }

  useEffect(loadState, []);

  var dates = entries.map(x => x.date);
  var values = entries.map(x => calculateEstimated1RM(def, x.sets));
  var volume = entries.map(x => calculateVolume(def, x.sets));

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

function calculateEstimated1RM(def: LiftDef, sets: PersistedSet[]): number {
  var sum = 0;
  for (var i = 0; i < sets.length; i++) {
    var set = sets[i];
    if (set.warmup != true) sum += Utils.calculate1RM(def, set);
  }

  return Math.round(sum / sets.length);
}

function calculateVolume(def: LiftDef, sets: PersistedSet[]): number {
  var sum = 0;
  for (var i = 0; i < sets.length; i++) {
    var set = sets[i];
    if (set.warmup != true) sum += Utils.calculateVolume(def, set);
  }

  return sum;
}

const styles = StyleSheet.create({
  entryRow: {
    flexDirection: 'row',
  },
});
