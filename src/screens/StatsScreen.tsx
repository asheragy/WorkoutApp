import { Text, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../App';
import { useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { GlobalSettings, LiftDef, MuscleGroup } from '../types/types';
import WorkoutRepository from '../repository/WorkoutRepository';
import { useAppSelector } from '../state/store.ts';
import { useTheme } from '@react-navigation/native';
import { NumberControl } from '../components/NumberControl.tsx';
import ChartUtils, { HistoryEntry } from '../utils/ChartUtils.ts';
import { ProgressChart } from '../components/ProgressChart.tsx';
import DropDownPicker from 'react-native-dropdown-picker';
import { enumToItemsNumeric } from '../utils/EnumUtils.ts';
import Utils from '../components/Utils.ts';
import LiftHistoryRepository, {
  LiftHistory,
} from '../repository/LiftHistoryRepository.ts';

type Props = StackScreenProps<RootStackParamList, 'Stats'>;

type GroupEntry = {
  group?: MuscleGroup;
  sets: number;
};

export function StatsScreen({ route, navigation }: Props) {
  const { colors } = useTheme();
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
    getProgressByGroup(value, defs).then(values => {
      setProgress(values);

      // Faking dates since required for chart
      const today = new Date();
      const dates = values.map((_, i, arr) => {
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
          sets,
        }),
      );

      const total = entries.map(e => e.sets).reduce((a, b) => a + b, 0);
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

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: 8 }}>
      <View style={{ marginBottom: 12 }}>
        {entriesNormalized.map(item => {
          const key =
            item.group !== undefined ? MuscleGroup[item.group] : 'total';

          return (
            <View key={key} style={{ flexDirection: 'row' }}>
              <View style={{ width: '50%', margin: 4 }}>
                <Text style={{ textAlign: 'right', color: colors.text }}>
                  {item.group != undefined ? MuscleGroup[item.group] : 'Total'}
                </Text>
              </View>

              <View style={{ width: '50%', margin: 4 }}>
                <Text style={{ color: colors.text }}>{item.sets}</Text>
              </View>
            </View>
          );
        })}
      </View>

      <NumberControl
        value={interval}
        precision={1}
        decrementBy={() => 0.5}
        incrementBy={() => 0.5}
        onChange={setInterval}
      />

      <DropDownPicker
        style={{ marginVertical: 16 }}
        items={muscleGroupItems}
        open={open}
        setOpen={setOpen}
        value={value}
        setValue={setValue}
        dropDownDirection={'TOP'}
      />
      <ProgressChart dates={progressDates} values={progress} />
    </View>
  );
}

async function getProgressByGroup(
  group: MuscleGroup,
  defs: Record<string, LiftDef>,
): Promise<number[]> {
  const ids = (await LiftHistoryRepository.listKeys()).filter(key =>
    defs[key].muscleGroups.includes(group),
  );
  const result = new Map<string, HistoryEntry[]>();

  for (const id of ids) {
    const history: LiftHistory[] = await LiftHistoryRepository.get(id);
    history.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    const mapped: HistoryEntry[] = history.map(x => {
      return {
        timestamp: x.timestamp,
        value: Utils.calculate1RMAverage(defs[id], x.sets),
      };
    });

    result.set(id, mapped);
  }

  return ChartUtils.toProgressByWeek(group, result, defs);
}
