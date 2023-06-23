import {Reducer} from 'react';
import {GlobalSettings} from '../types/types';
import {AppAction} from './store';

/** Action */

export interface UpdateSettingsAction {
  type: 'UPDATE_SETTINGS';
  payload: GlobalSettings;
}

export const updateSettings = (settings: GlobalSettings) =>
  <UpdateSettingsAction>{
    type: 'UPDATE_SETTINGS',
    payload: settings,
  };

/** Reducer */

const INITIAL_STATE: GlobalSettings = {};

export const settingsReducer = (
  state = INITIAL_STATE,
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
