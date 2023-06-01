import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {Lift, LiftSet} from '../types/workout';
import {EditableSetTable} from './workout/EditableSetRows';
import {Style_LiftText} from './workout/Common';

interface EditableLiftItemProps {
  lift: Lift;
  index: number;
  onChange: (index: number, lift: Lift) => void;
}

export default function EditableLiftItem(props: EditableLiftItemProps) {
  const {colors} = useTheme();

  function addSet() {
    var set: LiftSet = {weight: 0, reps: 0};
    var updatedLift = {...props.lift};
    updatedLift.sets = [...props.lift.sets, set];

    props.onChange(props.index, updatedLift);
  }

  function removeSet() {
    var updatedLift = {...props.lift};
    updatedLift.sets = props.lift.sets.slice(0, props.lift.sets.length - 1);

    props.onChange(props.index, updatedLift);
  }

  function onSetChange(setIndex: number, updatedSet: LiftSet) {
    var updatedLift = {...props.lift};
    updatedLift.sets[setIndex] = updatedSet;

    props.onChange(props.index, updatedLift);
  }

  return (
    <View style={{padding: 8}}>
      <Text style={[styles.liftText, {color: colors.text, marginBottom: 8}]}>
        {props.lift.def.name}
      </Text>
      <EditableSetTable
        sets={props.lift.sets}
        onChange={onSetChange}
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

const styles = StyleSheet.create({
  liftText: Style_LiftText,
});
