import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  FlatList,
  View,
  TouchableOpacity,
  ListRenderItemInfo,
} from 'react-native';
import {Lift, GlobalSettings} from '../types/types';
import {
  HeaderButton,
  HeaderButtons,
  HiddenItem,
  OverflowMenu,
} from 'react-navigation-header-buttons';
import Repository, {Workout} from '../data/Repository';
import {useTheme} from '@react-navigation/native';
import SettingsRepository from '../data/SettingsRepository';
import LiftRepository from '../data/LiftRepository';
import {connect, useDispatch, useSelector} from 'react-redux';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../App';
import {updateSettings} from '../state/settingsAction';

const MaterialHeaderButton = (props: any) => (
  <HeaderButton {...props} iconSize={23} color="blue" />
);

const mapStateToProps = (state: any) => {
  const {settings} = state;
  return {settings};
};

export default connect(mapStateToProps)(WorkoutList);

type Props = StackScreenProps<RootStackParamList, 'Home'> & {
  props: {settings: GlobalSettings};
};

export function WorkoutList({navigation, route, props}: Props) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const {colors} = useTheme();
  const dispatch = useDispatch();

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
            <HiddenItem
              title="Reset Lifts"
              onPress={() => LiftRepository.clearAllLifts()}
            />
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

    // TODO should this go in App.txs?
    SettingsRepository.get().then(result => dispatch(updateSettings(result)));
  }

  async function onUndo() {
    if (await Repository.undoComplete()) loadState();
  }

  async function onReset() {
    if (await Repository.resetProgram()) loadState();
  }

  async function onComplete(index: number) {
    // TODO complete should be done in child screen
    // this event is really just a "data changed, need to reload"
    if (await Repository.complete(index)) {
      navigation.pop();
      loadState();
    }
  }

  async function onWeightLog() {
    navigation.navigate('Weight');
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

function LiftItem(props: {lift: Lift}) {
  const {colors} = useTheme();
  const sets = props.lift.sets.length;

  return (
    <View>
      <Text style={[styles.liftText, {color: colors.text}]}>
        {props.lift.def.name + (sets > 1 ? ' (' + sets + ' Sets)' : '')}
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
