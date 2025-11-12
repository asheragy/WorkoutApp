import {useTheme} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {FlatList, ListRenderItemInfo, Text, View} from 'react-native';
import {RootStackParamList} from '../App';
import LiftHistoryRepository, {
  WorkoutHistory,
} from '../repository/LiftHistoryRepository';
import Utils from '../components/Utils';
import {useSelector} from 'react-redux';
import {AppState} from '../state/store';
import {LiftDef} from '../types/types.ts';

type Props = StackScreenProps<RootStackParamList, 'WorkoutHistory'>;

export function WorkoutHistoryScreen({route, navigation}: Props) {
  const workoutId = route.params.workoutId;
  const [entries, setEntries] = useState<WorkoutHistory[]>([]);
  const {colors} = useTheme();
  const defs = useSelector((store: AppState) => store.liftDefs);

  function loadState() {
    LiftHistoryRepository.getWorkoutHistory(workoutId).then(unsorted =>
      setEntries(unsorted.reverse()),
    );
  }

  useEffect(loadState, []);

  const renderItem = (item: ListRenderItemInfo<WorkoutHistory>) => (
    <WorkoutHistoryListItem
      entry={item.item}
      defs={defs}></WorkoutHistoryListItem>
  );

  return (
    <FlatList
      style={{backgroundColor: colors.background}}
      data={entries}
      renderItem={renderItem}
      keyExtractor={(_, index) => index.toString()}></FlatList>
  );
}

function WorkoutHistoryListItem({
  entry,
  defs,
}: {
  entry: WorkoutHistory;
  defs: Record<string, LiftDef>;
}) {
  const {colors} = useTheme();

  return (
    <View style={{backgroundColor: colors.card, margin: 4, padding: 4}}>
      <Text style={{color: colors.text}}>
        {Utils.lastCompleted(entry.timestamp)}
      </Text>
      {entry.lifts.map((lift, index) => {
        const sets = lift.sets.map(
          set => set.weight + 'x' + set.reps + (set.warmup ? ' (W)' : ''),
        );

        return (
          <View style={{paddingTop: 4}} key={index.toString()}>
            <Text style={{fontWeight: 'bold', color: colors.text}}>
              {defs[lift.liftId].name + ' - ' + sets.join(', ')}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
