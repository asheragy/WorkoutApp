import { SystemLifts } from '../src/core/LiftDatabase.ts';
import SetUtils from '../src/core/utils/SetUtils.ts';
import { FullBody_3day } from '../src/core/routines/3_FullBody.ts';
import LiftUtils from '../src/core/utils/LiftUtils.ts';
import { isLiftGroup } from '../src/core/types/workout.ts';

/*

npx tsx scripts/working-sets.ts

6-day Upper Lower
┌─────────┬──────────────┬───────┐
│ (index) │ group        │ sets  │
├─────────┼──────────────┼───────┤
│ 0       │ 'Other'      │ 12.4  │
│ 1       │ 'Quads'      │ 15.1  │
│ 2       │ 'Glutes'     │ 15.7  │
│ 3       │ 'Hamstrings' │ 8.2   │
│ 4       │ 'LowerBack'  │ 4.6   │
│ 5       │ 'Calves'     │ 7     │
│ 6       │ 'Abs'        │ 7     │
│ 7       │ 'Chest'      │ 13.2  │
│ 8       │ 'Triceps'    │ 12.4  │
│ 9       │ 'Shoulders'  │ 14    │
│ 10      │ 'Back'       │ 15.6  │
│ 11      │ 'Biceps'     │ 14    │
│ 12      │ 'Total'      │ 139.2 │
└─────────┴──────────────┴───────┘
 */

const defs = Object.fromEntries(SystemLifts.map(def => [def.id, def]));
const [routine, workouts] = FullBody_3day;

workouts.forEach(wo => {
  const sets = SetUtils.getWorkingSets(defs, [wo]).filter(
    x => x.group == 'Total',
  )[0].sets;
  console.log(wo.name + ' (' + sets + ')');

  LiftUtils.getWorkoutItems(wo).forEach(item => {
    if (isLiftGroup(item)) {
      const total = item.lifts
        .map(l => l.sets.length)
        .reduce((a, b) => a + b, 0);
      const count = item.lifts.length;
      const sets = total / count;
      console.log('  ' + sets + ' oneOf');
      item.lifts.forEach(lift => {
        console.log('    ' + lift.sets.length + ' ' + defs[lift.id].name);
      });
    } else {
      console.log('  ' + item.sets.length + ' ' + defs[item.id].name);
    }
  });
});

const interval = 4.5;
const entries = SetUtils.getWorkingSets(defs, workouts);
const entriesNormalized = entries.map(entry => ({
  group: entry.group,
  sets: Math.round(10 * entry.sets * (7 / interval)) / 10,
}));

console.log(routine.title);
console.table(entriesNormalized);
