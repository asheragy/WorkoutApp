import {useTheme} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  HeaderButton,
  HeaderButtons,
  HiddenItem,
  OverflowMenu,
} from 'react-navigation-header-buttons';
import {RootStackParamList} from '../App';
import WeightRepository from '../data/WeightRepository';
import {WeightEntry} from '../types/types';

type Props = StackScreenProps<RootStackParamList, 'Weight'>;

const MaterialHeaderButton = (props: any) => (
  <HeaderButton {...props} iconSize={23} color="blue" />
);

export function WeightScreen({route, navigation}: Props) {
  const [current, setCurrent] = useState<number>(1800);
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
          </OverflowMenu>
        </HeaderButtons>
      ),
    });
  }, [navigation]);

  useEffect(loadState, []);

  const {colors} = useTheme();

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          style={styles.counterButtonContainer}
          onPress={() => setCurrent(current - 2)}>
          <Text style={styles.counterButtonText}>-</Text>
        </TouchableOpacity>

        <TextInput style={{color: colors.text}}>{current / 10}</TextInput>
        <TouchableOpacity
          style={styles.counterButtonContainer}
          onPress={() => setCurrent(current + 2)}>
          <Text style={styles.counterButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <Button title="Add" onPress={() => onAdd()} />

      <View>
        {entries.map((entry, index) => (
          <View style={styles.entryRow}>
            <Text
              style={{width: '50%', textAlign: 'center', color: colors.text}}>
              {entry.date.toDateString()}
            </Text>
            <Text style={{color: colors.text}}>{entry.weight / 10}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  addButton: {},
  counterButtonContainer: {
    elevation: 8,
    backgroundColor: '#009688',
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 8,
    margin: 1,
    height: 30,
    alignSelf: 'center',
  },
  counterButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  entryRow: {
    flexDirection: 'row',
  },
});
