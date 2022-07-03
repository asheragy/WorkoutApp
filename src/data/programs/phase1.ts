import {
  Lift,
  PersistedLift,
  PersistedSet,
  Program,
  WorkoutNode,
} from '../../types/types';

function round5down(n: number) {
  var rounded = Math.floor(n / 5);
  return rounded * 5;
}

function round5up(n: number) {
  var rounded = Math.ceil(n / 5);
  return rounded * 5;
}

function round5(weight: number, percentage?: number) {
  var n = weight * (percentage || 1);
  n = Math.round(n / 5);
  return n * 5;
}

function createPersisted(
  name: string,
  key: string,
  sets: PersistedSet[],
  step?: number,
): PersistedLift {
  return {
    name: name,
    key: key,
    sets: sets,
    step: step,
  };
}

function createSets(
  weight: number,
  reps: number,
  repeat: number,
): PersistedSet[] {
  var set: PersistedSet = {
    weight: weight,
    reps: reps,
  };

  return [...Array(repeat).keys()].map(_ => set);
}

function getDLDay(block: number, week: number): WorkoutNode {
  return {
    name: 'DL Week ' + (week + 1) + ' Block ' + (block + 1),
    accessories: [
      {
        name: 'Extra',
        lifts: ['Back Extensions', 'Hip Machine', 'Leg Raises'],
      },
    ],
    lifts: [
      {
        name: 'Trap Bar Deadlift (315x10)',
        key: 'deadlift',
        sets: [
          {
            weight: 225,
            reps: 5,
          },
          {
            weight: 225,
            reps: 5,
          },
        ],
      },
      createPersisted(
        'Lunges (15-20lb x 15)',
        'lunges',
        createSets(0, 5, 3),
        2.5,
      ),
      createPersisted('Calf Raises (20 reps)', 'calf', createSets(70, 10, 4)),
      createPersisted(
        'Leg Extensions (20 reps)',
        'extensions',
        createSets(60, 10, 2),
      ),
      createPersisted('Leg Curls (20 reps)', 'legcurls', createSets(90, 10, 2)),
      {
        name: 'Leg Press (20 reps)',
        key: 'legpress',
        sets: [
          {
            weight: 45,
            reps: 10,
          },
        ],
      },
    ],
  };
}

function getBenchDay(block: number, week: number): WorkoutNode {
  const trainingMax = 273;

  return {
    name: 'Bench Week ' + week + ' Block ' + block,
    lifts: [getPyramidLift(block, week, 'Bench Press', trainingMax)],
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
        key: 'pullups',
        sets: pullupSets,
      },
      {
        name: 'Dips',
        key: 'dips',
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
        key: 'curls',
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
        key: 'inclineDb',
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
        key: 'sumoDL',
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
        key: 'squat',
        sets: [
          {
            reps: 5,
            weight: 135,
          },
        ],
      },
      {
        name: 'Pause Squat w/Bands (225x5/275x1)',
        key: 'squatBands',
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
      createPersisted('Overhead Press', 'ohp', createSets(100, 10, 5)),
      {
        name: 'Dumbell Bench Press',
        key: 'dbPress',
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
      createPersisted('Lat Raises', 'latRaise', createSets(20, 10, 3), 2.5),
      createPersisted('Tricep Extensions', 'tricepExt', createSets(45, 15, 3)),
      createPersisted('HS Press', 'hsPress', createSets(45 + 20, 10, 1)),
    ],
  };
}

function getPullDay(block: number, week: number): WorkoutNode {
  return {
    name: 'Pull Week ' + (week + 1) + ' Block ' + (block + 1),
    lifts: [
      {
        name: 'Row Machine',
        key: 'rows',
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
        key: 'hsRow',
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

  for (var block = 1; block <= 3; block++) {
    for (var week = 1; week <= 5; week++) {
      //workouts.push(getStretch1());
      workouts.push(getDLDay(block, week));
      //workouts.push(getBenchDay(block, week));
      //workouts.push(getUpperDay(block, week));
      //workouts.push(getStretch2());
      //workouts.push(getLowerDay(block, week));
      //workouts.push(getPushDay(block, week));
      //workouts.push(getPullDay(block, week));
    }
    // Deload
    //workouts.push(getDeloadDay());
  }

  return {workouts};
}

function getPyramidLift(
  block: number,
  week: number,
  name: string,
  trainingMax: number,
): Lift {
  const minReps = 5 + block;
  const reps = minReps + Math.floor((week - 1) / 2);
  const percent = 0.7 + 0.025 * Math.floor(week / 2);

  return {
    name: name,
    sets: [
      {
        weight: round5(trainingMax, percent - 0.1),
        reps: reps,
      },
      {
        weight: round5(trainingMax, percent - 0.05),
        reps: reps,
      },
      {
        weight: round5(trainingMax, percent),
        reps: reps,
      },
      {
        weight: round5(trainingMax, percent - 0.05),
        reps: reps,
      },
      {
        weight: round5(trainingMax, percent - 0.1),
        reps: reps,
      },
    ],
  };
}
