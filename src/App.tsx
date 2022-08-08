import React from 'react';
import {StyleSheet, Text, useColorScheme} from 'react-native';
import {Workout} from './data/Repository';
import {WorkoutScreen} from './components/WorkoutScreen';
import {WorkoutList} from './components/WorkoutList';
import {WeightScreen} from './components/WeightScreen';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {OverflowMenuProvider} from 'react-navigation-header-buttons';
import {LiftScreen} from './components/LiftScreen';
import {PersistedLift} from './types/types';
import Utils from './components/Utils';

export type RootStackParamList = {
  Home: undefined;
  Workout: {
    workout: Workout;
    onComplete: (index: number) => void;
  };
  Weight: undefined;
  Lift: {
    lift: PersistedLift;
  };
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  const scheme = useColorScheme();

  return (
    <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <OverflowMenuProvider>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={WorkoutList}
            options={{
              title: 'Workouts',
              headerStyle: styles.headerStyle,
            }}
          />
          <Stack.Screen
            name="Workout"
            options={({route}) => ({
              headerStyle: styles.headerStyle,
              title: route.params.workout.node.name ?? 'Workout',
            })}
            component={WorkoutScreen}
          />
          <Stack.Screen
            name="Weight"
            options={{
              headerStyle: styles.headerStyle,
            }}
            component={WeightScreen}
          />
          <Stack.Screen
            name="Lift"
            options={({route}) => ({
              headerStyle: styles.headerStyle,
              title: Utils.liftName(route.params.lift),
            })}
            component={LiftScreen}
          />
        </Stack.Navigator>
      </OverflowMenuProvider>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: '#f4511e',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
