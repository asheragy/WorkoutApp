import { Lift } from '../../core/types/workout';
import { GlobalSettings, LiftDef } from '../../core/types/types';
import { useSelector } from 'react-redux';
import { View } from 'react-native';
import SetItem from './SetItem';
import React from 'react';
import SetHeader from './SetHeader';
import { AppState } from '../../state/store.ts';
import SetUtils from '../../core/utils/SetUtils.ts';

export function ReadOnlySetTable({ lift, def }: { lift: Lift; def: LiftDef }) {
  const settings: GlobalSettings = useSelector(
    (store: AppState) => store.settings,
  );

  return (
    <View>
      <SetHeader showPlateCount={settings.plateCount == true}></SetHeader>
      <View>
        {SetUtils.normalizeSets(lift.sets, def).map((set, index) => (
          <SetItem
            set={set}
            key={index}
            showPlateCount={settings.plateCount == true}
          ></SetItem>
        ))}
      </View>
    </View>
  );
}
