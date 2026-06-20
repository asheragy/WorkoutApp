import React from 'react';
import { View } from 'react-native';
import { LiftHistory } from '../../repository/LiftHistoryRepository';
import { GlobalSettings, LiftDef } from '../../types/types';
import { ProgressChart } from '../../components/ProgressChart';
import SetUtils from '../../utils/SetUtils.ts';

export function LiftChartTab(props: {
  settings: GlobalSettings;
  def: LiftDef;
  entries: LiftHistory[];
}) {
  // Needs at least 1 valid set
  const entries = props.entries.filter(x => x.sets.find(set => !set.warmup));

  const dates = entries.map(x => x.timestamp);
  const values = entries.map(x =>
    SetUtils.calculate1RMAverage(props.settings, props.def, x.sets),
  );
  const volume = entries.map(x =>
    SetUtils.calculateVolume(props.settings, props.def, x.sets),
  );

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ProgressChart title="1RM" dates={dates} values={values}></ProgressChart>
      <ProgressChart
        title="Volume"
        dates={dates}
        values={volume}
      ></ProgressChart>
    </View>
  );
}
