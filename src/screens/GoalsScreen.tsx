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

type Props = StackScreenProps<RootStackParamList, 'Goals'>;

type GoalRow = {
  lift: LiftDef;
  percent: number;
};

export function GoalsScreen({route, navigation}: Props) {
  const defs = useSelector((store: AppState) => store.liftDefs);
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

        const sets = history.flatMap(h => h.sets);
        const maxes = sets.map(set => Utils.calculate1RM(defWithGoal, set));
        const best = Math.max(...maxes);

        const percent =
          best / Utils.calculate1RM(defWithGoal, defWithGoal.goal!!);
        result.push({lift: defWithGoal, percent});
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
