import React from 'react';
import { Button, ToastAndroid, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LiftDefRepository from '../repository/LiftDefRepository';
import {
  exportAsyncStorage,
  importAsyncStorage,
} from '../repository/ImportExport.ts';
import { LiftType, MuscleGroup } from '../types/types.ts';
import SettingsRepository from '../repository/SettingsRepository.ts';

export function SettingsScreen() {
  async function logKeys() {
    const keys = await AsyncStorage.getAllKeys();

    keys.forEach(key => {
      console.log(key);
    });
  }

  async function logLiftDefs() {
    const defs = await LiftDefRepository.getAll();
    console.log('Defs');
    if (defs.length == 0) console.log('  0');
    defs.forEach(x => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      x.type = LiftType[x.type];
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      x.muscleGroups = x.muscleGroups.map(g => MuscleGroup[g]);
      console.log('  ' + JSON.stringify(x));
    });
  }

  async function logSettings() {
    const settings = await SettingsRepository.get();
    console.log(JSON.stringify(settings));
  }

  async function onExport() {
    const path = await exportAsyncStorage();
    ToastAndroid.show(
      'Saved to ' + path.substring(path.lastIndexOf('/') + 1),
      ToastAndroid.LONG,
    );
  }

  async function onImport() {
    const keys = await AsyncStorage.getAllKeys();
    if (keys.length > 0)
      ToastAndroid.show(
        'Can only import on empty database',
        ToastAndroid.SHORT,
      );
    else {
      await importAsyncStorage();
      ToastAndroid.show('Successfully imported database', ToastAndroid.SHORT);
    }
  }

  return (
    <View>
      <Button title="Log Keys" onPress={logKeys}></Button>
      <Button title="Log Defs" onPress={logLiftDefs}></Button>
      <Button title="Log Settings" onPress={logSettings}></Button>
      <Button title="Export Database" onPress={onExport}></Button>
      <Button title="Import Database" onPress={onImport}></Button>
    </View>
  );
}
