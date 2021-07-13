import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../App';
import {WorkoutItem} from './WorkoutList';
import {Accessories} from './Accessories';
import {LogBox} from 'react-native';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

type Props = StackScreenProps<RootStackParamList, 'Workout'>;

type SavedData = {
  index: number;
  date: Date;
};

export function WorkoutScreen({route, navigation}: Props) {
  console.log(route.params);
  console.log('index = ' + route.params.index);
  console.log('workout = ' + route.params.workout);
  const workout = route.params.workout;

  const onComplete = async (index: number) => {
    //console.log('onComplete ' + index);
    route.params.onComplete(index);
  };

  return (
    <View style={styles.container}>
      <WorkoutItem workout={workout}></WorkoutItem>
      <Accessories></Accessories>
      <View style={styles.bottom}>
        <Button title="Complete" onPress={() => onComplete(route.params.index)}>
          Text
        </Button>
      </View>
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
});
