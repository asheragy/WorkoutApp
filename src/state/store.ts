import { GlobalSettings, LiftDef } from '../core/types/types';
import { DEFAULT_ROUTINE } from '../core/types/workout';
import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useSelector } from 'react-redux';

interface UpdateLiftDefAction {
  type: 'UPDATE_LIFTDEFS';
  payload: Record<string, LiftDef>;
}

interface UpdateSettingsAction {
  type: 'UPDATE_SETTINGS';
  payload: GlobalSettings;
}

export const updateLiftDefs = (liftDefs: Record<string, LiftDef>) =>
  <UpdateLiftDefAction>{
    type: 'UPDATE_LIFTDEFS',
    payload: liftDefs,
  };

export const updateSettings = (settings: GlobalSettings) =>
  <UpdateSettingsAction>{
    type: 'UPDATE_SETTINGS',
    payload: settings,
  };

export interface AppState {
  settings: GlobalSettings;
  liftDefs: Record<string, LiftDef>;
}

const initialState: AppState = {
  settings: {
    routine: DEFAULT_ROUTINE,
  },
  liftDefs: {},
};

export type AppAction = UpdateLiftDefAction | UpdateSettingsAction;

const rootReducer = (state = initialState, action: AppAction): AppState => {
  switch (action.type) {
    case 'UPDATE_SETTINGS':
      return { ...state, settings: action.payload };
    case 'UPDATE_LIFTDEFS':
      return { ...state, liftDefs: action.payload };
    default:
      return state;
  }
};

export const store = configureStore({ reducer: rootReducer });
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
