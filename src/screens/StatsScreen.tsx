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
import SetUtils, { WorkingSets } from '../utils/SetUtils.ts';

type Props = StackScreenProps<RootStackParamList, 'Stats'>;

export function StatsScreen({ route, navigation }: Props) {
  const { colors } = useTheme();
  const [interval, setInterval] = useState(7);
  const [entries, setEntries] = useState<WorkingSets[]>([]);
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

    WorkoutRepository.getRoutine(settings.routine).then(workouts => {
      const entries = SetUtils.getWorkingSets(defs, workouts);
      setEntries(entries);
    });
  }

  const entriesNormalized: WorkingSets[] = entries.map(entry => {
    return {
      group: entry.group,
      sets: Math.round(10 * entry.sets * (7 / interval)) / 10,
    };
  });

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: 8 }}>
      <View style={{ marginBottom: 12 }}>
        {entriesNormalized.map(item => {
          return (
            <View key={item.group} style={{ flexDirection: 'row' }}>
              <View style={{ width: '50%', margin: 4 }}>
                <Text style={{ textAlign: 'right', color: colors.text }}>
                  {item.group}
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
