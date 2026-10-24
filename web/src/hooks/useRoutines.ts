import { useEffect, useState } from 'react';
import { Routine } from '@shared/types/workout.ts';
import TemplateRepository from '../store/TemplateRepository.ts';

// Routine list for the shell selector and the root redirect.
export default function useRoutines(): Routine[] {
  const [routines, setRoutines] = useState<Routine[]>([]);
  useEffect(() => {
    TemplateRepository.listAll().then(setRoutines);
  }, []);
  return routines;
}
