import { GlobalSettings } from '../types/types';
import { db, dbReady } from './db.ts';

export default class SettingsRepository {
  static async get(): Promise<GlobalSettings> {
    await dbReady(); // 1 of 2 locations to ensure db is initialized

    const result: GlobalSettings = {};
    const rows = await db.executeRaw('SELECT key, value_json FROM settings');

    for (const [key, valueJson] of rows) {
      result[key as keyof GlobalSettings] = JSON.parse(valueJson as string);
    }

    result.largestHalfPoundDumbbell ??= 47.5;
    result.plateCount ??= true;
    result.bodyweight ??= 200;
    return result;
  }

  static async set<K extends keyof GlobalSettings>(
    key: K,
    value: GlobalSettings[K],
  ): Promise<void> {
    if (value === undefined) {
      await db.execute('DELETE FROM settings WHERE key = ?', [key]);
      return;
    }

    await db.execute(
      `INSERT INTO settings (key, value_json) VALUES (?, ?)
       ON CONFLICT(key) DO UPDATE SET value_json = excluded.value_json`,
      [key, JSON.stringify(value)],
    );
  }
}
