import {FlatList, ListRenderItemInfo, Text, View} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../App';
import {useSelector} from 'react-redux';
import React, {useEffect, useState} from 'react';
import {GlobalSettings, LiftDef, MuscleGroup} from '../types/types';
import WorkoutRepository from '../repository/WorkoutRepository';
import {useAppSelector} from '../state/store.ts';
import {useTheme} from '@react-navigation/native';
import {NumberControl} from '../components/NumberControl.tsx';
import ChartUtils, {ProgressByWeek} from '../utils/ChartUtils.ts';
import {ProgressChart} from '../components/ProgressChart.tsx';
import DropDownPicker from 'react-native-dropdown-picker';
import {enumToItemsNumeric} from '../utils/EnumUtils.ts';

type Props = StackScreenProps<RootStackParamList, 'Stats'>;

type GroupEntry = {
  group?: MuscleGroup;
  sets: number;
};

export function StatsScreen({route, navigation}: Props) {
  const {colors} = useTheme();
  const [interval, setInterval] = useState(7);
  const [entries, setEntries] = useState<GroupEntry[]>([]);
  const [progress, setProgress] = useState<number[]>([]);
  const [progressDates, setProgressDates] = useState<Date[]>([]);

  // Dropdown list
  const muscleGroupItems = enumToItemsNumeric(MuscleGroup, k => k);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<MuscleGroup>(MuscleGroup.Quads);

  const defs: Record<string, LiftDef> = useAppSelector(store => store.liftDefs);
  const settings: GlobalSettings = useSelector((store: any) => store.settings);

  useEffect(onLoad, [value]);

  function onLoad() {
    ChartUtils.getProgressByGroup(value, defs).then(values => {
      setProgress(values);

      // Faking dates since required for chart
      const today = new Date();
      const dates = values.map((value, i, arr) => {
        const weeksAgo = arr.length - 1 - i; // so last element = 0 weeks ago
        const date = new Date(today);
        date.setDate(today.getDate() - weeksAgo * 7);
        return date;
      });

      setProgressDates(dates);
    });

    const result = new Map<MuscleGroup, number>();

    WorkoutRepository.getRoutine(settings.routine).then(workouts => {
      workouts.forEach(workout => {
        workout.lifts
          .filter(lift => !lift.alternate)
          .forEach(lift => {
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
      result.forEach((sets, group) =>
        entries.push({
          group,
          sets: sets,
        }),
      );

      const total = entries.map(e => e.sets).reduce((a, b) => a + b);
      entries.push({
        sets: total,
      });

      setEntries(entries);
    });
  }

  const entriesNormalized = entries.map(entry => {
    return {
      group: entry.group,
      sets: Math.round(10 * entry.sets * (7 / interval)) / 10,
    };
  });

  const renderItem = (item: ListRenderItemInfo<GroupEntry>) => (
    <View style={{flex: 1, flexDirection: 'row'}}>
      <View style={{width: '50%', margin: 4}}>
        <Text style={{textAlign: 'right', color: colors.text}}>
          {item.item.group != undefined
            ? MuscleGroup[item.item.group]
            : 'Total'}
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
        data={entriesNormalized}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}></FlatList>

      <NumberControl
        value={interval}
        precision={1}
        decrementBy={() => 0.5}
        incrementBy={() => 0.5}
        onChange={setInterval}></NumberControl>

      <DropDownPicker
        style={{marginVertical: 16}}
        items={muscleGroupItems}
        open={open}
        setOpen={setOpen}
        value={value}
        setValue={setValue}
        dropDownDirection={'TOP'}
      />
      <ProgressChart dates={progressDates} values={progress}></ProgressChart>
    </View>
  );
}
