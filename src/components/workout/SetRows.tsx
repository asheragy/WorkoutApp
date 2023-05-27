import {useTheme} from '@react-navigation/native';
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {
  NormalizedSet,
  LiftType,
  GlobalSettings,
  PersistedSet,
  PlateCount,
} from '../../types/types';
import {NumberControl} from '../NumberControl';
import Utils from '../Utils';
import {LiftSet} from '../../types/workout';

export function SetHeader() {
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

export function SetItem(props: {set: NormalizedSet; plates?: PlateCount}) {
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

export function PersistedSetRow(props: {
  index: number;
  set: LiftSet;
  liftType: LiftType;
  settings: GlobalSettings;
  label: string;
  onChange: (index: number, updatedSet: LiftSet) => void;
}) {
  const {colors} = useTheme();

  const update = (weight?: number, reps?: number) => {
    var updatedSet = {...props.set};
    updatedSet.weight = weight;
    updatedSet.reps = reps;

    props.onChange(props.index, updatedSet);
  };

  // Iterate normal set => warmup => percentage
  const onSetLabelChange = () => {
    var updatedSet: LiftSet = {
      ...props.set,
      warmup: !props.set.warmup && !props.set.percentage,
      percentage: props.set.warmup,
    };

    console.log(updatedSet);

    props.onChange(props.index, updatedSet);
  };

  return (
    <View style={{flexDirection: 'row', marginVertical: 4}}>
      <TouchableOpacity
        style={{
          width: '20%',
          alignSelf: 'center',
        }}
        onPress={onSetLabelChange}>
        <Text
          style={{
            textAlign: 'center',
            textAlignVertical: 'center',
            color: colors.text,
          }}>
          {props.label}
        </Text>
      </TouchableOpacity>

      <View
        style={{
          width: '60%',
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        <NumberControl
          value={props.set.weight}
          onChange={newWeightValue => update(newWeightValue, props.set.reps)}
          decrementBy={() =>
            (props.set.weight || 0) -
            Utils.decrementWeight(
              props.set.weight || 0,
              props.liftType,
              props.settings,
            )
          }
          incrementBy={() =>
            Utils.incrementWeight(
              props.set.weight || 0,
              props.liftType,
              props.settings,
            ) - (props.set.weight || 0)
          }></NumberControl>
      </View>
      <View style={{width: '20%', flexDirection: 'row'}}>
        <NumberControl
          precision={0}
          value={props.set.reps}
          onChange={newRepsValue => update(props.set.weight, newRepsValue)}
          decrementBy={() => 1}
          incrementBy={() => 1}></NumberControl>
      </View>
    </View>
  );
}

// TODO this could maybe be shared with PersistedSetRow but need to refactor a few things
export function GoalSetRow(props: {
  index: number;
  set: PersistedSet;
  liftType: LiftType;
  settings: GlobalSettings;
  onChange: (index: number, updatedSet: PersistedSet) => void;
}) {
  const {colors} = useTheme();

  const update = (weight: number, reps: number) => {
    var updatedSet: PersistedSet = {
      weight: weight,
      reps: reps,
    };

    props.onChange(props.index, updatedSet);
  };

  return (
    <View style={{flexDirection: 'row', marginVertical: 4}}>
      <Text
        style={{
          width: '20%',
          textAlign: 'center',
          textAlignVertical: 'center',
          color: colors.text,
        }}></Text>
      <View
        style={{
          width: '60%',
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        <NumberControl
          value={props.set.weight}
          onChange={newWeightValue => update(newWeightValue, props.set.reps)}
          decrementBy={() =>
            props.set.weight -
            Utils.decrementWeight(
              props.set.weight,
              props.liftType,
              props.settings,
            )
          }
          incrementBy={() =>
            Utils.incrementWeight(
              props.set.weight,
              props.liftType,
              props.settings,
            ) - props.set.weight
          }></NumberControl>
      </View>
      <View style={{width: '20%', flexDirection: 'row'}}>
        <NumberControl
          precision={0}
          value={props.set.reps}
          onChange={newRepsValue => update(props.set.weight, newRepsValue)}
          decrementBy={() => 1}
          incrementBy={() => 1}></NumberControl>
      </View>
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
