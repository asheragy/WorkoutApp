import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { WorkoutTemplate } from '@shared/types/template.ts';
import LiftUtils from '@shared/utils/LiftUtils.ts';
import TemplateRepository from '../store/TemplateRepository.ts';
import { settings } from '../store/Settings.ts';
import { liftDefs } from '../store/LiftDefs.ts';
import Page from '../components/Page.tsx';
import { isLiftGroup } from '@shared/types/workout.ts';

type GoalRow = { id: string; name: string; percent: number };

// Simplified version of the phone app's calcWorkoutGoals: one row per lift with a goal,
// averaged when the lift appears in more than one workout. No muscle group rows.
export function calcGoals(workouts: WorkoutTemplate[]): GoalRow[] {
  const percents = new Map<string, number[]>();

  workouts
    .flatMap(w => w.items)
    .flatMap(item => (isLiftGroup(item) ? item.lifts : [item]))
    .forEach(lift => {
      const percent = LiftUtils.goalPercent(settings, liftDefs[lift.id], lift);
      if (percent === undefined || isNaN(percent)) return;
      percents.set(lift.id, [...(percents.get(lift.id) ?? []), percent]);
    });

  return [...percents.entries()]
    .map(([id, values]) => ({
      id,
      name: liftDefs[id].displayName,
      percent: values.reduce((sum, n) => sum + n, 0) / values.length,
    }))
    .sort((a, b) => a.percent - b.percent);
}

export default function GoalsPage() {
  const { routineId = '' } = useParams();
  const [rows, setRows] = useState<GoalRow[]>([]);

  useEffect(() => {
    TemplateRepository.get(routineId).then(t =>
      setRows(calcGoals(t?.workouts ?? [])),
    );
  }, [routineId]);

  return (
    <Page>
      <h2>Goals</h2>
      {rows.length === 0 ? (
        <p>No lifts in this routine have goals.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Lift</th>
              <th>Goal %</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.id}>
                <td>{row.name}</td>
                <td style={{ textAlign: 'right' }}>
                  {(100 * row.percent).toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Page>
  );
}
