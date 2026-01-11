import React, {useEffect, useState} from 'react';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../App';
import {Button, Text, ToastAndroid, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LiftDefRepository from '../repository/LiftDefRepository';
import {
  exportAsyncStorage,
  importAsyncStorage,
} from '../repository/ImportExport.ts';
import LiftHistoryRepository from '../repository/LiftHistoryRepository.ts';

type Props = StackScreenProps<RootStackParamList, 'Settings'>;

export function SettingsScreen({route, navigation}: Props) {
  async function logSettings() {
    const keys = await AsyncStorage.getAllKeys();

    keys.forEach(key => {
      console.log(key);
    });
  }

  async function logLiftDefs() {
    const defs = await LiftDefRepository.getAll();
    console.log('Defs');
    defs.forEach(x => {
      var max = x.trainingMax ? x.trainingMax + '' : '';
      var sys = x.system ? 'sys' : '';
      console.log(x.id.padEnd(38, ' ') + max + '\t' + sys + '\t' + x.name);
    });
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
      <Button title="Log Keys" onPress={logSettings}></Button>
      <Button title="Log Defs" onPress={logLiftDefs}></Button>
      <Button title="Export Database" onPress={onExport}></Button>
      <Button title="Import Database" onPress={onImport}></Button>
    </View>
  );
}
