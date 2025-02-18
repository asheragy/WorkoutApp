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
  // Chest
  barbell_benchPress: { name: "Bench Press", type: LiftType.Barbell },
  barbell_inclinePress: { name: "Incline Press", type: LiftType.Barbell },
  dumbbell_benchPress: { name: "Bench Press", type: LiftType.Dumbbell },
  dumbbell_inclinePress: { name: "Incline Press", type: LiftType.Dumbbell },
  machine_flys: { name: "Flys", type: LiftType.Machine },
  machine_pullovers: { name: "Pullovers", type: LiftType.Machine },
  dumbbell_pullovers: { name: "Pullovers", type: LiftType.Dumbbell },
  bodyweight_dips: { name: "Dips", type: LiftType.Bodyweight, muscleGroups: [MuscleGroup.Chest, MuscleGroup.Triceps] },
  plateMachine_inclinePress: { name: "Incline Press Machine", type: LiftType.PlateMachine },

  // Back
  barbell_rows: { name: "Rows", type: LiftType.Barbell },
  cable_rows: { name: "Rows (Cable)", type: LiftType.Machine },
  barbell_uprightRow: { name: "Upright Rows", type: LiftType.Barbell },
  dumbbell_rows: { name: "Rows", type: LiftType.Dumbbell },
  machine_pulldowns: { name: "Pulldowns", type: LiftType.Machine },
  bodyweight_pullups: { name: "Pullups", type: LiftType.Bodyweight },
  plateMachine_hsPulldown: { name: "HS Pulldown", type: LiftType.PlateMachine },
  plateMachine_hsRows: { name: "HS Rows", type: LiftType.PlateMachine },

  // Shoulders
  barbell_overheadPress: { name: "Overhead Press", type: LiftType.Barbell },
  machine_reverseFlys: { name: "Reverse Flys", type: LiftType.Machine },
  dumbbell_latRaises: { name: "Lat Raise", type: LiftType.Dumbbell },
  machine_latRaise: { name: "Lat Raise Machine", type: LiftType.Machine },
  machine_facePulls: { name: "Face Pulls", type: LiftType.Machine },
  plateMachine_hsPress: { name: "HS Overhead Press", type: LiftType.PlateMachine },

  // Biceps
  barbell_reverseCurls: { name: "Reverse Curls", type: LiftType.Barbell },
  dumbbell_hammerCurls: { name: "Hammer Curls", type: LiftType.Dumbbell },
  dumbbell_inclineCurls: { name: "Incline Curls", type: LiftType.Dumbbell },
  // Not a machine lift but it fits best with calculations
  machine_ezCurls: { name: "EZ-bar Curls", type: LiftType.Machine },

  // Triceps
  machine_tricep: { name: "Tricep Machine", type: LiftType.Machine },
  machine_tricepRope: { name: "Tricep Rope", type: LiftType.Machine },
  machine_tricepOverhead: { name: "Tricep Overhead", type: LiftType.Machine },
  closegrip_benchPress: { name: "Bench Press (Close-grip)", type: LiftType.Barbell },

  // Quads
  ssb_squat: { name: "Squat", type: LiftType.SSB, muscleGroups: [MuscleGroup.Quads] },
  plateMachine_legPress: { name: "Leg Press", type: LiftType.PlateMachine },
  plateMachine_vSquat: { name: "V-Squat", type: LiftType.PlateMachine },
  bodyweight_lunges: { name: "Lunges", type: LiftType.Bodyweight },
  barbell_frontSquat: { name: "Front Squat", type: LiftType.Barbell, muscleGroups: [MuscleGroup.Quads] },
  machine_legExtensions: { name: "Leg Extensions", type: LiftType.Machine },
  belt_squat: { name: "Belt Squat", type: LiftType.PlateMachine, muscleGroups: [MuscleGroup.Quads]},
  split_squat: { name: "Split Squat", type: LiftType.Bodyweight, muscleGroups: [MuscleGroup.Quads]},

  // Hamstrings / Glutes
  plateMachine_hipThrust: { name: "Hip Thrust", type: LiftType.PlateMachine },
  machine_legCurls: { name: "Leg Curls", type: LiftType.Machine },
  machine_kneelingLegCurls: { name: "Kneeling Leg Curls", type: LiftType.Machine },
  bodyweight_backExtensions: { name: "Back Extensions", type: LiftType.Bodyweight },
  barbell_deadlift: { name: 'Deadlift', type: LiftType.Barbell },
  barbell_sumoDeadlift: { name: "Sumo DL", type: LiftType.Barbell },
  barbell_rdl: { name: "RDL", type: LiftType.Barbell },
  trapbar_deadlift: { name: "Deadlift", type: LiftType.TrapBar },
  glute_kickback: { name: "Glute Kickback", type: LiftType.Machine },

  // Calves
  machine_calfRaises: { name: "Calf Raises (Standing)", type: LiftType.Machine },
  plateMachine_calfRaise: { name: "Calf Raises (Seated)", type: LiftType.PlateMachine },

  // Abs
  bodyweight_legRaises: { name: "Leg Raises", type: LiftType.Bodyweight },
  bodyweight_planks: { name: "Planks", type: LiftType.Bodyweight }, // TODO time
  front_squat_hold: { name: "Front Squat Hold", type: LiftType.Barbell, muscleGroups: [MuscleGroup.Abs]},

  // TODO misc category
  machine_hipAbduction: { name: "Hip Abduction", type: LiftType.Machine },
  machine_hipAdduction: { name: "Hip Adduction", type: LiftType.Machine },
  grippers: { name: "Grippers", type: LiftType.Other },
  dumbbell_shrugs: { name: "Shrugs", type: LiftType.Dumbbell },
  tib_raises: { name: "Tib Raises", type: LiftType.Bodyweight },


} as const);


// TODO add postfix on all duplicates
export const SystemLifts = Object.values(Lifts).map(def => {
  return {
    ...def,
    system: true
  };
});


