import {useTheme} from '@react-navigation/native';
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  NormalizedSet,
  LiftSet,
  LiftType,
  GlobalSettings,
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

export function SetItem(props: {number: Number; set: NormalizedSet}) {
  const {colors} = useTheme();

  return (
    <View style={{flexDirection: 'row'}}>
      <Text style={{width: '20%', textAlign: 'center', color: colors.text}}>
        {props.number.toString()}
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
  // TODO this should just pass back the modified LiftSet
  onChange: (index: number, weight: number, reps: number) => void;
}) {
  const {colors} = useTheme();

  return (
    <View style={{flexDirection: 'row', marginVertical: 4}}>
      <Text
        style={{
          width: '20%',
          textAlign: 'center',
          textAlignVertical: 'center',
          color: colors.text,
        }}>
        {props.index + 1}
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
            props.onChange(props.index, newWeightValue, props.set.reps.value)
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
            props.onChange(props.index, props.set.weight.value, newRepsValue)
          }
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