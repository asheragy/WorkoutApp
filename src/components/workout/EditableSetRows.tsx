import {useTheme} from '@react-navigation/native';
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {LiftType, GlobalSettings, TrainingMax} from '../../types/types';
import {NumberControl} from '../NumberControl';
import Utils from '../Utils';
import {LiftSet} from '../../types/workout';
import {useSelector} from 'react-redux';

const Widths = ['10%', '35%', '10%', '35%', '10%'];

export function EditableSetTable(props: {
  sets: LiftSet[];
  liftType: LiftType;
  onChange: (index: number, updatedSet: LiftSet) => void;
}) {
  const labels = Utils.normalizeSets(props.sets).map(set => set.label);
  const settings: GlobalSettings = useSelector((store: any) => store.settings);

  return (
    <View>
      <PersistedSetHeader></PersistedSetHeader>
      {props.sets.map((set, index) => (
        <PersistedSetRow
          index={index}
          set={set}
          label={labels[index]}
          settings={settings}
          liftType={props.liftType}
          key={index}
          onChange={props.onChange}></PersistedSetRow>
      ))}
    </View>
  );
}

export function PersistedSetHeader() {
  const {colors} = useTheme();
  const labels = ['Set', 'Weight', '', 'Reps', '1RM'];

  return (
    <View style={{flexDirection: 'row'}}>
      {labels.map((label, index) => (
        <Text
          key={index}
          style={[
            styles.liftHeader,
            {width: Widths[index], color: colors.text},
          ]}>
          {label}
        </Text>
      ))}
    </View>
  );
}

export function PersistedSetRow(props: {
  index: number;
  set: LiftSet;
  liftType: LiftType;
  settings: GlobalSettings;
  label: string;
  tm?: TrainingMax;
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

  var percentageWeight = '';
  if (props.set.percentage && props.set.weight && props.tm) {
    percentageWeight = Utils.calcPercentage(props.set.weight, props.tm) + '';
  }

  return (
    <View style={{flexDirection: 'row', marginVertical: 4}}>
      <TouchableOpacity
        style={{
          width: Widths[0],
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
          width: Widths[1],
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
              props.set.percentage,
            )
          }
          incrementBy={() =>
            Utils.incrementWeight(
              props.set.weight || 0,
              props.liftType,
              props.settings,
              props.set.percentage,
            ) - (props.set.weight || 0)
          }></NumberControl>
      </View>
      <View
        style={{
          width: Widths[2],
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        <Text
          style={{
            textAlign: 'center',
            textAlignVertical: 'center',
            color: colors.text,
          }}>
          {percentageWeight}
        </Text>
      </View>

      <View
        style={{
          width: Widths[3],
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        <NumberControl
          precision={0}
          value={props.set.reps}
          onChange={newRepsValue => update(props.set.weight, newRepsValue)}
          decrementBy={() => 1}
          incrementBy={() => 1}></NumberControl>
      </View>
      <View
        style={{
          width: Widths[4],
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        <Text
          style={{
            textAlign: 'center',
            textAlignVertical: 'center',
            color: colors.text,
          }}>
          {Math.round(Utils.calculate1RM(props.liftType, props.set, props.tm))}
        </Text>
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
