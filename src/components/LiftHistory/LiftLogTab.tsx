import {useTheme} from '@react-navigation/native';
import React from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {PersistedLiftHistory} from '../../data/LiftRepository';

export function LiftLogTab(props: {entries: PersistedLiftHistory[]}) {
  const {colors} = useTheme();

  const renderItem = (item: ListRenderItemInfo<PersistedLiftHistory>) => (
    <View style={{padding: 4}}>
      <Text>{item.item.date.toDateString()}</Text>
      {item.item.sets.map((set, index) => (
        <Text key={index.toString()}>
          {set.weight + ' x ' + set.reps + (set.warmup ? ' (W)' : '')}
        </Text>
      ))}
    </View>
  );

  return (
    <FlatList
      style={{backgroundColor: colors.background}}
      data={props.entries}
      renderItem={renderItem}
      keyExtractor={(_, index) => 'idx_' + index}></FlatList>
  );
}

const styles = StyleSheet.create({});