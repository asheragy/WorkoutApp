import {LiftDef} from '../types/types';

/** Action */

export interface UpdateLiftDefAction {
  type: 'UPDATE_LIFTDEFS';
  payload: Map<string, LiftDef>;
}

export const updateLiftDefs = (liftDefs: Map<string, LiftDef>) =>
  <UpdateLiftDefAction>{
    type: 'UPDATE_LIFTDEFS',
    payload: liftDefs,
  };

/** Reducer */

const INITIAL_STATE: Map<string, LiftDef> = new Map<string, LiftDef>();

export const liftDefsReducer = (
  state = INITIAL_STATE,
  action: UpdateLiftDefAction,
) => {
  switch (action.type) {
    case 'UPDATE_LIFTDEFS':
      return action.payload;

    default:
      return state;
  }
};
