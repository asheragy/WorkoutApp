import {FlatList, ListRenderItemInfo, Text, View} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../App';
import {useSelector} from 'react-redux';
import React, {useEffect, useState} from 'react';
import {GlobalSettings, LiftDef, MuscleGroup} from '../types/types';
import WorkoutRepository from '../repository/WorkoutRepository';
import {useAppSelector} from '../state/store.ts';
import {useTheme} from '@react-navigation/native';

type Props = StackScreenProps<RootStackParamList, 'Stats'>;

type GroupEntry = {
  group: MuscleGroup;
  sets: number;
};

export function StatsScreen({route, navigation}: Props) {
  const {colors} = useTheme();
  const [entries, setEntries] = useState<GroupEntry[]>([]);
  const defs: Record<string, LiftDef> = useAppSelector(store => store.liftDefs);

  const settings: GlobalSettings = useSelector((store: any) => store.settings);

  useEffect(onLoad, []);

  function onLoad() {
    const result = new Map<MuscleGroup, number>();

    WorkoutRepository.getRoutine(settings.routine).then(workouts => {
      workouts.forEach(workout => {
        workout.lifts.forEach(lift => {
          const workSets = lift.sets.filter(set => !set.warmup).length;

          const def = defs[lift.id];
          def.muscleGroups.forEach((group, index) => {
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
        <Text style={{textAlign: 'right', color: colors.text}}>
          {MuscleGroup[item.item.group]}
        </Text>
      </View>

      <View style={{width: '50%', margin: 4}}>
        <Text style={{color: colors.text}}>{item.item.sets}</Text>
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
