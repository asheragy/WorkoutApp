import AsyncStorage from '@react-native-async-storage/async-storage';
import {WorkoutNode} from '../types/workout';
import Utils from '../components/Utils';

const key = 'workouts';

export default class WorkoutRepository {
  static async getAll(): Promise<WorkoutNode[]> {
    const value = await AsyncStorage.getItem(key);
    if (value == null) return [];

    return JSON.parse(value);
  }

  static async upsert(workout: WorkoutNode) {
    if (workout.id == undefined) await this.insert(workout);
    else await this.update(workout);
  }

  private static async insert(workout: WorkoutNode) {
    workout.id = Utils.generate_uuidv4();

    var items = await this.getAll();
    items.push(workout);

    await AsyncStorage.setItem(key, JSON.stringify(items));
  }

  private static async update(workout: WorkoutNode) {
    var items = await this.getAll();
    var index = items.findIndex(item => item.id == workout.id);
    if (index < 0) throw new Error('Unable to find id ' + workout.id);

    items[index] = workout;
    await AsyncStorage.setItem(key, JSON.stringify(items));
  }
}
