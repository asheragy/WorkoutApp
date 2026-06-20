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

    const items = await LiftDefRepository.getAll();
    const index = items.findIndex(item => item.id == persistedDef.id);
    const systemDef = SystemLifts.find(item => item.id == persistedDef.id);

    if (!systemDef) {
      if (index < 0) {
        throw new Error(
          `Unable to find def '${persistedDef.id}', this should never happen `,
        );
      } else {
        console.log('Updating existing CustomDef');
        items[index] = persistedDef;
      }
    } else if (
      LiftDefRepository.matchesSystemDefault(persistedDef, systemDef)
    ) {
      if (index >= 0) {
        console.log('Update matches SystemDef, removing');
        items.splice(index, 1);
      } else console.log('SystemDef unmodified, no-op');
    } else if (index < 0) {
      console.log('Adding modified SystemDef');
      items.push(persistedDef);
    } else {
      console.log('Updating systemDef');
      items[index] = persistedDef;
    }

    await AsyncStorage.setItem(key, JSON.stringify(items));
    await this.init();

    return persistedDef;
  }

  private static matchesSystemDefault(
    def: LiftDef,
    systemDef: LiftDef,
  ): boolean {
    return (
      LiftDefRepository.optionalNumber(def.trainingMax) ===
        LiftDefRepository.optionalNumber(systemDef.trainingMax) &&
      JSON.stringify(def.muscleGroups) ===
        JSON.stringify(systemDef.muscleGroups) &&
      JSON.stringify(def.goal) === JSON.stringify(systemDef.goal) &&
      LiftDefRepository.optionalNumber(def.baseWeight) ===
        LiftDefRepository.optionalNumber(systemDef.baseWeight)
    );
  }

  private static optionalNumber(value: number | undefined): number {
    return value ?? 0;
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

    const nameMap = new Map<string, number>();
    Object.values(result).forEach(v => {
      let count = nameMap.get(v.name) ?? 0;
      count++;
      nameMap.set(v.name, count);
    });

    Object.values(result).forEach(v => {
      const count = nameMap.get(v.name)!;
      if (count > 1) v.multiple = true;
    });

    return result;
  }
}
