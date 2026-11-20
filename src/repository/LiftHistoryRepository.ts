import { LiftDef } from '../core/types/types';
import { LiftSet, PersistedSet, Workout } from '../core/types/workout';
import { db, LiftHistoryTableSchema } from './db.ts';
import { Scalar } from '@op-engineering/op-sqlite';
import LiftUtils from '../core/utils/LiftUtils.ts';
import SetUtils from '../core/utils/SetUtils.ts';

export type LiftHistory = {
  timestamp: Date;
  workoutId: string;
  sets: PersistedSet[];
};

export type WorkoutHistory = {
  timestamp: Date;
  lifts: {
    liftId: string;
    sets: PersistedSet[];
  }[];
};

export type CompletedWorkoutHistory = WorkoutHistory & {
  workoutId: string;
};

type Row = {
  liftId: string;
  workoutId: string;
  timestamp: Date;
  position: number;
  sets: PersistedSet[];
};

export default class LiftHistoryRepository {
  static async listKeys(): Promise<string[]> {
    const { rawRows: rows } = await db.executeRaw(
      `SELECT distinct lift_id FROM lift_history`,
      [],
    );

    return rows.map(row => row[0] as string);
  }

  static async get(key: string): Promise<LiftHistory[]> {
    const { rawRows: rows } = await db.executeRaw(
      `SELECT * FROM lift_history WHERE lift_id = ?`,
      [key],
    );

    return (rows as LiftHistoryTableSchema[]).map(row => {
      return {
        workoutId: row[1],
        timestamp: new Date(row[2]),
        sets: JSON.parse(row[4]),
      };
    });
  }

  static async getWorkoutHistory(workoutId: string): Promise<WorkoutHistory[]> {
    const rows = await this.query(
      `SELECT * FROM lift_history WHERE workout_id = ?`,
      [workoutId],
    );

    const workoutsByDate = rows.reduce<Record<number, Row[]>>((acc, row) => {
      const key = row.timestamp.getTime();
      if (!acc[key]) acc[key] = [];
      acc[key].push(row);
      return acc;
    }, {});

    const dates = Object.keys(workoutsByDate)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
      .map(Number);

    return dates.map(date => {
      const lifts = workoutsByDate[date]
        .sort((a, b) => a.position - b.position)
        .map(lift => {
          return {
            liftId: lift.liftId,
            sets: lift.sets,
          };
        });

      return {
        timestamp: new Date(date),
        lifts: lifts,
      };
    });
  }

  // Most recent completed workouts across all routines, newest first
  static async getRecentWorkouts(
    limit: number,
  ): Promise<CompletedWorkoutHistory[]> {
    // A completed workout writes all of its lifts with the same timestamp
    const { rawRows } = await db.executeRaw(
      `SELECT * FROM lift_history
       WHERE timestamp IN (
         SELECT DISTINCT timestamp FROM lift_history
         ORDER BY timestamp DESC LIMIT ?
       )
       ORDER BY timestamp DESC, position ASC`,
      [limit],
    );

    const result: CompletedWorkoutHistory[] = [];
    for (const rawRow of rawRows) {
      const row = this.getRow(rawRow as LiftHistoryTableSchema);
      let last = result[result.length - 1];

      if (
        last == undefined ||
        last.timestamp.getTime() != row.timestamp.getTime()
      ) {
        last = {
          workoutId: row.workoutId,
          timestamp: row.timestamp,
          lifts: [],
        };
        result.push(last);
      }

      last.lifts.push({ liftId: row.liftId, sets: row.sets });
    }

    return result;
  }

  private static async query(query: string, params?: Scalar[]): Promise<Row[]> {
    try {
      const { rawRows: rows } = await db.executeRaw(query, params);
      console.log(rows);
      return rows.map(row => this.getRow(row as LiftHistoryTableSchema));
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  private static getRow(row: LiftHistoryTableSchema): Row {
    return {
      liftId: row[0],
      workoutId: row[1],
      timestamp: new Date(row[2]),
      position: row[3],
      sets: JSON.parse(row[4]),
    };
  }

  static async addWorkout(workout: Workout, defs: Record<string, LiftDef>) {
    const timestamp = new Date();
    const key = workout.id!;
    const lifts = LiftUtils.flatten(workout.items).filter(
      lift => lift.sets.find(set => set.completed) != undefined,
    );

    for (let i = 0; i < lifts.length; i++) {
      const lift = lifts[i];
      const def = defs[lift.id];
      await this.add(def, lift.sets, timestamp, key, i);
    }
  }

  static async add(
    def: LiftDef,
    sets: LiftSet[],
    timestamp: Date,
    workoutId: string,
    position: number,
  ) {
    const persistedSets = LiftHistoryRepository.setsToPersisted(sets);

    await this.addHistorySql(
      def.id,
      workoutId,
      timestamp,
      position,
      persistedSets,
    );
  }

  private static setsToPersisted(sets: LiftSet[]): PersistedSet[] {
    const filtered = sets.filter(x => x.completed);

    if (sets.length != filtered.length) console.log('Filtered out lifts');

    return SetUtils.setsToPersisted(filtered);
  }

  private static async addHistorySql(
    liftId: string,
    workoutId: string,
    timestamp: Date,
    position: number,
    sets: PersistedSet[],
  ): Promise<void> {
    // Sql version

    try {
      await db.execute(
        'INSERT INTO lift_history (lift_id, workout_id, timestamp, position, sets_json) VALUES (?,?,?,?,?);',
        [
          liftId,
          workoutId,
          timestamp.getTime(),
          position,
          JSON.stringify(sets),
        ],
      );
    } catch (err) {
      console.error('Insert failed:', err);
      throw err;
    }
  }
}
