import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_ROUTINE, Workout } from '../types/workout';
import Utils from '../components/Utils';
import { PreLoadedRoutines } from './RoutineRepository.ts';
import { db, dbReady } from './db.ts';

export type CompletedWorkout = {
  workoutId: string;
  timestamp: Date;
};

// Shape of data_json: everything on Workout except the columns, with the
// Date flattened to epoch ms so it survives JSON round trips.
type WorkoutData = Omit<Workout, 'id' | 'routineId' | 'lastCompleted'> & {
  lastCompleted?: number;
};

export default class WorkoutRepository {
  static async getRoutine(
    routine: string,
    importLifts?: boolean,
  ): Promise<Workout[]> {
    const workouts = await this.getAllByRoutine(routine);
    // eslint-disable-next-line no-constant-condition
    if (true) {
      console.log('Temporary block until migration is done');
    } else if (workouts.length == 0) {
      const preloaded = findPreloaded(routine);
      if (preloaded.length > 0) {
        console.log(`Saving predefined routine ${routine}`);
        const workouts: Workout[] = preloaded.map(x => {
          return {
            ...x,
            routineId: routine,
          };
        });

        await this.insertAll(workouts);
        return this.getRoutine(routine, importLifts);
      }
    }

    /* TODO this should work but handling per workout for now
    if (importLifts) {
      console.log('Importing lifts to latest');
      for (const workout of workouts) {
        Actually this returns a modified workout which needs to be replaced here
        await this.importLatestLiftsInternal(workout, all);
      }
    }
     */

    return workouts;
  }

  static async importLatestLifts(workout: Workout): Promise<Workout> {
    const all = await this.getAll();
    return await this.importLatestLiftsInternal(workout, all);
  }

  private static async importLatestLiftsInternal(
    workout: Workout,
    allWorkouts: Workout[],
  ): Promise<Workout> {
    let updated = false;
    const updatedLifts = workout.lifts.map(lift => {
      const recentWorkoutWithLift = allWorkouts
        .filter(
          wo =>
            wo.lastCompleted &&
            wo.lifts.some(l => l.id === lift.id && l.sets.length > 0),
        )
        .sort(
          (a, b) => b.lastCompleted!!.getTime() - a.lastCompleted!!.getTime(),
        )[0];

      if (recentWorkoutWithLift && recentWorkoutWithLift.id !== workout.id) {
        const recentLift = recentWorkoutWithLift.lifts.find(
          x => x.id === lift.id,
        )!!;
        updated = true;

        return {
          ...lift,
          sets: recentLift.sets.map(set => ({ ...set })),
          goals: recentLift.goals?.map(goal => ({ ...goal })),
        };
      }

      return lift;
    });

    const updatedWorkout = updated
      ? {
          ...workout,
          lifts: updatedLifts,
        }
      : workout;

    if (updated) {
      await this.upsert(updatedWorkout);
    }

    return updatedWorkout;
  }

  static async upsert(workout: Workout) {
    if (workout.id == undefined) await this.insert(workout);
    else await this.update(workout);
  }

  static async listCompletedWorkouts(): Promise<CompletedWorkout[]> {
    await dbReady();

    const rows = await db.executeRaw(
      `
        SELECT workout_id, timestamp
        FROM lift_history
        GROUP BY workout_id, timestamp
        ORDER BY timestamp ASC
      `,
      [],
    );

    return rows.map(row => ({
      workoutId: row[0],
      timestamp: new Date(row[1]),
    }));
  }

  private static async insert(workout: Workout) {
    await this.insertAll([workout]);
  }

  // ----- Database layer only -----

  static async get(id: string): Promise<Workout | undefined> {
    await dbReady();

    const rows = await db.executeRaw(
      'SELECT id, routine_id, data_json FROM workouts WHERE id = ?',
      [id],
    );
    if (rows.length == 0) return undefined;

    return this.fromRow(rows[0]);
  }

  static async deleteById(workoutId: string) {
    await dbReady();

    const result = await db.execute('DELETE FROM workouts WHERE id = ?', [
      workoutId,
    ]);
    if (result.rowsAffected == 0)
      throw new Error('Unable to find id ' + workoutId);
  }

  private static async getAllByRoutine(routine: string): Promise<Workout[]> {
    await dbReady();

    const rows = await db.executeRaw(
      'SELECT id, routine_id, data_json FROM workouts WHERE routine_id = ?',
      [routine],
    );

    return rows.map(row => this.fromRow(row));
  }

  private static async getAll(): Promise<Workout[]> {
    await dbReady();

    const rows = await db.executeRaw(
      'SELECT id, routine_id, data_json FROM workouts',
    );

    return rows.map(row => this.fromRow(row));
  }

  // Temporary needed to stay for migrations. Inserts the workouts as-is,
  // keeping the existing ids so lift_history.workout_id still matches.
  // Refuses to run if the table already has rows so it cannot double-insert.
  static async insertForMigration(workouts: Workout[]): Promise<number> {
    await dbReady();

    const rows = await db.executeRaw('SELECT COUNT(*) FROM workouts');
    const existing = Number(rows[0][0]);
    if (existing > 0)
      throw new Error(`workouts table already has ${existing} rows`);

    const now = Date.now();
    await db.transaction(async tx => {
      for (const workout of workouts) {
        await tx.execute(
          `INSERT INTO workouts (id, routine_id, data_json, updated_at)
           VALUES (?, ?, ?, ?)`,
          [
            workout.id ?? Utils.generate_uuidv4(),
            workout.routineId ?? DEFAULT_ROUTINE,
            this.toDataJson(workout),
            now,
          ],
        );
      }
    });

    return workouts.length;
  }

  // Temporary needed to stay for migrations
  static async getAllAsyncStorage(): Promise<Workout[]> {
    const value = await AsyncStorage.getItem('workouts');
    if (value == null) return [];

    let json: Workout[] = JSON.parse(value);

    // Fix deserialized date
    json = json.map(wo => {
      const result: Workout = {
        ...wo,
        lastCompleted: wo.lastCompleted
          ? new Date(wo.lastCompleted)
          : undefined,
      };
      return result;
    });

    return json;
  }

  private static async update(workout: Workout) {
    await dbReady();

    const result = await db.execute(
      `UPDATE workouts
       SET routine_id = ?, data_json = ?, updated_at = ?
       WHERE id = ?`,
      [workout.routineId, this.toDataJson(workout), Date.now(), workout.id!],
    );

    if (result.rowsAffected == 0)
      throw new Error('Unable to find workout id ' + workout.id);
  }

  private static async insertAll(workouts: Workout[]) {
    await dbReady();

    const now = Date.now();
    await db.transaction(async tx => {
      for (const workout of workouts) {
        await tx.execute(
          `INSERT INTO workouts (id, routine_id, data_json, updated_at)
           VALUES (?, ?, ?, ?)`,
          [
            Utils.generate_uuidv4(),
            workout.routineId,
            this.toDataJson(workout),
            now,
          ],
        );
      }
    });
  }

  private static toDataJson(workout: Workout): string {
    // id and routineId are stored in their own columns
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, routineId, lastCompleted, ...rest } = workout;
    const data: WorkoutData = {
      ...rest,
      lastCompleted: lastCompleted?.getTime(),
    };

    return JSON.stringify(data);
  }

  private static fromRow(row: unknown[]): Workout {
    const [id, routineId, dataJson] = row;
    const data: WorkoutData = JSON.parse(dataJson as string);

    return {
      ...data,
      id: id as string,
      routineId: routineId as string,
      lastCompleted:
        data.lastCompleted != undefined
          ? new Date(data.lastCompleted)
          : undefined,
    };
  }
}

function findPreloaded(routineId: string): Workout[] {
  const result = PreLoadedRoutines.find(x => x[0].id == routineId);
  if (result) return result[1];

  return [];
}
