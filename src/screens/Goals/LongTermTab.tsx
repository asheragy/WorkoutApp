import React, {useEffect, useState} from 'react';
import LiftHistoryRepository from '../../repository/LiftHistoryRepository.ts';
import Utils from '../../components/Utils.ts';
import {useSelector} from 'react-redux';
import {AppState} from '../../state/store.ts';
import {GoalRow, ProgressList} from './Common.tsx';

export function LongTermTab() {
  const defs = useSelector((store: AppState) => store.liftDefs);
  const [goalRows, setGoalRows] = useState<GoalRow[]>([]);

  const goals = Object.values(defs)
    .filter(x => x.goal)
    .sort((a, b) => {
      if (a.muscleGroups[0] != b.muscleGroups[0])
        return a.muscleGroups[0] - b.muscleGroups[0];

      return a.name.localeCompare(b.name);
    });
  console.log(goals);

  useEffect(() => {
    const loadData = async () => {
      const result: GoalRow[] = [];

      for (const defWithGoal of goals) {
        const history = await LiftHistoryRepository.get(defWithGoal.id);
        if (history.length == 0) {
          result.push({id: defWithGoal.id, lift: defWithGoal, percent: 0});
          continue;
        }

        const sets = history.flatMap(h => h.sets).filter(set => !set.warmup);
        const maxes = sets.map(set => Utils.calculate1RM(defWithGoal, set));
        const best = Math.max(...maxes);

        const percent =
          best / Utils.calculate1RM(defWithGoal, defWithGoal.goal!!);
        result.push({id: defWithGoal.id, lift: defWithGoal, percent});
      }

      result.sort((a, b) => a.percent - b.percent);
      setGoalRows(result);
    };

    loadData();
  }, []);

  return <ProgressList goals={goalRows} />;
}
