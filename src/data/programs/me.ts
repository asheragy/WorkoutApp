import {PersistedSet, Program, WorkoutNode} from '../../types/types';

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
        name: 'Trap Bar Deadlift (315/335x5, 365x3 405x1)',
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
        step: 10,
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
        step: 2.5,
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
        name: 'Sumo DL (245x5/275x1)',
        id: 'sumoDL',
        sets: [
          {
            reps: 5,
            weight: 205,
          },
          {
            reps: 1,
            weight: 225,
          },
        ],
      },
      {
        name: 'Pause Squat (175x5)',
        id: 'squat',
        sets: [
          {
            reps: 5,
            weight: 135,
          },
        ],
      },
      {
        name: 'Pause Squat w/Bands (225x5/275x1)',
        id: 'squatBands',
        sets: [
          {
            reps: 5,
            weight: 185,
          },
          {
            reps: 1,
            weight: 205,
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
  return {
    name: 'Push Week ' + (week + 1) + ' Block ' + (block + 1),
    lifts: [
      {
        name: 'Overhead Press',
        id: 'ohp',
        sets: [
          {
            reps: 10,
            weight: 25,
          },
          {
            reps: 10,
            weight: 25,
          },
          {
            reps: 10,
            weight: 25,
          },
          {
            reps: 10,
            weight: 25,
          },
        ],
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
      {
        name: 'Lat Raises',
        sets: [
          {
            weight: 22,
            reps: {min: 8, max: 12},
            repeat: 3,
          },
        ],
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
        name: 'Row Machine',
        id: 'rows',
        sets: [
          {
            weight: 45,
            reps: 8,
          },
          {
            weight: 45,
            reps: 8,
          },
          {
            weight: 45,
            reps: 8,
          },
          {
            weight: 45,
            reps: 8,
          },
        ],
      },
      {
        name: 'HS Pulldown (90+25 x 8-10)',
        id: 'hsRow',
        sets: [
          {
            weight: 90,
            reps: 8,
          },
          {
            weight: 90,
            reps: 8,
          },
          {
            weight: 90,
            reps: 8,
          },
          {
            weight: 90,
            reps: 8,
          },
        ],
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

function getStretch1() {
  return {
    name: 'Stretch 1',
    lifts: [
      {
        name: 'Planks',
      },
      {
        name: 'Hip Thrust',
      },
      {
        name: 'Leg Balance',
      },
      {
        name: 'Squat',
      },
      {
        name: 'Toe Touch',
      },
    ],
  };
}

function getStretch2() {
  return {
    name: 'Stretch 2',
    lifts: [
      {
        name: 'Side Planks',
      },
      {
        name: 'Hips',
      },
      {
        name: 'Torso Twist',
      },
      {
        name: 'Squat',
      },
      {
        name: 'Toe Touch',
      },
    ],
  };
}

export default function getProgram(): Program {
  const workouts: WorkoutNode[] = [];

  for (var block = 0; block < 5; block++) {
    for (var week = 0; week < 3; week++) {
      workouts.push(getStretch1());
      workouts.push(getDLDay(block, week));
      workouts.push(getBenchDay(block, week));
      workouts.push(getUpperDay(block, week));
      workouts.push(getStretch2());
      workouts.push(getLowerDay(block, week));
      workouts.push(getPushDay(block, week));
      workouts.push(getPullDay(block, week));
    }
    // Deload
    workouts.push(getDeloadDay());
  }

  return {workouts};
}
