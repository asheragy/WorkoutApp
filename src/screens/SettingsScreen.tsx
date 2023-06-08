import React, {useEffect, useState} from 'react';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../App';
import {Button, Text, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TrainingMaxRepository from '../repository/TrainingMaxRepository';
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

  async function logTrainingMaxes() {
    const tms = await TrainingMaxRepository.getInstance().getAll();
    tms.forEach(x => console.log(x.id.padEnd(38, ' ') + x.max));
  }

  return (
    <View>
      <Button title="Log Keys" onPress={logSettings}></Button>
      <Button title="Log TMs" onPress={logTrainingMaxes}></Button>
    </View>
  );
}
