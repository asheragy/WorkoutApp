import {Program, WorkoutNode} from '../../../types/types';

function round5down(n: number) {
  var rounded = Math.floor(n / 5);
  return rounded * 5;
}

function round5up(n: number) {
  var rounded = Math.ceil(n / 5);
  return rounded * 5;
}

function getDLDay(block: number, week: number): WorkoutNode {
  const weight = 255 + 10 * week;

  return {
    name: 'DL Week ' + (week + 1) + ' Block ' + (block + 1),
    lifts: [
      {
        name: 'Trap Bar Deadlift',
        sets: [
          {
            weight: weight - 20,
            reps: 10,
            repeat: 1,
          },
          {
            weight: weight,
            reps: 10,
            repeat: 1,
          },
        ],
      },
      {
        name: 'Lunges',
      },
      {
        name: 'Calve Raises',
        id: 'calf',
        sets: [
          {
            weight: 70,
            reps: 10,
          },
          {
            weight: 70,
            reps: 10,
          },
          {
            weight: 70,
            reps: 10,
          },
          {
            weight: 70,
            reps: 10,
          },
        ],
      },
      {
        name: 'Leg Extensions',
        id: 'extensions',
        sets: [
          {
            weight: 55,
            reps: 12,
          },
          {
            weight: 60,
            reps: 12,
          },
        ],
      },
      {
        name: 'Leg Curls',
        id: 'legcurls',
        sets: [
          {
            weight: 100,
            reps: 12,
          },
          {
            weight: 115,
            reps: 12,
          },
        ],
      },
    ],
  };
}

function getBenchDay(block: number, week: number): WorkoutNode {
  const minWeight = 135 + block * 5;
  var maxWeight = 185 + week * 5;

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
            weight: round5up((minWeight + maxWeight) / 2),
            reps: 12,
          },
          {
            weight: maxWeight,
            reps: 12,
          },
          {
            weight: round5down((minWeight + maxWeight) / 2),
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
            weight: 195 + 5 * week + 10 * Math.min(block, 2),
          },
        ],
      },
      {
        name: 'Pause Squat',
        sets: [
          {
            reps: 5,
            weight: 125 + 5 * week + 10 * Math.min(block, 2),
          },
        ],
      },
      {
        name: 'Pause Squat w/Bands',
        sets: [
          {
            reps: 5,
            weight: 125 + 5 * week + 10 * Math.min(block, 2) + 50,
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

  const block = 3;

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
