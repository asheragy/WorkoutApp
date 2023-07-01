import React, {useEffect, useState} from 'react';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../App';
import {Button, Text, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LiftDefRepository from '../repository/LiftDefRepository';

type Props = StackScreenProps<RootStackParamList, 'Settings'>;

export function SettingsScreen({route, navigation}: Props) {
  async function logSettings() {
    const keys = await AsyncStorage.getAllKeys();

    keys.forEach(key => {
      console.log(key);
      //AsyncStorage.removeItem('@weightLog');

      if (key.startsWith('liftHistory:')) {
        //console.log('-');
        //AsyncStorage.removeItem(key);
        ///AsyncStorage.getItem(key).then(result => console.log(result));
      }
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

  return (
    <View>
      <Button title="Log Keys" onPress={logSettings}></Button>
      <Button title="Log Defs" onPress={logLiftDefs}></Button>
    </View>
  );
}
