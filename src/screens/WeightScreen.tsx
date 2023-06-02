import {useTheme} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {
  Button,
  FlatList,
  ListRenderItemInfo,
  LogBox,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  HeaderButton,
  HeaderButtons,
  HiddenItem,
  OverflowMenu,
} from 'react-navigation-header-buttons';
import {RootStackParamList} from '../App';
import WeightRepository from '../repository/WeightRepository';
import {WeightEntry} from '../types/types';
import {MaterialHeaderButton} from '../components/Common';
import {NumberControl} from '../components/NumberControl';
import {ProgressChart} from '../components/ProgressChart';

type Props = StackScreenProps<RootStackParamList, 'Weight'>;

// TODO warning on screen load, might be 3rd party library using deprecated method
LogBox.ignoreLogs(['EventEmitter.removeListener']);

export function WeightScreen({route, navigation}: Props) {
  const [current, setCurrent] = useState<number>(180);
  const [entries, setEntries] = useState<WeightEntry[]>([]);

  function loadState() {
    WeightRepository.getAll().then(result => {
      setEntries(result);

      if (result.length > 0) setCurrent(result[result.length - 1].weight);
    });
  }

  async function onAdd() {
    var entry: WeightEntry = {
      date: new Date(),
      weight: current,
    };

    await WeightRepository.add(entry);
    loadState();
  }

  async function onReset() {
    await WeightRepository.clear();
    loadState();
  }

  async function onRemoveLast() {
    await WeightRepository.removeLast();
    loadState();
  }

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={MaterialHeaderButton}>
          <OverflowMenu
            style={{marginHorizontal: 10}}
            OverflowIcon={({color}) => (
              <Text style={{fontWeight: 'bold', fontSize: 24}}>...</Text>
            )}>
            <HiddenItem title="Reset" onPress={() => onReset()} />
            <HiddenItem title="Remove Last" onPress={() => onRemoveLast()} />
          </OverflowMenu>
        </HeaderButtons>
      ),
    });
  }, [navigation]);

  useEffect(loadState, []);

  const {colors} = useTheme();

  var dates = entries.map(x => x.date);
  var values = entries.map(x => x.weight);

  const renderItem = (item: ListRenderItemInfo<WeightEntry>) => (
    <View key={item.index} style={styles.entryRow}>
      <Text style={{width: '50%', textAlign: 'center', color: colors.text}}>
        {item.item.date.toDateString()}
      </Text>
      <Text style={{color: colors.text}}>{item.item.weight}</Text>
    </View>
  );

  return (
    <View style={{flexDirection: 'column'}}>
      <View style={{height: '40%'}}>
        <ProgressChart
          title="Weight"
          dates={dates}
          values={values}></ProgressChart>
      </View>

      <FlatList
        style={{backgroundColor: colors.background, height: '40%'}}
        data={entries}
        renderItem={renderItem}
        keyExtractor={(_, index) => 'test' + index}></FlatList>

      <View style={{height: '10%'}}>
        <NumberControl
          value={current}
          onChange={newValue => setCurrent(newValue)}
          decrementBy={() => 0.2}
          incrementBy={() => 0.2}></NumberControl>
        <Button title="Add" onPress={() => onAdd()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  addButton: {},
  entryRow: {
    flexDirection: 'row',
  },
});
