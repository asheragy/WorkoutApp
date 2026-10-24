import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Routine } from '@shared/types/workout.ts';
import { WorkoutTemplate } from '@shared/types/template.ts';
import TemplateRepository from './store/TemplateRepository.ts';
import Workout from './components/Workout.tsx';
import './index.css';

function App() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [activeId, setActiveId] = useState('');
  const [workouts, setWorkouts] = useState<WorkoutTemplate[]>([]);
  const [compact, setCompact] = useState(false);
  const [reorder, setReorder] = useState(false);

  useEffect(() => {
    TemplateRepository.listAll().then(list => {
      setRoutines(list);
      setActiveId(prev => prev || list[0]?.id || '');
    });
  }, []);

  useEffect(() => {
    if (!activeId) return;
    TemplateRepository.get(activeId).then(t => setWorkouts(t?.workouts ?? []));
  }, [activeId]);

  return (
    <div style={{ fontFamily: 'sans-serif', padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <select value={activeId} onChange={e => setActiveId(e.target.value)}>
          {routines.map(r => (
            <option key={r.id} value={r.id}>
              {r.title}
            </option>
          ))}
        </select>
        <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <input type="checkbox" checked={compact} onChange={e => setCompact(e.target.checked)} />
          Compact
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <input type="checkbox" checked={reorder} onChange={e => setReorder(e.target.checked)} />
          Reorder
        </label>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 16, marginTop: 16, width: 'max-content' }}>
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
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
