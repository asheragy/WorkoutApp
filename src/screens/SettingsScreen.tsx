import React from 'react';
import {
  Alert,
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons';
import RNFS from 'react-native-fs';
import { StackScreenProps } from '@react-navigation/stack';
import type { RootStackParamList } from '../App';
import LiftDefRepository from '../repository/LiftDefRepository';
import { LiftType, MuscleGroup } from '../core/types/types.ts';
import SettingsRepository from '../repository/SettingsRepository.ts';
import { getDb } from '../repository/db.ts';
import WorkoutRepository from '../repository/WorkoutRepository.ts';
import { PreLoadedRoutines } from '../repository/RoutineRepository.ts';
import {
  cleanWorkouts,
  ROUTINE_FILE_VERSION,
} from '../core/utils/RoutineUtils.ts';

const BACKUP_DIR = `${RNFS.ExternalStorageDirectoryPath}/Documents/WorkoutApp`;

function timestamp() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}` +
    `_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`
  );
}

type SettingsAction =
  | 'lifts'
  | 'routines'
  | 'logDefs'
  | 'logSettings'
  | 'backup'
  | 'exportRoutine';

// Listed in display order
const ACTION_LABELS: Record<SettingsAction, string> = {
  lifts: 'Lifts',
  routines: 'Routines',
  logDefs: 'Log Defs',
  logSettings: 'Log Settings',
  backup: 'Backup Database',
  exportRoutine: 'Export Routine',
};

const ACTIONS = Object.keys(ACTION_LABELS) as SettingsAction[];

// These open another screen, the rest run in place
const NAVIGATE_ACTIONS: SettingsAction[] = ['lifts', 'routines'];

type Props = StackScreenProps<RootStackParamList, 'Settings'>;

export function SettingsScreen({ navigation }: Props) {
  const { colors } = useTheme();

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

  // Writes the current routine, as it is on this phone, in the same format as
  // the files in src/core/routines.
  async function onExportRoutine() {
    const filename = `routine_${timestamp()}.json`;
    const destPath = `${BACKUP_DIR}/${filename}`;

    try {
      const settings = await SettingsRepository.get();
      const workouts = await WorkoutRepository.getRoutine(settings.routine);
      // Title and description are not stored on the phone; they come from the
      // bundled routine this one was imported from, if any.
      const preloaded = PreLoadedRoutines.find(
        x => x.routine.id == settings.routine,
      )?.routine;

      const file = {
        version: ROUTINE_FILE_VERSION,
        routine: {
          id: settings.routine,
          title: preloaded?.title ?? settings.routineName ?? 'Default',
          ...(preloaded?.description && {
            description: preloaded.description,
          }),
        },
        workouts: cleanWorkouts(workouts),
      };

      await RNFS.mkdir(BACKUP_DIR);
      await RNFS.writeFile(
        destPath,
        JSON.stringify(file, null, 2) + '\n',
        'utf8',
      );

      ToastAndroid.show(
        'Saved to Documents/WorkoutApp/' + filename,
        ToastAndroid.LONG,
      );
    } catch (e) {
      console.error('Export failed', e);
      Alert.alert('Export failed', e instanceof Error ? e.message : String(e));
    }
  }

  function onAction(action: SettingsAction) {
    switch (action) {
      case 'lifts':
        return navigation.navigate('Lifts', {});
      case 'routines':
        return navigation.navigate('Routines');
      case 'logDefs':
        return logLiftDefs();
      case 'logSettings':
        return logSettings();
      case 'backup':
        return onBackup();
      case 'exportRoutine':
        return onExportRoutine();
    }
  }

  const renderItem = ({ item }: ListRenderItemInfo<SettingsAction>) => (
    <TouchableOpacity
      style={[styles.row, { backgroundColor: colors.card }]}
      onPress={() => onAction(item)}
    >
      <Text style={[styles.label, { color: colors.text }]}>
        {ACTION_LABELS[item]}
      </Text>
      {NAVIGATE_ACTIONS.includes(item) && (
        <MaterialDesignIcons
          name="chevron-right"
          size={24}
          color={colors.text}
        />
      )}
    </TouchableOpacity>
  );

  const separator = () => (
    <View style={[styles.separator, { backgroundColor: colors.border }]} />
  );

  return (
    <FlatList
      data={ACTIONS}
      renderItem={renderItem}
      keyExtractor={action => action}
      ItemSeparatorComponent={separator}
    />
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // Fixed so rows match with or without the chevron
    minHeight: 52,
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 16,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
  },
});
