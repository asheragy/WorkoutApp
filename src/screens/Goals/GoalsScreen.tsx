import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../../App.tsx';
import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {ShortTermTab} from './ShortTermTab.tsx';
import {LongTermTab} from './LongTermTab.tsx';

type Props = StackScreenProps<RootStackParamList, 'Goals'>;

const Tab = createMaterialTopTabNavigator();

export function GoalsScreen({route, navigation}: Props) {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Short Term" children={() => <ShortTermTab />} />
      <Tab.Screen name="Long Term" children={() => <LongTermTab />} />
    </Tab.Navigator>
  );
}
