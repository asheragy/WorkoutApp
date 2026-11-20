import React from 'react';
import { StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import { StackScreenProps } from '@react-navigation/stack';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import type { RootStackParamList } from '../App';
import { MaterialHeaderButton } from '../components/Common';
import { useSelector } from 'react-redux';
import { AppState } from '../state/store';
import { WorkoutList } from './Home';
import { GoalsScreen } from './Goals/GoalsScreen.tsx';
import { StatsScreen } from './StatsScreen';
import { HistoryScreen } from './History/HistoryScreen';

export type HomeTabParamList = {
  Workouts: undefined;
  Goals: undefined;
  Stats: undefined;
  History: undefined;
};

type IconName = React.ComponentProps<typeof MaterialDesignIcons>['name'];

const Tab = createBottomTabNavigator<HomeTabParamList>();

function tabIcon(name: IconName) {
  const TabIcon = (props: { color: string; size: number }) => (
    <MaterialDesignIcons name={name} color={props.color} size={props.size} />
  );
  return TabIcon;
}

type Props = StackScreenProps<RootStackParamList, 'Home'>;

export function HomeTabs({ navigation }: Props) {
  // Routine scoped tabs are titled with the active routine, falls back to the tab name
  const routineName = useSelector(
    (store: AppState) => store.settings.routineName,
  );

  // Workouts replaces this with its own buttons, which include settings
  const headerRight = () => (
    <View style={{ marginRight: 10 }}>
      <HeaderButtons HeaderButtonComponent={MaterialHeaderButton}>
        <Item
          title="settings"
          iconName="cog"
          onPress={() => navigation.navigate('Settings')}
        />
      </HeaderButtons>
    </View>
  );

  return (
    <Tab.Navigator
      screenOptions={{ headerStyle: styles.headerStyle, headerRight }}
    >
      <Tab.Screen
        name="Workouts"
        component={WorkoutList}
        options={{
          headerTitle: routineName,
          tabBarIcon: tabIcon('dumbbell'),
        }}
      />
      <Tab.Screen
        name="Goals"
        component={GoalsScreen}
        options={{
          // Top tabs sit directly under the header
          headerShadowVisible: false,
          headerTitle: routineName,
          tabBarIcon: tabIcon('flag-checkered'),
        }}
      />
      <Tab.Screen
        name="Stats"
        component={StatsScreen}
        options={{
          headerTitle: routineName,
          tabBarIcon: tabIcon('chart-bar'),
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          // Top tabs sit directly under the header
          headerShadowVisible: false,
          tabBarIcon: tabIcon('history'),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: '#f4511e',
  },
});
