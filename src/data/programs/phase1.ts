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
  return {
    name: 'Upper Week ' + week + ' Block ' + block,
    lifts: [
      createPersisted('Pullups (3x5, 3x10)', 'pullups', createSets(0, 2, 6)),
      createPersisted('Dips (5x10)', 'dips', createSets(0, 6, 5)),
      createPersisted('Curls (3x20)', 'curls', createSets(60, 10, 3), 10),
      createPersisted(
        'Incline DB Press (3x20)',
        'inclineDb',
        createSets(30, 10, 3),
        2.5,
      ),
      createPersisted('Face Pulls (2x30)', 'facePulls', createSets(50, 15, 2)),
    ],
  };
}

function getLowerDay(block: number, week: number): WorkoutNode {
  return {
    name: 'Lower Week ' + week + ' Block ' + block,
    lifts: [
      createPersisted('Sumo DL (225x10)', 'sumoDL', createSets(135, 10, 1)),
      createPersisted(
        'Front Squat (1x15)',
        'frontSquat',
        createSets(45, 10, 1),
      ),
      createPersisted('SSB Squat', 'ssb', createSets(95, 10, 1)),
      createPersisted('Hatfield Squat', 'hatfield', createSets(135, 10, 1)),
      createPersisted('RDL (3x15)', 'rdl', createSets(95, 10, 3)),
      {
        name: 'Calves',
      },
    ],
  };
}

function getPushDay(block: number, week: number): WorkoutNode {
  return {
    name: 'Push Week ' + week + ' Block ' + block,
    lifts: [
      getPyramidLift(block, week, 'Overhead Press', 166),
      createPersisted(
        'Dumbell Bench Press (3x20)',
        'dbPress',
        createSets(55, 10, 3),
      ),
      createPersisted(
        'Lat Raises (3x20)',
        'latRaise',
        createSets(15, 10, 3),
        2.5,
      ),
      createPersisted(
        'Tricep Extensions (3x30)',
        'tricepExt',
        createSets(35, 15, 3),
      ),
      createPersisted('HS Press (1x20)', 'hsPress', createSets(25, 10, 1)),
    ],
  };
}

function getPullDay(block: number, week: number): WorkoutNode {
  return {
    name: 'Pull Week ' + week + ' Block ' + block,
    lifts: [
      createPersisted('Dumbell Rows (5x10)', 'dbRows', createSets(80, 6, 5)),
      createPersisted(
        'HS Pulldown (3x15-20)',
        'hsRow',
        createSets(45 + 25, 10, 3),
      ),
      createPersisted(
        'Reverse Curls (3x20)',
        'reverseCurls',
        createSets(55, 10, 3),
      ),
      createPersisted(
        'Reverse Flys (3x20-30)',
        'reverseCurls',
        createSets(70, 15, 3),
      ),
      createPersisted(
        'Hammer Curls (3x20)',
        'hammerCurls',
        createSets(25, 10, 3),
      ),
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
        name: 'Hip Stretching',
      },
      {
        name: 'Camel / Cow',
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
        name: 'Hip Stretching',
      },
      {
        name: 'Camel / Cow',
      },
      {
        name: 'Toe Touch',
      },
    ],
  };
}

export default function getProgram(): Program {
  const workouts: WorkoutNode[] = [];
  var counter = 0;

  for (var block = 1; block <= 3; block++) {
    for (var week = 1; week <= 5; week++) {
      workouts.push(counter++ % 2 == 0 ? getStretch1() : getStretch2());
      workouts.push(getDLDay(block, week));
      workouts.push(getBenchDay(block, week));

      workouts.push(counter++ % 2 == 0 ? getStretch1() : getStretch2());
      workouts.push(getUpperDay(block, week));
      workouts.push(getLowerDay(block, week));

      workouts.push(counter++ % 2 == 0 ? getStretch1() : getStretch2());
      workouts.push(getPushDay(block, week));
      workouts.push(getPullDay(block, week));
    }
    // Deload
    workouts.push(getDeloadDay());
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
