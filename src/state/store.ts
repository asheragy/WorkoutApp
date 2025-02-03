import {GlobalSettings, LiftDef} from '../types/types';
import {combineReducers} from 'redux';
import {UpdateSettingsAction, settingsReducer} from './settings';
import {UpdateLiftDefAction, liftDefsReducer} from './liftDefs';

export interface AppState {
  settings: GlobalSettings;
  liftDefs: Map<string, LiftDef>;
}

export type AppAction = UpdateLiftDefAction | UpdateSettingsAction;

export const rootReducer = combineReducers({
  settings: settingsReducer,
  liftDefs: liftDefsReducer,
});
