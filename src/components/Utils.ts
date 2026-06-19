import { LiftDef, LiftType } from '../types/types';
import uuid from 'react-native-uuid';

export default class Utils {
  static round(x: number): number {
    return Math.round(x / 5) * 5;
  }

  static defToString(def: LiftDef) {
    if (def == undefined) return '';
    let result = def.name;

    if (def.multiple && def.type != LiftType.Bodyweight) {
      const type = LiftType[def.type]
        .replaceAll(LiftType[LiftType.MachinePlateSingle], 'Plate-Loaded')
        .replaceAll(LiftType[LiftType.MachinePlateDouble], 'Plate-Loaded')
        .replaceAll(LiftType[LiftType.MachineStack], 'Stack Machine');

      result += ` (${type})`;
    }

    return result;
  }

  static generate_uuidv4(): string {
    return uuid.v4();
  }

  static lastCompleted(date: Date | undefined): string {
    if (date == undefined) return 'Never';

    const hour = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hour >= 12 ? 'pm' : 'am';

    return `${date.getMonth() + 1}/${date.getDate()} at ${hour % 12}:${
      minutes > 9 ? minutes : '0' + minutes
    }${ampm}`;
  }
}
