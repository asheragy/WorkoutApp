import {Lift} from '../types/workout';

export default class Log {
  static lift(lift: Lift) {
    var sets = lift.sets.map(
      set => set.weight + 'x' + set.reps + (set.warmup == true ? ' W' : ''),
    );

    // TODO pass def so name can be logged
    let line = lift.id + ': ' + sets.join(', ');
    if (lift.hide)
      line += " (hidden)"
    console.log(line);
  }
}
