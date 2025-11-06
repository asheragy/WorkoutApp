import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';

export async function exportAsyncStorage() {
  const filename = 'asyncStorageBackup.json';
  const path = `${RNFS.DocumentDirectoryPath}/${filename}`;

  try {
    const keys = await AsyncStorage.getAllKeys();
    const pairs = await AsyncStorage.multiGet(keys);

    // Convert to object
    const data = Object.fromEntries(pairs);

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
  const path = `${RNFS.DocumentDirectoryPath}/${filename}`;

  try {
    // 🧭 Check if storage is empty
    const existingKeys = await AsyncStorage.getAllKeys();
    if (existingKeys.length > 0) {
      throw new Error(
        `AsyncStorage is not empty (${existingKeys.length} existing keys). Please clear it before importing.`,
      );
    }

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
      ([key, value]) => [key, JSON.stringify(value)],
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
