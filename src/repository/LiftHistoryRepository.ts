import AsyncStorage from '@react-native-async-storage/async-storage';
import {LiftDef, PersistedSet, TrainingMax} from '../types/types';
import {Lift, LiftSet, Workout} from '../types/workout';
import TrainingMaxRepository from './TrainingMaxRepository';
import Utils from '../components/Utils';

const keyPrefix = 'liftHistory:';

export type PersistedLiftHistory = {
  date: Date;
  sets: PersistedSet[];
};

export default class LiftHistoryRepository {
  // TODO could take LiftDef to be more type safe
  static async getHistory(key: string): Promise<PersistedLiftHistory[]> {
    var value = await AsyncStorage.getItem(keyPrefix + key);
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

  static async addAllHistory(workout: Workout): Promise<void> {
    for (var i = 0; i < workout.lifts.length; i++) {
      var lift = workout.lifts[i];

      var tm: TrainingMax | undefined;
      if (lift.sets.filter(x => x.percentage).length > 0) {
        tm = await TrainingMaxRepository.getInstance().get(lift.def.id);
        console.log(tm);
        if (tm == undefined)
          console.error('Training max required for persisted lift');
      }

      var persistedSets = LiftHistoryRepository.setsToPersisted(lift.sets, tm);

      await this.addHistory(lift.def.id, persistedSets);
    }
  }

  private static setsToPersisted(
    sets: LiftSet[],
    tm: TrainingMax | undefined,
  ): PersistedSet[] {
    var filtered = sets.filter(
      x => x.reps != undefined && x.weight != undefined,
    );

    if (sets.length != filtered.length) console.log('Filtered out lifts');

    return filtered.map(set => {
      var weight = set.weight!!;
      if (set.percentage) {
        if (tm !== undefined) weight = Utils.calcPercentage(weight, tm);
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
  ): Promise<void> {
    var history = await this.getHistory(key);
    var item: PersistedLiftHistory = {
      date: new Date(),
      sets: sets,
    };

    history.push(item);

    await AsyncStorage.setItem(keyPrefix + key, JSON.stringify(history));
  }
}
