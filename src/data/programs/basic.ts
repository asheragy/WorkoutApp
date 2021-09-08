import {WorkoutNode, Program} from '../../../types/types';

function getSquatDay(week: number): WorkoutNode {
  const weight = week < 6 ? 0 + week * 2.5 : 20;

  return {
    name: 'Week ' + (week + 1),
    lifts: [
      {
        name: 'Pause Squat',
        sets: [
          {
            weight: weight,
            reps: 10,
            repeat: 3,
          },
        ],
      },
      {
        name: 'Pushups - Against bench',
      },
    ],
  };
}

function getBenchDay(week: number): WorkoutNode {
  var sets = [];

  if (week != 5) {
    sets.push({
      weight: 7.5,
      reps: 12,
      repeat: 5 - week,
    });
  }

  if (week > 0) {
    sets.push({
      weight: 10,
      reps: 12,
      repeat: week,
    });
  }

  return {
    name: 'Week ' + (week + 1),
    lifts: [
      {
        name: 'Bench Press',
        sets: sets,
      },
      {
        name: 'Dumbell Rows - 10lbs on side',
      },
    ],
  };
}

function getDLDay(week: number): WorkoutNode {
  var trapWeek = week % 2 == 0;
  const baseWeight = 25;
  const weight = baseWeight + Math.floor(week / 2) * 5;

  var set1 = 5;
  var set2 = 5;

  switch (week) {
    case 1:
      set1 = 10;
      set2 = 12;
      break;
    case 3:
      set1 = 8;
      set2 = 10;
      break;
    case 5:
      set1 = 5;
      set2 = 8;
      break;
  }

  return {
    name: 'Week ' + (week + 1),
    lifts: [
      {
        name: trapWeek ? 'Trap Bar' : 'Deadlift',
        sets: [
          {
            weight: weight,
            reps: set1,
          },
          {
            weight: weight,
            reps: set2,
            amrap: true,
          },
        ],
      },
      {
        name: 'Overhead Press - Bar or Dumbell',
      },
    ],
  };
}

export default function getProgram(): Program {
  const result: Program = {workouts: []};
  result.workouts = [];

  for (var i = 0; i < 6; i++) {
    result.workouts.push(getSquatDay(i));
    result.workouts.push(getBenchDay(i));
    result.workouts.push(getDLDay(i));
  }

  return result;
}
