// db/init.ts
import {open} from '@op-engineering/op-sqlite';
import RNFS from 'react-native-fs';

export const db = open({
  name: 'app.sqlite',
  location: RNFS.ExternalDirectoryPath,
});

let _ready: Promise<void> | null = null;
export function dbReady() {
  if (!_ready) _ready = migrate();
  return _ready;
}

export async function migrate() {
  // read current version
  const res = await db.execute('PRAGMA user_version;');
  const current = Number(res.rows?.[0]?.user_version ?? 0);

  const pending = migrations
    .filter(m => m.to > current)
    .sort((a, b) => a.to - b.to);

  if (pending.length === 0) return;

  await db.transaction(async tx => {
    for (const m of pending) {
      try {
        console.log(`Executing migration ${m.to}`);
        await tx.execute(m.sql);
      } catch (err) {
        console.error(err);
        throw err; // ensure rollback
      }
    }
  });
}

type Migration = {to: number; sql: string};

export const migrations: Migration[] = [
  {
    to: 1,
    sql: `
      CREATE TABLE IF NOT EXISTS lift_history (
        lift_id TEXT NOT NULL,
        workout_id TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        position INTEGER NOT NULL, -- Position in workout
        sets_json TEXT NOT NULL,
        PRIMARY KEY (lift_id, timestamp)
      ) STRICT;
      PRAGMA user_version = 1;
    `,
  },
  // add new steps here ↑ for future app versions
];
