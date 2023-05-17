import React, {useEffect, useState} from 'react';
import {Alert, Button, ScrollView, StyleSheet, View} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';
import {AccessoryView} from './Accessories';
import {LogBox} from 'react-native';
import {useTheme} from '@react-navigation/native';
import LiftItem from './LiftItem';
import {Lift, Workout} from '../../types/workout';
import WorkoutRepository from '../../repository/WorkoutRepository';
import {TrainingMax} from '../../types/types';
import TrainingMaxRepository from '../../repository/TrainingMaxRepository';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

type Props = StackScreenProps<RootStackParamList, 'Workout'>;

export function WorkoutScreen({route, navigation}: Props) {
  console.log('WorkoutScreen');
  console.log(route.params);
  const workout = route.params.workout;
  const [tms, setTMs] = useState<TrainingMax[]>([]);

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
    //await LiftRepository.addAllHistory(workout);
    route.params.onComplete();
    navigation.pop();
  };

  function onViewLog(lift: Lift) {
    navigation.navigate('LiftHistory', {lift: lift.def});
  }

  function loadState() {
    TrainingMaxRepository.getInstance()
      .getAll()
      .then(result => {
        setTMs(result);
      });
  }
  useEffect(loadState, []);

  return (
    <ScrollView style={styles.container}>
      <WorkoutItem
        workout={workout}
        onViewLog={onViewLog}
        tms={tms}></WorkoutItem>
      {workout.accessories != null && (
        <AccessoryView accessories={workout.accessories}></AccessoryView>
      )}
      <View style={styles.bottom}>
        <Button title="Complete" onPress={() => confirmComplete()}></Button>
      </View>
    </ScrollView>
  );
}

function WorkoutItem(props: {
  workout: Workout;
  tms: TrainingMax[];
  onViewLog: (lift: Lift) => void;
}) {
  const {colors} = useTheme();

  return (
    <View style={styles.workoutItem}>
      {props.workout.lifts.map((lift, index) => (
        <LiftItem
          lift={lift}
          tm={props.tms.find(x => x.id == lift.def.id)}
          onViewLog={props.onViewLog}
          key={index}></LiftItem>
      ))}
    </View>
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
