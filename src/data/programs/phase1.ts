import {
  Lift,
  LiftDef,
  LiftSet,
  LiftType,
  Program,
  WorkoutNode,
} from '../../types/types';
import {LiftId, lookupDef} from '../LiftDatabase';

function getLift(id: string): LiftDef {
  return lookupDef(id, CustomLifts);
}

function createPersisted(id: string, sets: LiftSet[]): Lift {
  var def = getLift(id);

  return {
    def: def,
    sets: sets,
  };
}

function createSets(weight: number, reps: number, repeat: number): LiftSet[] {
  var result: LiftSet[] = [];

  for (var i = 0; i < repeat; i++) {
    result.push({
      weight: weight,
      reps: reps,
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
      createPersisted(LiftId.DeadLift_TrapBar, createSets(225, 5, 2)),
      createPersisted(LiftId.Lunges, createSets(0, 5, 3)),
      createPersisted(LiftId.CalfRaises, createSets(70, 10, 4)),
      createPersisted(LiftId.LegExtensions, createSets(60, 10, 2)),
      createPersisted(LiftId.LegCurls, createSets(90, 10, 2)),
      createPersisted(LiftId.LegPress, createSets(45, 10, 1)),
    ],
  };
}

function getUpperDay(block: number, week: number): WorkoutNode {
  return {
    name: 'Upper Week ' + week + ' Block ' + block,
    lifts: [
      createPersisted(LiftId.Pullups, createSets(0, 2, 6)),
      createPersisted(LiftId.InclinePress_Barbell, createSets(135, 10, 3)),
      createPersisted(LiftId.Curls_EzBar, createSets(60, 10, 3)),
      createPersisted(LiftId.Dips, createSets(0, 8, 5)),
      createPersisted(LiftId.FacePulls, createSets(35, 15, 2)),
    ],
  };
}

function getLowerDay(block: number, week: number): WorkoutNode {
  return {
    name: 'Lower Week ' + week + ' Block ' + block,
    lifts: [
      createPersisted(LiftId.DeadLift_Sumo, createSets(135, 10, 1)),
      createPersisted(LiftId.FrontSquat, createSets(45, 10, 1)),
      createPersisted(LiftId.SSBSquat, createSets(95, 10, 1)),
      createPersisted(LiftId.HatfieldSquat, createSets(135, 10, 1)),
      createPersisted(LiftId.RDL, createSets(95, 10, 3)),
      createPersisted(CustomLift_HomeCalfRaises, createSets(0, 20, 3)),
    ],
  };
}

function getPushDay(block: number, week: number): WorkoutNode {
  var dumbellPress = createPersisted(
    LiftId.BenchPress_Dumbell,
    createSets(55, 10, 4),
  );

  dumbellPress.sets[0].warmup = true;

  return {
    name: 'Push Week ' + week + ' Block ' + block,
    lifts: [
      createPersisted(LiftId.OverheadPress, createSets(115, 5, 5)),
      dumbellPress,
      createPersisted(LiftId.LatRaises, createSets(15, 10, 3)),
      createPersisted(LiftId.TricepExtension, createSets(35, 15, 3)),
      createPersisted(
        LiftId.HammerStrength_OverheadPress,
        createSets(25, 10, 1),
      ),
    ],
  };
}

function getPullDay(block: number, week: number): WorkoutNode {
  return {
    name: 'Pull Week ' + week + ' Block ' + block,
    lifts: [
      createPersisted(LiftId.DumbellRows, createSets(80, 6, 5)),
      createPersisted(
        LiftId.HammerStrength_Pulldown,
        createSets(45 + 25, 10, 3),
      ),
      createPersisted(LiftId.Curls_ReverseBarbell, createSets(55, 10, 3)),
      createPersisted(LiftId.ReverseFlys, createSets(70, 15, 3)),
      createPersisted(LiftId.HammerCurls, createSets(25, 10, 3)),
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

  for (var block = 1; block <= 5; block++) {
    for (var week = 1; week <= 3; week++) {
      workouts.push(getDLDay(block, week));
      workouts.push(getUpperDay(block, week));
      workouts.push(getStretch1());

      workouts.push(getLowerDay(block, week));
      workouts.push(getPushDay(block, week));
      workouts.push(getPullDay(block, week));
      workouts.push(getStretch2());
    }

    // Deload
    workouts.push(getDeloadDay());
  }

  return {
    workouts: workouts,
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
