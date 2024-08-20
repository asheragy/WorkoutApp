import AsyncStorage from '@react-native-async-storage/async-storage';
import {SingleWorkoutId, Workout} from '../types/workout';
import Utils from '../components/Utils';

const key = 'workouts';

export default class WorkoutRepository {
  static async get(id: string): Promise<Workout | undefined> {
    const workouts = await this.getAll();
    return workouts.find(x => x.id == id);
  }

  static async getAll(): Promise<Workout[]> {
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
    let items = await this.getAll();
    const index = items.findIndex(item => item.id == workout.id);
    if (index < 0) throw new Error('Unable to find id ' + workout.id);

    items = items.filter(x => x.id != workout.id);
    await AsyncStorage.setItem(key, JSON.stringify(items));
  }

  private static async insert(workout: Workout) {
    workout.id = Utils.generate_uuidv4();

    const items = await this.getAll();
    items.push(workout);

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
