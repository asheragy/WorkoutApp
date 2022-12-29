import {Lift, LiftSet} from '../types/types';

export default class Log {
  static lift(lift: Lift) {
    var sets = lift.sets.map(
      set => set.weight + 'x' + set.reps + (set.warmup == true ? ' W' : ''),
    );

    console.log(lift.def.name + ': ' + sets.join(', '));
  }
}
