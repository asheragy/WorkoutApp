import { NavLink, Outlet, useLocation, useNavigate, useParams } from 'react-router';
import useRoutines from './hooks/useRoutines.ts';

const LAST_ROUTINE_KEY = 'lastRoutineId';

// Persistent top bar: routine selector plus page tabs. Routine pages carry the routine id in
// the URL; the global Lift Defs page does not, so the selector falls back to the last one used.
export default function Shell() {
  const routines = useRoutines();
  const navigate = useNavigate();
  const { routineId } = useParams<{ routineId?: string }>();
  // Last path segment of a routine page, e.g. "workouts"; used to stay on the same page
  // when switching routines.
  const section = useLocation().pathname.split('/').pop() || 'workouts';

  if (routineId) localStorage.setItem(LAST_ROUTINE_KEY, routineId);
  const current = routineId ?? localStorage.getItem(LAST_ROUTINE_KEY) ?? routines[0]?.id ?? '';

  function selectRoutine(id: string) {
    localStorage.setItem(LAST_ROUTINE_KEY, id);
    if (routineId) navigate(`/r/${id}/${section}`);
  }

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '8px 16px',
          borderBottom: '1px solid #444',
          position: 'sticky',
          top: 0,
          background: 'var(--bg)',
        }}>
        <select value={current} onChange={e => selectRoutine(e.target.value)}>
          {routines.map(r => (
            <option key={r.id} value={r.id}>
              {r.title}
            </option>
          ))}
        </select>
        <span style={{ width: 1, alignSelf: 'stretch', background: 'var(--border)', marginLeft: 16 }} />
        <nav className="tabs" style={{ display: 'flex', gap: 4 }}>
          <NavLink to={`/r/${current}/workouts`}>Workouts</NavLink>
          <NavLink to={`/r/${current}/goals`}>Goals</NavLink>
          <NavLink to="/lifts">Lift Defs</NavLink>
        </nav>
      </header>
      <Outlet />
    </div>
  );
}
