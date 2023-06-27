import {Lift} from '../types/workout';

export default class Log {
  static lift(lift: Lift) {
    var sets = lift.sets.map(
      set => set.weight + 'x' + set.reps + (set.warmup == true ? ' W' : ''),
    );

    // TODO pass def so name can be logged
    console.log(lift.id + ': ' + sets.join(', '));
  }
}
