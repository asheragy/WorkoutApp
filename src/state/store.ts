import {Reducer} from 'react';
import {GlobalSettings, LiftDef} from '../types/types';
import {CombinedState, combineReducers} from 'redux';
import {UpdateSettingsAction, settingsReducer} from './settings';
import {UpdateLiftDefAction, liftDefsReducer} from './liftDefs';
import {useStore} from 'react-redux';

export interface AppState {
  settings: GlobalSettings;
  liftDefs: Map<string, LiftDef>;
}

export type AppAction = UpdateLiftDefAction | UpdateSettingsAction;

export const rootReducer = combineReducers({
  settings: settingsReducer,
  liftDefs: liftDefsReducer,
});
