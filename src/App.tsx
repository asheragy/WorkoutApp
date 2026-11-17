import React, { useEffect } from 'react';
import { Platform, StyleSheet, useColorScheme } from 'react-native';
import { WorkoutScreen } from './screens/WorkoutScreen';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  NavigatorScreenParams,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LiftDef } from './core/types/types';
import { Provider, useDispatch } from 'react-redux';
import { LiftHistoryScreen } from './screens/LiftHistory/LiftHistoryScreen';
import { LiftDefEditScreen } from './screens/LiftDefEditScreen';
import { WorkoutEditScreen } from './screens/WorkoutEditScreen';
import { HomeTabParamList, HomeTabs } from './screens/HomeTabs';
import { Lift } from './core/types/workout';
import { LiftsScreen } from './screens/LiftsScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { WorkoutHistoryScreen } from './screens/WorkoutHistoryScreen';
import LiftDefRepository from './repository/LiftDefRepository';
import { dbReady } from './repository/db.ts';
import { MenuProvider } from 'react-native-popup-menu';
import { RoutinesScreen } from './screens/Routines';
import { store } from './state/store.ts';
import LiftEditScreen from './screens/LiftEditScreen.tsx';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { HeaderButtonsProvider } from 'react-navigation-header-buttons/HeaderButtonsProvider';

export type RootStackParamList = {
  Home: NavigatorScreenParams<HomeTabParamList>;
  Workout: {
    workoutId: string;
  };
  LiftEdit: {
    workoutId: string;
    lift: Lift;
  };
  Weight: undefined;
  LiftChart: {
    lift: LiftDef;
  };
  LiftHistory: {
    liftId: string;
  };
  WorkoutHistory: {
    workoutId: string;
  };
  LiftDefEdit: {
    def?: LiftDef;
  };
  Lifts: {
    // TODO no function parameters
    // Params must be serializable; a callback triggers the "Non-serializable values were found in the navigation state" warning and breaks state persistence / deep links.
    // Only one caller passes it: WorkoutEditScreen.onSelectExercise -> LiftsScreen.onEdit.
    // Scope (3 files), using the documented "pass params back" pattern:
    // - Here: replace with a plain flag, e.g. Lifts: { select?: boolean }, and add WorkoutEdit: { workoutId?: string; selectedDefId?: string }
    // - LiftsScreen: isSelection reads the flag; on select, instead of onSelect(id) + pop(), return the id to the previous screen with
    //   navigation.popTo('WorkoutEdit', { selectedDefId }, { merge: true }) (merge is needed so workoutId is kept; check the v7 signature)
    // - WorkoutEditScreen: useEffect on route.params.selectedDefId calls onExerciseAdded, then setParams({ selectedDefId: undefined }) so picking the same lift twice in a row still fires
    // If a second screen ever needs the picker, LiftsScreen would have to take the return route name as a param instead of hardcoding it.
    onSelect?: (defId: string) => void;
  };
  WorkoutEdit: {
    workoutId?: string;
  };
  Settings: undefined;
  Routines: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <Provider store={store}>
      <MenuProvider>
        <SafeAreaProvider>
          <AppRoot></AppRoot>
        </SafeAreaProvider>
      </MenuProvider>
    </Provider>
  );
};

const AppRoot = () => {
  const scheme = useColorScheme();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    console.log(Platform.constants.reactNativeVersion);

    // Run pending migrations before anything hits a repository
    dbReady().then(() => new LiftDefRepository(dispatch).init());
  }, []);

  return (
    <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <HeaderButtonsProvider stackType={'native'} spaceAboveMenu={insets.top}>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeTabs}
            // Each tab draws its own header
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Workout"
            options={() => ({
              headerStyle: styles.headerStyle,
            })}
            component={WorkoutScreen}
          />
          <Stack.Screen
            name="LiftEdit"
            options={() => ({
              headerStyle: styles.headerStyle,
            })}
            component={LiftEditScreen}
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
              title: 'Lift History',
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
            name="Lifts"
            options={{
              title: 'Lifts',
              headerStyle: styles.headerStyle,
            }}
            component={LiftsScreen}
          />
          <Stack.Screen
            name="Settings"
            options={{
              headerStyle: styles.headerStyle,
            }}
            component={SettingsScreen}
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
