import WorkoutRepository from '../repository/WorkoutRepository.ts';
import WorkoutHistoryRepository, {
  WorkoutHistory,
} from '../repository/WorkoutHistoryRepository.ts';
import {LiftDef, MuscleGroup} from '../types/types.ts';
import LiftHistoryRepository, {
  LiftHistory,
} from '../repository/LiftHistoryRepository.ts';
import Utils from '../components/Utils.ts';

type LiftsByWeek = {
  // Week start/end
  start: Date;
  end: Date;
  // TODO number used later so should it go here?
  lifts: Record<string, number | undefined>;
};

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

  public static async getProgressByWeek(
    routine: string | undefined,
    defs: Record<string, LiftDef>,
  ): Promise<ProgressByWeek> {
    const weeks = await ChartUtils.getLiftsByWeek(routine);

    const historyCache = new Map<string, LiftHistory[]>();
    // either first 1RM or most recent 1RM depending what percentage indicates
    const baselineRM = new Map<string, number>();

    const getFirstInRange = (history: LiftHistory[], week: LiftsByWeek) => {
      return history.find(
        x =>
          x.timestamp.getTime() >= week.start.getTime() &&
          x.timestamp.getTime() <= week.end.getTime(),
      );
    };

    const getHistory = async (liftId: string) => {
      if (!historyCache.has(liftId)) {
        const lh = await LiftHistoryRepository.get(liftId);
        // Should already be sorted oldest -> newest
        historyCache.set(liftId, lh);
      }
      return historyCache.get(liftId)!;
    };

    for (const week of weeks) {
      for (const liftId of Object.keys(week.lifts)) {
        if (week.lifts[liftId] !== undefined) continue;

        const lh = await getHistory(liftId);
        const entry = getFirstInRange(lh, week);
        if (!entry) {
          continue;
        }

        const currRM = Utils.calculate1RMAverage(defs[liftId], entry.sets);

        if (!baselineRM.has(liftId)) {
          week.lifts[liftId] = NaN;
          baselineRM.set(liftId, currRM);
        } else {
          const base = baselineRM.get(liftId)!;
          week.lifts[liftId] = base === 0 ? 0 : (currRM - base) / base;
        }
      }
    }

    const result: ProgressByWeek = {
      dates: [],
    };

    // Group percentages and average by muscle group
    weeks.forEach((week, index) => {
      console.log('Week: ' + index);

      const liftDefs = Object.keys(week.lifts).map(x => defs[x]);
      result.dates.push(week.start);

      Object.keys(MuscleGroup).forEach(key => {
        if (key === 'Other' || key === 'Abs') return;

        if (isNaN(Number(key))) {
          //console.log('key: ' + key);

          let arr = result[key] ?? [];
          result[key] = arr;

          // @ts-ignore
          const currGroup = MuscleGroup[key];

          const liftsByGroup = liftDefs.filter(def =>
            def.muscleGroups.includes(currGroup),
          );

          let weight = 0;
          let sum = 0;
          liftsByGroup.forEach(lift => {
            const percent = week.lifts[lift.id]!!;
            if (Number.isNaN(percent)) {
              // First entry for this lift so don't include in average
            } else if (lift.muscleGroups[0] == currGroup) {
              weight += 1;
              sum += percent;
            } else {
              weight += 0.5;
              sum += percent / 2;
            }
          });

          if (weight == 0) {
            arr.push(0);
          } else {
            arr.push((100 * sum) / weight);
          }
        }
      });
    });

    return result;
  }

  private static async getLiftsByWeek(
    routine: string | undefined,
  ): Promise<LiftsByWeek[]> {
    const workouts = await WorkoutRepository.getRoutine(routine);
    const historiesByWorkout = await Promise.all(
      workouts.map(async wo => {
        const histories: WorkoutHistory[] = await WorkoutHistoryRepository.get(
          wo.id!!,
        );
        return histories.map(h => ({workoutId: wo.id, history: h}));
      }),
    );

    // Flatten and sort by time
    const entries = historiesByWorkout.flat();
    if (!entries.length) return [];
    entries.sort(
      (a, b) => a.history.timestamp.getTime() - b.history.timestamp.getTime(),
    );

    // A "week" starts every time we see the first workout again.
    const firstWorkoutId = entries[0].workoutId;

    const weeks: LiftsByWeek[] = [];
    let current: LiftsByWeek | null = null;

    for (const {workoutId, history} of entries) {
      const isStartOfNewWeek =
        // No active week → start one
        !current ||
        // Cycle back to first workout → new week
        (workoutId === firstWorkoutId &&
          current.start.getTime() !== history.timestamp.getTime());

      if (isStartOfNewWeek) {
        if (current && Object.keys(current.lifts).length > 0) {
          weeks.push(current);
        }
        current = {
          start: history.timestamp,
          end: history.timestamp,
          lifts: {},
        };
      } else {
        // Still same "week" window; extend the end time
        current!.end = history.timestamp;
      }

      // Collect lifts
      for (const liftId of history.liftIds) {
        current!.lifts[liftId] = undefined;
      }
    }

    if (current && Object.keys(current.lifts).length > 0) {
      weeks.push(current);
    }

    return weeks;
  }
}
