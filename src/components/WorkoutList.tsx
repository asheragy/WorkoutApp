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
import Repository, {Workout} from '../data/Repository';
import {useTheme} from '@react-navigation/native';

const MaterialHeaderButton = (props: any) => (
  <HeaderButton {...props} iconSize={23} color="blue" />
);

export function WorkoutList({navigation}: any) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const {colors} = useTheme();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={MaterialHeaderButton}>
          <OverflowMenu
            style={{marginHorizontal: 10}}
            OverflowIcon={({color}) => (
              <Text style={{fontWeight: 'bold', fontSize: 24}}>...</Text>
            )}>
            <HiddenItem title="Weight Log" onPress={() => onWeightLog()} />
            <HiddenItem title="Undo Complete" onPress={() => onUndo()} />
            <HiddenItem title="Refresh" onPress={() => loadState()} />
            <HiddenItem title="Reset" onPress={() => onReset()} />
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

  async function onReset() {
    if (await Repository.resetProgram()) loadState();
  }

  async function onComplete(index: number) {
    if (await Repository.complete(index)) {
      navigation.pop();
      loadState();
    }
  }

  async function onWeightLog() {
    navigation.navigate('Weight', {});
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

  const {colors} = useTheme();

  return (
    <FlatList
      style={{backgroundColor: colors.background}}
      data={props.workouts}
      renderItem={renderItem}
      keyExtractor={(_, index) => 'test' + index}></FlatList>
  );
}

interface WorkoutItemProps {
  workout: Workout;
}

function WorkoutListItem(props: WorkoutItemProps) {
  const {colors} = useTheme();

  return (
    <View style={[styles.workoutItem, {backgroundColor: colors.card}]}>
      <Text style={[styles.titleText, {color: colors.text}]}>
        {props.workout.node?.name}
      </Text>
      {props.workout.node.lifts.map((lift, index) => (
        <LiftItem lift={lift} key={index}></LiftItem>
      ))}
    </View>
  );
}

function LiftItem(props: {lift: Lift | PersistedLift}) {
  const {colors} = useTheme();

  return (
    <View>
      <Text style={[styles.liftText, {color: colors.text}]}>
        {props.lift.name}
      </Text>
      <View style={styles.liftSetRow}>
        {props.lift.sets?.map((set, index) => (
          <SetItem set={set} key={index}></SetItem>
        ))}
      </View>
    </View>
  );
}

function SetItem(props: {set: LiftSet | PersistedSet}) {
  const {colors} = useTheme();

  var str = '';

  if (props.set.weight != null) {
    if (typeof props.set.weight == 'number') str += props.set.weight + 'lb';
    else str += props.set.weight.min + '-' + props.set.weight.max + 'lbs';
  } else {
    str = 'Any';
  }

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
          <Text style={{color: colors.text}} key={index}>
            {str}
          </Text>
        ))}
      </Fragment>
    );
  }

  return <Text style={{color: colors.text}}>{str}</Text>;
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
    opacity: 0.8,
  },
  liftSetRow: {
    marginLeft: 8,
  },
});
