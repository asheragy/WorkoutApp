import React, {useEffect, useState} from 'react';
import {Alert, Button, ScrollView, StyleSheet, View} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';
import {AccessoryView} from '../Accessories';
import {LogBox} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {Lift, Workout} from '../../types/workout';
import WorkoutRepository from '../../repository/WorkoutRepository';
import {TrainingMax} from '../../types/types';
import TrainingMaxRepository from '../../repository/TrainingMaxRepository';
import Log from '../../utils/Log';
import LiftHistoryRepository from '../../repository/LiftHistoryRepository';
import LiftItem from '../LiftItem';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

type Props = StackScreenProps<RootStackParamList, 'Workout'>;

export function WorkoutScreen({route, navigation}: Props) {
  const [tms, setTMs] = useState<TrainingMax[]>([]);
  const [workout, setWorkout] = useState<Workout>({
    name: '',
    lifts: [],
  });

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
    await LiftHistoryRepository.addAllHistory(workout);
    route.params.onComplete();
    navigation.pop();
  };

  function onViewLog(lift: Lift) {
    navigation.navigate('LiftHistory', {lift: lift.def});
  }

  function onLiftChanged(lift: Lift) {
    var index = workout.lifts.findIndex(x => x.def.id == lift.def.id);
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
    TrainingMaxRepository.getInstance()
      .getAll()
      .then(result => {
        setTMs(result);
      });
  }
  useEffect(loadState, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.workoutItem}>
        {workout.lifts.map((lift, index) => (
          <LiftItem
            lift={lift}
            tm={tms.find(x => x.id == lift.def.id)}
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
