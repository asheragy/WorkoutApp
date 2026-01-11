import React, {Dispatch, useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  FlatList,
  View,
  TouchableOpacity,
  ListRenderItemInfo,
} from 'react-native';
import {
  HeaderButtons,
  HiddenItem,
  OverflowMenu,
} from 'react-navigation-header-buttons';
import {useFocusEffect, useTheme} from '@react-navigation/native';
import SettingsRepository from '../repository/SettingsRepository';
import {connect, useDispatch, useSelector} from 'react-redux';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../App';
import {MaterialHeaderButton} from '../components/Common';
import {Lift, SingleWorkoutId, Workout} from '../types/workout';
import WorkoutRepository from '../repository/WorkoutRepository';
import Utils from '../components/Utils';
import {AppDispatch, AppState, updateSettings} from '../state/store';
import RoutineRepository from '../repository/RoutineRepository.ts';

const mapStateToProps = (state: any) => {
  const {settings} = state;
  return {settings};
};

export default connect(mapStateToProps)(WorkoutList);

type Props = StackScreenProps<RootStackParamList, 'Home'>;

export function WorkoutList({navigation, route}: Props) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const {colors} = useTheme();
  const dispatch: AppDispatch = useDispatch();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={MaterialHeaderButton}>
          <OverflowMenu
            style={{marginHorizontal: 10}}
            OverflowIcon={({color}) => (
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 24,
                  color: colors.text,
                }}>
                ...
              </Text>
            )}>
            {
              //<HiddenItem title="Weight Log" onPress={() => onWeightLog()} />
            }
            <HiddenItem title="Refresh" onPress={() => loadState()} />
            <HiddenItem title="Lift History" onPress={() => onLifts()} />
            <HiddenItem title="Lift Defs" onPress={() => onLiftDefs()} />
            <HiddenItem
              title="Add"
              onPress={() =>
                navigation.navigate('WorkoutEdit', {onChanged: loadState})
              }
            />
            <HiddenItem title="Stats" onPress={() => onStats()} />
            <HiddenItem
              title="Routines"
              onPress={() =>
                navigation.navigate('Routines', {
                  onChanged: importLifts => loadState(importLifts),
                })
              }
            />
            <HiddenItem
              title="Single Workout"
              disabled={
                workouts.find(x => x.id == SingleWorkoutId) != undefined
              }
              onPress={() => onSingleWorkout()}
            />
            <HiddenItem title="Goals" onPress={() => onGoals()} />
            <HiddenItem title="Settings" onPress={() => onSettings()} />
            {}
          </OverflowMenu>
        </HeaderButtons>
      ),
    });
  }, [navigation, workouts]);

  function loadState(importLifts?: boolean) {
    /*
    LiftDefRepository.getLookupMap().then(result => {
      dispatch(updateLiftDefs(result));
    });
    */

    SettingsRepository.get().then(settings => {
      // TODO should this go in App.txs?
      dispatch(updateSettings(settings));

      console.log('Using routine: ' + settings.routine);
      RoutineRepository.getAll().then(routines => {
        const curr = routines.find(x => x.id == settings.routine);
        const title = curr?.id ? curr.title : 'Workouts';
        navigation.setOptions({title});
      });

      WorkoutRepository.getRoutine(settings.routine, importLifts).then(
        result => {
          const incompleted = result.filter(w => w.lastCompleted == null);
          const completed = result
            .filter(
              (w): w is Workout & {lastCompleted: Date} =>
                w.lastCompleted != null,
            )
            .slice()
            .sort(
              (a, b) => a.lastCompleted.getTime() - b.lastCompleted.getTime(),
            );

          setWorkouts([...incompleted, ...completed]);
        },
      );
    });
  }
  useEffect(loadState, []);

  useFocusEffect(
    useCallback(() => {
      //loadState();
      console.log('Home screen focus...');
    }, []),
  );

  const onLifts = () => navigation.navigate('LiftList');
  const onLiftDefs = () => navigation.navigate('LiftDefList', {});
  const onWeightLog = () => navigation.navigate('Weight');
  const onSettings = () => navigation.navigate('Settings');
  const onGoals = () => navigation.navigate('Goals');
  const onStats = () => navigation.navigate('Stats');

  async function onSingleWorkout() {
    const workout: Workout = {
      id: SingleWorkoutId,
      name: 'Single Workout',
      lifts: [],
    };

    await WorkoutRepository.upsert(workout);
    onSelect(workout);
    loadState();
  }

  function onSelect(item: Workout) {
    navigation.navigate('Workout', {
      workoutId: item.id!,
      onComplete: loadState,
    });
  }

  function onEdit(item: Workout) {
    navigation.navigate('WorkoutEdit', {
      workoutId: item.id,
      onChanged: loadState,
    });
  }

  const renderItem = (item: ListRenderItemInfo<Workout>) => (
    <TouchableOpacity
      onPress={() => onSelect(item.item)}
      onLongPress={() => onEdit(item.item)}>
      <WorkoutListItem workout={item.item}></WorkoutListItem>
    </TouchableOpacity>
  );

  return (
    <FlatList
      style={{backgroundColor: colors.background}}
      data={workouts}
      renderItem={renderItem}
      keyExtractor={(_, index) => 'test' + index}></FlatList>
  );
}

interface WorkoutItemProps {
  workout: Workout;
}

function WorkoutListItem({workout}: WorkoutItemProps) {
  const {colors} = useTheme();

  return (
    <View style={[styles.workoutItem, {backgroundColor: colors.card}]}>
      <Text style={[styles.titleText, {color: colors.text}]}>
        {workout.name}
      </Text>

      {workout.lifts
        .filter(x => !x.alternate)
        .map((lift, index) => (
          <LiftItem lift={lift} key={index}></LiftItem>
        ))}
      <Text style={{paddingTop: 8, color: colors.text}}>
        {'Last Completed: ' + Utils.lastCompleted(workout.lastCompleted)}
      </Text>
    </View>
  );
}

function LiftItem(props: {lift: Lift}) {
  const {colors} = useTheme();
  const sets = props.lift.sets.length;
  const defs = useSelector((store: AppState) => store.liftDefs);

  return (
    <View>
      <Text style={[styles.liftText, {color: colors.text}]}>
        {Utils.defToString(defs[props.lift.id]) +
          (sets > 1 ? ' (' + sets + ' Sets)' : '')}
      </Text>
      {/**
      <View style={styles.liftSetRow}>
        {Utils.normalizeSets(props.lift.sets).map((set, index) => (
          <Text style={{color: colors.text}} key={index}>
            {set.weight + ' x ' + set.reps}
          </Text>
        ))}
      </View>
      */}
    </View>
  );
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
