import AsyncStorage from '@react-native-async-storage/async-storage';
import { LiftDef } from '../types/types';
import Utils from '../components/Utils';
import { SystemLifts } from './LiftDatabase';
import { AppDispatch, updateLiftDefs } from '../state/store.ts';
import { dbReady } from './db.ts';

const key = 'liftdefs';

export default class LiftDefRepository {
  private readonly dispatch: AppDispatch;

  constructor(dispatch: AppDispatch) {
    this.dispatch = dispatch;
  }

  async init(): Promise<void> {
    await dbReady(); // 1 of 2 locations to ensure db is initialized

    const data = await LiftDefRepository.getLookupMap();
    this.dispatch(updateLiftDefs(data));
  }

  async upsert(def: LiftDef): Promise<LiftDef> {
    if (def.id.length == 0) return await this.insert(def);
    else return await this.update(def);
  }

  async delete(id: string) {
    let items = await LiftDefRepository.getAll();
    items = items.filter(item => item.id != id);

    await AsyncStorage.setItem(key, JSON.stringify(items));
    await this.init();
  }

  private async insert(def: LiftDef): Promise<LiftDef> {
    const defToInsert: LiftDef = {
      ...def,
      id: Utils.generate_uuidv4(),
    };

    const items = await LiftDefRepository.getAll();
    items.push(defToInsert);

    await AsyncStorage.setItem(key, JSON.stringify(items));
    await this.init();

    return defToInsert;
  }

  private async update(def: LiftDef): Promise<LiftDef> {
    const persistedDef: LiftDef = {
      ...def,
    };
    delete persistedDef.multiple; // Not persisted

    let items = await LiftDefRepository.getAll();
    let index = items.findIndex(item => item.id == persistedDef.id);

    if (index < 0) {
      // Editing new systemDef for first time, add to list
      let systemDef = SystemLifts.find(item => item.id == persistedDef.id);
      if (!systemDef)
        throw new Error(
          `Unable to find def '${persistedDef.id}', this should never happen `,
        );

      items.push(persistedDef);
    } else {
      items[index] = persistedDef;
    }

    // Don't save system lifts that are unmodified
    const savedItems = items.filter(curr => {
      let systemDef = SystemLifts.find(sys => sys.id == curr.id);

      if (systemDef) {
        if (
          (curr.trainingMax === undefined || curr.trainingMax == 0) &&
          JSON.stringify(persistedDef.muscleGroups) ===
            JSON.stringify(systemDef.muscleGroups) &&
          JSON.stringify(persistedDef.goal) === JSON.stringify(systemDef.goal)
        )
          return false;
      }

      return true;
    });

    console.log(`Read ${items.length}, saving ${savedItems.length}`);

    await AsyncStorage.setItem(key, JSON.stringify(savedItems));
    await this.init();

    return persistedDef;
  }

  static async getAll(): Promise<LiftDef[]> {
    const value = await AsyncStorage.getItem(key);
    if (value == null) return [];

    return JSON.parse(value);
  }

  private static async getLookupMap(): Promise<Record<string, LiftDef>> {
    const customDefs = await this.getAll();
    const result: Record<string, LiftDef> = {};

    customDefs.forEach(def => (result[def.id] = def));
    SystemLifts.forEach(def => {
      if (result[def.id]) {
        // Use hardcoded name for system lifts
        const entry = result[def.id];
        entry.name = def.name;
        // For backwards compatability also type
        entry.type = def.type;
        entry.muscleGroups = def.muscleGroups;

        result[def.id] = entry;
      } else {
        result[def.id] = def;
      }
    });

    const nameMap = new Map<String, number>();
    Object.values(result).forEach(v => {
      let count = nameMap.get(v.name) ?? 0;
      count++;
      nameMap.set(v.name, count);
    });

    Object.values(result).forEach(v => {
      let count = nameMap.get(v.name)!!;
      if (count > 1) v.multiple = true;
    });

    return result;
  }
}
