import {LiftDef} from '../../types/types.ts';
import {FlatList, ListRenderItemInfo, Text, View} from 'react-native';
import Utils from '../../components/Utils.ts';
import React from 'react';
import {useTheme} from '@react-navigation/native';

export type GoalRow = {
  lift: LiftDef;
  percent: number;
};

export const renderItem = ({item, index}: ListRenderItemInfo<GoalRow>) => (
  <View
    key={index}
    style={{flexDirection: 'row', alignItems: 'center', padding: 8}}>
    <GoalRow item={item}></GoalRow>
  </View>
);

function GoalRow({item}: {item: GoalRow}) {
  const {colors} = useTheme();

  return (
    <>
      <Text style={{flex: 5, textAlign: 'right', color: colors.text}}>
        {Utils.defToString(item.lift)}
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
}

export function ProgressList({goals}: {goals: GoalRow[]}) {
  const {colors} = useTheme();

  let progress = 0;
  let count = 0;
  for (const goal of goals) {
    if (goal.percent > 0) {
      count++;
      progress += Math.min(goal.percent, 1);
    }
  }

  progress /= count;

  return (
    <View style={{flex: 1}}>
      <Text style={{textAlign: 'center', color: colors.text, padding: 8}}>
        {'Progress: ' + Math.round(progress * 1000) / 10 + '%'}
      </Text>
      <FlatList
        style={{flex: 1, backgroundColor: colors.background}}
        data={goals}
        renderItem={renderItem}
        keyExtractor={(_, index) => '_' + index}></FlatList>
    </View>
  );
}
