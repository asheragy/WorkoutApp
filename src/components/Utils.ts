import { LiftDef, LiftType } from '../core/types/types';
import uuid from 'react-native-uuid';
import { defToString } from '../core/LiftDatabase.ts';

export default class Utils {
  static round(x: number): number {
    return Math.round(x / 5) * 5;
  }

  // TODO remove
  static defToString(def: LiftDef) {
    return defToString(def);
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
