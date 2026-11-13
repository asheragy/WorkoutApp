import { NavLink, Outlet, useLocation, useNavigate, useParams } from 'react-router';
import useRoutines from './hooks/useRoutines.ts';
import TemplateRepository from './store/TemplateRepository.ts';
import { parseRoutineFile } from './store/RoutineFile.ts';

const LAST_ROUTINE_KEY = 'lastRoutineId';
// Sentinel value of the selector's last option.
const NEW_ROUTINE = '__new__';
const IMPORT_ROUTINE = '__import__';

// Opens the browser's file dialog; resolves with the picked file, or never if
// the dialog is cancelled.
function pickFile(accept: string): Promise<File> {
  return new Promise(resolve => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    input.onchange = () => {
      const file = input.files?.[0];
      if (file) resolve(file);
    };
    input.click();
  });
}

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

  // Loads a routine file (e.g. a phone export) as a new, unsaved routine and
  // switches to it. Saving it prompts for a file name like any new routine.
  async function importRoutine() {
    const file = await pickFile('.json,application/json');
    let template;
    try {
      template = parseRoutineFile(await file.text());
    } catch (e) {
      window.alert(
        `Cannot import ${file.name}: ${e instanceof Error ? e.message : String(e)}`,
      );
      return;
    }
    const title = window.prompt('Routine title', template.routine.title)?.trim();
    if (!title) return;
    selectRoutine(TemplateRepository.import(template, title));
  }

  function selectRoutine(id: string) {
    if (id === IMPORT_ROUTINE) {
      // The select is controlled, so it stays on the current routine until
      // the import succeeds.
      importRoutine();
      return;
    }
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
          <option value={IMPORT_ROUTINE}>Import…</option>
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
