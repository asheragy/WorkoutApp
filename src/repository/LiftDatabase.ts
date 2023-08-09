import {LiftDef, LiftType} from '../types/types';

const lifts: LiftDef[] = [
  // Barbell
  {
    id: 'barbell_deadlift',
    name: 'Deadlift',
    type: LiftType.Barbell,
  },
  {
    id: 'barbell_sumoDeadlift',
    name: 'Sumo DL',
    type: LiftType.Barbell,
  },
  {
    id: 'barbell_rows',
    name: 'Rows',
    type: LiftType.Barbell,
  },
  {
    id: 'barbell_uprightRow',
    name: 'Upright Rows',
    type: LiftType.Barbell,
  },
  {
    id: 'barbell_rdl',
    name: 'RDL',
    type: LiftType.Barbell,
  },
  {
    id: 'barbell_benchPress',
    name: 'Bench Press',
    type: LiftType.Barbell,
  },
  {
    id: 'barbell_overheadPress',
    name: 'Overhead Press',
    type: LiftType.Barbell,
  },
  {
    id: 'barbell_inclinePress',
    name: 'Incline Press',
    type: LiftType.Barbell,
  },
  {
    id: 'barbell_reverseCurls',
    name: 'Reverse Curls',
    type: LiftType.Barbell,
  },
  {
    id: 'barbell_frontSquat',
    name: 'Front Squat',
    type: LiftType.Barbell,
  },
  // Dumbbell
  {
    id: 'dumbbell_benchPress',
    name: 'Bench Press',
    type: LiftType.Dumbbell,
  },
  {
    id: 'dumbbell_inclinePress',
    name: 'Incline Press',
    type: LiftType.Dumbbell,
  },
  {
    id: 'dumbbell_hammerCurls',
    name: 'Hammer Curls',
    type: LiftType.Dumbbell,
  },
  {
    id: 'dumbbell_latRaises',
    name: 'Lat Raises',
    type: LiftType.Dumbbell,
  },
  {
    id: 'dumbbell_rows',
    name: 'Rows',
    type: LiftType.Dumbbell,
  },
  // Machine
  {
    id: 'machine_facePulls',
    name: 'Face Pulls',
    type: LiftType.Machine,
  },
  {
    id: 'machine_flys',
    name: 'Flys',
    type: LiftType.Machine,
  },
  {
    id: 'machine_reverseFlys',
    name: 'Reverse Flys',
    type: LiftType.Machine,
  },
  {
    id: 'machine_tricep',
    name: 'Tricep Machine',
    type: LiftType.Machine,
  },
  {
    id: 'machine_tricepRope',
    name: 'Tricep Rope',
    type: LiftType.Machine,
  },
  {
    id: 'machine_calfRaises',
    name: 'Calf Raises',
    type: LiftType.Machine,
  },
  {
    id: 'machine_legExtensions',
    name: 'Leg Extensions',
    type: LiftType.Machine,
  },
  {
    id: 'machine_legCurls',
    name: 'Leg Curls',
    type: LiftType.Machine,
  },
  {
    id: 'machine_pulldowns',
    name: 'Pulldowns',
    type: LiftType.Machine,
  },
  {
    id: 'machine_pullovers',
    name: 'Pullovers',
    type: LiftType.Machine,
  },
  {
    id: 'machine_hipAbduction',
    name: 'Hip Abduction Machine',
    type: LiftType.Machine,
  },
  // Not a machine lift but it fits best with calculations
  {
    id: 'machine_ezCurls',
    name: 'EZ-bar Curls',
    type: LiftType.Machine,
  },
  // Bodyweight
  {
    id: 'bodyweight_pullups',
    name: 'Pullups',
    type: LiftType.Bodyweight,
  },
  {
    id: 'bodyweight_dips',
    name: 'Dips',
    type: LiftType.Bodyweight,
  },
  {
    id: 'bodyweight_lunges',
    name: 'Lunges',
    type: LiftType.Bodyweight,
  },
  {
    id: 'bodyweight_backExtensions',
    name: 'Back Extensions',
    type: LiftType.Bodyweight,
  },
  // Plate Machine / Hammer Strength
  {
    id: 'plateMachine_hsPress',
    name: 'HS Overhead Press',
    type: LiftType.PlateMachine,
  },
  {
    id: 'plateMachine_hsPulldown',
    name: 'HS Pulldown',
    type: LiftType.PlateMachine,
  },
  {
    id: 'plateMachine_hsRows',
    name: 'HS Rows',
    type: LiftType.PlateMachine,
  },
  {
    id: 'plateMachine_legPress',
    name: 'Leg Press',
    type: LiftType.PlateMachine,
  },
  // Trap bar
  {
    id: 'trapbar_deadlift',
    name: 'Deadlift',
    type: LiftType.TrapBar,
  },
  // SSB
  {
    id: 'ssb_squat',
    name: 'Squat',
    type: LiftType.SSB,
  },
];

export const SystemLifts = lifts.map(def => {
  def.system = true;
  return def;
});
