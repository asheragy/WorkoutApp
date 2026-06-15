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
import { AccessoryView } from '../components/Accessories';
import { Lift, Workout } from '../types/workout';
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
import Utils from '../components/Utils.ts';

type Props = StackScreenProps<RootStackParamList, 'Workout'>;

export function WorkoutScreen({ route, navigation }: Props) {
  const { colors } = useTheme();
  const defs = useSelector((store: AppState) => store.liftDefs);
  const [workout, setWorkout] = useState<Workout>({
    name: '',
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

  const completedAlts = getCompletedAlts(workout.lifts);
  const activeLifts = workout.lifts.filter(
    x => !x.hide && !completedAlts.includes(x.instanceId),
  );
  const hiddenLifts = workout.lifts.filter(
    x => x.hide || completedAlts.includes(x.instanceId),
  );
  const sortedLifts = activeLifts.concat(hiddenLifts);

  return (
    <ScrollView style={styles.container}>
      {sortedLifts.map(lift => (
        <LiftItem
          lift={lift}
          onEdit={() =>
            navigation.navigate('LiftEdit', {
              workoutId: route.params.workoutId,
              lift: lift,
            })
          }
          overrideComplete={completedAlts.includes(lift.instanceId)}
          key={lift.instanceId}
        ></LiftItem>
      ))}

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
  const groups = Utils.groupLifts(lifts);

  const result: string[] = [];
  groups.forEach(group => {
    // If at least 1 set in any lift is completed, the other lifts can be hidden
    const anyCompleted =
      group
        .map(lift => lift.sets.filter(set => set.completed).length)
        .filter(count => count > 0).length > 0;

    // If at least 1 is skipped, then others are too
    const anySkipped = group.filter(x => x.hide).length > 0;

    // Return all that have not completed yet
    if (anyCompleted || anySkipped) {
      group.forEach(lift => {
        if (lift.sets.every(set => !set.completed)) {
          result.push(lift.instanceId);
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
});
