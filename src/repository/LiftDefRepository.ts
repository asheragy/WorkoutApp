import AsyncStorage from '@react-native-async-storage/async-storage';
import {LiftDef} from '../types/types';
import Utils from '../components/Utils';
import {SystemLifts} from './LiftDatabase';
import {Dispatch} from 'react';
import {AnyAction} from 'redux';
import {updateLiftDefs} from '../state/liftDefs';

const key = 'liftdefs';

export default class LiftDefRepository {
  private readonly dispatch: Dispatch<AnyAction>;

  constructor(dispatch: Dispatch<AnyAction>) {
    this.dispatch = dispatch;
  }

  async init(): Promise<void> {
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
    def.id = Utils.generate_uuidv4();

    const items = await LiftDefRepository.getAll();
    items.push(def);

    await AsyncStorage.setItem(key, JSON.stringify(items));
    await this.init();

    return def;
  }

  private async update(def: LiftDef): Promise<LiftDef> {
    let items = await LiftDefRepository.getAll();
    let index = items.findIndex(item => item.id == def.id);
    if (index < 0) index = SystemLifts.findIndex(item => item.id == def.id);
    if (index < 0) throw new Error('Unable to find def id ' + def.id);

    items[index] = def;

    // Don't save system lifts that are unmodified
    items = items.filter(item => {
      if (
        item.system &&
        (item.trainingMax === undefined || item.trainingMax == 0)
      )
        return false;

      return true;
    });

    await AsyncStorage.setItem(key, JSON.stringify(items));
    await this.init();

    return def;
  }

  static async getAll(): Promise<LiftDef[]> {
    const value = await AsyncStorage.getItem(key);
    if (value == null) return [];

    return JSON.parse(value);
  }

  private static async getLookupMap(): Promise<Map<string, LiftDef>> {
    const customDefs = await this.getAll();
    const result = new Map<string, LiftDef>();

    customDefs.forEach(def => result.set(def.id, def));
    SystemLifts.forEach(def => {
      if (result.has(def.id)) {
        // Use hardcoded name for system lifts
        const entry = result.get(def.id)!;
        entry.name = def.name;
        result.set(def.id, entry);
      } else {
        result.set(def.id, def);
      }
    });

    return result;
  }
}
