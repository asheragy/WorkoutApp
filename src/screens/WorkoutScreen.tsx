import React, {useEffect, useState} from 'react';
import {Alert, Button, ScrollView, StyleSheet, Text, View} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../App';
import {AccessoryView} from '../components/Accessories';
import {LogBox} from 'react-native';
import {Lift, LiftSet, SingleWorkoutId, Workout} from '../types/workout';
import WorkoutRepository from '../repository/WorkoutRepository';
import Log from '../utils/Log';
import LiftItem from '../components/LiftItem';
import WorkoutHistoryRepository from '../repository/WorkoutHistoryRepository';
import {
  HeaderButtons,
  OverflowMenu,
  HiddenItem,
  Item,
} from 'react-navigation-header-buttons';
import {MaterialHeaderButton} from '../components/Common';
import {useSelector} from 'react-redux';
import {AppState} from '../state/store';
import {LiftDef} from '../types/types';
import LiftHistoryRepository from '../repository/LiftHistoryRepository';

type Props = StackScreenProps<RootStackParamList, 'Workout'>;

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

export function WorkoutScreen({route, navigation}: Props) {
  const defs = useSelector((store: AppState) => store.liftDefs);
  const [workout, setWorkout] = useState<Workout>({
    name: '',
    lifts: [],
  });

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={MaterialHeaderButton}>
          {workout.id == SingleWorkoutId && (
            <Item title="+Exercise" onPress={onAddExercise} />
          )}
          <OverflowMenu
            style={{marginHorizontal: 10}}
            OverflowIcon={({color}) => (
              <Text style={{fontWeight: 'bold', fontSize: 24}}>...</Text>
            )}>
            <HiddenItem title="History" onPress={() => onHistory()} />
          </OverflowMenu>
        </HeaderButtons>
      ),
    });
  }, [navigation, workout]);

  const confirmComplete = () => {
    Alert.alert('Complete?', 'Are you sure', [
      {
        text: 'No',
        style: 'cancel',
      },
      {text: 'Yes', onPress: () => onComplete()},
    ]);
  };

  const onComplete = async () => {
    workout.lastCompleted = new Date();
    await WorkoutRepository.upsert(workout);
    await WorkoutHistoryRepository.add(workout, defs);

    if (workout.id == SingleWorkoutId) await WorkoutRepository.delete(workout);

    route.params.onComplete();
    navigation.pop();
  };

  function onAddExercise() {
    navigation.navigate('LiftDefList', {onSelect: onExerciseAdded});
  }

  async function onExerciseAdded(def: LiftDef) {
    var history = await LiftHistoryRepository.get(def.id);
    var sets: LiftSet[] = [];
    if (history.length > 0) {
      var last = history[history.length - 1].sets;
      sets = last.map(set => ({
        weight: set.weight,
        reps: set.reps,
        warmup: set.warmup,
      }));
    }
    const updatedWorkout = {
      ...workout,
    };

    updatedWorkout.lifts.push({
      id: def.id,
      sets: sets,
    });

    setWorkout(updatedWorkout);
    WorkoutRepository.upsert(updatedWorkout);
  }

  function onViewLog(lift: Lift) {
    navigation.navigate('LiftHistory', {liftId: lift.id});
  }

  function onLiftChanged(lift: Lift) {
    var index = workout.lifts.findIndex(x => x.id == lift.id);
    var lifts = [...workout.lifts];
    lifts[index] = lift;

    lifts.forEach(x => Log.lift(x));

    const updatedWorkout = {
      ...workout,
      lifts: lifts,
    };
    setWorkout(updatedWorkout);
    WorkoutRepository.upsert(updatedWorkout);
  }

  function loadState() {
    WorkoutRepository.get(route.params.workoutId).then(result => {
      if (result !== undefined) setWorkout(result);
    });
  }

  function onHistory() {
    navigation.navigate('WorkoutHistory', {workoutId: route.params.workoutId});
  }

  useEffect(loadState, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.workoutItem}>
        {workout.lifts.map((lift, index) => (
          <LiftItem
            lift={lift}
            onViewLog={onViewLog}
            onLiftChanged={onLiftChanged}
            key={index}></LiftItem>
        ))}
      </View>

      {workout.accessories != null && (
        <AccessoryView accessories={workout.accessories}></AccessoryView>
      )}
      <View style={styles.bottom}>
        <Button title="Complete" onPress={() => confirmComplete()}></Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 36,
  },

  workoutItem: {
    marginHorizontal: 8,
    marginVertical: 4,
    padding: 8,
    opacity: 0.8,
  },
});
