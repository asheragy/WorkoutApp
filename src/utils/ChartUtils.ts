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

export type ProgressByWeek = {dates: Date[]} & Record<string, number[]>;

export default class ChartUtils {
  public static async getProgressByWeek(
    routine: string,
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
          week.lifts[liftId] = 0;
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
            if (lift.muscleGroups[0] == currGroup) {
              weight += 1;
              sum += percent;
            } else {
              weight += 0.5;
              sum += percent / 2;
            }
          });

          if (weight == 0) {
            console.log('  ' + key + ' 0');
            arr.push(0);
          } else {
            console.log('  ' + key + ' ' + sum / weight);
            arr.push((100 * sum) / weight);
          }
        }
      });
    });

    return result;
  }

  private static async getLiftsByWeek(routine: string): Promise<LiftsByWeek[]> {
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
