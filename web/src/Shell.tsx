import { NavLink, Outlet, useLocation, useNavigate, useParams } from 'react-router';
import useRoutines from './hooks/useRoutines.ts';
import TemplateRepository from './store/TemplateRepository.ts';

const LAST_ROUTINE_KEY = 'lastRoutineId';
// Sentinel value of the selector's last option.
const NEW_ROUTINE = '__new__';

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
    if (id === NEW_ROUTINE) {
      // The select is controlled, so cancelling leaves it on the current routine.
      const title = window.prompt('Routine title')?.trim();
      if (!title) return;
      id = TemplateRepository.create(title);
    }
    localStorage.setItem(LAST_ROUTINE_KEY, id);
    if (routineId || id !== current) navigate(`/r/${id}/${section}`);
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
          <option value={NEW_ROUTINE}>New routine…</option>
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
