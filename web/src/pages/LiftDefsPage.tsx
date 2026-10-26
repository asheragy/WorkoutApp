import { LiftDef, LiftType, MuscleGroup } from '@shared/types/types.ts';
import { SystemLiftDefs as liftDefs } from '@shared/LiftDatabase.ts';
import Page from '../components/Page.tsx';

// Grouped by primary muscle group name, then by display name, both alphabetically.
const sortedDefs = Object.values(liftDefs).sort(
  (a, b) =>
    MuscleGroup[a.muscleGroups[0]].localeCompare(MuscleGroup[b.muscleGroups[0]]) ||
    a.displayName.localeCompare(b.displayName),
);

// LiftDef fields in display order. Skips id and system (always true for the system list).
const COLUMNS: { key: keyof Omit<LiftDef, 'id'>; label: string }[] = [
  { key: 'name', label: 'Name' },
  { key: 'type', label: 'Type' },
  { key: 'muscleGroups', label: 'Muscle Groups' },
  { key: 'baseWeight', label: 'Base Weight' },
  { key: 'factor', label: 'Factor' },
  { key: 'goal', label: 'Goal' },
];

function formatCell(def: LiftDef, key: (typeof COLUMNS)[number]['key']): string {
  const value = def[key];
  if (value === undefined) return '';
  switch (key) {
    case 'name':
      return def.displayName;
    case 'type':
      return LiftType[def.type];
    case 'muscleGroups':
      return def.muscleGroups.map(g => MuscleGroup[g]).join(', ');
    case 'goal': {
      const goal = def.goal!;
      return `${goal.weight} x ${goal.reps}${goal.warmup ? ' (warmup)' : ''}`;
    }
    default:
      return String(value);
  }
}

export default function LiftDefsPage() {
  return (
    <Page>
      <h2>Lift Defs</h2>
      <table className="data-table">
        <thead>
          <tr>
            {COLUMNS.map(c => (
              <th key={c.key}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedDefs.map(def => (
            <tr key={def.id}>
              {COLUMNS.map(c => (
                <td key={c.key}>{formatCell(def, c.key)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Page>
  );
}
