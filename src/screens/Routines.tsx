import React, { useEffect, useState } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../App';
import {
  Alert,
  FlatList,
  ListRenderItemInfo,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Routine } from '../core/types/workout';
import RoutineRepository from '../repository/RoutineRepository';
import { useTheme } from '@react-navigation/native';
import SettingsRepository from '../repository/SettingsRepository';
import WorkoutRepository from '../repository/WorkoutRepository.ts';

type Props = StackScreenProps<RootStackParamList, 'Routines'>;

export function RoutinesScreen({ navigation }: Props) {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [selected, setSelected] = useState<string | undefined>(undefined);
  const { colors } = useTheme();

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

  async function onSwitch(routine: Routine) {
    await SettingsRepository.set('routine', routine.id);
    await SettingsRepository.set('routineName', routine.title);
    await WorkoutRepository.importIfEmpty(routine.id);
    navigation.pop();
  }

  const confirmSwitch = (routine: Routine) => {
    Alert.alert('Switch Program?', 'Are you sure', [
      {
        text: 'Yes',
        style: 'default',
        onPress: () => onSwitch(routine),
      },
      {
        text: 'No',
        style: 'cancel',
      },
    ]);
  };

  // TODO bold text for selected only
  const renderItem = (item: ListRenderItemInfo<Routine>) => (
    <TouchableOpacity onPress={() => onClick(item.item)}>
      <View key={item.item.id}>
        <Text style={{ color: colors.text, padding: 10 }}>
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
        keyExtractor={(_, index) => 'idx_' + index}
      ></FlatList>
    </View>
  );
}
