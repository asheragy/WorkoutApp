import {GlobalSettings} from '../types/types';

export const SettingsAction_Update = 'UPDATE';

export const updateSettings = (settings: GlobalSettings) => ({
  type: SettingsAction_Update,
  payload: settings,
});
