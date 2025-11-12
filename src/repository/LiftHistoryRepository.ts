import AsyncStorage from '@react-native-async-storage/async-storage';
import {LiftDef, PersistedSet} from '../types/types';
import {LiftSet} from '../types/workout';
import Utils from '../components/Utils';
import {db} from './db.ts';
import WorkoutHistoryRepository from './WorkoutHistoryRepository.ts';

const keyPrefix = 'liftHistory:';

export type LiftHistory = {
  timestamp: Date;
  workoutId: string;
  sets: PersistedSet[];
};

export type WorkoutHistory = {
  timestamp: Date;
  lifts: {
    liftId: string;
    sets: PersistedSet[];
  }[];
};

type Row = {
  liftId: string;
  workoutId: string;
  timestamp: Date;
  position: number;
  sets: PersistedSet[];
};

export default class LiftHistoryRepository {
  // TODO temp Migration only
  static async getAll(): Promise<Map<string, LiftHistory[]>> {
    var result = new Map<string, LiftHistory[]>();
    var keys = await AsyncStorage.getAllKeys();

    var ids = keys
      .filter(x => x.startsWith(keyPrefix))
      .map(x => x.replace(keyPrefix, ''));
    for (const id of ids) {
      result.set(id, await this.getLegacy(id));
    }

    return result;
  }

  static async listKeys(): Promise<string[]> {
    const keys = await AsyncStorage.getAllKeys();
    return keys
      .filter(key => key.startsWith(keyPrefix))
      .map(key => key.split(':')[1]);
  }

  static async get(key: string): Promise<LiftHistory[]> {
    const rows = await db.executeRaw(
      `SELECT * FROM lift_history WHERE lift_id = ?`,
      [key],
    );

    return rows.map(row => {
      return {
        workoutId: row[1],
        timestamp: new Date(row[2]),
        sets: JSON.parse(row[4]),
      };
    });
  }

  static async getWorkoutHistory(workoutId: string): Promise<WorkoutHistory[]> {
    const rows = await this.query(
      `SELECT * FROM lift_history WHERE workout_id = ?`,
      [workoutId],
    );

    const workoutsByDate = rows.reduce<Record<number, Row[]>>((acc, row) => {
      const key = row.timestamp.getTime();
      if (!acc[key]) acc[key] = [];
      acc[key].push(row);
      return acc;
    }, {});

    const dates = Object.keys(workoutsByDate)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
      .map(Number);

    return dates.map(date => {
      const lifts = workoutsByDate[date]
        .sort((a, b) => a.position - b.position)
        .map(lift => {
          return {
            liftId: lift.liftId,
            sets: lift.sets,
          };
        });

      return {
        timestamp: new Date(date),
        lifts: lifts,
      };
    });
  }

  private static async query(query: string, params?: any[]): Promise<Row[]> {
    const rows = await db.executeRaw(query, params);
    return rows.map(row => this.getRow(row));
  }

  private static getRow(row: any[]): Row {
    return {
      liftId: row[0],
      workoutId: row[1],
      timestamp: new Date(row[2]),
      position: row[3],
      sets: JSON.parse(row[4]),
    };
  }

  static async getLegacy(key: string): Promise<LiftHistory[]> {
    const value = await AsyncStorage.getItem(keyPrefix + key);
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
    position: number,
  ) {
    if (
      sets.filter(x => x.percentage).length > 0 &&
      def.trainingMax == undefined
    ) {
      console.error('Training max required for persisted lift');
    }

    var persistedSets = LiftHistoryRepository.setsToPersisted(sets, def);

    await this.addHistory(def.id, persistedSets, timestamp, workoutId);
    await this.addHistorySql(
      def.id,
      workoutId,
      timestamp,
      position,
      persistedSets,
    );
  }

  static async migrateHistory() {
    var allWorkoutHistory = await WorkoutHistoryRepository.getAll();
    var liftHistory = await LiftHistoryRepository.getAll();

    for (const [workoutId, workoutHistory] of allWorkoutHistory) {
      for (const history of workoutHistory) {
        for (var i = 0; i < history.liftIds.length; i++) {
          var liftId = history.liftIds[i];
          var lh = liftHistory.get(liftId)!!;
          var current = lh.filter(
            h => h.timestamp.getTime() == history.timestamp.getTime(),
          );
          if (current.length != 1) {
            console.log('Unexpected length');
          } else {
            var sets = current[0].sets;
            console.log(liftId, workoutId, history.timestamp, i, sets);
            await LiftHistoryRepository.addHistorySql(
              liftId,
              workoutId,
              history.timestamp,
              i,
              sets,
            );
          }
        }
      }
    }
  }

  private static setsToPersisted(
    sets: LiftSet[],
    def: LiftDef,
  ): PersistedSet[] {
    var filtered = sets
      .filter(x => x.reps != undefined && x.weight != undefined)
      .filter(x => x.completed);

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

  private static async addHistorySql(
    liftId: string,
    workoutId: string,
    timestamp: Date,
    position: number,
    sets: PersistedSet[],
  ): Promise<void> {
    // Sql version

    try {
      await db.execute(
        'INSERT INTO lift_history (lift_id, workout_id, timestamp, position, sets_json) VALUES (?,?,?,?,?);',
        [
          liftId,
          workoutId,
          timestamp.getTime(),
          position,
          JSON.stringify(sets),
        ],
      );
    } catch (err) {
      console.error('Insert failed:', err);
      throw err;
    }
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
