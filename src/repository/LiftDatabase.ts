import {LiftDef, LiftType, MuscleGroup} from '../types/types';

const lifts: LiftDef[] = [
  // Barbell
  { id: 'barbell_deadlift', name: 'Deadlift', type: LiftType.Barbell },
  { id: 'barbell_sumoDeadlift', name: 'Sumo DL', type: LiftType.Barbell },
  { id: 'barbell_rows', name: 'Rows', type: LiftType.Barbell },
  { id: 'cable_rows',   name: 'Rows (Cable)', type: LiftType.Machine },
  { id: 'barbell_uprightRow', name: 'Upright Rows', type: LiftType.Barbell },
  { id: 'barbell_rdl', name: 'RDL', type: LiftType.Barbell },
  { id: 'barbell_benchPress', name: 'Bench Press', type: LiftType.Barbell },
  { id: 'closegrip_benchPress', name: 'Bench Press (Close-grip)', type: LiftType.Barbell },
  { id: 'barbell_overheadPress', name: 'Overhead Press', type: LiftType.Barbell },
  { id: 'barbell_inclinePress', name: 'Incline Press', type: LiftType.Barbell },
  { id: 'barbell_reverseCurls', name: 'Reverse Curls', type: LiftType.Barbell },
  { id: 'barbell_frontSquat', name: 'Front Squat', type: LiftType.Barbell, muscleGroups: [MuscleGroup.Quads] },
  // Dumbbell
  { id: 'dumbbell_benchPress', name: 'Bench Press', type: LiftType.Dumbbell },
  { id: 'dumbbell_inclinePress', name: 'Incline Press', type: LiftType.Dumbbell },
  { id: 'dumbbell_hammerCurls', name: 'Hammer Curls', type: LiftType.Dumbbell },
  { id: 'dumbbell_inclineCurls', name: 'Incline Curls', type: LiftType.Dumbbell },
  { id: 'dumbbell_latRaises', name: 'Lat Raise', type: LiftType.Dumbbell },
  { id: 'dumbbell_rows', name: 'Rows', type: LiftType.Dumbbell },
  { id: 'dumbbell_shrugs', name: 'Shrugs', type: LiftType.Dumbbell },
  // Machine
  { id: 'machine_facePulls', name: 'Face Pulls', type: LiftType.Machine },
  { id: 'machine_flys', name: 'Flys', type: LiftType.Machine },
  { id: 'machine_reverseFlys', name: 'Reverse Flys', type: LiftType.Machine },
  { id: 'machine_tricep', name: 'Tricep Machine', type: LiftType.Machine },
  { id: 'machine_tricepRope', name: 'Tricep Rope', type: LiftType.Machine },
  { id: 'machine_tricepOverhead', name: 'Tricep Overhead', type: LiftType.Machine },
  { id: 'machine_calfRaises', name: 'Calf Raises (Standing)', type: LiftType.Machine },
  { id: 'machine_legExtensions', name: 'Leg Extensions', type: LiftType.Machine },
  { id: 'machine_legCurls', name: 'Leg Curls', type: LiftType.Machine },
  { id: 'machine_kneelingLegCurls', name: 'Kneeling Leg Curls', type: LiftType.Machine },
  { id: 'machine_pulldowns', name: 'Pulldowns', type: LiftType.Machine },
  { id: 'machine_pullovers', name: 'Pullovers', type: LiftType.Machine },
  { id: 'dumbbell_pullovers', name: 'Pullovers', type: LiftType.Dumbbell },
  { id: 'machine_hipAbduction', name: 'Hip Abduction Machine', type: LiftType.Machine },
  { id: 'machine_latRaise', name: 'Lat Raise Machine', type: LiftType.Machine },
  // Not a machine lift but it fits best with calculations
  { id: 'machine_ezCurls', name: 'EZ-bar Curls', type: LiftType.Machine },
  // Bodyweight
  { id: 'bodyweight_pullups', name: 'Pullups', type: LiftType.Bodyweight },
  { id: 'bodyweight_dips', name: 'Dips', type: LiftType.Bodyweight, muscleGroups: [MuscleGroup.Chest, MuscleGroup.Triceps] },
  { id: 'bodyweight_lunges', name: 'Lunges', type: LiftType.Bodyweight },
  { id: 'bodyweight_backExtensions', name: 'Back Extensions', type: LiftType.Bodyweight },
  { id: 'bodyweight_legRaises', name: 'Leg Raises', type: LiftType.Bodyweight },
  { id: 'bodyweight_planks', name: 'Planks', type: LiftType.Bodyweight },
  // Plate Machine / Hammer Strength
  { id: 'plateMachine_hsPress', name: 'HS Overhead Press', type: LiftType.PlateMachine },
  { id: 'plateMachine_inclinePress', name: 'Incline Press Machine', type: LiftType.PlateMachine },
  { id: 'plateMachine_hsPulldown', name: 'HS Pulldown', type: LiftType.PlateMachine },
  { id: 'plateMachine_hsRows', name: 'HS Rows', type: LiftType.PlateMachine },
  { id: 'plateMachine_legPress', name: 'Leg Press', type: LiftType.PlateMachine },
  { id: 'plateMachine_hipThrust', name: 'Hip Thrust', type: LiftType.PlateMachine },
  { id: 'plateMachine_calfRaise', name: 'Calf Raises (Seated)', type: LiftType.PlateMachine },
  { id: 'plateMachine_vSquat', name: 'V-Squat', type: LiftType.PlateMachine },
  // Trap bar
  { id: 'trapbar_deadlift', name: 'Deadlift', type: LiftType.TrapBar },
  // SSB
  { id: 'ssb_squat', name: 'Squat', type: LiftType.SSB, muscleGroups: [MuscleGroup.Quads] },
  { id: 'grippers', name: 'Grippers', type: LiftType.Other },
];

export const SystemLifts = lifts.map(def => {
  def.system = true;
  return def;
});
