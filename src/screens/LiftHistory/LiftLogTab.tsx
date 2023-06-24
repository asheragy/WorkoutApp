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
import Utils from '../../components/Utils';

export function LiftLogTab(props: {entries: LiftHistory[]}) {
  const {colors} = useTheme();

  const renderItem = (item: ListRenderItemInfo<LiftHistory>) => {
    // TODO remove after resetting database
    var ts = item.item.hasOwnProperty('timestamp')
      ? item.item.timestamp.toDateString()
      : 'old data';

    return (
      <View style={{padding: 4}}>
        <Text>{ts}</Text>
        {item.item.sets.map((set, index) => (
          <Text key={index.toString()}>
            {set.weight + ' x ' + set.reps + (set.warmup ? ' (W)' : '')}
          </Text>
        ))}
      </View>
    );
  };

  return (
    <FlatList
      style={{backgroundColor: colors.background}}
      data={props.entries}
      renderItem={renderItem}
      keyExtractor={(_, index) => 'idx_' + index}></FlatList>
  );
}

const styles = StyleSheet.create({});
