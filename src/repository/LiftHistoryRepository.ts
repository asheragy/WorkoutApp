import AsyncStorage from '@react-native-async-storage/async-storage';
import {LiftDef, PersistedSet, TrainingMax} from '../types/types';
import {Lift, LiftSet} from '../types/workout';
import TrainingMaxRepository from './TrainingMaxRepository';
import Utils from '../components/Utils';

const keyPrefix = 'liftHistory:';

export type LiftHistory = {
  timestamp: Date;
  workoutId: string;
  sets: PersistedSet[];
};

export default class LiftHistoryRepository {
  static async get(key: string): Promise<LiftHistory[]> {
    var value = await AsyncStorage.getItem(keyPrefix + key);
    if (value == null) return [];

    return JSON.parse(value, (key, value) => {
      if (key == 'timestamp') return new Date(value);

      return value;
    });
  }

  static async add(
    def: LiftDef,
    sets: LiftSet[],
    timestamp: Date,
    workoutId: string,
  ) {
    if (
      sets.filter(x => x.percentage).length > 0 &&
      def.trainingMax == undefined
    ) {
      console.error('Training max required for persisted lift');
    }

    var persistedSets = LiftHistoryRepository.setsToPersisted(sets, def);

    await this.addHistory(def.id, persistedSets, timestamp, workoutId);
  }

  private static setsToPersisted(
    sets: LiftSet[],
    def: LiftDef,
  ): PersistedSet[] {
    var filtered = sets.filter(
      x => x.reps != undefined && x.weight != undefined,
    );

    if (sets.length != filtered.length) console.log('Filtered out lifts');

    return filtered.map(set => {
      var weight = set.weight!!;
      if (set.percentage) {
        if (def.trainingMax !== undefined)
          weight = Utils.calcPercentage(weight, def.trainingMax);
        else weight = -1;
      }

      var res: PersistedSet = {
        weight: weight,
        reps: set.reps!!,
        warmup: set.warmup || false,
      };

      return res;
    });
  }

  private static async addHistory(
    key: string,
    sets: PersistedSet[],
    timestamp: Date,
    workoutId: string,
  ): Promise<void> {
    var history = await this.get(key);
    var item: LiftHistory = {
      timestamp: timestamp,
      sets: sets,
      workoutId: workoutId,
    };

    history.push(item);

    await AsyncStorage.setItem(keyPrefix + key, JSON.stringify(history));
  }
}
