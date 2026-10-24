import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import Shell from './Shell.tsx';
import WorkoutsPage from './pages/WorkoutsPage.tsx';
import GoalsPage from './pages/GoalsPage.tsx';
import LiftDefsPage from './pages/LiftDefsPage.tsx';
import useRoutines from './hooks/useRoutines.ts';

// Unknown or bare URLs land on the first routine's editor.
function RootRedirect() {
  const routines = useRoutines();
  if (routines.length === 0) return null;
  return <Navigate to={`/r/${routines[0].id}/workouts`} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

// Separate from the router so tests can render it under a MemoryRouter.
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Shell />}>
        <Route path="/r/:routineId">
          <Route index element={<Navigate to="workouts" replace />} />
          <Route path="workouts" element={<WorkoutsPage />} />
          <Route path="goals" element={<GoalsPage />} />
        </Route>
        <Route path="/lifts" element={<LiftDefsPage />} />
      </Route>
      <Route path="*" element={<RootRedirect />} />
    </Routes>
  );
}
