import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '../../state/store.ts';
import WorkoutRepository from '../../repository/WorkoutRepository.ts';
import { ProgressList } from './Common.tsx';
import GoalRow, { calcWorkoutGoals } from './Utils.ts';
import { GlobalSettings } from '../../types/types.ts';

export function ShortTermTab(props: { settings: GlobalSettings }) {
  const defs = useSelector((store: AppState) => store.liftDefs);
  const [goalRows, setGoalRows] = useState<GoalRow[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const workouts = await WorkoutRepository.getRoutine(
        props.settings.routine,
      );
      const result = calcWorkoutGoals(props.settings, defs, workouts);

      setGoalRows(result);
    };

    loadData();
  }, []);

  return <ProgressList goals={goalRows} />;
}
