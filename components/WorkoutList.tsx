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
import getProgram from '../programs/me';
import {
  HeaderButton,
  HeaderButtons,
  HiddenItem,
  OverflowMenu,
} from 'react-navigation-header-buttons';
import Storage from '../utils/Storage';

const MaterialHeaderButton = (props: any) => (
  <HeaderButton {...props} iconSize={23} color="blue" />
);

export function WorkoutList({navigation}: any) {
  const [completedIndex, setCompletedIndex] = useState(0);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={MaterialHeaderButton}>
          <OverflowMenu
            style={{marginHorizontal: 10}}
            OverflowIcon={({color}) => (
              <Text style={{fontWeight: 'bold', fontSize: 24}}>...</Text>
            )}>
            <HiddenItem title="Undo Complete" onPress={() => onUndo()} />
          </OverflowMenu>
        </HeaderButtons>
      ),
    });
  }, [navigation]);

  function loadState() {
    Storage.getLastCompletedIndex().then(index => setCompletedIndex(index));
  }

  async function onUndo() {
    if (await Storage.undoComplete()) {
      navigation.pop();
      loadState();
    }
  }

  async function onComplete(index: number) {
    if (await Storage.complete(index)) {
      navigation.pop();
      loadState();
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
  if (props.set.weight != null) var str = props.set.weight + 'lb';
  else var str = 'Any';

  str += ' x ';

  if (typeof props.set.reps == 'number') str += props.set.reps;
  else str += props.set.reps.min + '-' + props.set.reps.max;

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
