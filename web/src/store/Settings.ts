import { GlobalSettings } from '@shared/types/types.ts';
import { DEFAULT_ROUTINE } from '@shared/types/workout.ts';

// TODO: phone app defaults (SettingsRepository); move to a shared DEFAULT_SETTINGS.
export const settings: GlobalSettings = {
  routine: DEFAULT_ROUTINE,
  largestHalfPoundDumbbell: 47.5,
  plateCount: true,
  bodyweight: 200,
};
