import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';

export async function exportAsyncStorage() {
  const timestamp = new Date()
    .toISOString()
    .split('.')[0]
    .replace('T', '_')
    .replace(/:/g, '')
    .replaceAll('-', '');

  const filename = `asyncStorageBackup_${timestamp}.json`;
  const path = `${RNFS.ExternalDirectoryPath}/${filename}`;

  try {
    const allKeys = await AsyncStorage.getAllKeys();
    const keys = allKeys.filter(
      key =>
        !key.startsWith('liftHistory:') && !key.startsWith('workoutHistory:'),
    );
    const pairs = await AsyncStorage.multiGet(keys);

    const data = Object.fromEntries(
      pairs.map(([key, value]) => {
        if (value == null) return [key, null];
        try {
          // Try parsing JSON values — if it fails, keep the raw string
          return [key, JSON.parse(value)];
        } catch {
          return [key, value];
        }
      }),
    );

    // Wrap in metadata for future-proofing
    const json = JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        data,
      },
      null,
      2,
    );

    await RNFS.writeFile(path, json, 'utf8');

    console.log('AsyncStorage exported to:', path);
    return path; // absolute file path, e.g. /data/user/0/com.appname/files/asyncStorageBackup.json
  } catch (e) {
    console.error('Error exporting AsyncStorage:', e);
    throw e;
  }
}

export async function importAsyncStorage(): Promise<void> {
  const filename = 'asyncStorageBackup.json';
  const path = `${RNFS.ExternalDirectoryPath}/${filename}`;

  try {
    // Read JSON file
    const json = await RNFS.readFile(path, 'utf8');
    const parsed = JSON.parse(json);

    // Handle either { exportedAt, data } or raw object
    const data =
      parsed && typeof parsed === 'object' && parsed.data
        ? parsed.data
        : parsed;

    if (!data || typeof data !== 'object') {
      throw new Error('Invalid backup format');
    }

    // Convert all values to strings for AsyncStorage
    const entries: [string, string][] = Object.entries(data).map(
      ([key, value]) => [key, toStorageString(value)],
    );

    // Save all pairs
    await AsyncStorage.multiSet(entries);

    console.log(`Imported ${entries.length} keys from ${filename}`);
    return;
  } catch (e) {
    console.error('Error importing AsyncStorage:', e);
    throw e;
  }
}

function toStorageString(value: unknown): string {
  // Keep plain strings as-is; stringify everything else
  if (typeof value === 'string') return value;
  return JSON.stringify(value); // objects, arrays, numbers, booleans, null
}
