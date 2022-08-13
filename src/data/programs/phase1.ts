import {Lift, LiftSet, Program, WorkoutNode} from '../../types/types';
import {getLift, LiftId} from '../LiftDatabase';

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

function createPersisted(id: string, sets: LiftSet[], goal?: string): Lift {
  const def = getLift(id);
  return {
    def: def,
    sets: sets,
    goal: goal,
    persisted: true,
  };
}

function createSets(weight: number, reps: number, repeat: number): LiftSet[] {
  var set: LiftSet = {
    weight: {
      value: weight,
      range: {},
    },
    reps: {
      value: reps,
      range: {},
    },
  };

  return [...Array(repeat).keys()].map(_ => set);
}

function getDLDay(block: number, week: number): WorkoutNode {
  return {
    name: `DL Week ${week} Block ${block}`,
    accessories: [
      {
        name: 'Extra',
        lifts: ['Back Extensions', 'Hip Machine', 'Leg Raises'],
      },
    ],
    lifts: [
      {
        def: getLift(LiftId.placeHolder),
        persisted: false,
        sets: [
          {
            weight: {
              value: 100,
              range: {
                min: 100,
                max: 120,
              },
            },
            reps: {
              value: 10,
              range: {
                min: 0,
              },
            },
          },
        ],
      },

      createPersisted(LiftId.DeadLift_TrapBar, createSets(225, 5, 2), '315x10'),
      createPersisted(LiftId.Lunges, createSets(0, 5, 3), '15-20lb x 15'),
      createPersisted(LiftId.CalfRaises, createSets(70, 10, 4), '20 reps'),
      createPersisted(LiftId.LegExtensions, createSets(60, 10, 2), '20 reps'),
      createPersisted(LiftId.LegCurls, createSets(90, 10, 2), '20 reps'),
      createPersisted(LiftId.LegPress, createSets(45, 10, 1), '20 reps'),
    ],
  };
}

function getBenchDay(block: number, week: number): WorkoutNode {
  const trainingMax = 273;

  return {
    name: 'Bench Week ' + week + ' Block ' + block,
    lifts: [getPyramidLift(block, week, LiftId.BenchPress, trainingMax)],
  };
}

function getUpperDay(block: number, week: number): WorkoutNode {
  return {
    name: 'Upper Week ' + week + ' Block ' + block,
    lifts: [
      createPersisted(LiftId.Pullups, createSets(0, 2, 6), '3x5, 3x10'),
      createPersisted(LiftId.Dips, createSets(0, 6, 5), '5x10'),
      createPersisted(LiftId.Curls_EzBar, createSets(60, 10, 3), '3x20'),
      createPersisted(
        LiftId.InclinePress_Dumbell,
        createSets(30, 10, 3),
        '3x15',
      ),
      createPersisted(LiftId.FacePulls, createSets(50, 15, 2), '2x30'),
    ],
  };
}

function getLowerDay(block: number, week: number): WorkoutNode {
  return {
    name: 'Lower Week ' + week + ' Block ' + block,
    lifts: [
      createPersisted(LiftId.DeadLift_Sumo, createSets(135, 10, 1), '225x10'),
      createPersisted(LiftId.FrontSquat, createSets(45, 10, 1), '1x15'),
      createPersisted(LiftId.SSBSquat, createSets(95, 10, 1)),
      createPersisted(LiftId.HatfieldSquat, createSets(135, 10, 1)),
      createPersisted(LiftId.RDL, createSets(95, 10, 3), '3x15'),
      {
        // TODO this should be the at home version
        def: getLift(LiftId.CalfRaises),
        persisted: false,
        sets: [],
      },
    ],
  };
}

function getPushDay(block: number, week: number): WorkoutNode {
  return {
    name: 'Push Week ' + week + ' Block ' + block,
    lifts: [
      getPyramidLift(block, week, LiftId.OverheadPress, 166),
      createPersisted(LiftId.BenchPress_Dumbell, createSets(55, 10, 3), '3x20'),
      createPersisted(LiftId.LatRaises, createSets(15, 10, 3), '3x20'),
      createPersisted(LiftId.TricepExtension, createSets(35, 15, 3), '3x20'),
      createPersisted(
        LiftId.HammerStrength_OverheadPress,
        createSets(25, 10, 1),
        '1x20',
      ),
    ],
  };
}

function getPullDay(block: number, week: number): WorkoutNode {
  return {
    name: 'Pull Week ' + week + ' Block ' + block,
    lifts: [
      createPersisted(LiftId.DumbellRows, createSets(80, 6, 5), '5x10'),
      createPersisted(
        LiftId.HammerStrength_Pulldown,
        createSets(45 + 25, 10, 3),
        '3x15-20',
      ),
      createPersisted(
        LiftId.Curls_ReverseBarbell,
        createSets(55, 10, 3),
        '3x20',
      ),
      createPersisted(LiftId.ReverseFlys, createSets(70, 15, 3), '3x20-30'),
      createPersisted(LiftId.HammerCurls, createSets(25, 10, 3), '3x20'),
    ],
  };
}

function getDeloadDay(): WorkoutNode {
  return {
    name: 'Deload',
    accessories: [
      {
        name: 'Extra',
        lifts: ['Cleans', 'One Hand DL', 'Deadlift'],
      },
    ],
    lifts: [],
  };
}

function getStretch1() {
  return {
    name: 'Stretch 1',
    accessories: [
      {
        name: 'Extra',
        lifts: [
          'Planks',
          'Hip Thrust',
          'Leg Balance',
          'Squat',
          'Hip Stretching',
          'Camel / Cow',
          'Toe Touch',
        ],
      },
    ],
    lifts: [],
  };
}

function getStretch2() {
  return {
    name: 'Stretch 2',
    accessories: [
      {
        name: 'Extra',
        lifts: [
          'Side Planks',
          'Hips',
          'Torso Twist',
          'Squat',
          'Hip Stretching',
          'Camel / Cow',
          'Toe Touch',
        ],
      },
    ],
    lifts: [],
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
  id: string,
  trainingMax: number,
): Lift {
  const minReps = 5 + block;
  const reps = minReps + Math.floor((week - 1) / 2);
  const percent = 0.7 + 0.025 * Math.floor(week / 2);

  return {
    def: getLift(id),
    persisted: false,
    sets: [
      {
        weight: {
          value: round5(trainingMax, percent - 0.1),
        },
        reps: {
          value: reps,
        },
      },
      {
        weight: {
          value: round5(trainingMax, percent - 0.05),
        },
        reps: {
          value: reps,
        },
      },
      {
        weight: {
          value: round5(trainingMax, percent),
        },
        reps: {
          value: reps,
        },
      },
      {
        weight: {
          value: round5(trainingMax, percent - 0.05),
        },
        reps: {
          value: reps,
        },
      },
      {
        weight: {
          value: round5(trainingMax, percent - 0.1),
        },
        reps: {
          value: reps,
        },
      },
    ],
  };
}
