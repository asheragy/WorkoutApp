import {LiftDef, LiftType, MuscleGroup, PersistedSet} from '../types/types';


const createDictionary = <T extends Record<string, Omit<LiftDef, "id">>>(
  obj: { readonly [K in keyof T]: Readonly<T[K]> }
): { [K in keyof T]: LiftDef & { id: K } } => {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, { ...value, id: key }])
  ) as { [K in keyof T]: LiftDef & { id: K } };
};



export const Lifts = createDictionary({
  // Chest
  bench_barbell: { name: "Bench Press", type: LiftType.Barbell, muscleGroups: [MuscleGroup.Chest, MuscleGroup.Triceps] },
  bench_dumbbell: { name: "Bench Press", type: LiftType.Dumbbell, muscleGroups: [MuscleGroup.Chest, MuscleGroup.Triceps] },
  inclinePress_barbell: { name: "Incline Press", type: LiftType.Barbell, muscleGroups: [MuscleGroup.Chest, MuscleGroup.Triceps] },
  inclinePress_dumbbell: { name: "Incline Press", type: LiftType.Dumbbell, muscleGroups: [MuscleGroup.Chest, MuscleGroup.Triceps] },
  inclinePress_plateMachine: { name: "Incline Press", type: LiftType.PlateMachine, muscleGroups: [MuscleGroup.Chest, MuscleGroup.Triceps] },
  inclinePress_machine: { name: "Incline Press", type: LiftType.Machine, muscleGroups: [MuscleGroup.Chest, MuscleGroup.Triceps] },
  fly_machine: { name: "Flys", type: LiftType.Machine, muscleGroups: [MuscleGroup.Chest] },

  // Back
  row_barbell: { name: "Rows", type: LiftType.Barbell, muscleGroups: [MuscleGroup.Back, MuscleGroup.Biceps] },
  row_dumbbell: { name: "Rows", type: LiftType.Dumbbell, muscleGroups: [MuscleGroup.Back, MuscleGroup.Biceps] },
  row_cable: { name: "Rows (Cable)", type: LiftType.Machine, muscleGroups: [MuscleGroup.Back, MuscleGroup.Biceps] },
  row_plateMachine: { name: "Rows", type: LiftType.PlateMachine, muscleGroups: [MuscleGroup.Back, MuscleGroup.Biceps] },
  // Rows T-Bar (Plate loaded machine)
  // Rows T-Bar (Barbell)
  uprightRow_barbell: { name: "Upright Rows", type: LiftType.Barbell, muscleGroups: [MuscleGroup.Back, MuscleGroup.Shoulders] },
  pulldown_cable: { name: "Pulldowns (Cable)", type: LiftType.Machine, muscleGroups: [MuscleGroup.Back, MuscleGroup.Biceps] },
  pulldown_hsHighRow: { name: "Pulldowns (High Row)", type: LiftType.PlateMachine, muscleGroups: [MuscleGroup.Back, MuscleGroup.Biceps] },
  pulldown_plateMachine: { name: "Pulldowns", type: LiftType.PlateMachine, muscleGroups: [MuscleGroup.Back, MuscleGroup.Biceps] },
  pulldown_machine: { name: "Pulldowns", type: LiftType.Machine, muscleGroups: [MuscleGroup.Back, MuscleGroup.Biceps] },
  pullup: { name: "Pullups", type: LiftType.Bodyweight, muscleGroups: [MuscleGroup.Back, MuscleGroup.Biceps] },

  // Shoulders
  ohp_barbell: { name: "Overhead Press", type: LiftType.Barbell, muscleGroups: [MuscleGroup.Shoulders, MuscleGroup.Triceps] },
  ohp_dumbbell: { name: "Overhead Press", type: LiftType.Dumbbell, muscleGroups: [MuscleGroup.Shoulders, MuscleGroup.Triceps] },
  ohp_plateMachine: { name: "Overhead Press", type: LiftType.PlateMachine, muscleGroups: [MuscleGroup.Shoulders, MuscleGroup.Triceps] },
  ohp_machine: { name: "Overhead Press", type: LiftType.Machine, muscleGroups: [MuscleGroup.Shoulders, MuscleGroup.Triceps] },
  reverseFly_machine: { name: "Reverse Flys", type: LiftType.Machine, muscleGroups: [MuscleGroup.Shoulders] },
  latRaise_dumbbell: { name: "Lat Raise", type: LiftType.Dumbbell, muscleGroups: [MuscleGroup.Shoulders] },
  latRaise_machine: { name: "Lat Raise", type: LiftType.Machine, muscleGroups: [MuscleGroup.Shoulders] },
  facePull: { name: "Face Pulls", type: LiftType.Machine, muscleGroups: [MuscleGroup.Shoulders] },

  // Biceps
  curl_reverse: { name: "Curls (Reverse)", type: LiftType.Barbell, muscleGroups: [MuscleGroup.Biceps] },
  curl_hammer: { name: "Curls (Hammer)", type: LiftType.Dumbbell, muscleGroups: [MuscleGroup.Biceps] },
  curl_incline: { name: "Curls (Incline)", type: LiftType.Dumbbell, muscleGroups: [MuscleGroup.Biceps] },
  // Not a machine lift but it fits best with calculations
  curl_ezBar: { name: "Curls (EZ-bar)", type: LiftType.Machine, muscleGroups: [MuscleGroup.Biceps] },

  // Triceps
  tricep_machine: { name: "Tricep (Machine)", type: LiftType.Machine, muscleGroups: [MuscleGroup.Triceps] },
  tricep_rope: { name: "Tricep (Cable)", type: LiftType.Machine, muscleGroups: [MuscleGroup.Triceps] },
  tricep_overhead: { name: "Tricep (Overhead)", type: LiftType.Machine, muscleGroups: [MuscleGroup.Triceps] },
  bench_closegrip: { name: "Bench Press (Close-grip)", type: LiftType.Barbell, muscleGroups: [MuscleGroup.Triceps, MuscleGroup.Chest] },
  dip: { name: "Dips", type: LiftType.Bodyweight, muscleGroups: [MuscleGroup.Chest, MuscleGroup.Triceps] },
  dip_machine: { name: "Dips", type: LiftType.PlateMachine, muscleGroups: [MuscleGroup.Chest, MuscleGroup.Triceps] },

  // Quads
  squat_barbell: { name: "Squat", type: LiftType.Barbell, muscleGroups: [MuscleGroup.Quads, MuscleGroup.Hamstrings] },
  squat_ssb: { name: "Squat", type: LiftType.SSB, muscleGroups: [MuscleGroup.Quads, MuscleGroup.Hamstrings] },
  squat_belt: { name: "Squat (Belt)", type: LiftType.PlateMachine, muscleGroups: [MuscleGroup.Quads, MuscleGroup.Hamstrings]},
  squat_v: { name: "Squat (V-Squat)", type: LiftType.PlateMachine, muscleGroups: [MuscleGroup.Quads] },
  squat_front: { name: "Squat (Front)", type: LiftType.Barbell, muscleGroups: [MuscleGroup.Quads, MuscleGroup.Hamstrings] },
  legPress: { name: "Leg Press", type: LiftType.PlateMachine, muscleGroups: [MuscleGroup.Quads] },
  lunge: { name: "Lunges", type: LiftType.Bodyweight, muscleGroups: [MuscleGroup.Quads, MuscleGroup.Hamstrings] },
  legExtensions: { name: "Leg Extensions", type: LiftType.Machine, muscleGroups: [MuscleGroup.Quads] },
  splitSquat: { name: "Split Squat", type: LiftType.Bodyweight, muscleGroups: [MuscleGroup.Quads, MuscleGroup.Hamstrings]},

  // Hamstrings / Glutes
  deadlift_barbell: { name: 'Deadlift', type: LiftType.Barbell, muscleGroups: [MuscleGroup.Hamstrings, MuscleGroup.Quads, MuscleGroup.Back] },
  deadlift_trapbar: { name: "Deadlift", type: LiftType.TrapBar, muscleGroups: [MuscleGroup.Hamstrings, MuscleGroup.Quads, MuscleGroup.Back] },
  deadlift_trapbar_high: { name: "Deadlift High (TrapBar)", type: LiftType.TrapBar, muscleGroups: [MuscleGroup.Hamstrings, MuscleGroup.Quads, MuscleGroup.Back] },
  deadlift_sumo: { name: "Deadlift (Sumo)", type: LiftType.Barbell, muscleGroups: [MuscleGroup.Hamstrings, MuscleGroup.Quads, MuscleGroup.Back] },
  rdl_barbell: { name: "RDL", type: LiftType.Barbell, muscleGroups: [MuscleGroup.Hamstrings, MuscleGroup.Back] },
  rdl_single: { name: "RDL (Single Leg)", type: LiftType.Other, muscleGroups: [MuscleGroup.Hamstrings, MuscleGroup.Back] },
  hipThrust: { name: "Hip Thrust", type: LiftType.PlateMachine, muscleGroups: [MuscleGroup.Hamstrings] },
  legCurl_seated: { name: "Leg Curls", type: LiftType.Machine, muscleGroups: [MuscleGroup.Hamstrings] },
  legCurl_kneeling: { name: "Leg Curls (Kneeling)", type: LiftType.Machine, muscleGroups: [MuscleGroup.Hamstrings] },
  backExtension: { name: "Back Extensions", type: LiftType.Bodyweight, muscleGroups: [MuscleGroup.Hamstrings, MuscleGroup.Back] },
  gluteKickback: { name: "Glute Kickback", type: LiftType.Machine, muscleGroups: [MuscleGroup.Hamstrings] },

  // Calves
  calfRaise_standing: { name: "Calf Raises (Standing)", type: LiftType.Machine, muscleGroups: [MuscleGroup.Calves] },
  calfRaise_seated: { name: "Calf Raises (Seated)", type: LiftType.PlateMachine, muscleGroups: [MuscleGroup.Calves] },
  calfRaise_bodyWeight: { name: "Calf Raises (Body weight)", type: LiftType.Bodyweight, muscleGroups: [MuscleGroup.Calves] },

  // Abs
  legRaise: { name: "Leg Raises", type: LiftType.Bodyweight, muscleGroups: [MuscleGroup.Abs] },
  plank: { name: "Planks", type: LiftType.Bodyweight, muscleGroups: [MuscleGroup.Abs] }, // TODO time
  frontSquatHold: { name: "Front Squat Hold", type: LiftType.Barbell, muscleGroups: [MuscleGroup.Abs]},

  // Other
  hipAbduction: { name: "Hip Abduction", type: LiftType.Machine, muscleGroups: [MuscleGroup.Other] },
  hipAdduction: { name: "Hip Adduction", type: LiftType.Machine, muscleGroups: [MuscleGroup.Other] },
  gripper: { name: "Grippers", type: LiftType.Other, muscleGroups: [MuscleGroup.Other] },
  shrug_dumbbell: { name: "Shrugs", type: LiftType.Dumbbell, muscleGroups: [MuscleGroup.Other] },
  shrug_barbell: { name: "Shrugs", type: LiftType.Barbell, muscleGroups: [MuscleGroup.Other] },
  tibRaise: { name: "Tib Raises", type: LiftType.Bodyweight, muscleGroups: [MuscleGroup.Other] },
  pullover_machine: { name: "Pullovers", type: LiftType.Machine, muscleGroups: [MuscleGroup.Other] },
  pullover_dumbbell: { name: "Pullovers", type: LiftType.Dumbbell, muscleGroups: [MuscleGroup.Other] },
} as const);



const goals: Record<string, PersistedSet> = {
  [Lifts.bench_dumbbell.id]: {
    weight: 100,
    reps: 10
  },
  [Lifts.bench_barbell.id]: {
    weight: 315,
    reps: 1,
  },
  [Lifts.inclinePress_barbell.id]: {
    weight: 275,
    reps: 1,
  },
  [Lifts.ohp_barbell.id]: {
    weight: 205,
    reps: 1,
  },
  [Lifts.row_barbell.id]: {
    weight: 225,
    reps: 10,
  },
  [Lifts.hipThrust.id]: {
    weight: 135,
    reps: 10,
  },
  [Lifts.squat_front.id]: {
    weight: 365,
    reps: 1,
  },
  [Lifts.deadlift_barbell.id]: {
    weight: 500,
    reps: 1,
  },
  [Lifts.deadlift_trapbar.id]: {
    weight: 455 + 15,
    reps: 1,
  },
  [Lifts.deadlift_trapbar_high.id]: {
    weight: 545 + 15,
    reps: 1,
  },
  [Lifts.deadlift_sumo.id]: {
    weight: 405,
    reps: 1,
  },
  [Lifts.rdl_barbell.id]: {
    weight: 275,
    reps: 10,
  },
}

export const SystemLifts = Object.values(Lifts).map(def => {
  if (goals[def.id]) {
    return {
      ...def,
      system: true,
      goal: goals[def.id]
    };
  }

  return {
    ...def,
    system: true
  };
});


