import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../App.tsx';
import {FlatList, ListRenderItemInfo, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import LiftHistoryRepository from '../repository/LiftHistoryRepository.ts';
import Utils from '../components/Utils.ts';
import {useSelector} from 'react-redux';
import {AppState} from '../state/store.ts';
import {LiftDef} from '../types/types.ts';
import {useTheme} from '@react-navigation/native';
import WorkoutRepository from '../repository/WorkoutRepository.ts';
import {LiftSet} from '../types/workout.ts';
import SetUtils from '../utils/SetUtils.ts';

type Props = StackScreenProps<RootStackParamList, 'Goals'>;

type GoalRow = {
  lift?: LiftDef;
  percent: number;
};

export function GoalsScreen({route, navigation}: Props) {
  const defs = useSelector((store: AppState) => store.liftDefs);
  const settings = useSelector((store: AppState) => store.settings);
  const [goalRows, setGoalRows] = useState<GoalRow[]>([]);
  const {colors} = useTheme();

  const goals = Object.values(defs)
    .filter(x => x.goal)
    .sort((a, b) => {
      if (a.muscleGroups[0] != b.muscleGroups[0])
        return a.muscleGroups[0] - b.muscleGroups[0];

      return a.name.localeCompare(b.name);
    });
  console.log(goals);

  useEffect(() => {
    const loadData = async () => {
      const result: GoalRow[] = [];

      for (const defWithGoal of goals) {
        const history = await LiftHistoryRepository.get(defWithGoal.id);
        if (history.length == 0) {
          result.push({lift: defWithGoal, percent: 0});
          continue;
        }

        const sets = history.flatMap(h => h.sets).filter(set => !set.warmup);
        const maxes = sets.map(set => Utils.calculate1RM(defWithGoal, set));
        const best = Math.max(...maxes);

        const percent =
          best / Utils.calculate1RM(defWithGoal, defWithGoal.goal!!);
        result.push({lift: defWithGoal, percent});
      }

      // Short term Goals
      const shortTerm: GoalRow[] = [];
      const workouts = await WorkoutRepository.getRoutine(settings.routine);
      const lifts = workouts
        .flatMap(x => x.lifts)
        .filter(x => x.sets.length > 0)
        .filter(x => x.goals != undefined && x.goals.length > 0);

      lifts.forEach(lift => {
        const def = defs[lift.id];
        const sets = lift.sets
          .filter(x => !x.warmup)
          .map(x => SetUtils.setToPersisted(x));
        const goals = (lift.goals ?? []).map(x => SetUtils.setToPersisted(x));

        const percent =
          Utils.calculate1RMAverage(def, sets) /
          Utils.calculate1RMAverage(def, goals);

        shortTerm.push({lift: def, percent});
      });

      result.sort((a, b) => a.percent - b.percent);
      result.push({lift: undefined, percent: 0}); // Placeholder row
      shortTerm.sort((a, b) => a.percent - b.percent);
      result.push(...shortTerm);
      setGoalRows(result);
    };

    loadData();
  }, []);

  const renderItem = ({item, index}: ListRenderItemInfo<GoalRow>) => (
    <View
      key={index}
      style={{flexDirection: 'row', alignItems: 'center', padding: 8}}>
      {item.lift === undefined ? (
        <SpacerRow></SpacerRow>
      ) : (
        <GoalRow item={item}></GoalRow>
      )}
    </View>
  );

  const SpacerRow = (props: {}) => (
    <>
      <Text
        style={{
          flex: 5,
          textAlign: 'center',
          color: colors.text,
          fontWeight: 'bold',
        }}>
        {'Short Term'}
      </Text>
    </>
  );

  const GoalRow = ({item}: {item: GoalRow}) => (
    <>
      <Text style={{flex: 5, textAlign: 'right', color: colors.text}}>
        {item.lift ? Utils.defToString(item.lift) : 'Short Term'}
      </Text>
      <Text
        style={{
          flex: 5,
          textAlign: 'left',
          color: colors.text,
          paddingLeft: 10,
        }}>
        {Math.round(item.percent * 1000) / 10 + '%'}
      </Text>
    </>
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
