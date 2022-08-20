import {LiftDef, LiftType, Program} from '../../types/types';

export default function getProgram(): Program {
  return {
    workouts: [
      {
        name: 'Workout 1',
        lifts: [
          {
            def: lookup('531'),
            persisted: true,
            sets: [
              {
                // TODO warmup
                weight: {
                  value: 50,
                },
                reps: {
                  value: 20,
                },
              },
              {
                weight: {
                  value: 75,
                },
                reps: {
                  value: 5,
                },
              },
              {
                weight: {
                  value: 85,
                },
                reps: {
                  value: 3,
                },
              },
              {
                weight: {
                  value: 95,
                },
                reps: {
                  value: 1,
                  range: {
                    min: 1,
                    // No max means AMRAP 1+
                  },
                },
              },
            ],
          },
          {
            def: lookup('manual'),
            persisted: true,
            sets: [
              // Enter whatever
              // TODO no default values?
              {
                weight: {
                  value: 100,
                  range: {},
                },
                reps: {
                  value: 10,
                  range: {},
                },
              },
              {
                weight: {
                  value: 100,
                  range: {},
                },
                reps: {
                  value: 10,
                  // AMRAP
                  range: {
                    min: 0,
                  },
                },
              },
              {
                weight: {
                  value: 100,
                  range: {},
                },
                reps: {
                  value: 10,
                  range: {
                    min: 8,
                    max: 12,
                  },
                },
              },
            ],
          },
          {
            def: lookup('noEntry'),
            persisted: false,
            sets: [
              {
                weight: {
                  value: 80,
                },
                reps: {
                  value: 8,
                },
              },
              {
                weight: {
                  value: 100,
                },
                reps: {
                  value: 10,
                },
              },
            ],
          },
        ],
      },
    ],
  };
}

function lookup(id: string): LiftDef {
  var result = CustomLifts.find(x => x.id == id);
  if (result == undefined) throw new Error('unknown id ' + id);

  return result;
}

const CustomLifts = [
  // Fixed weight, flexible reps
  // Min AMRAP set
  {
    id: '531',
    name: '531 Bench',
    type: LiftType.Barbell,
  },
  // Enter everything
  // AMRAP
  // Range 8-12
  //
  {
    id: 'manual',
    name: 'Manual Entered',
    type: LiftType.Barbell,
  },
  // No data entry fixed everything
  {
    id: 'noEntry',
    name: '100% Programmed set/reps',
    type: LiftType.Barbell,
  },
];
