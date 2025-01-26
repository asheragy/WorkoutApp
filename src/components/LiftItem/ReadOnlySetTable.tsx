import {Lift} from '../../types/workout';
import {GlobalSettings, LiftDef, PlateCount} from '../../types/types';
import {useSelector} from 'react-redux';
import Utils from '../Utils';
import {View} from 'react-native';
import SetItem from './SetItem';
import React from 'react';
import SetHeader from './SetHeader';

export function ReadOnlySetTable({lift, def}: {lift: Lift; def: LiftDef}) {
  const settings: GlobalSettings = useSelector((store: any) => store.settings);

  function calcPlates(weight: string): PlateCount | undefined {
    if (settings.plateCount != true) return undefined;

    // Just using string since it already accounts for percentage lifts
    const n = parseFloat(weight.replace('lb', ''));
    return Utils.calcPlates(def.type, n);
  }

  return (
    <View>
      <SetHeader showPlateCount={settings.plateCount == true}></SetHeader>
      <View>
        {Utils.normalizeSets(lift.sets, def).map((set, index) => (
          <SetItem
            set={set}
            key={index}
            showPlateCount={settings.plateCount == true}
            plates={calcPlates(set.weight)}></SetItem>
        ))}
      </View>
    </View>
  );
}
