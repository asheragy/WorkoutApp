import { FlatList, ListRenderItemInfo, Text, View } from 'react-native';
import React from 'react';
import { useTheme } from '@react-navigation/native';
import GoalRow from './Utils.ts';

export const renderItem = ({ item }: ListRenderItemInfo<GoalRow>) => (
  <View
    key={item.id}
    style={{ flexDirection: 'row', alignItems: 'center', padding: 8 }}
  >
    <Goal item={item}></Goal>
  </View>
);

function Goal({ item }: { item: GoalRow }) {
  const { colors } = useTheme();

  return (
    <>
      <Text
        style={{
          flex: 5,
          textAlign: 'right',
          color: colors.text,
          fontWeight: item.group ? 'bold' : 'normal',
        }}
      >
        {item.name}
      </Text>
      <Text
        style={{
          flex: 5,
          textAlign: 'left',
          color: colors.text,
          paddingLeft: 10,
        }}
      >
        {(100 * item.percent).toFixed(1) + '%'}
      </Text>
    </>
  );
}

export function ProgressList({ goals }: { goals: GoalRow[] }) {
  const { colors } = useTheme();

  let progress = 0;
  let count = 0;
  for (const goal of goals) {
    if (!goal.group && goal.percent > 0) {
      count++;
      progress += Math.min(goal.percent, 1);
    }
  }

  progress /= count;

  return (
    <View style={{ flex: 1 }}>
      <Text style={{ textAlign: 'center', color: colors.text, padding: 8 }}>
        {'Progress: ' + (100 * progress).toFixed(1) + '%'}
      </Text>
      <FlatList
        style={{ flex: 1, backgroundColor: colors.background }}
        data={goals}
        renderItem={renderItem}
        keyExtractor={row => row.id}
      ></FlatList>
    </View>
  );
}
