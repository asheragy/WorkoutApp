import {LiftDef, LiftType, MuscleGroup} from '../types/types';


const createDictionary = <T extends Record<string, Omit<LiftDef, "id">>>(
  obj: { readonly [K in keyof T]: Readonly<T[K]> }
): { [K in keyof T]: LiftDef & { id: K } } => {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, { ...value, id: key }])
  ) as { [K in keyof T]: LiftDef & { id: K } };
};



export const Lifts = createDictionary({
  // TODO add (Plate Loaded) postfix and remove HS
  // TODO fix ids

  // Chest
  barbell_benchPress: { name: "Bench Press", type: LiftType.Barbell, muscleGroups: [MuscleGroup.Chest, MuscleGroup.Triceps] },
  barbell_inclinePress: { name: "Incline Press", type: LiftType.Barbell, muscleGroups: [MuscleGroup.Chest, MuscleGroup.Triceps] },
  dumbbell_benchPress: { name: "Bench Press", type: LiftType.Dumbbell, muscleGroups: [MuscleGroup.Chest, MuscleGroup.Triceps] },
  dumbbell_inclinePress: { name: "Incline Press", type: LiftType.Dumbbell, muscleGroups: [MuscleGroup.Chest, MuscleGroup.Triceps] },
  machine_flys: { name: "Flys", type: LiftType.Machine, muscleGroups: [MuscleGroup.Chest] },
  plateMachine_inclinePress: { name: "Incline Press Machine", type: LiftType.PlateMachine, muscleGroups: [MuscleGroup.Chest, MuscleGroup.Triceps] },

  // Back
  barbell_rows: { name: "Rows", type: LiftType.Barbell, muscleGroups: [MuscleGroup.Back, MuscleGroup.Biceps] },
  cable_rows: { name: "Rows (Cable)", type: LiftType.Machine, muscleGroups: [MuscleGroup.Back, MuscleGroup.Biceps] },
  barbell_uprightRow: { name: "Upright Rows", type: LiftType.Barbell, muscleGroups: [MuscleGroup.Back, MuscleGroup.Shoulders] },
  dumbbell_rows: { name: "Rows", type: LiftType.Dumbbell, muscleGroups: [MuscleGroup.Back, MuscleGroup.Biceps] },
  machine_pulldowns: { name: "Pulldowns", type: LiftType.Machine, muscleGroups: [MuscleGroup.Back, MuscleGroup.Biceps] },
  bodyweight_pullups: { name: "Pullups", type: LiftType.Bodyweight, muscleGroups: [MuscleGroup.Back, MuscleGroup.Biceps] },
  plateMachine_hsPulldown: { name: "HS Pulldown", type: LiftType.PlateMachine, muscleGroups: [MuscleGroup.Back, MuscleGroup.Biceps] },
  plateMachine_hsRows: { name: "HS Rows", type: LiftType.PlateMachine, muscleGroups: [MuscleGroup.Back, MuscleGroup.Biceps] },

  // Shoulders
  barbell_overheadPress: { name: "Overhead Press", type: LiftType.Barbell, muscleGroups: [MuscleGroup.Shoulders, MuscleGroup.Triceps] },
  machine_reverseFlys: { name: "Reverse Flys", type: LiftType.Machine, muscleGroups: [MuscleGroup.Shoulders] },
  dumbbell_latRaises: { name: "Lat Raise", type: LiftType.Dumbbell, muscleGroups: [MuscleGroup.Shoulders] },
  machine_latRaise: { name: "Lat Raise Machine", type: LiftType.Machine, muscleGroups: [MuscleGroup.Shoulders] },
  machine_facePulls: { name: "Face Pulls", type: LiftType.Machine, muscleGroups: [MuscleGroup.Shoulders] },
  plateMachine_hsPress: { name: "HS Overhead Press", type: LiftType.PlateMachine, muscleGroups: [MuscleGroup.Shoulders, MuscleGroup.Triceps] },

  // Biceps
  barbell_reverseCurls: { name: "Reverse Curls", type: LiftType.Barbell, muscleGroups: [MuscleGroup.Biceps] },
  dumbbell_hammerCurls: { name: "Hammer Curls", type: LiftType.Dumbbell, muscleGroups: [MuscleGroup.Biceps] },
  dumbbell_inclineCurls: { name: "Incline Curls", type: LiftType.Dumbbell, muscleGroups: [MuscleGroup.Biceps] },
  // Not a machine lift but it fits best with calculations
  machine_ezCurls: { name: "EZ-bar Curls", type: LiftType.Machine, muscleGroups: [MuscleGroup.Biceps] },

  // Triceps
  machine_tricep: { name: "Tricep Machine", type: LiftType.Machine, muscleGroups: [MuscleGroup.Triceps] },
  machine_tricepRope: { name: "Tricep Rope", type: LiftType.Machine, muscleGroups: [MuscleGroup.Triceps] },
  machine_tricepOverhead: { name: "Tricep Overhead", type: LiftType.Machine, muscleGroups: [MuscleGroup.Triceps] },
  closegrip_benchPress: { name: "Bench Press (Close-grip)", type: LiftType.Barbell, muscleGroups: [MuscleGroup.Triceps, MuscleGroup.Chest] },
  bodyweight_dips: { name: "Dips", type: LiftType.Bodyweight, muscleGroups: [MuscleGroup.Chest, MuscleGroup.Triceps] },

  // Quads
  ssb_squat: { name: "Squat", type: LiftType.SSB, muscleGroups: [MuscleGroup.Quads, MuscleGroup.Hamstrings] },
  plateMachine_legPress: { name: "Leg Press", type: LiftType.PlateMachine, muscleGroups: [MuscleGroup.Quads] },
  plateMachine_vSquat: { name: "V-Squat", type: LiftType.PlateMachine, muscleGroups: [MuscleGroup.Quads] },
  bodyweight_lunges: { name: "Lunges", type: LiftType.Bodyweight, muscleGroups: [MuscleGroup.Quads, MuscleGroup.Hamstrings] },
  barbell_frontSquat: { name: "Front Squat", type: LiftType.Barbell, muscleGroups: [MuscleGroup.Quads, MuscleGroup.Hamstrings] },
  machine_legExtensions: { name: "Leg Extensions", type: LiftType.Machine, muscleGroups: [MuscleGroup.Quads] },
  belt_squat: { name: "Belt Squat", type: LiftType.PlateMachine, muscleGroups: [MuscleGroup.Quads, MuscleGroup.Hamstrings]},
  split_squat: { name: "Split Squat", type: LiftType.Bodyweight, muscleGroups: [MuscleGroup.Quads, MuscleGroup.Hamstrings]},

  // Hamstrings / Glutes
  plateMachine_hipThrust: { name: "Hip Thrust", type: LiftType.PlateMachine, muscleGroups: [MuscleGroup.Hamstrings] },
  machine_legCurls: { name: "Leg Curls", type: LiftType.Machine, muscleGroups: [MuscleGroup.Hamstrings] },
  machine_kneelingLegCurls: { name: "Kneeling Leg Curls", type: LiftType.Machine, muscleGroups: [MuscleGroup.Hamstrings] },
  bodyweight_backExtensions: { name: "Back Extensions", type: LiftType.Bodyweight, muscleGroups: [MuscleGroup.Hamstrings, MuscleGroup.Back] },
  barbell_deadlift: { name: 'Deadlift', type: LiftType.Barbell, muscleGroups: [MuscleGroup.Hamstrings, MuscleGroup.Quads, MuscleGroup.Back] },
  barbell_sumoDeadlift: { name: "Sumo DL", type: LiftType.Barbell, muscleGroups: [MuscleGroup.Hamstrings, MuscleGroup.Quads, MuscleGroup.Back] },
  barbell_rdl: { name: "RDL", type: LiftType.Barbell, muscleGroups: [MuscleGroup.Hamstrings, MuscleGroup.Back] },
  trapbar_deadlift: { name: "Deadlift", type: LiftType.TrapBar, muscleGroups: [MuscleGroup.Hamstrings, MuscleGroup.Quads, MuscleGroup.Back] },
  glute_kickback: { name: "Glute Kickback", type: LiftType.Machine, muscleGroups: [MuscleGroup.Hamstrings] },

  // Calves
  machine_calfRaises: { name: "Calf Raises (Standing)", type: LiftType.Machine, muscleGroups: [MuscleGroup.Calves] },
  plateMachine_calfRaise: { name: "Calf Raises (Seated)", type: LiftType.PlateMachine, muscleGroups: [MuscleGroup.Calves] },

  // Abs
  bodyweight_legRaises: { name: "Leg Raises", type: LiftType.Bodyweight, muscleGroups: [MuscleGroup.Abs] },
  bodyweight_planks: { name: "Planks", type: LiftType.Bodyweight, muscleGroups: [MuscleGroup.Abs] }, // TODO time
  front_squat_hold: { name: "Front Squat Hold", type: LiftType.Barbell, muscleGroups: [MuscleGroup.Abs]},

  // Other
  machine_hipAbduction: { name: "Hip Abduction", type: LiftType.Machine, muscleGroups: [MuscleGroup.Other] },
  machine_hipAdduction: { name: "Hip Adduction", type: LiftType.Machine, muscleGroups: [MuscleGroup.Other] },
  grippers: { name: "Grippers", type: LiftType.Other, muscleGroups: [MuscleGroup.Other] },
  dumbbell_shrugs: { name: "Shrugs", type: LiftType.Dumbbell, muscleGroups: [MuscleGroup.Other] },
  tib_raises: { name: "Tib Raises", type: LiftType.Bodyweight, muscleGroups: [MuscleGroup.Other] },
  machine_pullovers: { name: "Pullovers", type: LiftType.Machine, muscleGroups: [MuscleGroup.Other] },
  dumbbell_pullovers: { name: "Pullovers", type: LiftType.Dumbbell, muscleGroups: [MuscleGroup.Other] },

} as const);


// TODO add postfix on all duplicates
export const SystemLifts = Object.values(Lifts).map(def => {
  return {
    ...def,
    system: true
  };
});


