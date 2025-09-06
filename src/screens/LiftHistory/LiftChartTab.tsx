import React from 'react';
import {View} from 'react-native';
import {LiftHistory} from '../../repository/LiftHistoryRepository';
import {LiftDef, PersistedSet} from '../../types/types';
import {ProgressChart} from '../../components/ProgressChart';
import Utils from '../../components/Utils';

export function LiftChartTab(props: {def: LiftDef; entries: LiftHistory[]}) {
  // Needs at least 1 valid set
  const entries = props.entries.filter(x => x.sets.find(set => !set.warmup));

  const dates = entries.map(x => x.timestamp);
  const values = entries.map(x => Utils.calculate1RMAverage(props.def, x.sets));
  const volume = entries.map(x => calculateVolume(props.def, x.sets));

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

function calculateVolume(def: LiftDef, sets: PersistedSet[]): number {
  var sum = 0;
  for (var i = 0; i < sets.length; i++) {
    var set = sets[i];
    if (set.warmup != true) sum += Utils.calculateVolume(def, set);
  }

  return sum;
}
