import { GlobalSettings } from '../types/types';
import { db, dbReady } from './db.ts';
import { DEFAULT_ROUTINE } from '../types/workout';

export default class SettingsRepository {
  static async get(): Promise<GlobalSettings> {
    await dbReady();

    const result: GlobalSettings = {
      routine: DEFAULT_ROUTINE,
      largestHalfPoundDumbbell: 47.5,
      plateCount: true,
      bodyweight: 200,
    };

    const rows = await db.executeRaw('SELECT key, value_json FROM settings');

    const writable = result as Record<string, unknown>;
    for (const [key, valueJson] of rows) {
      writable[key as string] = JSON.parse(valueJson as string);
    }

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
