import {LiftType, GlobalSettings} from '../types/types';
import {LiftSet} from '../types/workout';

export default class SetUtils {
  static incrementWeight(
    set: LiftSet,
    liftType: LiftType,
    settings: GlobalSettings,
  ): number {
    const current = set.weight || 0;

    var step = 5;
    if (liftType == LiftType.Machine || set.percentage) step = 2.5;
    else if (
      liftType == LiftType.Dumbbell &&
      settings.largestHalfPoundDumbbell != undefined
    ) {
      if (current <= settings.largestHalfPoundDumbbell) step = 2.5;
    }

    return current + step;
  }

  static decrementWeight(
    set: LiftSet,
    liftType: LiftType,
    settings: GlobalSettings,
  ): number {
    const current = set.weight || 0;
    var step = 5;
    if (liftType == LiftType.Machine || set.percentage) step = 2.5;
    else if (
      liftType == LiftType.Dumbbell &&
      settings.largestHalfPoundDumbbell != undefined
    ) {
      if (current <= settings.largestHalfPoundDumbbell) step = 2.5;
      else if (current - 2.5 == settings.largestHalfPoundDumbbell) step = 2.5;
    }

    return current - step;
  }
}
