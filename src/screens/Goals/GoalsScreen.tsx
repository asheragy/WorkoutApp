import React from 'react';
import { ShortTermTab } from './ShortTermTab.tsx';
import { LongTermTab } from './LongTermTab.tsx';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useSelector } from 'react-redux';
import { AppState } from '../../state/store.ts';

const Tab = createMaterialTopTabNavigator();

export function GoalsScreen() {
  const settings = useSelector((store: AppState) => store.settings);

  return (
    <Tab.Navigator>
      <Tab.Screen name="Short Term">
        {() => <ShortTermTab settings={settings} />}
      </Tab.Screen>
      <Tab.Screen name="Long Term">
        {() => <LongTermTab settings={settings} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
