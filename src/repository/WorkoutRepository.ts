import AsyncStorage from '@react-native-async-storage/async-storage';
import {Lift, SingleWorkoutId, Workout} from '../types/workout';
import Utils from '../components/Utils';
import {PreLoadedRoutines} from './RoutineRepository.ts';

const key = 'workouts';

export default class WorkoutRepository {
  static async get(id: string): Promise<Workout | undefined> {
    const workouts = await this.getAll();
    return workouts.find(x => x.id == id);
  }

  static async getRoutine(
    routine: string | undefined,
    importLifts?: boolean,
  ): Promise<Workout[]> {
    const all = await this.getAll();
    if (routine && all.filter(x => x.routineId == routine).length == 0) {
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

    const workouts = all.filter(
      x => x.routineId == routine || x.id == SingleWorkoutId,
    );

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
    for (const lift of workout.lifts) {
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
        lift.sets = recentLift.sets;
        lift.goals = recentLift.goals;
        updated = true;
      }
    }

    if (updated) {
      await this.upsert(workout);
    }

    return workout;
  }

  private static async getAll(): Promise<Workout[]> {
    const value = await AsyncStorage.getItem(key);
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

  static async upsert(workout: Workout) {
    if (workout.id == undefined) await this.insert(workout);
    else await this.update(workout);
  }

  static async delete(workout: Workout) {
    if (workout.id) await this.deleteById(workout.id);
  }

  static async deleteById(workoutId: String) {
    let items = await this.getAll();
    const index = items.findIndex(item => item.id == workoutId);
    if (index < 0) throw new Error('Unable to find id ' + workoutId);

    items = items.filter(x => x.id != workoutId);
    await AsyncStorage.setItem(key, JSON.stringify(items));
  }

  private static async insert(workout: Workout) {
    await this.insertAll([workout]);
  }

  private static async insertAll(workouts: Workout[]) {
    const withIds = workouts.map(x => {
      return {
        ...x,
        id: Utils.generate_uuidv4(),
      };
    });

    const items = await this.getAll();
    items.push(...withIds);

    await AsyncStorage.setItem(key, JSON.stringify(items));
  }

  private static async update(workout: Workout) {
    const items = await this.getAll();
    const index = items.findIndex(item => item.id == workout.id);

    if (index >= 0) items[index] = workout;
    else if (workout.id == SingleWorkoutId) items.push(workout);
    else throw new Error('Unable to find workout id ' + workout.id);

    await AsyncStorage.setItem(key, JSON.stringify(items));
  }
}

function findPreloaded(routineId: string): Workout[] {
  const result = PreLoadedRoutines.find(x => x[0].id == routineId);
  if (result) return result[1];

  return [];
}
