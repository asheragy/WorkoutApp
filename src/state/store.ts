import {GlobalSettings, LiftDef} from '../types/types';
import {combineReducers} from 'redux';

interface UpdateLiftDefAction {
  type: 'UPDATE_LIFTDEFS';
  payload: Map<string, LiftDef>;
}

export const updateLiftDefs = (liftDefs: Map<string, LiftDef>) =>
  <UpdateLiftDefAction>{
    type: 'UPDATE_LIFTDEFS',
    payload: liftDefs,
  };

const liftDefsReducer = (
  state: Map<string, LiftDef> = new Map<string, LiftDef>(),
  action: UpdateLiftDefAction,
) => {
  switch (action.type) {
    case 'UPDATE_LIFTDEFS':
      return action.payload;

    default:
      return state;
  }
};

interface UpdateSettingsAction {
  type: 'UPDATE_SETTINGS';
  payload: GlobalSettings;
}

export const updateSettings = (settings: GlobalSettings) =>
  <UpdateSettingsAction>{
    type: 'UPDATE_SETTINGS',
    payload: settings,
  };

const settingsReducer = (
  state: GlobalSettings = {},
  action: UpdateSettingsAction,
) => {
  switch (action.type) {
    case 'UPDATE_SETTINGS':
      var result: GlobalSettings = {
        ...action.payload,
      };

      return result;

    default:
      return state;
  }
};

export interface AppState {
  settings: GlobalSettings;
  liftDefs: Map<string, LiftDef>;
}

export type AppAction = UpdateLiftDefAction | UpdateSettingsAction;

export const rootReducer = combineReducers({
  settings: settingsReducer,
  liftDefs: liftDefsReducer,
});
