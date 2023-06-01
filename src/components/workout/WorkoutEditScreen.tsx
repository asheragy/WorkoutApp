import React, {useState} from 'react';
import {StackScreenProps} from '@react-navigation/stack';
import {Button, FlatList, ListRenderItemInfo, Text, View} from 'react-native';
import {RootStackParamList} from '../../App';
import {LiftDef} from '../../types/types';
import {TextInput} from 'react-native-gesture-handler';
import {Lift, Workout} from '../../types/workout';
import Utils from '../Utils';
import WorkoutRepository from '../../repository/WorkoutRepository';
import EditableLiftItem from '../EditableLiftItem';

type Props = StackScreenProps<RootStackParamList, 'WorkoutEdit'>;

export function WorkoutEditScreen({route, navigation}: Props) {
  const existing = route.params.workout;

  const [title, setTitle] = useState(
    existing ? existing.name : 'Workout Title',
  );
  const [lifts, setLifts] = useState<Lift[]>(existing ? existing.lifts : []);

  async function onSave() {
    const workout: Workout = {
      id: existing ? existing.id : undefined,
      name: title,
      lifts: lifts,
    };

    await WorkoutRepository.upsert(workout);
    route.params.onChanged();
    navigation.pop();
  }

  function onSelectExercise() {
    navigation.navigate('LiftDefList', {onSelect: onExerciseAdded});
  }

  function onExerciseAdded(def: LiftDef) {
    const lift: Lift = {
      def: def,
      sets: [],
    };
    setLifts(prevState => [...prevState, lift]);
  }

  function onLiftChanged(index: number, lift: Lift) {
    var updatedLifts = [...lifts];
    updatedLifts[index] = lift;

    setLifts(updatedLifts);
  }

  const renderItem = (item: ListRenderItemInfo<Lift>) => (
    <EditableLiftItem
      lift={item.item}
      index={item.index}
      onChange={onLiftChanged}></EditableLiftItem>
  );

  return (
    <View>
      <TextInput onChangeText={setTitle}>{title}</TextInput>
      {existing != undefined && (
        <Text>
          {'Last Completed: ' + Utils.lastCompleted(existing.lastCompleted)}
        </Text>
      )}
      <FlatList
        data={lifts}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}></FlatList>
      <Button title="Add Exercise" onPress={() => onSelectExercise()}></Button>
      <Button title="Save" onPress={() => onSave()}></Button>
    </View>
  );
}
