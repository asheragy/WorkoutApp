import { useEffect, useState } from 'react';
import { Routine } from '@shared/types/workout.ts';
import TemplateRepository from '../store/TemplateRepository.ts';

// Routine list for the shell selector and the root redirect.
export default function useRoutines(): Routine[] {
  const [routines, setRoutines] = useState<Routine[]>([]);
  useEffect(() => {
    const load = () => TemplateRepository.listAll().then(setRoutines);
    load();
    return TemplateRepository.subscribe(load);
  }, []);
  return routines;
}
