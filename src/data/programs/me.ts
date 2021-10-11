import {Program, WorkoutNode} from '../../../types/types';

function getDLDay(block: number, week: number): WorkoutNode {
  const weight = 235 + block * 10 + 20 * week;

  return {
    name: 'DL Week ' + (week + 1) + ' Block ' + (block + 1),
    lifts: [
      {
        name: 'Trap Bar Deadlift',
        sets: [
          {
            weight: weight,
            reps: 10 - week * 2,
            repeat: 1,
          },
        ],
      },
      {
        name: 'Calve Raises',
      },
      {
        name: 'Lunges',
      },
      {
        name: 'Leg Extensions',
      },
      {
        name: 'Leg Curls',
      },
    ],
  };
}

function getBenchDay(block: number, week: number): WorkoutNode {
  const minWeight = 135 + block * 5;
  var maxWeight = minWeight + 30 + week * 5;

  return {
    name: 'Bench Week ' + (week + 1) + ' Block ' + (block + 1),
    lifts: [
      {
        name: 'Bench Press',
        sets: [
          {
            weight: minWeight,
            reps: 12,
          },
          {
            weight: (minWeight + maxWeight) / 2,
            reps: 12,
          },
          {
            weight: maxWeight,
            reps: 12,
          },
          {
            weight: (minWeight + maxWeight) / 2,
            reps: 12,
          },
          {
            weight: minWeight,
            reps: 12,
          },
        ],
      },
    ],
  };
}

function getUpperDay(block: number, week: number): WorkoutNode {
  return {
    name: 'Upper Week ' + (week + 1) + ' Block ' + (block + 1),
    lifts: [
      {
        name: 'Pullups',
      },
      {
        name: 'Dips',
        sets: [
          {
            reps: 10,
          },
          {
            reps: 6,
            repeat: 5,
          },
          {
            reps: 10,
          },
        ],
      },
      {
        name: 'Curls',
        sets: [
          {
            weight: 25,
            reps: {min: 10, max: 13},
          },
        ],
      },
      {
        name: 'DB Press',
        sets: [
          {
            weight: 35,
            reps: {min: 8, max: 12},
          },
        ],
      },
      {
        name: 'Band Pulls',
      },
    ],
  };
}

function getLowerDay(block: number, week: number): WorkoutNode {
  return {
    name: 'Lower Week ' + (week + 1) + ' Block ' + (block + 1),
    lifts: [
      {
        name: 'Sumo DL',
        sets: [
          {
            reps: 5,
            weight: 185 + 10 * week + 10 * block,
          },
        ],
      },
      {
        name: 'Pause Squat',
        sets: [
          {
            reps: 5,
            weight: 115 + 10 * week + 10 * block,
          },
        ],
      },
      {
        name: 'Pause Squat w/Bands',
        sets: [
          {
            reps: 5,
            weight: 165 + 10 * week + 10 * block,
          },
        ],
      },
      {
        name: 'Calves',
      },
    ],
  };
}

function getPushDay(block: number, week: number): WorkoutNode {
  const ohpMin = 15 + block * 2.5;
  const ohpMax = ohpMin + week * 5;
  const ohpMid = (ohpMax + ohpMin) / 2;
  const ohpWeight = [ohpMin, ohpMid, ohpMax, ohpMid, ohpMin];

  return {
    name: 'Push Week ' + (week + 1) + ' Block ' + (block + 1),
    lifts: [
      {
        name: 'Overhead Press',
        sets: ohpWeight.map(x => ({
          weight: x,
          reps: 10,
        })),
      },
      {
        name: 'Dumbell Bench Press',
        id: 'dbPress',
        sets: [
          {
            reps: 10,
            weight: 45,
          },
          {
            reps: 10,
            weight: 55,
          },
          {
            reps: 8,
            weight: 65,
          },
          {
            reps: 8,
            weight: 60,
          },
          {
            reps: 8,
            weight: 55,
          },
        ],
      },
      /*
      {
        name: 'Dumbell Bench Press',
        sets: [
          {
            reps: 10,
            weight: 45,
          },
          {
            reps: 10,
            weight: 55,
          },
          {
            reps: {min: 8, max: 12},
            weight: 65,
          },
          {
            reps: {min: 8, max: 12},
            weight: 60,
          },
          {
            reps: 12,
            weight: 55,
          },
        ],
      },
      */
      {
        name: 'Lat Raises',
      },
      {
        name: 'Triceps',
      },
    ],
  };
}

function getPullDay(block: number, week: number): WorkoutNode {
  return {
    name: 'Pull Week ' + (week + 1) + ' Block ' + (block + 1),
    lifts: [
      {
        name: 'Dumbbell Rows',
        sets: [
          {
            weight: 60,
            reps: 10,
          },
          {
            weight: 80,
            reps: 10,
          },
          {
            weight: 100,
            reps: week + 8,
            repeat: 2,
          },
          {
            weight: 100,
            reps: week + 9 + block,
          },
        ],
      },
      {
        name: 'HS Pulldown',
      },
      {
        name: 'Hammer Curls',
      },
      {
        name: 'Reverse Curls',
      },
      {
        name: 'Reverse Lat Machine',
      },
    ],
  };
}

export default function getProgram(): Program {
  const workouts: WorkoutNode[] = [];

  const block = 2;

  for (var week = 0; week < 3; week++) {
    workouts.push(getDLDay(block, week));
    workouts.push(getBenchDay(block, week));
    workouts.push(getUpperDay(block, week));
    workouts.push(getLowerDay(block, week));
    workouts.push(getPushDay(block, week));
    workouts.push(getPullDay(block, week));
  }

  return {workouts};
}
