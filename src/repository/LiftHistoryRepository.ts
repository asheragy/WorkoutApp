import {LiftDef, PersistedSet} from '../types/types';
import {LiftSet, Workout} from '../types/workout';
import Utils from '../components/Utils';
import {db} from './db.ts';

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

type Row = {
  liftId: string;
  workoutId: string;
  timestamp: Date;
  position: number;
  sets: PersistedSet[];
};

export default class LiftHistoryRepository {
  static async listKeys(): Promise<string[]> {
    const rows = await db.executeRaw(
      `SELECT distinct lift_id FROM lift_history`,
      [],
    );

    return rows.map(row => row[0]);
  }

  static async get(key: string): Promise<LiftHistory[]> {
    const rows = await db.executeRaw(
      `SELECT * FROM lift_history WHERE lift_id = ?`,
      [key],
    );

    return rows.map(row => {
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

  private static async query(query: string, params?: any[]): Promise<Row[]> {
    try {
      const rows = await db.executeRaw(query, params);
      console.log(rows);
      return rows.map(row => this.getRow(row));
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  private static getRow(row: any[]): Row {
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
    const lifts = workout.lifts.filter(
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
    if (
      sets.filter(x => x.percentage).length > 0 &&
      def.trainingMax == undefined
    ) {
      console.error('Training max required for persisted lift');
    }

    var persistedSets = LiftHistoryRepository.setsToPersisted(sets, def);

    await this.addHistorySql(
      def.id,
      workoutId,
      timestamp,
      position,
      persistedSets,
    );
  }

  private static setsToPersisted(
    sets: LiftSet[],
    def: LiftDef,
  ): PersistedSet[] {
    var filtered = sets
      .filter(x => x.reps != undefined && x.weight != undefined)
      .filter(x => x.completed);

    if (sets.length != filtered.length) console.log('Filtered out lifts');

    return filtered.map(set => {
      var weight = set.weight!!;
      if (set.percentage) {
        if (def.trainingMax !== undefined)
          weight = Utils.calcPercentage(weight, def.trainingMax);
        else weight = -1;
      }

      var res: PersistedSet = {
        weight: weight,
        reps: set.reps!!,
        warmup: set.warmup || false,
      };

      return res;
    });
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
