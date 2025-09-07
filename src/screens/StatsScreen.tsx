import {
  Dimensions,
  FlatList,
  ListRenderItemInfo,
  Text,
  View,
} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../App';
import {useSelector} from 'react-redux';
import React, {useEffect, useState} from 'react';
import {GlobalSettings, LiftDef, MuscleGroup} from '../types/types';
import WorkoutRepository from '../repository/WorkoutRepository';
import {useAppSelector} from '../state/store.ts';
import {useTheme} from '@react-navigation/native';
import {NumberControl} from '../components/NumberControl.tsx';
import ChartUtils from '../utils/ChartUtils.ts';
import {LineChart} from 'react-native-chart-kit';

type Props = StackScreenProps<RootStackParamList, 'Stats'>;

type GroupEntry = {
  group?: MuscleGroup;
  sets: number;
};

export function StatsScreen({route, navigation}: Props) {
  const {colors} = useTheme();
  const [interval, setInterval] = useState(7);
  const [entries, setEntries] = useState<GroupEntry[]>([]);
  const [progress, setProgress] = useState<number[][]>([]);
  const [progressDates, setProgressDates] = useState<Date[]>([]);

  const defs: Record<string, LiftDef> = useAppSelector(store => store.liftDefs);

  const settings: GlobalSettings = useSelector((store: any) => store.settings);

  useEffect(onLoad, []);

  function onLoad() {
    ChartUtils.getProgressByWeek(settings.routine ?? '', defs).then(x => {
      setProgressDates(x.dates);
      const numbers: number[][] = [];
      Object.keys(x).forEach(key => {
        if (key !== 'dates') {
          numbers.push(x[key]);
        }
      });

      setProgress(numbers);
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

      <ProgressChartTemp
        title={''}
        dates={progressDates}
        values={progress}></ProgressChartTemp>
    </View>
  );
}

// TODO make the other work with multiple data sets including labels
function ProgressChartTemp(props: {
  title: string;
  dates: Date[];
  values: number[][];
}) {
  if (props.dates.length == 0) return <View></View>;

  const {colors} = useTheme();

  // https://www.npmjs.com/package/react-native-chart-kit
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text style={{color: colors.text}}>{props.title}</Text>
      <LineChart
        data={{
          labels: props.dates.map(x => x.getMonth() + 1 + '/' + x.getDate()),
          datasets: props.values.map(arr => ({data: arr})),
        }}
        width={Dimensions.get('window').width} // from react-native
        height={Dimensions.get('window').height / 3}
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={{
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 0,
          },
          propsForDots: {
            r: '2',
            strokeWidth: '2',
            stroke: '#ffa726',
          },
        }}
        bezier
        style={{
          marginVertical: 0,
          borderRadius: 0,
          padding: 40,
          paddingRight: 40,
        }}
      />
    </View>
  );
}
