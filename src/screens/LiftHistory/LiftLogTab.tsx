import {useTheme} from '@react-navigation/native';
import React from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {LiftHistory} from '../../repository/LiftHistoryRepository';

export function LiftLogTab(props: {entries: LiftHistory[]}) {
  const {colors} = useTheme();
  const entries = props.entries.slice().reverse();
  const df: Intl.DateTimeFormatOptions = {
    month: '2-digit',
    day: '2-digit',
  };

  const renderItem = (item: ListRenderItemInfo<LiftHistory>) => {
    const date = item.item.timestamp.toLocaleDateString('us-en', df);
    const sets = item.item.sets.map(
      set => set.weight + 'x' + set.reps + (set.warmup ? ' (W)' : ''),
    );

    return (
      <View style={{padding: 4}}>
        <Text style={{color: colors.text}}>
          {date + ' - ' + sets.join(', ')}
        </Text>
      </View>
    );
  };

  return (
    <FlatList
      style={{backgroundColor: colors.background}}
      data={entries}
      renderItem={renderItem}
      keyExtractor={(_, index) => 'idx_' + index}></FlatList>
  );
}

const styles = StyleSheet.create({});
