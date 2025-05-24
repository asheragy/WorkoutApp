import React, {useEffect, useState} from 'react';
import {Alert, Button, ScrollView, StyleSheet, Text, View} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../App';
import {AccessoryView} from '../components/Accessories';
import {LogBox} from 'react-native';
import {Lift, LiftSet, SingleWorkoutId, Workout} from '../types/workout';
import WorkoutRepository from '../repository/WorkoutRepository';
import Log from '../utils/Log';
import LiftItem from '../components/LiftItem/LiftItem';
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
import LiftHistoryRepository from '../repository/LiftHistoryRepository';
import {useTheme} from '@react-navigation/native';

type Props = StackScreenProps<RootStackParamList, 'Workout'>;

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

export function WorkoutScreen({route, navigation}: Props) {
  const {colors} = useTheme();
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
              <Text
                style={{fontWeight: 'bold', fontSize: 24, color: colors.text}}>
                ...
              </Text>
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
    await WorkoutHistoryRepository.add(workout, defs);

    workout.lifts.forEach(lift => {
      lift.hide = undefined;
      lift.sets.forEach(set => {
        set.completed = undefined;
      });
    });

    await WorkoutRepository.upsert(workout);

    if (workout.id == SingleWorkoutId) await WorkoutRepository.delete(workout);

    route.params.onComplete();
    navigation.pop();
  };

  function onAddExercise() {
    navigation.navigate('LiftDefList', {onSelect: onExerciseAdded});
  }

  async function onExerciseAdded(defId: string) {
    const history = await LiftHistoryRepository.get(defId);
    let sets: LiftSet[] = [];
    if (history.length > 0) {
      const last = history[history.length - 1].sets;
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
      id: defId,
      sets: sets,
    });

    setWorkout(updatedWorkout);
    await WorkoutRepository.upsert(updatedWorkout);
  }

  function onViewLog(lift: Lift) {
    navigation.navigate('LiftHistory', {liftId: lift.id});
  }

  async function onLiftChanged(lift: Lift) {
    const index = workout.lifts.findIndex(x => x.id == lift.id);
    const lifts = [...workout.lifts];
    lifts[index] = lift;

    //lifts.forEach(x => Log.lift(x));

    const updatedWorkout = {
      ...workout,
      lifts: lifts,
    };
    setWorkout(updatedWorkout);
    await WorkoutRepository.upsert(updatedWorkout);
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

  const completedAlts = getCompletedAlts(workout.lifts);
  const activeLifts = workout.lifts.filter(
    x => !x.hide && !completedAlts.includes(x.id),
  );
  const hiddenLifts = workout.lifts.filter(
    x => x.hide || completedAlts.includes(x.id),
  );
  const sortedLifts = activeLifts.concat(hiddenLifts);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.workoutItem}>
        {sortedLifts.map((lift, index) => (
          <LiftItem
            lift={lift}
            onViewLog={onViewLog}
            onLiftChanged={onLiftChanged}
            overrideComplete={completedAlts.includes(lift.id)}
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

function getCompletedAlts(lifts: Lift[]): string[] {
  const groups: string[][] = [];

  // Create groups of alternates with their primary
  let curr: string[] = [];
  lifts.forEach(lift => {
    if (!lift.alternate) {
      if (curr.length > 1) groups.push(curr);

      curr = [lift.id];
    } else {
      curr.push(lift.id);
    }
  });

  const result: string[] = [];
  groups.forEach(group => {
    // If at least 1 set in any lift is completed, the other lifts can be hidden
    const liftsForGroup = lifts.filter(x => group.includes(x.id));
    const anyCompleted =
      liftsForGroup
        .map(lift => lift.sets.filter(set => set.completed).length)
        .filter(count => count > 0).length > 0;

    // Return all that have not completed yet
    if (anyCompleted) {
      liftsForGroup.forEach(lift => {
        if (lift.sets.every(set => !set.completed)) {
          result.push(lift.id);
        }
      });
    }
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

  workoutItem: {
    marginHorizontal: 8,
    marginVertical: 4,
    padding: 8,
    opacity: 0.8,
  },
});
