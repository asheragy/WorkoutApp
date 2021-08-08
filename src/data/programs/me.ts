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
    ],
  };
}

function getBenchDay(block: number, week: number): WorkoutNode {
  const weight = [0, 0, 0, 0, 0];
  const minWeight = 135 + block * 5;
  var maxWeight = 155 + block * 5 + week * 10;
  if (maxWeight > 175) maxWeight = 175;
  const mid = (maxWeight - minWeight) / 2;

  // Default is pyramid with min/max weight
  weight[0] = minWeight;
  weight[1] = minWeight + mid;
  weight[2] = maxWeight;
  weight[3] = minWeight + mid;
  weight[4] = minWeight;

  switch (week) {
    case 1: {
      if (block == 3) {
        weight[1] = maxWeight;
        weight[3] = 165;
      } else if (block == 4) {
        weight[1] = maxWeight;
        weight[3] = maxWeight;
      }
      break;
    }
    case 2: {
      if (block >= 1) weight[3] = maxWeight;
      if (block >= 2) weight[1] = maxWeight;
      if (block >= 3) weight[4] = maxWeight;
      if (block == 4) weight[0] = maxWeight;
    }
  }

  return {
    name: 'Bench Week ' + (week + 1) + ' Block ' + (block + 1),
    lifts: [
      {
        name: 'Bench Press',
        sets: [
          {
            weight: weight[0],
            reps: 12,
          },
          {
            weight: weight[1],
            reps: 12,
          },
          {
            weight: weight[2],
            reps: 12,
          },
          {
            weight: weight[3],
            reps: 12,
          },
          {
            weight: weight[4],
            reps: 12,
          },
        ],
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
            reps: 5,
            repeat: 5,
          },
          {
            reps: 15,
          },
        ],
      },
      {
        name: 'Curls',
        sets: [
          {
            weight: 25,
            reps: {min: 10, max: 12},
          },
        ],
      },
      {
        name: 'DB Press',
        sets: [
          {
            weight: 32.5,
            reps: {min: 10, max: 15},
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
            weight: 185 + 10 * week + 5 * block,
          },
        ],
      },
      {
        name: 'Pause Squat',
        sets: [
          {
            reps: 5,
            weight: 115 + 10 * week + 5 * block,
          },
        ],
      },
      {
        name: 'Pause Squat w/Bands',
        sets: [
          {
            reps: 5,
            weight: 165 + 10 * week + 5 * block,
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
            reps: {min: 8, max: 12},
            weight: 55,
          },
        ],
      },
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

  for (var block = 0; block < 1; block++) {
    for (var week = 0; week < 3; week++) {
      workouts.push(getDLDay(block, week));
      workouts.push(getBenchDay(block, week));
      workouts.push(getUpperDay(block, week));
      workouts.push(getLowerDay(block, week));
      workouts.push(getPushDay(block, week));
      workouts.push(getPullDay(block, week));
    }
  }

  return {workouts};
}
