import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { LiftsTab } from './LiftsTab.tsx';
import { WorkoutsTab } from './WorkoutsTab.tsx';

const Tab = createMaterialTopTabNavigator();

export function HistoryScreen() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Lifts" component={LiftsTab} />
      <Tab.Screen name="Workouts" component={WorkoutsTab} />
    </Tab.Navigator>
  );
}
