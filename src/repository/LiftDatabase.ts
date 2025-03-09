import {LiftDef, LiftType, MuscleGroup} from '../types/types';


const createDictionary = <T extends Record<string, Omit<LiftDef, "id">>>(
  obj: { readonly [K in keyof T]: Readonly<T[K]> }
): { [K in keyof T]: LiftDef & { id: K } } => {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, { ...value, id: key }])
  ) as { [K in keyof T]: LiftDef & { id: K } };
};



export const Lifts = createDictionary({
  // TODO fix ids to include type AFTER

  // Chest
  barbell_benchPress: { name: "Bench Press", type: LiftType.Barbell, muscleGroups: [MuscleGroup.Chest, MuscleGroup.Triceps] },
  dumbbell_benchPress: { name: "Bench Press", type: LiftType.Dumbbell, muscleGroups: [MuscleGroup.Chest, MuscleGroup.Triceps] },
  barbell_inclinePress: { name: "Incline Press", type: LiftType.Barbell, muscleGroups: [MuscleGroup.Chest, MuscleGroup.Triceps] },
  dumbbell_inclinePress: { name: "Incline Press", type: LiftType.Dumbbell, muscleGroups: [MuscleGroup.Chest, MuscleGroup.Triceps] },
  plateMachine_inclinePress: { name: "Incline Press", type: LiftType.PlateMachine, muscleGroups: [MuscleGroup.Chest, MuscleGroup.Triceps] },
  inclinePress_machine: { name: "Incline Press", type: LiftType.Machine, muscleGroups: [MuscleGroup.Chest, MuscleGroup.Triceps] },
  machine_flys: { name: "Flys", type: LiftType.Machine, muscleGroups: [MuscleGroup.Chest] },

  // Back
  barbell_rows: { name: "Rows", type: LiftType.Barbell, muscleGroups: [MuscleGroup.Back, MuscleGroup.Biceps] },
  dumbbell_rows: { name: "Rows", type: LiftType.Dumbbell, muscleGroups: [MuscleGroup.Back, MuscleGroup.Biceps] },
  cable_rows: { name: "Rows (Cable)", type: LiftType.Machine, muscleGroups: [MuscleGroup.Back, MuscleGroup.Biceps] },
  plateMachine_hsRows: { name: "Rows", type: LiftType.PlateMachine, muscleGroups: [MuscleGroup.Back, MuscleGroup.Biceps] },
  // Rows T-Bar (Plate loaded machine)
  // Rows T-Bar (Barbell)
  barbell_uprightRow: { name: "Upright Rows", type: LiftType.Barbell, muscleGroups: [MuscleGroup.Back, MuscleGroup.Shoulders] },
  machine_pulldowns: { name: "Pulldowns (Cable)", type: LiftType.Machine, muscleGroups: [MuscleGroup.Back, MuscleGroup.Biceps] },
  plateMachine_hsPulldown: { name: "Pulldowns (High Row)", type: LiftType.PlateMachine, muscleGroups: [MuscleGroup.Back, MuscleGroup.Biceps] },
  pulldown_plate: { name: "Pulldowns", type: LiftType.PlateMachine, muscleGroups: [MuscleGroup.Back, MuscleGroup.Biceps] },
  pulldown_machine: { name: "Pulldowns", type: LiftType.Machine, muscleGroups: [MuscleGroup.Back, MuscleGroup.Biceps] },
  bodyweight_pullups: { name: "Pullups", type: LiftType.Bodyweight, muscleGroups: [MuscleGroup.Back, MuscleGroup.Biceps] },

  // Shoulders
  barbell_overheadPress: { name: "Overhead Press", type: LiftType.Barbell, muscleGroups: [MuscleGroup.Shoulders, MuscleGroup.Triceps] },
  plateMachine_hsPress: { name: "Overhead Press", type: LiftType.PlateMachine, muscleGroups: [MuscleGroup.Shoulders, MuscleGroup.Triceps] },
  ohp_machine: { name: "Overhead Press", type: LiftType.Machine, muscleGroups: [MuscleGroup.Shoulders, MuscleGroup.Triceps] },
  machine_reverseFlys: { name: "Reverse Flys", type: LiftType.Machine, muscleGroups: [MuscleGroup.Shoulders] },
  dumbbell_latRaises: { name: "Lat Raise", type: LiftType.Dumbbell, muscleGroups: [MuscleGroup.Shoulders] },
  machine_latRaise: { name: "Lat Raise", type: LiftType.Machine, muscleGroups: [MuscleGroup.Shoulders] },
  machine_facePulls: { name: "Face Pulls", type: LiftType.Machine, muscleGroups: [MuscleGroup.Shoulders] },

  // Biceps
  barbell_reverseCurls: { name: "Curls (Reverse)", type: LiftType.Barbell, muscleGroups: [MuscleGroup.Biceps] },
  dumbbell_hammerCurls: { name: "Curls (Hammer)", type: LiftType.Dumbbell, muscleGroups: [MuscleGroup.Biceps] },
  dumbbell_inclineCurls: { name: "Curls (Incline)", type: LiftType.Dumbbell, muscleGroups: [MuscleGroup.Biceps] },
  // Not a machine lift but it fits best with calculations
  machine_ezCurls: { name: "Curls (EZ-bar)", type: LiftType.Machine, muscleGroups: [MuscleGroup.Biceps] },

  // Triceps
  machine_tricep: { name: "Tricep (Machine)", type: LiftType.Machine, muscleGroups: [MuscleGroup.Triceps] },
  machine_tricepRope: { name: "Tricep (Cable)", type: LiftType.Machine, muscleGroups: [MuscleGroup.Triceps] },
  machine_tricepOverhead: { name: "Tricep (Overhead)", type: LiftType.Machine, muscleGroups: [MuscleGroup.Triceps] },
  closegrip_benchPress: { name: "Bench Press (Close-grip)", type: LiftType.Barbell, muscleGroups: [MuscleGroup.Triceps, MuscleGroup.Chest] },
  bodyweight_dips: { name: "Dips", type: LiftType.Bodyweight, muscleGroups: [MuscleGroup.Chest, MuscleGroup.Triceps] },
  dips_machine: { name: "Dips", type: LiftType.PlateMachine, muscleGroups: [MuscleGroup.Chest, MuscleGroup.Triceps] },

  // Quads
  squat: { name: "Squat", type: LiftType.Barbell, muscleGroups: [MuscleGroup.Quads, MuscleGroup.Hamstrings] },
  ssb_squat: { name: "Squat", type: LiftType.SSB, muscleGroups: [MuscleGroup.Quads, MuscleGroup.Hamstrings] },
  belt_squat: { name: "Squat (Belt)", type: LiftType.PlateMachine, muscleGroups: [MuscleGroup.Quads, MuscleGroup.Hamstrings]},
  plateMachine_vSquat: { name: "Squat (V-Squat)", type: LiftType.PlateMachine, muscleGroups: [MuscleGroup.Quads] },
  barbell_frontSquat: { name: "Squat (Front)", type: LiftType.Barbell, muscleGroups: [MuscleGroup.Quads, MuscleGroup.Hamstrings] },
  plateMachine_legPress: { name: "Leg Press", type: LiftType.PlateMachine, muscleGroups: [MuscleGroup.Quads] },
  bodyweight_lunges: { name: "Lunges", type: LiftType.Bodyweight, muscleGroups: [MuscleGroup.Quads, MuscleGroup.Hamstrings] },
  machine_legExtensions: { name: "Leg Extensions", type: LiftType.Machine, muscleGroups: [MuscleGroup.Quads] },
  split_squat: { name: "Split Squat", type: LiftType.Bodyweight, muscleGroups: [MuscleGroup.Quads, MuscleGroup.Hamstrings]},

  // Hamstrings / Glutes
  barbell_deadlift: { name: 'Deadlift', type: LiftType.Barbell, muscleGroups: [MuscleGroup.Hamstrings, MuscleGroup.Quads, MuscleGroup.Back] },
  trapbar_deadlift: { name: "Deadlift", type: LiftType.TrapBar, muscleGroups: [MuscleGroup.Hamstrings, MuscleGroup.Quads, MuscleGroup.Back] },
  barbell_sumoDeadlift: { name: "Deadlift (Sumo)", type: LiftType.Barbell, muscleGroups: [MuscleGroup.Hamstrings, MuscleGroup.Quads, MuscleGroup.Back] },
  barbell_rdl: { name: "RDL", type: LiftType.Barbell, muscleGroups: [MuscleGroup.Hamstrings, MuscleGroup.Back] },
  rdl_single: { name: "RDL (Single Leg)", type: LiftType.Other, muscleGroups: [MuscleGroup.Hamstrings, MuscleGroup.Back] },
  plateMachine_hipThrust: { name: "Hip Thrust", type: LiftType.PlateMachine, muscleGroups: [MuscleGroup.Hamstrings] },
  machine_legCurls: { name: "Leg Curls", type: LiftType.Machine, muscleGroups: [MuscleGroup.Hamstrings] },
  machine_kneelingLegCurls: { name: "Leg Curls (Kneeling)", type: LiftType.Machine, muscleGroups: [MuscleGroup.Hamstrings] },
  bodyweight_backExtensions: { name: "Back Extensions", type: LiftType.Bodyweight, muscleGroups: [MuscleGroup.Hamstrings, MuscleGroup.Back] },
  glute_kickback: { name: "Glute Kickback", type: LiftType.Machine, muscleGroups: [MuscleGroup.Hamstrings] },

  // Calves
  machine_calfRaises: { name: "Calf Raises (Standing)", type: LiftType.Machine, muscleGroups: [MuscleGroup.Calves] },
  plateMachine_calfRaise: { name: "Calf Raises (Seated)", type: LiftType.PlateMachine, muscleGroups: [MuscleGroup.Calves] },
  calfRaise_bodyWeight: { name: "Calf Raises (Body weight)", type: LiftType.Bodyweight, muscleGroups: [MuscleGroup.Calves] },

  // Abs
  bodyweight_legRaises: { name: "Leg Raises", type: LiftType.Bodyweight, muscleGroups: [MuscleGroup.Abs] },
  bodyweight_planks: { name: "Planks", type: LiftType.Bodyweight, muscleGroups: [MuscleGroup.Abs] }, // TODO time
  front_squat_hold: { name: "Front Squat Hold", type: LiftType.Barbell, muscleGroups: [MuscleGroup.Abs]},

  // Other
  machine_hipAbduction: { name: "Hip Abduction", type: LiftType.Machine, muscleGroups: [MuscleGroup.Other] },
  machine_hipAdduction: { name: "Hip Adduction", type: LiftType.Machine, muscleGroups: [MuscleGroup.Other] },
  grippers: { name: "Grippers", type: LiftType.Other, muscleGroups: [MuscleGroup.Other] },
  dumbbell_shrugs: { name: "Shrugs", type: LiftType.Dumbbell, muscleGroups: [MuscleGroup.Other] },
  shrugs_barbell: { name: "Shrugs", type: LiftType.Barbell, muscleGroups: [MuscleGroup.Other] },
  tib_raises: { name: "Tib Raises", type: LiftType.Bodyweight, muscleGroups: [MuscleGroup.Other] },
  machine_pullovers: { name: "Pullovers", type: LiftType.Machine, muscleGroups: [MuscleGroup.Other] },
  dumbbell_pullovers: { name: "Pullovers", type: LiftType.Dumbbell, muscleGroups: [MuscleGroup.Other] },

} as const);


export const SystemLifts = Object.values(Lifts).map(def => {
  return {
    ...def,
    system: true
  };
});


