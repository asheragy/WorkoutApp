import {WorkoutNode, Program, AccessoryGroup} from '../../types/types';

export default function getProgram(): Program {
  const result: Program = {workouts: []};
  result.workouts = [];

  result.workouts.push(getSquatDay(1));
  result.workouts.push(getBenchDay(1));
  result.workouts.push(getDLDay(1));
  result.workouts.push(getPressDay(1));

  return result;
}

function getSquatDay(week: number): WorkoutNode {
  return {
    name: 'Lower Squat Day',
    accessories: lowerAccessories,
    lifts: [
      {
        name: 'Bodyweight / Plate warmups',
      },
      {
        name: 'Squat Warmups',
        sets: [
          {
            weight: 0,
            reps: 10,
          },
          {
            weight: 10,
            reps: 8,
          },
          {
            weight: {min: 15, max: 25},
            reps: 5,
          },
        ],
      },
      {
        name: 'Squat A',
        sets: [
          {
            weight: {min: 15, max: 25},
            reps: {min: 8, max: 10},
          },
          {
            weight: {min: 10, max: 20},
            reps: {min: 10, max: 12},
          },
          {
            weight: {min: 0, max: 15},
            reps: {min: 10, max: 15},
          },
        ],
      },
      {
        name: 'Squat B',
        sets: [
          {
            weight: {min: 15, max: 25},
            reps: {min: 8, max: 10},
            repeat: 3,
          },
        ],
      },
      {
        name: 'Squat C',
        sets: [
          {
            weight: {min: 20, max: 30},
            reps: {min: 5, max: 8},
          },
          {
            weight: {min: 25, max: 35},
            reps: {min: 3, max: 5},
          },
          {
            weight: {min: 35, max: 45},
            reps: {min: 1, max: 5},
          },
        ],
      },
    ]
  };
}

function getBenchDay(week: number): WorkoutNode {
  return {
    name: 'Upper Bench Day',
    accessories: upperAccessories,
    lifts: [
      {
        name: 'Warmup',
        sets: [
          {
            weight: 0,
            reps: 10,
          },
          {
            weight: 10,
            reps: 8,
          },
          {
            weight: {min: 12.5, max: 15},
            reps: 5,
          },
        ],
      },
      {
        name: 'A) Light',
        sets: [
          {
            weight: {min: 12.5, max: 15},
            reps: {min: 8, max: 10},
          },
          {
            weight: {min: 10, max: 12.5},
            reps: {min: 10, max: 12},
          },
          {
            weight: {min: 5, max: 10},
            reps: {min: 12, max: 20},
          },
        ],
      },
      {
        name: ' B) Medium',
        sets: [
          {
            weight: {min: 12.5, max: 15},
            reps: {min: 8, max: 10},
            repeat: 3,
          },
        ],
      },
      {
        name: 'C) Heavy',
        sets: [
          {
            weight: {min: 15, max: 20},
            reps: {min: 5, max: 8},
          },
          {
            weight: {min: 20, max: 25},
            reps: {min: 3, max: 5},
          },
          {
            weight: {min: 25, max: 30},
            reps: {min: 1, max: 5},
          },
        ],
      },
    ],
  };
}

function getDLDay(week: number): WorkoutNode {
  return {
    name: 'Lower Deadlift Day',
    accessories: lowerAccessories,
    lifts: [
      {
        name: 'Warmup',
        sets: [
          {
            weight: 25,
            reps: {min: 5, max: 8},
          }
        ],
      },
      {
        name: 'A) Light',
        sets: [
          {
            weight: {min: 25, max: 30},
            reps: {min: 10, max: 15},
            repeat: 3
          },
        ],
      },
      {
        name: ' B) Medium',
        sets: [
          {
            weight: 25,
            reps: {min: 8, max: 10},
          },
          {
            weight: 30,
            reps: {min: 8, max: 10},
          },
          {
            weight: 35,
            reps: {min: 8, max: 10},
          }
        ],
      },
      {
        name: 'C) Heavy',
        sets: [
          {
            weight: {min: 30, max: 35},
            reps: {min: 5, max: 8},
          },
          {
            weight: {min: 35, max: 40},
            reps: {min: 3, max: 5},
          },
          {
            weight: {min: 40, max: 45},
            reps: {min: 3, max: 5},
          },
        ],
      },
    ],
  };
}

function getPressDay(week: number): WorkoutNode {
  return {
    name: 'Upper Press Day',
    accessories: upperAccessories,
    lifts: [
      {
        name: 'Overhead Press OR Incline Bench Press',
      },
      {
        name: 'Pulldowns or Rows',
      },
    ],
  };
}

// Accessories
const legs = ['Lunges / Step ups', 'Calf Raises', '1-leg DL', 'RDL'];
const core = ['Planks', 'Hip Thrusts', 'Hanging leg raises'];
const push = [
  'Overhead Press',
  'Pushups',
  'Band Triceps',
  'Lat Raises',
  'Skull crushers',
];
const pull = [
  'Curls',
  'Band face pulls',
  'Dumbell Rows',
  'Barbell Rows',
  'Upright rows',
];


const lowerAccessories: AccessoryGroup[] = [
  { name: "Legs", lifts: legs },
  { name: "Core", lifts: core }
]

const upperAccessories: AccessoryGroup[] = [
  { name: "Push", lifts: push },
  { name: "Pull", lifts: pull }
]