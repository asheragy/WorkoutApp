import {AppState, FlatList, ListRenderItemInfo, Text, View} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../App';
import {useSelector} from 'react-redux';
import React, {useEffect, useState} from 'react';
import {LiftDef, MuscleGroup} from '../types/types';
import WorkoutRepository from '../repository/WorkoutRepository';

type Props = StackScreenProps<RootStackParamList, 'Stats'>;

type GroupEntry = {
  group: MuscleGroup;
  sets: number;
};

export function StatsScreen({route, navigation}: Props) {
  const [entries, setEntries] = useState<GroupEntry[]>([]);
  const defs: Map<string, LiftDef> = useSelector(
    (store: AppState) => store.liftDefs,
  );

  useEffect(onLoad, []);

  function onLoad() {
    const result = new Map<MuscleGroup, number>();

    WorkoutRepository.getAll().then(workouts => {
      workouts.forEach(workout => {
        workout.lifts.forEach(lift => {
          const workSets = lift.sets.filter(
            set => !set.warmup && !set.goal,
          ).length;

          const def = defs.get(lift.id)!;
          def.muscleGroups?.forEach((group, index) => {
            let curr = result.get(group);
            if (curr == undefined) curr = 0;

            // Secondary counts as half set
            const multiplier = index == 0 ? 1 : 0.5;

            result.set(group, curr + workSets * multiplier);
          });
        });
      });

      const entries: GroupEntry[] = [];
      result.forEach((sets, group) => entries.push({group, sets}));
      setEntries(entries);
    });
  }

  const renderItem = (item: ListRenderItemInfo<GroupEntry>) => (
    <View style={{flex: 1, flexDirection: 'row'}}>
      <View style={{width: '50%', margin: 4}}>
        <Text style={{textAlign: 'right'}}>{MuscleGroup[item.item.group]}</Text>
      </View>

      <View style={{width: '50%', margin: 4}}>
        <Text>{item.item.sets}</Text>
      </View>
    </View>
  );

  return (
    <View>
      <FlatList
        data={entries}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}></FlatList>
    </View>
  );
}
