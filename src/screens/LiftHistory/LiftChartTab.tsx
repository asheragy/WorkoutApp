import React from 'react';
import {StyleSheet, View} from 'react-native';
import {PersistedLiftHistory} from '../../repository/LiftHistoryRepository';
import {LiftDef, PersistedSet} from '../../types/types';
import {ProgressChart} from '../../components/ProgressChart';
import Utils from '../../components/Utils';

export function LiftChartTab(props: {
  def: LiftDef;
  entries: PersistedLiftHistory[];
}) {
  var dates = props.entries.map(x => x.date);
  var values = props.entries.map(x => calculateEstimated1RM(props.def, x.sets));
  var volume = props.entries.map(x => calculateVolume(props.def, x.sets));

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
