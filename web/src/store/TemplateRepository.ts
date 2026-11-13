import uuid from 'react-native-uuid';
import { isLiftGroup, Lift, Routine } from '@shared/types/workout.ts';
import { RoutineTemplate } from '@shared/types/template.ts';
import { RoutineFile } from './RoutineFile.ts';

// Every routine JSON in src/core/routines, globbed at build time by Vite the
// same way the phone uses Metro's require.context, plus routines created in
// this session that have not been saved yet. Keyed by routine id; the file
// name is kept so Save writes back to the same file, and is undefined until
// a new routine is saved for the first time.
type Entry = { file?: string; template: RoutineTemplate };

const modules = import.meta.glob<RoutineFile>(
  '../../../src/core/routines/*.json',
  { eager: true, import: 'default' },
);

const entries = new Map<string, Entry>();
for (const path of Object.keys(modules).sort()) {
  const file = path.slice(path.lastIndexOf('/') + 1).replace(/\.json$/, '');
  const { version: _version, ...template } = modules[path];
  const id = template.routine.id;
  if (entries.has(id))
    throw new Error(
      `Duplicate routine id ${id} in ${file}.json and ${entries.get(id)!.file}.json`,
    );
  entries.set(id, { file, template });
}

// Notified when the routine list changes (a routine is created).
const listeners = new Set<() => void>();
function notify() {
  listeners.forEach(fn => fn());
}

export default class TemplateRepository {
  static async listAll(): Promise<Routine[]> {
    return [...entries.values()].map(e => e.template.routine);
  }

  static async get(id: string): Promise<RoutineTemplate | undefined> {
    return entries.get(id)?.template;
  }

  // New empty routine, in memory only until the first Save. Returns its id.
  static create(title: string): string {
    const id = uuid.v4();
    entries.set(id, { template: { routine: { id, title }, workouts: [] } });
    notify();
    return id;
  }

  // Adds a routine read from a file outside src/core/routines as a new
  // routine: it gets a fresh routine id and fresh instanceIds, so it never
  // collides with the routine it was exported from, and like create() it has
  // no file until the first Save. Returns its id.
  static import(template: RoutineTemplate, title: string): string {
    const id = uuid.v4();
    const freshLift = (lift: Lift): Lift => ({
      ...lift,
      instanceId: uuid.v4(),
    });
    entries.set(id, {
      template: {
        routine: { ...template.routine, id, title },
        workouts: template.workouts.map(w => ({
          ...w,
          items: w.items.map(item =>
            isLiftGroup(item)
              ? {
                  ...item,
                  instanceId: uuid.v4(),
                  lifts: item.lifts.map(freshLift),
                }
              : freshLift(item),
          ),
        })),
      },
    });
    notify();
    return id;
  }

  // File name (without .json) the routine was loaded from, or undefined for a
  // routine created this session that has not been saved yet. Throws for an
  // unknown id so a save can never silently create a second file.
  static fileName(id: string): string | undefined {
    const entry = entries.get(id);
    if (!entry) throw new Error(`Unknown routine id ${id}`);
    return entry.file;
  }

  // Records the file a new routine was first saved to.
  static setFile(id: string, file: string) {
    const entry = entries.get(id);
    if (!entry) throw new Error(`Unknown routine id ${id}`);
    entry.file = file;
  }

  static subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }
}
