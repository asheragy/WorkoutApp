import {useTheme} from '@react-navigation/native';
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  NormalizedSet,
  LiftSet,
  LiftType,
  GlobalSettings,
  PersistedSet,
} from '../../types/types';
import {NumberControl} from '../NumberControl';
import Utils from '../Utils';

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

export function SetItem(props: {set: NormalizedSet}) {
  const {colors} = useTheme();

  return (
    <View style={{flexDirection: 'row'}}>
      <Text style={{width: '20%', textAlign: 'center', color: colors.text}}>
        {props.set.label}
      </Text>
      <Text style={{width: '60%', textAlign: 'center', color: colors.text}}>
        {props.set.weight}
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
  warmupOffset: number;
  onChange: (index: number, updatedSet: LiftSet) => void;
}) {
  const {colors} = useTheme();

  const update = (weight: number, reps: number) => {
    // TODO full object copy needed here
    var updatedSet: LiftSet = {
      weight: {
        value: weight,
        range: props.set.weight.range,
      },
      reps: {
        value: reps,
        range: props.set.reps.range,
      },
      warmup: props.set.warmup,
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
        }}>
        {props.set.warmup ? 'W' : props.index + 1 - props.warmupOffset}
      </Text>
      <View
        style={{
          width: '60%',
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        <NumberControl
          value={props.set.weight.value}
          onChange={newWeightValue =>
            update(newWeightValue, props.set.reps.value)
          }
          decrementBy={() =>
            props.set.weight.value -
            Utils.decrementWeight(
              props.set.weight.value,
              props.liftType,
              props.settings,
            )
          }
          incrementBy={() =>
            Utils.incrementWeight(
              props.set.weight.value,
              props.liftType,
              props.settings,
            ) - props.set.weight.value
          }></NumberControl>
      </View>
      <View style={{width: '20%', flexDirection: 'row'}}>
        <NumberControl
          precision={0}
          value={props.set.reps.value}
          onChange={newRepsValue =>
            update(props.set.weight.value, newRepsValue)
          }
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
