import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { RootStackParamList } from '../../App';
import LiftHistoryRepository, {
  LiftHistory,
} from '../../repository/LiftHistoryRepository';
import { LiftChartTab } from './LiftChartTab';
import { LiftLogTab } from './LiftLogTab';
import { useSelector } from 'react-redux';
import { AppState } from '../../state/store';
import Utils from '../../components/Utils';

type Props = StackScreenProps<RootStackParamList, 'LiftHistory'>;

const Tab = createMaterialTopTabNavigator();

export function LiftHistoryScreen({ route, navigation }: Props) {
  const [entries, setEntries] = useState<LiftHistory[]>([]);
  const defs = useSelector((store: AppState) => store.liftDefs);

  const liftId = route.params.liftId;
  const def = defs[liftId];

  function loadState() {
    LiftHistoryRepository.get(liftId).then(result => {
      setEntries(result);
    });
  }

  useEffect(() => {
    loadState();
    navigation.setOptions({ title: Utils.defToString(def) });
  }, []);

  return (
    <Tab.Navigator>
      <Tab.Screen name="Log">
        {() => <LiftLogTab entries={entries} />}
      </Tab.Screen>
      <Tab.Screen name="Charts">
        {() => <LiftChartTab def={def} entries={entries} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
