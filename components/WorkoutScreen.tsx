import React, {Fragment} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../App';
import {Accessories} from './Accessories';
import {LogBox} from 'react-native';
import {Lift, LiftSet} from '../types/types';
import {Workout} from '../src/data/Repository';

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
  console.log('workout = ' + route.params.workout);
  const workout = route.params.workout;

  const onComplete = async (index: number) => {
    //console.log('onComplete ' + index);
    route.params.onComplete(index);
  };

  return (
    <View style={styles.container}>
      <WorkoutItem workout={workout}></WorkoutItem>
      <View style={styles.bottom}>
        <Button
          title="Complete"
          onPress={() => onComplete(route.params.workout.position)}>
          Text
        </Button>
      </View>
    </View>
  );
}

function WorkoutItem(props: {workout: Workout}) {
  return (
    <View style={styles.workoutItem}>
      <Text style={styles.titleText}>{props.workout.node?.name}</Text>
      {props.workout.node.lifts.map((lift, index) => (
        <LiftItem lift={lift} key={index}></LiftItem>
      ))}
    </View>
  );
}

function LiftItem(props: {lift: Lift}) {
  const showHeader = props.lift.sets != undefined;

  return (
    <View style={{marginVertical: 4}}>
      <Text style={styles.liftText}>{props.lift.name}</Text>
      {showHeader && (
        <View style={{flexDirection: 'row'}}>
          <Text style={[styles.liftHeader, {width: '20%'}]}>Set</Text>
          <Text style={[styles.liftHeader, {width: '60%'}]}>Weight</Text>
          <Text style={[styles.liftHeader, {width: '20%'}]}>Reps</Text>
        </View>
      )}
      <View>
        {normalizeSets(props.lift.sets).map((set, index) => (
          <SetItem number={index + 1} set={set} key={index}></SetItem>
        ))}
      </View>
    </View>
  );
}

function SetItem(props: {number: Number; set: LiftSet}) {
  if (props.set.weight != null) var weight = props.set.weight + 'lb';
  else var weight = 'Any';

  var str = '';
  if (typeof props.set.reps == 'number') str += props.set.reps;
  else str += props.set.reps.min + '-' + props.set.reps.max;

  if (props.set.amrap) str = str + '+';

  return (
    <View style={{flexDirection: 'row'}}>
      <Text style={{width: '20%', textAlign: 'center'}}>{props.number}</Text>
      <Text style={{width: '60%', textAlign: 'center'}}>{weight}</Text>
      <Text style={{width: '20%', textAlign: 'center'}}>{str}</Text>
    </View>
  );
}

function normalizeSets(sets?: LiftSet[]): LiftSet[] {
  var result: LiftSet[] = [];

  sets?.forEach(set => {
    if (set.repeat && set.repeat > 1) {
      var t: LiftSet[] = Array(set.repeat)
        .fill(0)
        .map(x => set);
      result.push(...t);
    } else result.push(set);
  });

  return result;
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
  titleText: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    paddingBottom: 10,
  },
  liftHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  liftText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  workoutItem: {
    marginHorizontal: 8,
    marginVertical: 4,
    padding: 8,
    backgroundColor: 'white',
    opacity: 0.8,
  },
});
