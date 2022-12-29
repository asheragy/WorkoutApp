import AsyncStorage from '@react-native-async-storage/async-storage';
import Utils from '../components/Utils';
import {
  Lift,
  LiftDef,
  LiftSet,
  PersistedSet,
  Program,
  WorkoutNode,
} from '../types/types';

const liftKeyPrefix = 'lift:';
const historyKeyPrefix = 'liftHistory:';

export type PersistedLiftHistory = {
  date: Date;
  sets: PersistedSet[];
};

export default class LiftRepository {
  static async getLift(key: string): Promise<PersistedSet[] | null> {
    var value = await AsyncStorage.getItem(liftKeyPrefix + key);
    //console.log('GetLift ' + key + ' = ' + value);
    if (value != null) {
      return JSON.parse(value);
    }

    return null;
  }

  static async getLifts(
    program: Program,
  ): Promise<Map<string, PersistedSet[]>> {
    var map = new Map<string, PersistedSet[]>();
    var ignore = new Set<string>(); // Prevent multiple lookup attempts for missing values

    for (const wo of program.workouts) {
      for (let i = 0; i < wo.lifts.length; i++) {
        const lift = wo.lifts[i];

        if (!map.has(lift.def.id) && !ignore.has(lift.def.id)) {
          var persisted = await this.getLift(lift.def.id);
          if (persisted != null) map.set(lift.def.id, persisted);
          else ignore.add(lift.def.id);
        }
      }
    }

    return map;
  }

  static async saveLift(lift: Lift): Promise<void> {
    return this.saveSets(lift.def, LiftRepository.setsToPersisted(lift.sets));
  }

  static async clearAllLifts(): Promise<void> {
    var keys = await AsyncStorage.getAllKeys();

    keys.forEach(async key => {
      if (key.startsWith(liftKeyPrefix)) {
        console.log('Deleting: ' + key);
        await AsyncStorage.removeItem(key);
      }
    });
  }

  private static async saveSets(
    def: LiftDef,
    sets: PersistedSet[],
  ): Promise<void> {
    return AsyncStorage.setItem(liftKeyPrefix + def.id, JSON.stringify(sets));
  }

  // TODO could take LiftDef to be more type safe
  static async getHistory(key: string): Promise<PersistedLiftHistory[]> {
    var value = await AsyncStorage.getItem(historyKeyPrefix + key);
    if (value == null) return [];

    var stringResult: {date: string; sets: PersistedSet[]}[] =
      JSON.parse(value);

    return stringResult.map(entry => {
      var item: PersistedLiftHistory = {
        date: new Date(entry.date),
        sets: entry.sets,
      };

      return item;
    });
  }

  static async addAllHistory(workout: WorkoutNode): Promise<void> {
    for (var i = 0; i < workout.lifts.length; i++) {
      var lift = workout.lifts[i];

      // TODO why is this needed?
      var savedValue = await this.getLift(lift.def.id);
      var persistedSets: PersistedSet[] = [];

      if (savedValue != null) persistedSets = savedValue;
      else persistedSets = LiftRepository.setsToPersisted(lift.sets);

      await this.addHistory(lift.def.id, persistedSets);
    }
  }

  private static setsToPersisted(sets: LiftSet[]): PersistedSet[] {
    var filtered = sets.filter(
      x => x.reps != undefined && x.weight != undefined,
    );

    if (sets.length != filtered.length) console.log('Filtered out lifts');

    return filtered.map(set => {
      var res: PersistedSet = {
        weight: set.weight!!,
        reps: set.reps!!,
        warmup: set.warmup || false,
      };

      return res;
    });
  }

  private static async addHistory(
    key: string,
    sets: PersistedSet[],
  ): Promise<void> {
    var history = await this.getHistory(key);
    var item: PersistedLiftHistory = {
      date: new Date(),
      sets: sets,
    };

    history.push(item);

    await AsyncStorage.setItem(historyKeyPrefix + key, JSON.stringify(history));
  }
}
