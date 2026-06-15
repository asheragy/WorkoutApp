import React from 'react';
import { ShortTermTab } from './ShortTermTab.tsx';
import { LongTermTab } from './LongTermTab.tsx';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

export function GoalsScreen() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Short Term">{() => <ShortTermTab />}</Tab.Screen>
      <Tab.Screen name="Long Term">{() => <LongTermTab />}</Tab.Screen>
    </Tab.Navigator>
  );
}
