import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { SystemLiftDefs } from '../LiftDatabase.ts';
import { RoutineTemplate } from '../types/template.ts';
import { isLiftGroup } from '../types/workout.ts';

// Checks over every routine JSON saved by the web app. The files are read from
// disk here because the app loads them via Metro's require.context, which Jest
// does not provide.
const dir = __dirname;
const files = readdirSync(dir).filter(f => f.endsWith('.json'));
const routines: [string, RoutineTemplate][] = files.map(file => [
  file,
  JSON.parse(readFileSync(join(dir, file), 'utf8')),
]);

test('at least one routine json exists', () => {
  expect(files.length).toBeGreaterThan(0);
});

test('no duplicate routine uuid', () => {
  const ids = routines.map(([, r]) => r.routine.id);
  expect(new Set(ids).size).toBe(ids.length);
});

// Otherwise the phone would crash when importing it.
test('every lift id in routines/*.json exists in SystemLiftDefs', () => {
  const invalid: string[] = [];

  for (const [file, template] of routines) {
    for (const workout of template.workouts) {
      for (const item of workout.items) {
        const lifts = isLiftGroup(item) ? item.lifts : [item];
        for (const lift of lifts) {
          if (!SystemLiftDefs[lift.id])
            invalid.push(`${file} / ${workout.name}: ${lift.id}`);
        }
      }
    }
  }

  expect(invalid).toEqual([]);
});

test('workouts do not set routineId', () => {
  const invalid: string[] = [];

  for (const [file, template] of routines) {
    for (const workout of template.workouts) {
      if (workout.routineId !== undefined && workout.routineId != '')
        invalid.push(`${file} / ${workout.name}`);
    }
  }

  expect(invalid).toEqual([]);
});
