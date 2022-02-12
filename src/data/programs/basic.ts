import {WorkoutNode, Program} from '../../../types/types';

function getSquatDay(week: number): WorkoutNode {
  return {
    name: 'Lower Squat Day',

    lifts: [
      {
        name: 'Bodyweight / Plate warmups',
      },
      {
        name: 'Squat Warmups',
        sets: [
          {
            weight: 0,
            reps: 10,
          },
          {
            weight: 10,
            reps: 8,
          },
          {
            weight: {min: 15, max: 25},
            reps: 5,
          },
        ],
      },
      {
        name: 'Squat A',
        sets: [
          {
            weight: {min: 15, max: 25},
            reps: {min: 8, max: 10},
          },
          {
            weight: {min: 10, max: 20},
            reps: {min: 10, max: 12},
          },
          {
            weight: {min: 0, max: 15},
            reps: {min: 10, max: 15},
          },
        ],
      },
      {
        name: 'Squat B',
        sets: [
          {
            weight: {min: 15, max: 25},
            reps: {min: 8, max: 10},
            repeat: 3,
          },
        ],
      },
      {
        name: 'Squat C',
        sets: [
          {
            weight: {min: 20, max: 30},
            reps: {min: 5, max: 8},
          },
          {
            weight: {min: 25, max: 35},
            reps: {min: 3, max: 5},
          },
          {
            weight: {min: 35, max: 45},
            reps: {min: 1, max: 5},
          },
        ],
      },
    ],
  };
}

function getBenchDay(week: number): WorkoutNode {
  var weight = week < 3 ? 7.5 : 10;

  return {
    name: 'Upper Bench Day',

    lifts: [
      {
        name: 'Warmup',
        sets: [
          {
            weight: 0,
            reps: 10,
          },
          {
            weight: 10,
            reps: 8,
          },
          {
            weight: {min: 12.5, max: 15},
            reps: 5,
          },
        ],
      },
      {
        name: 'A) Light',
        sets: [
          {
            weight: {min: 12.5, max: 15},
            reps: {min: 8, max: 10},
          },
          {
            weight: {min: 10, max: 12.5},
            reps: {min: 10, max: 12},
          },
          {
            weight: {min: 5, max: 10},
            reps: {min: 12, max: 20},
          },
        ],
      },
      {
        name: ' B) Medium',
        sets: [
          {
            weight: {min: 12.5, max: 15},
            reps: {min: 8, max: 10},
            repeat: 3,
          },
        ],
      },
      {
        name: 'C) Heavy',
        sets: [
          {
            weight: {min: 15, max: 20},
            reps: {min: 5, max: 8},
          },
          {
            weight: {min: 20, max: 25},
            reps: {min: 3, max: 5},
          },
          {
            weight: {min: 25, max: 30},
            reps: {min: 1, max: 5},
          },
        ],
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
    name: 'Lower Deadlift Day',
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

function getPressDay(week: number): WorkoutNode {
  var weight = week < 3 ? 7.5 : 10;

  return {
    name: 'Upper Press Day',
    lifts: [
      {
        name: 'Overhead Press',
        sets: [
          {
            weight: weight,
            reps: 10,
          },
          {
            weight: weight + 2.5,
            reps: 8,
          },
          {
            weight: weight + 5,
            reps: {
              min: 6,
              max: 8,
            },
          },
          {
            weight: weight + 2.5,
            reps: 8,
          },
          {
            weight: weight,
            reps: {
              min: 10,
              max: 12,
            },
          },
        ],
      },
      {
        name: 'Dumbell Rows - 10lbs on side',
      },
    ],
  };
}

export default function getProgram(): Program {
  const result: Program = {workouts: []};
  result.workouts = [];

  result.workouts.push(getSquatDay(1));
  result.workouts.push(getBenchDay(1));
  result.workouts.push(getDLDay(1));
  result.workouts.push(getPressDay(1));

  return result;
}
