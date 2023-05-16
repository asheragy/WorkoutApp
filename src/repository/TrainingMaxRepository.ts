import AsyncStorage from '@react-native-async-storage/async-storage';
import {TrainingMax} from '../types/types';

const key = 'trainingMax';

export default class TrainingMaxRepository {
  private static instance: TrainingMaxRepository;

  public static getInstance(): TrainingMaxRepository {
    if (!TrainingMaxRepository.instance) {
      TrainingMaxRepository.instance = new TrainingMaxRepository();
    }

    return TrainingMaxRepository.instance;
  }

  async getAll(): Promise<TrainingMax[]> {
    const value = await AsyncStorage.getItem(key);
    if (value == null) return [];

    return JSON.parse(value);
  }

  async get(id: string): Promise<TrainingMax | undefined> {
    var items = await this.getAll();
    return items.find(x => x.id == id);
  }

  async upsert(tm: TrainingMax): Promise<void> {
    // Id is always set so just a matter of finding if it exists already
    var items = await this.getAll();
    var index = items.findIndex(item => item.id == tm.id);
    if (index < 0) {
      items.push(tm);
    } else {
      items[index] = tm;
    }

    await AsyncStorage.setItem(key, JSON.stringify(items));
  }
}
