import React, { useCallback, useState } from 'react';
import {
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../App';
import { Lift, Workout } from '../core/types/workout';
import WorkoutRepository from '../repository/WorkoutRepository';
import LiftItem from '../components/LiftItem/LiftItem';
import {
  HeaderButtons,
  OverflowMenu,
  HiddenItem,
} from 'react-navigation-header-buttons';
import { MaterialHeaderButton } from '../components/Common';
import { useSelector } from 'react-redux';
import { AppState } from '../state/store';
import LiftHistoryRepository from '../repository/LiftHistoryRepository';
import { useFocusEffect, useTheme } from '@react-navigation/native';
import LiftUtils from '../core/utils/LiftUtils.ts';

type Props = StackScreenProps<RootStackParamList, 'Workout'>;

export function WorkoutScreen({ route, navigation }: Props) {
  const { colors } = useTheme();
  const defs = useSelector((store: AppState) => store.liftDefs);
  const settings = useSelector((store: AppState) => store.settings);
  const [workout, setWorkout] = useState<Workout>({
    // TODO should just be undefined to start?
    name: '',
    routineId: '',
    lifts: [],
  });

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={MaterialHeaderButton}>
          <OverflowMenu
            style={{ marginHorizontal: 10 }}
            OverflowIcon={() => (
              <Text
                style={{ fontWeight: 'bold', fontSize: 24, color: colors.text }}
              >
                ...
              </Text>
            )}
          >
            <HiddenItem title="History" onPress={() => onHistory()} />
            <HiddenItem title="Import Lifts" onPress={() => onImport()} />
          </OverflowMenu>
        </HeaderButtons>
      ),
    });
  }, [navigation, workout]);

  function onImport() {
    Alert.alert('Import Sets', 'Are you sure', [
      {
        text: 'No',
        style: 'cancel',
      },
      { text: 'Yes', style: 'destructive', onPress: () => onImportConfirmed() },
    ]);
  }

  async function onImportConfirmed() {
    const updated = await WorkoutRepository.importLatestLifts(workout);
    setWorkout({
      ...updated,
    });
  }

  const confirmComplete = () => {
    Alert.alert('Complete?', 'Are you sure', [
      {
        text: 'No',
        style: 'cancel',
      },
      { text: 'Yes', onPress: () => onComplete() },
    ]);
  };

  const onComplete = async () => {
    const completedWorkout: Workout = {
      ...workout,
      lastCompleted: new Date(),
    };
    await LiftHistoryRepository.addWorkout(completedWorkout, defs);

    const resetWorkout: Workout = {
      ...completedWorkout,
      lifts: completedWorkout.lifts.map(lift => ({
        ...lift,
        hide: undefined,
        sets: lift.sets.map(set => ({
          ...set,
          completed: undefined,
        })),
      })),
    };

    await WorkoutRepository.upsert(resetWorkout);
    navigation.goBack();
  };

  function onHistory() {
    navigation.navigate('WorkoutHistory', {
      workoutId: route.params.workoutId,
    });
  }

  useFocusEffect(
    useCallback(() => {
      WorkoutRepository.get(route.params.workoutId).then(result => {
        if (result !== undefined) setWorkout(result);
      });
    }, [route.params.workoutId]),
  );

  return (
    <ScrollView style={styles.container}>
      {
        // TODO cannot use toWorkoutItems because it drops alternate when saving
        LiftUtils.groupLifts(workout.lifts).map(item => {
          if (item.length > 1)
            return (
              <GroupItem
                group={item}
                key={item[0].instanceId}
                onEditLift={lift =>
                  navigation.navigate('LiftEdit', {
                    workoutId: route.params.workoutId,
                    lift: lift,
                  })
                }
              />
            );

          const lift = item[0];
          return (
            <LiftItem
              lift={lift}
              def={defs[lift.id]}
              settings={settings}
              onEdit={() =>
                navigation.navigate('LiftEdit', {
                  workoutId: route.params.workoutId,
                  lift: lift,
                })
              }
              overrideComplete={false}
              key={lift.instanceId}
            ></LiftItem>
          );
        })
      }

      <View style={styles.bottom}>
        <Button title="Complete" onPress={() => confirmComplete()}></Button>
      </View>
    </ScrollView>
  );
}

function GroupItem(props: { group: Lift[]; onEditLift: (lift: Lift) => void }) {
  const defs = useSelector((store: AppState) => store.liftDefs);
  const settings = useSelector((store: AppState) => store.settings);
  const { colors } = useTheme();

  const anyCompleted =
    props.group
      .map(lift => lift.sets.filter(set => set.completed).length)
      .filter(count => count > 0).length > 0;

  return (
    <View
      style={{
        borderLeftWidth: 3,
        borderLeftColor: colors.primary,
      }}
    >
      {props.group.map(lift => {
        return (
          <LiftItem
            lift={lift}
            def={defs[lift.id]}
            settings={settings}
            onEdit={() => props.onEditLift(lift)}
            overrideComplete={
              anyCompleted && lift.sets.every(set => !set.completed)
            }
            key={lift.instanceId}
          ></LiftItem>
        );
      })}
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
