import React from 'react';
import { Alert, Button, ToastAndroid, View } from 'react-native';
import RNFS from 'react-native-fs';
import LiftDefRepository from '../repository/LiftDefRepository';
import { LiftType, MuscleGroup } from '../types/types.ts';
import SettingsRepository from '../repository/SettingsRepository.ts';
import { getDb } from '../repository/db.ts';

const BACKUP_DIR = `${RNFS.ExternalStorageDirectoryPath}/Documents/WorkoutApp`;

function timestamp() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}` +
    `_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`
  );
}

export function SettingsScreen() {
  async function logLiftDefs() {
    const defs = await LiftDefRepository.getAll();
    console.log('Defs');
    if (defs.length == 0) console.log('  0');
    defs.forEach(x => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      x.type = LiftType[x.type];
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      x.muscleGroups = x.muscleGroups.map(g => MuscleGroup[g]);
      console.log('  ' + JSON.stringify(x));
    });
  }

  async function logSettings() {
    const settings = await SettingsRepository.get();
    console.log(JSON.stringify(settings));
  }

  async function onBackup() {
    const filename = `app_${timestamp()}.sqlite`;
    // VACUUM INTO writes a consistent snapshot. Write it next to the live db
    // first (always writable), then move it to the shared Documents folder.
    const tmpPath = `${RNFS.ExternalDirectoryPath}/${filename}`;
    const destPath = `${BACKUP_DIR}/${filename}`;

    try {
      const db = await getDb();
      await db.execute('VACUUM INTO ?', [tmpPath]);

      await RNFS.mkdir(BACKUP_DIR);
      await RNFS.moveFile(tmpPath, destPath);

      ToastAndroid.show(
        'Saved to Documents/WorkoutApp/' + filename,
        ToastAndroid.LONG,
      );
    } catch (e) {
      console.error('Backup failed', e);
      RNFS.unlink(tmpPath).catch(() => {});
      Alert.alert('Backup failed', e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <View>
      <Button title="Log Defs" onPress={logLiftDefs}></Button>
      <Button title="Log Settings" onPress={logSettings}></Button>
      <Button title="Backup Database" onPress={onBackup}></Button>
    </View>
  );
}
