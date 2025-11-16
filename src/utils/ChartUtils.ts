import {LiftDef, MuscleGroup} from '../types/types.ts';
import LiftHistoryRepository, {
  LiftHistory,
} from '../repository/LiftHistoryRepository.ts';
import Utils from '../components/Utils.ts';
export type ProgressByWeek = Record<string, number[]> & {
  dates: Date[];
};

export type HistoryEntry = {
  value: number; // 1RM
  timestamp: Date;
};

export default class ChartUtils {
  public static async getProgressByGroup(
    group: MuscleGroup,
    defs: Record<string, LiftDef>,
  ): Promise<number[]> {
    const ids = (await LiftHistoryRepository.listKeys()).filter(key =>
      defs[key].muscleGroups.includes(group),
    );
    const result = new Map<string, HistoryEntry[]>();

    for (const id of ids) {
      const history: LiftHistory[] = await LiftHistoryRepository.get(id);
      history.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
      const mapped: HistoryEntry[] = history.map(x => {
        return {
          timestamp: x.timestamp,
          value: Utils.calculate1RMAverage(defs[id], x.sets),
        };
      });

      result.set(id, mapped);
    }

    return this.toProgressByWeek(group, result, defs);
  }

  public static toProgressByWeek(
    group: MuscleGroup,
    entries: Map<string, HistoryEntry[]>,
    defs: Record<string, LiftDef>,
  ): number[] {
    const startDate = new Date(
      Math.min(
        ...Array.from(entries.values()).map(x => x[0].timestamp.getTime()),
      ),
    );
    const endDate = new Date(
      Math.max(
        ...Array.from(entries.values()).map(x =>
          x[x.length - 1].timestamp.getTime(),
        ),
      ),
    );

    const weekArrays = new Map<string, number[]>();

    for (const [key, arr] of entries) {
      let currPeriodStart = new Date(startDate);
      const currPeriodEnd = new Date(startDate);
      currPeriodEnd.setDate(currPeriodEnd.getDate() + 14);

      let pos = 0;
      const weekArray: number[] = [];

      while (currPeriodStart < endDate) {
        let sum = 0;
        let count = 0;
        while (pos < arr.length && arr[pos].timestamp < currPeriodEnd) {
          sum += arr[pos].value;
          count++;

          pos++;
        }

        weekArray.push(sum / count);

        currPeriodStart.setDate(currPeriodStart.getDate() + 7);
        currPeriodEnd.setDate(currPeriodEnd.getDate() + 7);
      }

      // Convert average 1RM -> percent increase
      let start = weekArray[0];
      weekArray[0] = 0;
      for (let i = 1; i < weekArray.length; i++) {
        const curr = weekArray[i];
        if (isNaN(start)) {
          start = curr;
          weekArray[i] = 0;
        } else {
          weekArray[i] = (curr - start) / start;
        }
      }

      weekArrays.set(key, weekArray);
    }

    // Average all arrays
    const result = [0];
    const length = weekArrays.values().next().value.length;

    for (let i = 1; i < length; i++) {
      let count = 0;
      let sum = 0;

      for (const [key, arr] of weekArrays) {
        const def = defs[key];
        const weight = def.muscleGroups[0] == group ? 2 : 1;

        if (!isNaN(arr[i])) {
          count += weight;
          sum += arr[i] * weight;
        }
      }

      result.push(sum / count);
    }

    return result.filter(x => !isNaN(x));
  }
}
