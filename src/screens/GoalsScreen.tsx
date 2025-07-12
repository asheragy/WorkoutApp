import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../App.tsx';
import {FlatList, ListRenderItemInfo, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Lifts} from '../repository/LiftDatabase.ts';
import LiftHistoryRepository from '../repository/LiftHistoryRepository.ts';
import Utils from '../components/Utils.ts';
import {useSelector} from 'react-redux';
import {AppState} from '../state/store.ts';
import {LiftDef, PersistedSet} from '../types/types.ts';
import {useTheme} from '@react-navigation/native';

type Props = StackScreenProps<RootStackParamList, 'Goals'>;

type Goal = PersistedSet & {
  liftId: string;
};

type GoalRow = {
  lift: LiftDef;
  percent: number;
};

export function GoalsScreen({route, navigation}: Props) {
  const defs = useSelector((store: AppState) => store.liftDefs);
  const [goalRows, setGoalRows] = useState<GoalRow[]>([]);
  const {colors} = useTheme();

  const goalsUpper: Goal[] = [
    {
      liftId: Lifts.bench_dumbbell.id,
      weight: 100,
      reps: 10,
    },
    {
      liftId: Lifts.bench_barbell.id,
      weight: 315,
      reps: 1,
    },
    {
      liftId: Lifts.inclinePress_barbell.id,
      weight: 275,
      reps: 1,
    },
    {
      liftId: Lifts.ohp_barbell.id,
      weight: 205,
      reps: 1,
    },
    {
      liftId: Lifts.row_barbell.id,
      weight: 225,
      reps: 10,
    },
  ].sort((a, b) => a.liftId.localeCompare(b.liftId));

  const goalsLower: Goal[] = [
    {
      liftId: Lifts.hipThrust.id,
      weight: 135,
      reps: 10,
    },
    {
      liftId: Lifts.squat_front.id,
      weight: 365,
      reps: 1,
    },
    {
      liftId: Lifts.deadlift_barbell.id,
      weight: 500,
      reps: 1,
    },
    {
      liftId: Lifts.deadlift_trapbar.id,
      weight: 455 + 15,
      reps: 1,
    },
    {
      liftId: Lifts.deadlift_trapbar_high.id,
      weight: 545 + 15,
      reps: 1,
    },
    {
      liftId: Lifts.deadlift_sumo.id,
      weight: 405,
      reps: 1,
    },
    {
      liftId: Lifts.rdl_barbell.id,
      weight: 275,
      reps: 10,
    },
  ].sort((a, b) => a.liftId.localeCompare(b.liftId));

  useEffect(() => {
    const loadData = async () => {
      const result: GoalRow[] = [];

      for (const goal of [...goalsUpper, ...goalsLower]) {
        const def = defs[goal.liftId];
        const history = await LiftHistoryRepository.get(goal.liftId);
        if (history.length == 0) {
          result.push({lift: def, percent: 0});
          continue;
        }

        const sets = history.flatMap(h => h.sets);
        const maxes = sets.map(set => Utils.calculate1RM(def, set));
        const best = Math.max(...maxes);

        const percent = best / Utils.calculate1RM(def, goal);
        result.push({lift: def, percent});
      }

      setGoalRows(result);
    };

    loadData();
  }, []);

  const renderItem = (item: ListRenderItemInfo<GoalRow>) => (
    <View
      key={item.index}
      style={{flexDirection: 'row', alignItems: 'center', padding: 8}}>
      <Text style={{flex: 5, textAlign: 'right', color: colors.text}}>
        {Utils.defToString(item.item.lift)}
      </Text>
      <Text
        style={{
          flex: 5,
          textAlign: 'left',
          color: colors.text,
          paddingLeft: 10,
        }}>
        {Math.round(item.item.percent * 1000) / 10 + '%'}
      </Text>
    </View>
  );

  return (
    <View>
      <FlatList
        style={{backgroundColor: colors.background}}
        data={goalRows}
        renderItem={renderItem}
        keyExtractor={(_, index) => '_' + index}></FlatList>
    </View>
  );
}
