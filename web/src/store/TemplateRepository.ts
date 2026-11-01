import { Routine } from '@shared/types/workout.ts';
import { RoutineTemplate } from '@shared/types/template.ts';
import { RoutineFile } from './RoutineFile.ts';

// Every routine JSON in src/core/routines, globbed at build time by Vite the
// same way the phone uses Metro's require.context. Keyed by routine id; the
// file name is kept so Save writes back to the same file.
type Entry = { file: string; template: RoutineTemplate };

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

export default class TemplateRepository {
  static async listAll(): Promise<Routine[]> {
    return [...entries.values()].map(e => e.template.routine);
  }

  static async get(id: string): Promise<RoutineTemplate | undefined> {
    return entries.get(id)?.template;
  }

  // File name (without .json) the routine was loaded from. Throws for an
  // unknown id so a save can never silently create a second file.
  static fileName(id: string): string {
    const entry = entries.get(id);
    if (!entry) throw new Error(`No routine file for id ${id}`);
    return entry.file;
  }
}
