import React from 'react';
import {Button, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {Lift, LiftSet} from '../types/workout';
import {Style_LiftText} from './workout/Common';
import {GlobalSettings, LiftType, TrainingMax} from '../types/types';
import {NumberControl} from './NumberControl';
import Utils from './Utils';
import {useSelector} from 'react-redux';

interface EditableLiftItemProps {
  lift: Lift;
  tm?: TrainingMax;
  onChange: (lift: Lift) => void;
}

export default function EditableLiftItem(props: EditableLiftItemProps) {
  const {colors} = useTheme();

  function addSet() {
    var set: LiftSet = {weight: 0, reps: 0};
    var updatedLift = {...props.lift};
    updatedLift.sets = [...props.lift.sets, set];

    props.onChange(updatedLift);
  }

  function removeSet() {
    var updatedLift = {...props.lift};
    updatedLift.sets = props.lift.sets.slice(0, props.lift.sets.length - 1);

    props.onChange(updatedLift);
  }

  function onSetChange(setIndex: number, updatedSet: LiftSet) {
    var updatedLift = {...props.lift};
    updatedLift.sets[setIndex] = updatedSet;

    props.onChange(updatedLift);
  }

  return (
    <View style={{padding: 8}}>
      <Text style={[styles.liftText, {color: colors.text, marginBottom: 8}]}>
        {props.lift.def.name}
      </Text>
      <EditableSetTable
        sets={props.lift.sets}
        onChange={onSetChange}
        tm={props.tm}
        liftType={props.lift.def.type}></EditableSetTable>

      <View
        style={{
          marginTop: 10,
          flexDirection: 'row',
        }}>
        <View
          style={{
            width: '45%',
            marginHorizontal: 10,
          }}>
          <Button
            disabled={props.lift.sets.length == 0}
            title="Remove Set"
            onPress={removeSet}></Button>
        </View>

        <View style={{width: '45%', marginHorizontal: 10}}>
          <Button title="Add Set" onPress={addSet}></Button>
        </View>
      </View>
    </View>
  );
}

const Widths = ['10%', '35%', '10%', '35%', '10%'];

export function EditableSetTable(props: {
  sets: LiftSet[];
  liftType: LiftType;
  tm?: TrainingMax;
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
          tm={props.tm}
          onChange={props.onChange}></PersistedSetRow>
      ))}
    </View>
  );
}

function PersistedSetHeader() {
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

function PersistedSetRow(props: {
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
  liftText: Style_LiftText,
  liftHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
