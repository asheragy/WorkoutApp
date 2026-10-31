import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { SystemLiftDefs } from '../LiftDatabase.ts';
import { RoutineTemplate } from '../types/template.ts';
import { isLiftGroup } from '../types/workout.ts';

// Every routine JSON saved by the web app must only reference lifts that exist
// in SystemLiftDefs, otherwise the phone would crash when importing it.
const dir = __dirname;
const files = readdirSync(dir).filter(f => f.endsWith('.json'));

test('every lift id in routines/*.json exists in SystemLiftDefs', () => {
  const invalid: string[] = [];

  for (const file of files) {
    const template: RoutineTemplate = JSON.parse(
      readFileSync(join(dir, file), 'utf8'),
    );
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
