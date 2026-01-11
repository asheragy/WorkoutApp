import React, {useEffect, useState} from 'react';
import {StackScreenProps} from '@react-navigation/stack';
import {Alert, Button, Text, TouchableOpacity, View} from 'react-native';
import {RootStackParamList} from '../App';
import {GlobalSettings} from '../types/types';
import {TextInput} from 'react-native-gesture-handler';
import {Lift, Workout} from '../types/workout';
import Utils from '../components/Utils';
import WorkoutRepository from '../repository/WorkoutRepository';
import EditableLiftItem from '../components/EditableLiftItem/EditableLiftItem';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import {MaterialHeaderButton} from '../components/Common';
import {useTheme} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {AppState} from '../state/store';
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';

type Props = StackScreenProps<RootStackParamList, 'WorkoutEdit'>;

export function WorkoutEditScreen({route, navigation}: Props) {
  const [workout, setWorkout] = useState<Workout>({
    name: 'Workout Title',
    lifts: [],
  });
  const {colors} = useTheme();
  const defs = useSelector((store: AppState) => store.liftDefs);
  const settings: GlobalSettings = useSelector((store: any) => store.settings);

  function loadState() {
    if (route.params.workoutId) {
      WorkoutRepository.get(route.params.workoutId).then(result => {
        if (result !== undefined) {
          setWorkout(result);
        }
      });
    }
  }

  useEffect(loadState, []);

  // Menu
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{marginRight: 10}}>
          <HeaderButtons HeaderButtonComponent={MaterialHeaderButton}>
            <Item
              title="+Exercise"
              iconName="plus"
              onPress={onSelectExercise}
            />
            <Item title="save" iconName="content-save" onPress={onSave} />
          </HeaderButtons>
        </View>
      ),
    });
  }, [navigation, workout]);

  async function onSave() {
    if (workout.lifts.length > 0 && workout.lifts[0].alternate) {
      Alert.alert('Error', 'First lift cannot be an alternate');
      return;
    }

    // Would set above but SingleWorkout is a special case that this shouldn't overwrite
    if (!route.params.workoutId) {
      workout.routineId = settings.routine;
    }

    try {
      await WorkoutRepository.upsert(workout);
    } catch (error) {
      console.error('Failed to save workout:', error);
    }

    route.params.onChanged();
    navigation.pop();
  }

  // TODO copy from context menu in prior screen instead of here?
  async function onCopy() {
    const workoutCopy: Workout = {
      ...workout,
      name: workout.name + ' (Copy)',
    };

    delete workoutCopy.id;
    await WorkoutRepository.upsert(workoutCopy);
    route.params.onChanged();
    navigation.pop();
  }

  function onSelectExercise() {
    navigation.navigate('LiftDefList', {onSelect: onExerciseAdded});
  }

  function onExerciseAdded(defId: string) {
    const lift: Lift = {
      id: defId,
      sets: [],
      goals: [],
    };
    setWorkout(prev => ({
      ...prev,
      lifts: [...prev.lifts, lift],
    }));
  }

  function onExerciseDelete(index: number) {
    setWorkout(prev => ({
      ...prev,
      lifts: prev.lifts.filter((_, i) => i !== index),
    }));
  }

  function onLiftChanged(index: number, lift: Lift) {
    setWorkout(prev => ({
      ...prev,
      lifts: prev.lifts.map((l, i) => (i === index ? lift : l)),
    }));
  }

  function setLifts(lifts: Lift[]) {
    setWorkout(prev => ({
      ...prev,
      lifts: lifts,
    }));
  }

  function setTitle(title: string) {
    setWorkout(prev => ({
      ...prev,
      name: title,
    }));
  }

  async function onDeleteWorkout() {
    await WorkoutRepository.deleteById(route.params.workoutId!);
    route.params.onChanged();
    navigation.pop();
  }

  function confirmLiftDelete(index: number) {
    const liftId = workout.lifts[index].id;

    Alert.alert(
      `Delete ${defs[liftId].name}?`,
      undefined,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => onExerciseDelete(index),
        },
      ],
      {cancelable: false},
    );
  }

  const renderItem = (item: RenderItemParams<Lift>) => (
    <ScaleDecorator>
      <TouchableOpacity
        onLongPress={item.drag}
        style={{margin: 4, backgroundColor: colors.card}}>
        <EditableLiftItem
          lift={item.item}
          hideCompleted={true}
          onChange={lift => onLiftChanged(item.getIndex()!, lift)}
          onDelete={() =>
            confirmLiftDelete(item.getIndex()!)
          }></EditableLiftItem>
      </TouchableOpacity>
    </ScaleDecorator>
  );

  return (
    <View style={{flex: 1}}>
      <TextInput onChangeText={setTitle} style={{color: colors.text}}>
        {workout.name}
      </TextInput>
      {workout.id != undefined && (
        <Text style={{color: colors.text}}>
          {'Last Completed: ' + Utils.lastCompleted(workout.lastCompleted)}
        </Text>
      )}

      <View
        style={{
          flex: 1,
          flexGrow: 1,
        }}>
        <DraggableFlatList
          data={workout.lifts}
          renderItem={renderItem}
          onDragEnd={({data}) => setLifts(data)}
          keyExtractor={(_, index) => index.toString()}></DraggableFlatList>
        {route.params.workoutId && (
          <Button title="Delete" onPress={onDeleteWorkout}></Button>
        )}
        {route.params.workoutId && (
          <Button title="Create Copy" onPress={onCopy}></Button>
        )}
      </View>
    </View>
  );
}
