import {useTheme} from '@react-navigation/native';
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {NormalizedSet, PlateCount, TrainingMax} from '../../types/types';
import Utils from '../Utils';
import {Lift} from '../../types/workout';

export function ReadOnlySetTable(props: {lift: Lift; tm?: TrainingMax}) {
  function calcPlates(lift: Lift, weight: string): PlateCount | undefined {
    // Just using string since it already accounts for percentage lifts
    var n = parseInt(weight.replace('lb', ''));
    return Utils.calcPlates(lift.def.type, n);
  }

  return (
    <View>
      <SetHeader></SetHeader>
      <View>
        {Utils.normalizeSets(props.lift.sets, props.tm).map((set, index) => (
          <SetItem
            set={set}
            key={index}
            plates={calcPlates(props.lift, set.weight)}></SetItem>
        ))}
      </View>
    </View>
  );
}

function SetHeader() {
  const {colors} = useTheme();
  return (
    <View style={{flexDirection: 'row'}}>
      <Text style={[styles.liftHeader, {width: '20%', color: colors.text}]}>
        Set
      </Text>
      <Text style={[styles.liftHeader, {width: '60%', color: colors.text}]}>
        Weight
      </Text>
      <Text style={[styles.liftHeader, {width: '20%', color: colors.text}]}>
        Reps
      </Text>
    </View>
  );
}

function SetItem(props: {set: NormalizedSet; plates?: PlateCount}) {
  const {colors} = useTheme();
  var weight = props.set.weight;

  /*
  TODO disabling for now but need setting
  if (props.plates !== undefined) {
    console.log(props.plates);
    if (props.plates.p45) weight += ' 45(' + props.plates.p45 + ')';
    if (props.plates.p25) weight += ' 25(' + props.plates.p25 + ')';
    if (props.plates.p10) weight += ' 10(' + props.plates.p10 + ')';
    if (props.plates.p5) weight += ' 5(' + props.plates.p5 + ')';
    if (props.plates.p2point5) weight += ' 2.5(' + props.plates.p2point5 + ')';
  }
  */

  return (
    <View style={{flexDirection: 'row'}}>
      <Text style={{width: '20%', textAlign: 'center', color: colors.text}}>
        {props.set.label}
      </Text>
      <Text style={{width: '60%', textAlign: 'center', color: colors.text}}>
        {weight}
      </Text>
      <Text style={{width: '20%', textAlign: 'center', color: colors.text}}>
        {props.set.reps}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  liftHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
