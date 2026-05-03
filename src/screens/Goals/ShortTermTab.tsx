import React, { useEffect, useState } from 'react';
import Utils from '../../components/Utils.ts';
import { useSelector } from 'react-redux';
import { AppState } from '../../state/store.ts';
import WorkoutRepository from '../../repository/WorkoutRepository.ts';
import { GoalRow, ProgressList } from './Common.tsx';
import { MuscleGroup } from '../../types/types.ts';

export function ShortTermTab() {
  const defs = useSelector((store: AppState) => store.liftDefs);
  const settings = useSelector((store: AppState) => store.settings);
  const [goalRows, setGoalRows] = useState<GoalRow[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const result: GoalRow[] = [];

      const workouts = await WorkoutRepository.getRoutine(settings.routine);
      const lifts = workouts
        .flatMap(x => x.lifts)
        .filter(x => x.sets.length > 0)
        .filter(x => x.goals != undefined && x.goals.length > 0);

      const counts = new Map<MuscleGroup, number>();
      const percentages = new Map<MuscleGroup, number>();

      lifts.forEach(lift => {
        const def = defs[lift.id];
        const percent = Utils.goalPercent(def, lift);
        if (percent) {
          result.push({ id: lift.instanceId, lift: def, percent });

          def.muscleGroups.forEach(group => {
            const count = counts.get(group) ?? 0;
            const percentage = percentages.get(group) ?? 0;
            counts.set(group, count + 1);
            percentages.set(group, percentage + percent);
          });
        }
      });

      // Add group results
      counts.forEach((count, group) => {
        if (count > 1) {
          const percent = percentages.get(group)!! / count;
          result.push({ id: group.toString(), group, percent });
        }
      });

      result.sort((a, b) => a.percent - b.percent);
      setGoalRows(result);
    };

    loadData();
  }, []);

  return <ProgressList goals={goalRows} />;
}
