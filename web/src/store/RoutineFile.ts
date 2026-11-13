import { RoutineTemplate } from '@shared/types/template.ts';
import { cleanItem, cleanWorkouts } from '@shared/utils/RoutineUtils.ts';
import { SystemLiftDefs } from '@shared/LiftDatabase.ts';

// On-disk format for src/core/routines/<file>.json: the RoutineTemplate shape
// plus a version field. Runtime-only fields (completed, lastCompleted, hide) are
// never written.
export const FILE_VERSION = 1;

export type RoutineFile = RoutineTemplate & { version: number };

export function toFile(template: RoutineTemplate): RoutineFile {
  return {
    version: FILE_VERSION,
    routine: {
      id: template.routine.id,
      title: template.routine.title,
      ...(template.routine.description && {
        description: template.routine.description,
      }),
    },
    workouts: template.workouts.map(w => ({
      ...(w.id !== undefined && { id: w.id }),
      name: w.name,
      routineId: w.routineId,
      items: w.items.map(cleanItem),
    })),
  };
}

export function serialize(template: RoutineTemplate): string {
  return JSON.stringify(toFile(template), null, 2);
}

// Allowed routine file names (without .json); mirrors the server check.
export const FILE_NAME = /^[A-Za-z0-9_-]+$/;

// PUT the routine to the dev-server plugin (web/plugins/routinesApi.ts).
// `file` is the name (without .json) the routine was loaded from. With
// `create`, the server refuses to overwrite an existing file.
export async function saveRoutine(
  template: RoutineTemplate,
  file: string,
  create = false,
): Promise<void> {
  const query = create ? '?create=1' : '';
  const res = await fetch(
    `/api/routines/${encodeURIComponent(file)}${query}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: serialize(template),
    },
  );
  if (!res.ok)
    throw new Error(`Save failed (${res.status}): ${await res.text()}`);
}

// Parses the text of a routine file picked in the Import dialog (e.g. one
// exported by the phone). Checks everything the editor would otherwise break
// on later and throws an Error describing the first problem found. The
// result holds only the known fields; ids are still the ones from the file.
export function parseRoutineFile(text: string): RoutineTemplate {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('not valid JSON');
  }
  if (!isObject(data)) throw new Error('not a routine file');
  if (typeof data.version !== 'number')
    throw new Error('missing version, not a routine file');
  if (data.version > FILE_VERSION)
    throw new Error(
      `file version ${data.version} is newer than supported version ${FILE_VERSION}`,
    );

  const { routine, workouts } = data;
  if (!isObject(routine)) throw new Error('missing routine');
  if (typeof routine.title !== 'string' || !routine.title.trim())
    throw new Error('missing routine title');
  if (routine.description !== undefined && typeof routine.description !== 'string')
    throw new Error('routine description is not text');
  if (!Array.isArray(workouts)) throw new Error('missing workouts');

  const unknownLifts = new Set<string>();
  workouts.forEach((w, i) => {
    const where = `workout ${i + 1}`;
    if (!isObject(w)) throw new Error(`${where} is not an object`);
    if (typeof w.name !== 'string') throw new Error(`${where} has no name`);
    if (!Array.isArray(w.items)) throw new Error(`"${w.name}" has no items`);
    w.items.forEach((item, j) => {
      const at = `"${w.name}" item ${j + 1}`;
      if (!isObject(item)) throw new Error(`${at} is not an object`);
      if ('kind' in item) {
        if (item.kind !== 'oneOf')
          throw new Error(`${at} has unknown group kind "${item.kind}"`);
        if (!Array.isArray(item.lifts) || item.lifts.length === 0)
          throw new Error(`${at} is a group with no lifts`);
        item.lifts.forEach(l => checkLift(l, at, unknownLifts));
      } else checkLift(item, at, unknownLifts);
    });
  });
  if (unknownLifts.size > 0)
    throw new Error(`unknown lift ids: ${[...unknownLifts].join(', ')}`);

  return {
    routine: {
      id: typeof routine.id === 'string' ? routine.id : '',
      title: routine.title.trim(),
      ...(routine.description && { description: routine.description }),
    },
    workouts: cleanWorkouts(workouts),
  };
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function checkLift(lift: unknown, at: string, unknownLifts: Set<string>) {
  if (!isObject(lift)) throw new Error(`${at} is not an object`);
  if (typeof lift.id !== 'string' || !lift.id)
    throw new Error(`${at} has no lift id`);
  // The editor looks every lift up in SystemLiftDefs with no fallback.
  if (!SystemLiftDefs[lift.id]) unknownLifts.add(lift.id);
  checkSets(lift.sets, `${at} (${lift.id}) sets`, true);
  checkSets(lift.goals, `${at} (${lift.id}) goals`, false);
  checkSets(lift.goals2, `${at} (${lift.id}) goals2`, false);
}

function checkSets(sets: unknown, at: string, required: boolean) {
  if (sets === undefined && !required) return;
  if (!Array.isArray(sets)) throw new Error(`${at} is not a list`);
  for (const set of sets) {
    if (
      !isObject(set) ||
      typeof set.weight !== 'number' ||
      typeof set.reps !== 'number'
    )
      throw new Error(`${at} has a set without a numeric weight and reps`);
  }
}
