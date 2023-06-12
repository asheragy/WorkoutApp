import React from 'react';
import {StyleSheet, Text, useColorScheme} from 'react-native';
import {WorkoutScreen} from './screens/WorkoutScreen';
import {WeightScreen} from './screens/WeightScreen';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {OverflowMenuProvider} from 'react-navigation-header-buttons';
import {GlobalSettings, LiftDef} from './types/types';
import {createStore} from 'redux';
import settingsReducer from './state/settingsReducer';
import {Provider} from 'react-redux';
import {LiftListScreen} from './components/LiftListScreen';
import {LiftHistoryScreen} from './screens/LiftHistory/LiftHistoryScreen';
import {LiftDefEditScreen} from './screens/LiftDefEditScreen';
import {WorkoutEditScreen} from './screens/WorkoutEditScreen';
import {WorkoutList} from './screens/WorkoutListScreen';
import {Workout} from './types/workout';
import {LiftDefListScreen} from './screens/LiftDefListScreen';
import {SettingsScreen} from './screens/SettingsScreen';
import {WorkoutHistoryScreen} from './screens/WorkoutHistoryScreen';

export type RootStackParamList = {
  Home: {
    settings: GlobalSettings;
  };
  Workout: {
    workoutId: string;
    onComplete: () => void;
  };
  Weight: undefined;
  LiftChart: {
    lift: LiftDef;
  };
  LiftHistory: {
    lift: LiftDef;
  };
  WorkoutHistory: {
    workoutId: string;
  };
  LiftList: undefined;
  LiftDefEdit: {
    onChanged: () => void;
    def?: LiftDef;
  };
  LiftDefList: {
    onSelect?: (def: LiftDef) => void;
  };
  WorkoutEdit: {
    workout?: Workout;
    onChanged: () => void;
  };
  Settings: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const store = createStore(settingsReducer);

const App = () => {
  const scheme = useColorScheme();

  return (
    <Provider store={store}>
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
              name="Settings"
              options={{
                headerStyle: styles.headerStyle,
              }}
              component={SettingsScreen}
            />
            <Stack.Screen
              name="LiftHistory"
              options={({route}) => ({
                headerStyle: styles.headerStyle,
                title: route.params.lift.name,
              })}
              component={LiftHistoryScreen}
            />
            <Stack.Screen
              name="WorkoutHistory"
              options={({route}) => ({
                headerStyle: styles.headerStyle,
                title: 'Workout History',
              })}
              component={WorkoutHistoryScreen}
            />
            <Stack.Screen
              name="LiftList"
              options={{
                title: 'Lifts',
                headerStyle: styles.headerStyle,
              }}
              component={LiftListScreen}
            />
            <Stack.Screen
              name="LiftDefEdit"
              options={{
                title: 'Edit Lift Defintion',
                headerStyle: styles.headerStyle,
              }}
              component={LiftDefEditScreen}
            />
            <Stack.Screen
              name="LiftDefList"
              options={{
                title: 'Lift Definitions',
                headerStyle: styles.headerStyle,
              }}
              component={LiftDefListScreen}
            />
            <Stack.Screen
              name="WorkoutEdit"
              options={{
                title: 'Edit Workout',
                headerStyle: styles.headerStyle,
              }}
              component={WorkoutEditScreen}
            />
          </Stack.Navigator>
        </OverflowMenuProvider>
      </NavigationContainer>
    </Provider>
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
