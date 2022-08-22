import {combineReducers} from 'redux';
import {GlobalSettings} from '../types/types';
import {SettingsAction_Update} from './settingsAction';

const INITIAL_STATE: GlobalSettings = {};

const settingsReducer = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case SettingsAction_Update:
      var result: GlobalSettings = {
        ...action.payload,
      };

      return result;

    default:
      return state;
  }
};

export default combineReducers({
  settings: settingsReducer,
});
