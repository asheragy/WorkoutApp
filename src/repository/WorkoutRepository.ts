import AsyncStorage from '@react-native-async-storage/async-storage';
import {Workout} from '../types/workout';
import Utils from '../components/Utils';

const key = 'workouts';

export default class WorkoutRepository {
  static async getAll(): Promise<Workout[]> {
    const value = await AsyncStorage.getItem(key);
    if (value == null) return [];

    var json: Workout[] = JSON.parse(value);

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

  private static async insert(workout: Workout) {
    workout.id = Utils.generate_uuidv4();

    var items = await this.getAll();
    items.push(workout);

    await AsyncStorage.setItem(key, JSON.stringify(items));
  }

  private static async update(workout: Workout) {
    var items = await this.getAll();
    var index = items.findIndex(item => item.id == workout.id);
    if (index < 0) throw new Error('Unable to find id ' + workout.id);

    items[index] = workout;
    await AsyncStorage.setItem(key, JSON.stringify(items));
  }
}
