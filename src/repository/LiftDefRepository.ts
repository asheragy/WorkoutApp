import AsyncStorage from '@react-native-async-storage/async-storage';
import {LiftDef} from '../types/types';
import Utils from '../components/Utils';
import {SystemLifts} from './LiftDatabase';

const key = 'liftdefs';

export default class LiftDefRepository {
  static async upsert(def: LiftDef): Promise<LiftDef> {
    if (def.id.length == 0) return await this.insert(def);
    else return await this.update(def);
  }

  private static async insert(def: LiftDef): Promise<LiftDef> {
    def.id = Utils.generate_uuidv4();

    var items = await this.getAll();
    items.push(def);

    await AsyncStorage.setItem(key, JSON.stringify(items));

    return def;
  }

  private static async update(def: LiftDef): Promise<LiftDef> {
    var items = await this.getAll();
    var index = items.findIndex(item => item.id == def.id);
    if (index < 0) throw new Error('Unable to find id ' + def.id);

    items[index] = def;
    await AsyncStorage.setItem(key, JSON.stringify(items));

    return def;
  }

  static async delete(id: string) {
    var items = await this.getAll();
    items = items.filter(item => item.id != id);

    await AsyncStorage.setItem(key, JSON.stringify(items));
  }

  static async getAll(): Promise<LiftDef[]> {
    const value = await AsyncStorage.getItem(key);
    if (value == null) return [];

    return JSON.parse(value);
  }

  static async getLookupMap(): Promise<Map<string, LiftDef>> {
    const all = (await this.getAll()).concat(SystemLifts);
    const result = new Map<string, LiftDef>();

    all.forEach(def => result.set(def.id, def));

    return result;
  }
}
