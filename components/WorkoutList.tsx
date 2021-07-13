import React, {Fragment, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  FlatList,
  View,
  TouchableOpacity,
  ListRenderItemInfo,
} from 'react-native';
import {Workout, Lift, LiftSet} from '../types/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getProgram from '../programs/basic';

export function WorkoutList({navigation}: any) {
  const [completedIndex, setCompletedIndex] = useState(0);
  const storageKey = '@test9';

  function loadState() {
    console.log('load state');
    AsyncStorage.getItem(storageKey).then(value => {
      if (value != null) {
        var values = JSON.parse(value);
        console.log('completed index = ' + (values.length - 1));
        setCompletedIndex(values.length - 1);
      } else setCompletedIndex(-1);
    });
  }

  async function onComplete(index: number) {
    console.log('onComplete' + index);

    try {
      var value = await AsyncStorage.getItem(storageKey);
      var values = [];

      if (value == null && index != 0) {
        console.log('First workout must be completed first');
        return;
      }

      if (value != null) {
        console.log('Previous value = ' + value);
        values = JSON.parse(value);
        if (values.length != index) {
          console.log('Must complete workouts in order');
          return;
        }
      }

      values.push(new Date());

      await AsyncStorage.setItem(storageKey, JSON.stringify(values));
      //setCompletedIndex(values.length);
      navigation.pop();
      loadState();
    } catch (e) {
      // error reading value
    }
  }

  useEffect(loadState, []);

  return (
    <WorkoutFlatList
      completedIndex={completedIndex}
      navigation={navigation}
      onComplete={onComplete}></WorkoutFlatList>
  );
}

function WorkoutFlatList(props: {
  completedIndex: number;
  navigation: any;
  onComplete: (index: number) => void;
}) {
  const list = getProgram().workouts;

  function actionOnRow(index: number, item: Workout) {
    props.navigation.navigate('Workout', {
      index: index,
      workout: item,
      onComplete: props.onComplete,
    });
  }

  const renderItem = (item: ListRenderItemInfo<Workout>) =>
    item.index > props.completedIndex && (
      <TouchableOpacity onPress={() => actionOnRow(item.index, item.item)}>
        <WorkoutItem workout={item.item}></WorkoutItem>
      </TouchableOpacity>
    );

  return (
    <FlatList
      style={{backgroundColor: 'lightgray'}}
      data={list}
      renderItem={renderItem}
      keyExtractor={(_, index) => 'test' + index}></FlatList>
  );
}

interface WorkoutItemProps {
  workout: Workout;
}

export function WorkoutItem(props: WorkoutItemProps) {
  return (
    <View style={styles.workoutItem}>
      <Text style={styles.weekText}>{'Week ' + props.workout.week}</Text>
      {props.workout.lifts.map((lift, index) => (
        <LiftItem lift={lift} key={index}></LiftItem>
      ))}
    </View>
  );
}

function LiftItem(props: {lift: Lift}) {
  return (
    <View>
      <Text style={styles.liftText}>{props.lift.name}</Text>
      <View style={styles.liftSetRow}>
        {props.lift.sets?.map((set, index) => (
          <SetItem set={set} key={index}></SetItem>
        ))}
      </View>
    </View>
  );
}

function SetItem(props: {set: LiftSet}) {
  var str = props.set.weight + 'lb x ' + props.set.reps;
  if (props.set.amrap) str = str + '+';

  if (props.set.repeat && props.set.repeat > 1) {
    var arr = Array(props.set.repeat).fill(0);

    //console.log(arr);
    return (
      <Fragment>
        {arr.map((_, index) => (
          <Text key={index}>{str}</Text>
        ))}
      </Fragment>
    );
  }

  return <Text>{str}</Text>;
}

const styles = StyleSheet.create({
  weekText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  liftText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  workoutItem: {
    marginHorizontal: 8,
    marginVertical: 4,
    padding: 8,
    backgroundColor: 'white',
    opacity: 0.8,
  },
  liftSetRow: {
    marginLeft: 8,
  },
});
