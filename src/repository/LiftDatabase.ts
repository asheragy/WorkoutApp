import {LiftDef, LiftType, MuscleGroup} from '../types/types';


const createDictionary = <T extends Record<string, Omit<LiftDef, "id">>>(obj: { [K in keyof T]: Omit<T[K], "id"> }): { [K in keyof T]: LiftDef } => {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, { ...value, id: key }])
  ) as { [K in keyof T]: LiftDef };
};

export const Lifts = createDictionary({
  // Barbell
  barbell_deadlift: { name: 'Deadlift', type: LiftType.Barbell },
  barbell_sumoDeadlift: { name: "Sumo DL", type: LiftType.Barbell },
  barbell_rows: { name: "Rows", type: LiftType.Barbell },
  cable_rows: { name: "Rows (Cable)", type: LiftType.Machine },
  barbell_uprightRow: { name: "Upright Rows", type: LiftType.Barbell },
  barbell_rdl: { name: "RDL", type: LiftType.Barbell },
  barbell_benchPress: { name: "Bench Press", type: LiftType.Barbell },
  closegrip_benchPress: { name: "Bench Press (Close-grip)", type: LiftType.Barbell },
  barbell_overheadPress: { name: "Overhead Press", type: LiftType.Barbell },
  barbell_inclinePress: { name: "Incline Press", type: LiftType.Barbell },
  barbell_reverseCurls: { name: "Reverse Curls", type: LiftType.Barbell },
  barbell_frontSquat: { name: "Front Squat", type: LiftType.Barbell, muscleGroups: [MuscleGroup.Quads] },
  // Dumbbell
  dumbbell_benchPress: { name: "Bench Press", type: LiftType.Dumbbell },
  dumbbell_inclinePress: { name: "Incline Press", type: LiftType.Dumbbell },
  dumbbell_hammerCurls: { name: "Hammer Curls", type: LiftType.Dumbbell },
  dumbbell_inclineCurls: { name: "Incline Curls", type: LiftType.Dumbbell },
  dumbbell_latRaises: { name: "Lat Raise", type: LiftType.Dumbbell },
  dumbbell_rows: { name: "Rows", type: LiftType.Dumbbell },
  dumbbell_shrugs: { name: "Shrugs", type: LiftType.Dumbbell },
  // Machine
  machine_facePulls: { name: "Face Pulls", type: LiftType.Machine },
  machine_flys: { name: "Flys", type: LiftType.Machine },
  machine_reverseFlys: { name: "Reverse Flys", type: LiftType.Machine },
  machine_tricep: { name: "Tricep Machine", type: LiftType.Machine },
  machine_tricepRope: { name: "Tricep Rope", type: LiftType.Machine },
  machine_tricepOverhead: { name: "Tricep Overhead", type: LiftType.Machine },
  machine_calfRaises: { name: "Calf Raises (Standing)", type: LiftType.Machine },
  machine_legExtensions: { name: "Leg Extensions", type: LiftType.Machine },
  machine_legCurls: { name: "Leg Curls", type: LiftType.Machine },
  machine_kneelingLegCurls: { name: "Kneeling Leg Curls", type: LiftType.Machine },
  machine_pulldowns: { name: "Pulldowns", type: LiftType.Machine },
  machine_pullovers: { name: "Pullovers", type: LiftType.Machine },
  dumbbell_pullovers: { name: "Pullovers", type: LiftType.Dumbbell },
  machine_hipAbduction: { name: "Hip Abduction Machine", type: LiftType.Machine },
  machine_latRaise: { name: "Lat Raise Machine", type: LiftType.Machine },
  // Not a machine lift but it fits best with calculations
  machine_ezCurls: { name: "EZ-bar Curls", type: LiftType.Machine },
  // Bodyweight
  bodyweight_pullups: { name: "Pullups", type: LiftType.Bodyweight },
  bodyweight_dips: { name: "Dips", type: LiftType.Bodyweight, muscleGroups: [MuscleGroup.Chest, MuscleGroup.Triceps] },
  bodyweight_lunges: { name: "Lunges", type: LiftType.Bodyweight },
  bodyweight_backExtensions: { name: "Back Extensions", type: LiftType.Bodyweight },
  bodyweight_legRaises: { name: "Leg Raises", type: LiftType.Bodyweight },
  bodyweight_planks: { name: "Planks", type: LiftType.Bodyweight },
  // Plate Machine / Hammer Strength
  plateMachine_hsPress: { name: "HS Overhead Press", type: LiftType.PlateMachine },
  plateMachine_inclinePress: { name: "Incline Press Machine", type: LiftType.PlateMachine },
  plateMachine_hsPulldown: { name: "HS Pulldown", type: LiftType.PlateMachine },
  plateMachine_hsRows: { name: "HS Rows", type: LiftType.PlateMachine },
  plateMachine_legPress: { name: "Leg Press", type: LiftType.PlateMachine },
  plateMachine_hipThrust: { name: "Hip Thrust", type: LiftType.PlateMachine },
  plateMachine_calfRaise: { name: "Calf Raises (Seated)", type: LiftType.PlateMachine },
  plateMachine_vSquat: { name: "V-Squat", type: LiftType.PlateMachine },
  // Trap bar
  trapbar_deadlift: { name: "Deadlift", type: LiftType.TrapBar },
  // SSB
  ssb_squat: { name: "Squat", type: LiftType.SSB, muscleGroups: [MuscleGroup.Quads] },
  grippers: { name: "Grippers", type: LiftType.Other }
});


export const SystemLifts = Object.values(Lifts).map(def => {
  return {
    ...def,
    system: true
  };
});


