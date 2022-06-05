import {WorkoutNode, Program, AccessoryGroup} from '../../types/types';

export default function getProgram(): Program {
  const result: Program = {workouts: []};
  result.workouts = [];

  for (var i = 0; i < 5; i++) {
    result.workouts.push(getHome1());
    result.workouts.push(getGym());
    result.workouts.push(getHome2());
  }

  return result;
}

function getHome1(): WorkoutNode {
  return {
    name: 'Home day 1',
    accessories: homeAcessories,
    lifts: [
      {
        name: 'Leg/Ankle Mobility stretches',
      },
      {
        name: 'Bodyweight Squat',
      },
      {
        name: '10lb plate squat',
      },
      {
        name: 'Front Squat (Shoulder width stance)',
        key: 'frontSquat',
        sets: [
          {
            weight: 0,
            reps: 1,
          },
          {
            weight: 0,
            reps: 1,
          },
          {
            weight: 0,
            reps: 1,
          },
        ],
      },
      {
        name: 'Trap bar deadlift (high handles / small 25lb)',
        key: 'trapBar',
        sets: [
          {
            weight: 25,
            reps: 1,
          },
          {
            weight: 25,
            reps: 1,
          },
          {
            weight: 25,
            reps: 1,
          },
        ],
      },
      {
        name: 'Bench Press (Pyramid weight)',
        key: 'benchPress',
        sets: [
          {
            weight: 5,
            reps: 1,
          },
          {
            weight: 10,
            reps: 1,
          },
          {
            weight: 15,
            reps: 1,
          },
          {
            weight: 10,
            reps: 1,
          },
          {
            weight: 5,
            reps: 1,
          },
        ],
      },
    ],
  };
}

function getHome2(): WorkoutNode {
  return {
    name: 'Home day 2',
    accessories: homeAcessories,
    lifts: [
      {
        name: 'Leg/Ankle Mobility stretches',
      },
      {
        name: 'Bodyweight Squat',
      },
      {
        name: 'Squat Bar warmups',
      },
      {
        name: 'Squat Bar (no hand support)',
        key: 'ssb',
        sets: [
          {
            weight: 0,
            reps: 1,
          },
          {
            weight: 0,
            reps: 1,
          },
        ],
      },
      {
        name: 'Squat Bar (hands on rack)',
        key: 'ssbAssist',
        sets: [
          {
            weight: 0,
            reps: 1,
          },
        ],
      },
      {
        name: 'Deadlift (high rep)',
        key: 'deadlift',
        sets: [
          {
            weight: 25,
            reps: 1,
          },
          {
            weight: 25,
            reps: 1,
          },
        ],
      },
      {
        name: 'Overhead Press',
        key: 'ohp',
        sets: [
          {
            weight: 0,
            reps: 1,
          },
          {
            weight: 0,
            reps: 1,
          },
          {
            weight: 0,
            reps: 1,
          },
        ],
      },
    ],
  };
}

function getGym(): WorkoutNode {
  return {
    name: 'Gym Day',
    accessories: gymAccessories,
    lifts: [
      {
        name: 'Pulldowns (Pyramid)',
        key: 'pulldowns',
        sets: [
          {
            weight: 85,
            reps: 10,
          },
          {
            weight: 85,
            reps: 10,
          },
          {
            weight: 85,
            reps: 10,
          },
          {
            weight: 60,
            reps: 1,
          },
        ],
      },
      {
        name: 'Rows (Pyramid)',
        key: 'rows',
        sets: [
          {
            weight: 60,
            reps: 10,
          },
          {
            weight: 70,
            reps: 10,
          },
          {
            weight: 80,
            reps: 10,
          },
          {
            weight: 60,
            reps: 1,
          },
        ],
      },
      {
        name: 'Leg Press',
      },
      {
        name: 'Dip Machine / Triceps',
      },
    ],
  };
}

// Accessories
const legs = ['Lunges / Step ups', 'Calf Raises', '1-leg DL', 'RDL'];
const core = ['Planks', 'Hip Thrusts', 'Hanging leg raises'];
const push = ['Dumbell Press flat/incline/overhead', 'Lat Raises', 'Flys'];
const pull = [
  'Curls DB/Machine',
  'Reverse Curls',
  'Reverse flys',
  'Band face pulls',
  'Dumbell Rows',
];

const homeAcessories: AccessoryGroup[] = [
  {
    name: 'Arms',
    lifts: ['Pushups', 'Lat Raises', 'Curls', 'Dumbell Rows', 'Upright rows'],
  },
  {name: 'Core', lifts: core},
  {name: 'Legs', lifts: legs},
];

const gymAccessories: AccessoryGroup[] = [
  {name: 'Push', lifts: push},
  {name: 'Pull', lifts: pull},
  {name: 'Core', lifts: core},
  {name: 'Legs', lifts: legs},
];
