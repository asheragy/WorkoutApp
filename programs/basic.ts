import {Workout, Program} from '../types/types';

function getSquatDay(week: number): Workout {
  const weight = week < 6 ? 0 + week * 2.5 : 20;

  return {
    week: week + 1,
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

function getBenchDay(week: number): Workout {
  var sets = [];

  if (week != 5) {
    sets.push({
      weight: 5,
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
    week: week + 1,
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

function getDLDay(week: number): Workout {
  var trapWeek = week % 2 == 0;
  const baseWeight = trapWeek ? 25 : 35;
  const weight = baseWeight + Math.floor(week / 2) * 5;

  var set1 = 5;
  var set2 = 5;

  switch (week) {
    case 1:
      set1 = 3;
      set2 = 10;
      break;
    case 3:
      set1 = 3;
      set2 = 8;
      break;
    case 5:
      set1 = 3;
      set2 = 5;
      break;
  }

  return {
    week: week + 1,
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
  const result = new Program();
  result.workouts = [];

  for (var i = 0; i < 6; i++) {
    result.workouts.push(getSquatDay(i));
    result.workouts.push(getBenchDay(i));
    result.workouts.push(getDLDay(i));
  }

  return result;
}
