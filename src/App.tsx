import React, {useEffect} from 'react';
import {StyleSheet, useColorScheme} from 'react-native';
import {WorkoutScreen} from './screens/WorkoutScreen';
import {WeightScreen} from './screens/WeightScreen';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {GlobalSettings, LiftDef} from './types/types';
import {createStore} from 'redux';
import {Provider, useDispatch} from 'react-redux';
import {LiftListScreen} from './screens/LiftListScreen';
import {LiftHistoryScreen} from './screens/LiftHistory/LiftHistoryScreen';
import {LiftDefEditScreen} from './screens/LiftDefEditScreen';
import {WorkoutEditScreen} from './screens/WorkoutEditScreen';
import {WorkoutList} from './screens/Home';
import {Workout} from './types/workout';
import {LiftDefListScreen} from './screens/LiftDefListScreen';
import {StatsScreen} from './screens/StatsScreen';
import {SettingsScreen} from './screens/SettingsScreen';
import {WorkoutHistoryScreen} from './screens/WorkoutHistoryScreen';
import {HeaderButtonsProvider} from 'react-navigation-header-buttons';
import {rootReducer} from './state/store';
import LiftDefRepository from './repository/LiftDefRepository';
import {MenuProvider} from 'react-native-popup-menu';
import {RoutinesScreen} from './screens/Routines';

export type RootStackParamList = {
  Home: {
    settings: GlobalSettings;
  };
  Workout: {
    workoutId: string;
    onComplete: () => void;
  };
  Weight: undefined;
  Stats: undefined;
  LiftChart: {
    lift: LiftDef;
  };
  LiftHistory: {
    liftId: string;
  };
  WorkoutHistory: {
    workoutId: string;
  };
  LiftList: undefined;
  LiftDefEdit: {
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
  Programs: {
    onChanged: () => void;
  };
};

const Stack = createStackNavigator<RootStackParamList>();
const store = createStore(rootReducer);

const App = () => {
  return (
    <Provider store={store}>
      <MenuProvider>
        <AppRoot></AppRoot>
      </MenuProvider>
    </Provider>
  );
};

const AppRoot = () => {
  const scheme = useColorScheme();
  const dispatch = useDispatch();

  useEffect(() => {
    new LiftDefRepository(dispatch).init();
  }, []);

  return (
    <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <HeaderButtonsProvider stackType={'native'}>
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
            options={() => ({
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
            name="Stats"
            options={{
              headerStyle: styles.headerStyle,
            }}
            component={StatsScreen}
          />
          <Stack.Screen
            name="Settings"
            options={{
              headerStyle: styles.headerStyle,
            }}
            component={SettingsScreen}
          />
          <Stack.Screen
            name="Routines"
            options={{
              headerStyle: styles.headerStyle,
            }}
            component={RoutinesScreen}
          />
          <Stack.Screen
            name="LiftHistory"
            options={() => ({
              headerStyle: styles.headerStyle,
              title: 'TODO',
            })}
            component={LiftHistoryScreen}
          />
          <Stack.Screen
            name="WorkoutHistory"
            options={() => ({
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
            name="WorkoutEdit"
            options={{
              title: 'Edit Workout',
              headerStyle: styles.headerStyle,
            }}
            component={WorkoutEditScreen}
          />
          <Stack.Screen
            name="LiftDefList"
            options={{
              title: 'Lift Definitions',
              headerStyle: styles.headerStyle,
            }}
            component={LiftDefListScreen}
          />
        </Stack.Navigator>
      </HeaderButtonsProvider>
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
