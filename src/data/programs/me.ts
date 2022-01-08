import {PersistedSet, Program, WorkoutNode} from '../../../types/types';

function round5down(n: number) {
  var rounded = Math.floor(n / 5);
  return rounded * 5;
}

function round5up(n: number) {
  var rounded = Math.ceil(n / 5);
  return rounded * 5;
}

function getDLDay(block: number, week: number): WorkoutNode {
  return {
    name: 'DL Week ' + (week + 1) + ' Block ' + (block + 1),
    lifts: [
      {
        name: 'Trap Bar Deadlift',
        id: 'deadlift',
        sets: [
          {
            weight: 275,
            reps: 5,
          },
          {
            weight: 275,
            reps: 5,
          },
        ],
      },
      {
        name: 'Lunges',
        sets: [
          {
            reps: 5,
            repeat: 5,
          },
        ],
      },
      {
        name: 'Calve Raises',
        id: 'calf',
        sets: [
          {
            weight: 85,
            reps: 8,
          },
          {
            weight: 85,
            reps: 8,
          },
          {
            weight: 85,
            reps: 8,
          },
          {
            weight: 85,
            reps: 8,
          },
        ],
      },
      {
        name: 'Leg Extensions',
        id: 'extensions',
        sets: [
          {
            weight: 60,
            reps: 12,
          },
          {
            weight: 65,
            reps: 12,
          },
        ],
      },
      {
        name: 'Leg Curls',
        id: 'legcurls',
        sets: [
          {
            weight: 105,
            reps: 12,
          },
          {
            weight: 120,
            reps: 12,
          },
        ],
      },
    ],
  };
}

function getBenchDay(block: number, week: number): WorkoutNode {
  return {
    name: 'Bench Week ' + (week + 1) + ' Block ' + (block + 1),
    lifts: [
      {
        name: 'Bench Press',
        id: 'bench',
        sets: [
          {
            weight: 155,
            reps: 12,
          },
          {
            weight: 170,
            reps: 10,
          },
          {
            weight: 185,
            reps: 8,
          },
          {
            weight: 170,
            reps: 10,
          },
          {
            weight: 155,
            reps: 12,
          },
        ],
      },
    ],
  };
}

function getUpperDay(block: number, week: number): WorkoutNode {
  var pullupSets = [...Array(10).keys()].map(_ => {
    const result: PersistedSet = {
      weight: 0,
      reps: 2,
    };
    return result;
  });

  return {
    name: 'Upper Week ' + (week + 1) + ' Block ' + (block + 1),
    lifts: [
      {
        name: 'Pullups',
        id: 'pullups',
        sets: pullupSets,
      },
      {
        name: 'Dips',
        id: 'dips',
        sets: [
          {
            weight: 0,
            reps: 6,
          },
          {
            weight: 0,
            reps: 6,
          },
          {
            weight: 0,
            reps: 6,
          },
          {
            weight: 0,
            reps: 6,
          },
          {
            weight: 0,
            reps: 6,
          },
        ],
      },
      {
        name: 'Curls',
        id: 'curls',
        sets: [
          {
            weight: 60,
            reps: 10,
          },
          {
            weight: 60,
            reps: 10,
          },
          {
            weight: 60,
            reps: 10,
          },
        ],
      },
      {
        name: 'Incline DB Press',
        id: 'inclineDb',
        sets: [
          {
            weight: 30,
            reps: 8,
          },
          {
            weight: 30,
            reps: 8,
          },
          {
            weight: 30,
            reps: 8,
          },
          {
            weight: 30,
            reps: 8,
          },
        ],
      },
      {
        name: 'Face Pulls',
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
            weight: 50,
          },
          {
            reps: 10,
            weight: 60,
          },
          {
            reps: 8,
            weight: 70,
          },
          {
            reps: 8,
            weight: 65,
          },
          {
            reps: 8,
            weight: 60,
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

function getDeloadDay(): WorkoutNode {
  return {
    name: 'Deload',
    lifts: [
      {
        name: 'Cleans',
      },
      {
        name: 'One Hand DL',
      },
      {
        name: 'Deadlift',
      },
    ],
  };
}

export default function getProgram(): Program {
  const workouts: WorkoutNode[] = [];

  for (var block = 0; block < 5; block++) {
    for (var week = 0; week < 3; week++) {
      // Stretch day 1
      //workouts.push(getDLDay(block, week));
      //workouts.push(getBenchDay(block, week));
      workouts.push(getUpperDay(block, week));
      // Stretch day 2
      //workouts.push(getLowerDay(block, week));
      //workouts.push(getPushDay(block, week));
      //workouts.push(getPullDay(block, week));
    }
    // Deload
    workouts.push(getDeloadDay());
  }

  return {workouts};
}
