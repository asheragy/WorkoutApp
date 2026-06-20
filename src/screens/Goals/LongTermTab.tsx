import React, { useEffect, useState } from 'react';
import LiftHistoryRepository from '../../repository/LiftHistoryRepository.ts';
import Utils from '../../components/Utils.ts';
import { useSelector } from 'react-redux';
import { AppState } from '../../state/store.ts';
import { ProgressList } from './Common.tsx';
import GoalRow from './Utils.ts';
import SetUtils from '../../utils/SetUtils.ts';
import { GlobalSettings } from '../../types/types.ts';

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
  console.log(goals);

  useEffect(() => {
    const loadData = async () => {
      const result: GoalRow[] = [];

      for (const defWithGoal of goals) {
        const history = await LiftHistoryRepository.get(defWithGoal.id);
        const name = Utils.defToString(defWithGoal);

        if (history.length == 0) {
          result.push({
            id: defWithGoal.id,
            name,
            percent: 0,
          });
          continue;
        }

        const sets = history.flatMap(h => h.sets).filter(set => !set.warmup);
        const maxes = sets.map(set =>
          SetUtils.calculate1RM(props.settings, defWithGoal, set),
        );
        const best = Math.max(...maxes);

        if (defWithGoal.goal) {
          const percent =
            best /
            SetUtils.calculate1RM(
              props.settings,
              defWithGoal,
              defWithGoal.goal,
            );
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
