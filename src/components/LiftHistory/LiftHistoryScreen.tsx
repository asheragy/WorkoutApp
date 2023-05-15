import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useTheme} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {RootStackParamList} from '../../App';
import LiftRepository, {
  PersistedLiftHistory,
} from '../../repository/LiftRepository';
import {LiftChartTab} from './LiftChartTab';
import {LiftLogTab} from './LiftLogTab';

type Props = StackScreenProps<RootStackParamList, 'LiftHistory'>;

const Tab = createMaterialTopTabNavigator();

export function LiftHistoryScreen({route, navigation}: Props) {
  const [entries, setEntries] = useState<PersistedLiftHistory[]>([]);
  const {colors} = useTheme();
  const def = route.params.lift;

  function loadState() {
    LiftRepository.getHistory(def.id).then(result => {
      setEntries(result);
    });
  }

  useEffect(loadState, []);

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Log"
        children={() => <LiftLogTab entries={entries} />}
      />
      <Tab.Screen
        name="Charts"
        children={() => <LiftChartTab def={def} entries={entries} />}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({});
