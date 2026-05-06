import { LiftDef, MuscleGroup } from '../../types/types.ts';
import { Workout } from '../../types/workout.ts';
import Utils from '../../components/Utils.ts';

type GoalRow = {
  id: string;
  name: string;
  percent: number;
  group?: boolean;
};
export default GoalRow;

export function calcWorkoutGoals(
  defs: Record<string, LiftDef>,
  workouts: Workout[],
): GoalRow[] {
  const result: GoalRow[] = [];

  const lifts = workouts
    .flatMap(x => x.lifts)
    .filter(x => x.sets.length > 0)
    .filter(x => x.goals != undefined && x.goals.length > 0);

  const counts = new Map<MuscleGroup, number>();
  const percentages = new Map<MuscleGroup, number>();

  const grouped = lifts.reduce((acc, lift) => {
    (acc[lift.id] ||= []).push(lift);
    return acc;
  }, {} as Record<string, typeof lifts>);

  Object.entries(grouped).forEach(([liftId, lifts]) => {
    const def = defs[liftId];
    const percents = lifts
      .map(lift => Utils.goalPercent(def, lift))
      .filter(x => x !== undefined);

    if (percents.length > 0) {
      const percent = percents.reduce((sum, n) => sum + n, 0) / percents.length;
      result.push({
        id: liftId,
        name: Utils.defToString(def),
        percent,
      });

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
      result.push({
        id: MuscleGroup[group],
        name: MuscleGroup[group],
        percent,
        group: true,
      });
    }
  });

  result.sort((a, b) => a.percent - b.percent);
  return result;
}
