import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Routine } from '@shared/types/workout.ts';
import RoutineRepository from './store/RoutineRepository.ts';

function App() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    RoutineRepository.getAll().then(list => {
      setRoutines(list);
      setActiveId(prev => prev || list[0]?.id || '');
    });
  }, []);

  return (
    <div style={{ fontFamily: 'sans-serif', padding: 16 }}>
      <select value={activeId} onChange={e => setActiveId(e.target.value)}>
        {routines.map(r => (
          <option key={r.id} value={r.id}>
            {r.title}
          </option>
        ))}
      </select>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
