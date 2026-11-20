import React, { useCallback, useState } from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  useFocusEffect,
  useNavigation,
  useTheme,
} from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import LiftHistoryRepository, {
  CompletedWorkoutHistory,
} from '../../repository/LiftHistoryRepository';
import WorkoutRepository from '../../repository/WorkoutRepository';
import Utils from '../../components/Utils';
import { displayName } from '../../core/LiftDatabase.ts';
import { useAppSelector } from '../../state/store';
import { LiftDef } from '../../core/types/types';

// Only the most recent workouts are loaded, there is no paging
const MAX_WORKOUTS = 20;

export function WorkoutsTab() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const defs = useAppSelector(store => store.liftDefs);
  const [entries, setEntries] = useState<CompletedWorkoutHistory[]>([]);
  const [names, setNames] = useState<Record<string, string>>({});

  // Reload on focus, the tab stays mounted while workouts are completed elsewhere
  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        setNames(await WorkoutRepository.getNames());
        setEntries(await LiftHistoryRepository.getRecentWorkouts(MAX_WORKOUTS));
      };

      loadData();
    }, []),
  );

  const renderItem = (item: ListRenderItemInfo<CompletedWorkoutHistory>) => (
    <WorkoutListItem
      entry={item.item}
      // History can outlive a deleted workout
      name={names[item.item.workoutId] ?? 'Deleted workout'}
      defs={defs}
      onLiftPress={liftId => navigation.navigate('LiftHistory', { liftId })}
    />
  );

  return (
    <FlatList
      data={entries}
      renderItem={renderItem}
      keyExtractor={entry => entry.timestamp.getTime().toString()}
    />
  );
}

function WorkoutListItem(props: {
  entry: CompletedWorkoutHistory;
  name: string;
  defs: Record<string, LiftDef>;
  onLiftPress: (liftId: string) => void;
}) {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      <View style={styles.header}>
        <Text style={[styles.name, { color: colors.text }]}>{props.name}</Text>
        <Text style={{ color: colors.text }}>
          {Utils.lastCompleted(props.entry.timestamp)}
        </Text>
      </View>
      {props.entry.lifts.map(lift => {
        const sets = lift.sets.map(
          set => set.weight + 'x' + set.reps + (set.warmup ? ' (W)' : ''),
        );

        return (
          <TouchableOpacity
            style={styles.lift}
            key={lift.liftId}
            onPress={() => props.onLiftPress(lift.liftId)}
          >
            <Text style={[styles.liftName, { color: colors.text }]}>
              {displayName(props.defs, lift.liftId)}
            </Text>
            <Text style={{ color: colors.text }}>{sets.join(', ')}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 4,
    padding: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  lift: {
    paddingTop: 6,
  },
  liftName: {
    fontWeight: 'bold',
  },
});
