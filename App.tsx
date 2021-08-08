import React from 'react';
import {StyleSheet, Text, useColorScheme} from 'react-native';
import {Workout} from './src/data/Repository';
import {WorkoutScreen} from './components/WorkoutScreen';
import {WorkoutList} from './components/WorkoutList';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {OverflowMenuProvider} from 'react-navigation-header-buttons';

export type RootStackParamList = {
  Home: undefined;
  Workout: {
    workout: Workout;
    onComplete: (index: number) => void;
  };
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
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
            options={{
              headerStyle: styles.headerStyle,
            }}
            component={WorkoutScreen}
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
