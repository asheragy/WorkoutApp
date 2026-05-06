import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '../../state/store.ts';
import WorkoutRepository from '../../repository/WorkoutRepository.ts';
import { ProgressList } from './Common.tsx';
import GoalRow, { calcWorkoutGoals } from './Utils.ts';

export function ShortTermTab() {
  const defs = useSelector((store: AppState) => store.liftDefs);
  const settings = useSelector((store: AppState) => store.settings);
  const [goalRows, setGoalRows] = useState<GoalRow[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const workouts = await WorkoutRepository.getRoutine(settings.routine);
      const result = calcWorkoutGoals(defs, workouts);

      setGoalRows(result);
    };

    loadData();
  }, []);

  return <ProgressList goals={goalRows} />;
}
