import React, { useEffect, useState } from 'react';
import Utils from '../../components/Utils.ts';
import { useSelector } from 'react-redux';
import { AppState } from '../../state/store.ts';
import { ProgressList } from './Common.tsx';
import GoalRow from './Utils.ts';
import SetUtils from '../../core/utils/SetUtils.ts';
import { GlobalSettings } from '../../core/types/types.ts';
import WorkoutRepository from '../../repository/WorkoutRepository.ts';
import LiftUtils from '../../core/utils/LiftUtils.ts';

export function LongTermTab(props: { settings: GlobalSettings }) {
  const defs = useSelector((store: AppState) => store.liftDefs);
  const [goalRows, setGoalRows] = useState<GoalRow[]>([]);

  const goals = Object.values(defs)
    .filter(x => x.goal)
    .sort((a, b) => {
      if (a.muscleGroups[0] != b.muscleGroups[0])
        return a.muscleGroups[0] - b.muscleGroups[0];

      return a.name.localeCompare(b.name);
    });

  useEffect(() => {
    const loadData = async () => {
      const workouts = await WorkoutRepository.getRoutine(
        props.settings.routine,
      );
      const result: GoalRow[] = [];

      for (const defWithGoal of goals) {
        const lifts = workouts
          .flatMap(workout => LiftUtils.getAllLifts(workout))
          .filter(lift => lift.id === defWithGoal.id);
        const name = Utils.defToString(defWithGoal);

        if (lifts.length == 0) continue;

        const sets = lifts
          .flatMap(lift => lift.sets)
          .filter(set => !set.warmup);
        const maxes = sets.map(set =>
          SetUtils.calculate1RM(props.settings, defWithGoal, set),
        );
        const best = maxes.length > 0 ? Math.max(...maxes) : 0;

        if (defWithGoal.goal) {
          const target = SetUtils.calculate1RM(
            props.settings,
            defWithGoal,
            defWithGoal.goal,
          );
          const percent = target > 0 ? best / target : 0;
          result.push({ id: defWithGoal.id, name, percent });
        }
      }

      result.sort((a, b) => a.percent - b.percent);
      setGoalRows(result);
    };

    loadData();
  }, []);

  return <ProgressList goals={goalRows} />;
}
