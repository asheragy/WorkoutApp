import {
  Lift,
  LiftDef,
  LiftSet,
  LiftType,
  Program,
  WorkoutNode,
} from '../../types/types';
import {LiftId, lookupDef} from '../LiftDatabase';

function round5(weight: number, percentage?: number) {
  var n = weight * (percentage || 1);
  n = Math.round(n / 5);
  return n * 5;
}

function getLift(id: string): LiftDef {
  return lookupDef(id, CustomLifts);
}

function createPersisted(id: string, sets: LiftSet[], goal?: string): Lift {
  var def = getLift(id);

  return {
    def: def,
    sets: sets,
    goal: goal,
    persisted: true,
  };
}

function createSets(weight: number, reps: number, repeat: number): LiftSet[] {
  var result: LiftSet[] = [];

  for (var i = 0; i < repeat; i++) {
    result.push({
      weight: {
        value: weight,
        range: {},
      },
      reps: {
        value: reps,
        range: {},
      },
    });
  }

  return result;
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
      createPersisted(LiftId.DeadLift_TrapBar, createSets(225, 5, 2), '315x10'),
      createPersisted(LiftId.Lunges, createSets(0, 5, 3), '15-20lb x 15'),
      createPersisted(LiftId.CalfRaises, createSets(70, 10, 4), '15 reps'),
      createPersisted(LiftId.LegExtensions, createSets(60, 10, 2), '18 reps'),
      createPersisted(LiftId.LegCurls, createSets(90, 10, 2), '18 reps'),
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
      createPersisted(
        LiftId.InclinePress_Dumbell,
        createSets(30, 10, 3),
        '3x15',
      ),
      createPersisted(LiftId.Curls_EzBar, createSets(60, 10, 3), '3x18'),
      createPersisted(LiftId.FacePulls, createSets(50, 15, 2), '2x25'),
    ],
  };
}

function getLowerDay(block: number, week: number): WorkoutNode {
  return {
    name: 'Lower Week ' + week + ' Block ' + block,
    lifts: [
      createPersisted(LiftId.DeadLift_Sumo, createSets(135, 10, 1), '225 x 10'),
      createPersisted(LiftId.FrontSquat, createSets(45, 10, 1), '115 x 15'),
      createPersisted(LiftId.SSBSquat, createSets(95, 10, 1), '135 x 15'),
      createPersisted(LiftId.HatfieldSquat, createSets(135, 10, 1), '155 x 15'),
      createPersisted(LiftId.RDL, createSets(95, 10, 3), '3x15'),
      createPersisted(CustomLift_HomeCalfRaises, createSets(0, 20, 3)),
    ],
  };
}

function getPushDay(block: number, week: number): WorkoutNode {
  var mainLift = getPyramidLift(block, week, LiftId.OverheadPress, 166);
  var customDef = {...mainLift.def};
  customDef.id += '2';

  var customLift = createPersisted(LiftId.OverheadPress, createSets(95, 5, 2));
  customLift.def = customDef;

  var dumbellPress = createPersisted(
    LiftId.BenchPress_Dumbell,
    createSets(55, 10, 4),
    '70 x 18',
  );
  dumbellPress.sets[0].warmup = true;

  return {
    name: 'Push Week ' + week + ' Block ' + block,
    lifts: [
      mainLift,
      customLift,
      dumbellPress,
      createPersisted(LiftId.LatRaises, createSets(15, 10, 3), '3x18'),
      createPersisted(LiftId.TricepExtension, createSets(35, 15, 3), '3x25'),
      createPersisted(
        LiftId.HammerStrength_OverheadPress,
        createSets(25, 10, 1),
        '45lb x 20',
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
        '90lb x 15',
      ),
      createPersisted(
        LiftId.Curls_ReverseBarbell,
        createSets(55, 10, 3),
        '3x15',
      ),
      createPersisted(LiftId.ReverseFlys, createSets(70, 15, 3), '3x25'),
      createPersisted(LiftId.HammerCurls, createSets(25, 10, 3), '3x15'),
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

  return {
    workouts: workouts,
  };
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

const CustomLift_HomeCalfRaises = 'homeCalfRaises';

const CustomLifts = [
  {
    id: CustomLift_HomeCalfRaises,
    name: 'Calf Raises',
    type: LiftType.Bodyweight,
  },
];
