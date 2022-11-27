import {useTheme} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  HeaderButtons,
  HiddenItem,
  OverflowMenu,
} from 'react-navigation-header-buttons';
import {RootStackParamList} from '../App';
import LiftRepository, {PersistedLiftHistory} from '../data/LiftRepository';
import {MaterialHeaderButton} from './Common';

type Props = StackScreenProps<RootStackParamList, 'LiftLog'>;

export function LiftLogScreen({route, navigation}: Props) {
  const [entries, setEntries] = useState<PersistedLiftHistory[]>([]);
  const {colors} = useTheme();
  const def = route.params.lift;

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={MaterialHeaderButton}>
          <OverflowMenu
            style={{marginHorizontal: 10}}
            OverflowIcon={({color}) => (
              <Text style={{fontWeight: 'bold', fontSize: 24}}>...</Text>
            )}>
            <HiddenItem
              title="Chart"
              onPress={() => navigation.navigate('LiftChart', {lift: def})}
            />
          </OverflowMenu>
        </HeaderButtons>
      ),
    });
  }, [navigation]);

  function loadState() {
    LiftRepository.getHistory(def.id).then(result => {
      setEntries(result);
    });
  }

  useEffect(loadState, []);

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
      data={entries}
      renderItem={renderItem}
      keyExtractor={(_, index) => 'idx_' + index}></FlatList>
  );
}

const styles = StyleSheet.create({});
