import {LiftDef, MuscleGroup} from '../../types/types.ts';
import {FlatList, ListRenderItemInfo, Text, View} from 'react-native';
import Utils from '../../components/Utils.ts';
import React from 'react';
import {useTheme} from '@react-navigation/native';

export type GoalRow = {
  id: string;
  lift?: LiftDef;
  group?: MuscleGroup;
  percent: number;
};

export const renderItem = ({item}: ListRenderItemInfo<GoalRow>) => (
  <View
    key={item.id}
    style={{flexDirection: 'row', alignItems: 'center', padding: 8}}>
    <GoalRow item={item}></GoalRow>
  </View>
);

function GoalRow({item}: {item: GoalRow}) {
  const {colors} = useTheme();

  return (
    <>
      <Text
        style={{
          flex: 5,
          textAlign: 'right',
          color: colors.text,
          fontWeight: item.lift ? 'normal' : 'bold',
        }}>
        {item.lift ? Utils.defToString(item.lift) : MuscleGroup[item.group!!]}
      </Text>
      <Text
        style={{
          flex: 5,
          textAlign: 'left',
          color: colors.text,
          paddingLeft: 10,
        }}>
        {(100 * item.percent).toFixed(1) + '%'}
      </Text>
    </>
  );
}

export function ProgressList({goals}: {goals: GoalRow[]}) {
  const {colors} = useTheme();

  let progress = 0;
  let count = 0;
  for (const goal of goals) {
    if (goal.lift && goal.percent > 0) {
      count++;
      progress += Math.min(goal.percent, 1);
    }
  }

  progress /= count;

  return (
    <View style={{flex: 1}}>
      <Text style={{textAlign: 'center', color: colors.text, padding: 8}}>
        {'Progress: ' + (100 * progress).toFixed(1) + '%'}
      </Text>
      <FlatList
        style={{flex: 1, backgroundColor: colors.background}}
        data={goals}
        renderItem={renderItem}
        keyExtractor={row => row.id}></FlatList>
    </View>
  );
}
