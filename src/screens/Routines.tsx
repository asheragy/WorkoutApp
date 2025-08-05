import React, {useEffect, useState} from 'react';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../App';
import {
  Alert,
  FlatList,
  ListRenderItemInfo,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Routine} from '../types/workout';
import RoutineRepository from '../repository/RoutineRepository';
import {useTheme} from '@react-navigation/native';
import SettingsRepository from '../repository/SettingsRepository';

type Props = StackScreenProps<RootStackParamList, 'Routines'>;

export function RoutinesScreen({route, navigation}: Props) {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [selected, setSelected] = useState<string | undefined>(undefined);
  const {colors} = useTheme();

  function load() {
    SettingsRepository.get().then(settings => setSelected(settings.routine));
    RoutineRepository.getAll().then(r =>
      setRoutines(r.sort((a, b) => a.title.localeCompare(b.title))),
    );
  }

  useEffect(load, []);

  function onClick(routine: Routine) {
    if (routine.id != selected) {
      confirmSwitch(routine);
    }
  }

  async function onSwitch(routine: Routine, importLifts: boolean) {
    await SettingsRepository.set('routine', routine.id);
    route.params.onChanged(importLifts);
    navigation.pop();
  }

  const confirmSwitch = (routine: Routine) => {
    Alert.alert('Switch Program?', 'Are you sure', [
      {
        text: 'Yes/Import',
        style: 'destructive',
        onPress: () => onSwitch(routine, true),
      },
      {
        text: 'Yes',
        style: 'default',
        onPress: () => onSwitch(routine, false),
      },
      {
        text: 'No',
        style: 'cancel',
      },
    ]);
  };

  const renderItem = (item: ListRenderItemInfo<Routine>) => (
    <TouchableOpacity onPress={() => onClick(item.item)}>
      <View key={item.index}>
        <Text style={{color: colors.text, padding: 10}}>
          {(item.item.id == selected ? '**' : '') + item.item.title}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View>
      <FlatList
        data={routines}
        renderItem={renderItem}
        keyExtractor={(_, index) => 'idx_' + index}></FlatList>
    </View>
  );
}
