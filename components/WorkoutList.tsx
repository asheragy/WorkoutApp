import React, {Fragment, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  FlatList,
  View,
  TouchableOpacity,
  ListRenderItemInfo,
} from 'react-native';
import {Lift, LiftSet, PersistedLift, PersistedSet} from '../types/types';
import {
  HeaderButton,
  HeaderButtons,
  HiddenItem,
  OverflowMenu,
} from 'react-navigation-header-buttons';
import Repository, {Workout} from '../src/data/Repository';

const MaterialHeaderButton = (props: any) => (
  <HeaderButton {...props} iconSize={23} color="blue" />
);

export function WorkoutList({navigation}: any) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

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
            <HiddenItem title="Refresh" onPress={() => loadState()} />
          </OverflowMenu>
        </HeaderButtons>
      ),
    });
  }, [navigation]);

  function loadState() {
    Repository.getWorkouts().then(result => {
      var uncompletedWorkouts = result.filter(wo => !wo.completed);
      setWorkouts(uncompletedWorkouts);
    });
  }

  async function onUndo() {
    if (await Repository.undoComplete()) loadState();
  }

  async function onComplete(index: number) {
    if (await Repository.complete(index)) {
      navigation.pop();
      loadState();
    }
  }

  useEffect(loadState, []);

  return (
    <WorkoutFlatList
      workouts={workouts}
      navigation={navigation}
      onComplete={onComplete}></WorkoutFlatList>
  );
}

function WorkoutFlatList(props: {
  workouts: Workout[];
  navigation: any;
  onComplete: (index: number) => void;
}) {
  function actionOnRow(index: number, item: Workout) {
    props.navigation.navigate('Workout', {
      workout: item,
      onComplete: props.onComplete,
    });
  }

  const renderItem = (item: ListRenderItemInfo<Workout>) => (
    <TouchableOpacity onPress={() => actionOnRow(item.index, item.item)}>
      <WorkoutListItem workout={item.item}></WorkoutListItem>
    </TouchableOpacity>
  );

  return (
    <FlatList
      style={{backgroundColor: 'lightgray'}}
      data={props.workouts}
      renderItem={renderItem}
      keyExtractor={(_, index) => 'test' + index}></FlatList>
  );
}

interface WorkoutItemProps {
  workout: Workout;
}

function WorkoutListItem(props: WorkoutItemProps) {
  return (
    <View style={styles.workoutItem}>
      <Text style={styles.titleText}>{props.workout.node?.name}</Text>
      {props.workout.node.lifts.map((lift, index) => (
        <LiftItem lift={lift} key={index}></LiftItem>
      ))}
    </View>
  );
}

function LiftItem(props: {lift: Lift | PersistedLift}) {
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

function SetItem(props: {set: LiftSet | PersistedSet}) {
  if (props.set.weight != null) var str = props.set.weight + 'lb';
  else var str = 'Any';

  str += ' x ';

  if (typeof props.set.reps == 'number') str += props.set.reps;
  else str += props.set.reps.min + '-' + props.set.reps.max;

  if ('amrap' in props.set && props.set.amrap) str = str + '+';

  if ('repeat' in props.set && props.set.repeat && props.set.repeat > 1) {
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
  titleText: {
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
