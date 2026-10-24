import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { WorkoutTemplate } from '@shared/types/template.ts';
import TemplateRepository from '../store/TemplateRepository.ts';
import Workout from '../components/Workout.tsx';
import Page from '../components/Page.tsx';

export default function WorkoutsPage() {
  const { routineId = '' } = useParams();
  const [workouts, setWorkouts] = useState<WorkoutTemplate[]>([]);
  const [compact, setCompact] = useState(false);
  const [reorder, setReorder] = useState(false);

  useEffect(() => {
    TemplateRepository.get(routineId).then(t => setWorkouts(t?.workouts ?? []));
  }, [routineId]);

  return (
    <Page wide>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <input type="checkbox" checked={compact} onChange={e => setCompact(e.target.checked)} />
          Compact
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <input type="checkbox" checked={reorder} onChange={e => setReorder(e.target.checked)} />
          Reorder
        </label>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 16, marginTop: 16 }}>
        {workouts.map((w, i) => (
          <Workout
            key={i}
            workout={w}
            compact={compact}
            reorder={reorder}
            onChange={updated => setWorkouts(prev => prev.map((x, j) => (j === i ? updated : x)))}
          />
        ))}
      </div>
    </Page>
  );
}
