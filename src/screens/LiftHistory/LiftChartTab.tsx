import React from 'react';
import {StyleSheet, View} from 'react-native';
import {LiftHistory} from '../../repository/LiftHistoryRepository';
import {LiftDef, PersistedSet} from '../../types/types';
import {ProgressChart} from '../../components/ProgressChart';
import Utils from '../../components/Utils';
import {useSelector} from 'react-redux';
import {AppState} from '../../state/store';

export function LiftChartTab(props: {def: LiftDef; entries: LiftHistory[]}) {
  // TODO remove after resetting database
  var entries = props.entries.filter(x => x.hasOwnProperty('timestamp'));

  var dates = entries.map(x => x.timestamp);
  var values = entries.map(x => calculateEstimated1RM(props.def, x.sets));
  var volume = entries.map(x => calculateVolume(props.def, x.sets));

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
  var workSets = 0;

  for (var i = 0; i < sets.length; i++) {
    var set = sets[i];
    if (set.warmup != true) {
      sum += Utils.calculate1RM(def, set);
      workSets++;
    }
  }

  return Math.round(sum / workSets);
}

function calculateVolume(def: LiftDef, sets: PersistedSet[]): number {
  var sum = 0;
  for (var i = 0; i < sets.length; i++) {
    var set = sets[i];
    if (set.warmup != true) sum += Utils.calculateVolume(def, set);
  }

  return sum;
}
