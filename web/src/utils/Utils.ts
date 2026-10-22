import { LiftDef, LiftType } from '@shared/types/types.ts';

export default class Utils {
  // Step used by the weight input's native spinner / arrow keys.
  // Simpler than SetUtils.incrementWeight for now: barbell 5, everything else 2.5.
  static weightStep(def: LiftDef): number {
    if (def.type == LiftType.Barbell || def.type == LiftType.MachinePlateDouble)
      return 5;

    return 2.5;
  }
}
