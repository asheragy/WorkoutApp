import React from 'react';
import {Button, StyleSheet, View} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';
import {AccessoryView} from './Accessories';
import {LogBox} from 'react-native';
import {Lift} from '../../types/types';
import {Workout} from '../../data/Repository';
import {ScrollView} from 'react-native-gesture-handler';
import {useTheme} from '@react-navigation/native';
import LiftRepository from '../../data/LiftRepository';
import LiftItem from './LiftItem';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

type Props = StackScreenProps<RootStackParamList, 'Workout'>;

export function WorkoutScreen({route, navigation}: Props) {
  console.log(route.params);
  console.log('workout = ' + route.params.workout);
  const workout = route.params.workout;

  const onComplete = async (index: number) => {
    await LiftRepository.addAllHistory(workout.node);
    route.params.onComplete(index);
  };

  function onViewLog(lift: Lift) {
    navigation.navigate('Lift', {lift: lift});
  }

  return (
    <ScrollView style={styles.container}>
      <WorkoutItem workout={workout} onViewLog={onViewLog}></WorkoutItem>
      {workout.node.accessories != null && (
        <AccessoryView accessories={workout.node.accessories}></AccessoryView>
      )}
      <View style={styles.bottom}>
        <Button
          title="Complete"
          onPress={() => onComplete(route.params.workout.position)}></Button>
      </View>
    </ScrollView>
  );
}

function WorkoutItem(props: {
  workout: Workout;
  onViewLog: (lift: Lift) => void;
}) {
  const {colors} = useTheme();

  return (
    <View style={styles.workoutItem}>
      {props.workout.node.lifts.map((lift, index) => (
        <LiftItem
          lift={lift}
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