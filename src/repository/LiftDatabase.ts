import {LiftDef, LiftType} from '../types/types';

class LiftId {
  public static readonly BenchPress = 'bench';
  public static readonly BenchPress_Dumbell = 'dumbellBench';
  public static readonly OverheadPress = 'overheadPress';

  public static readonly FacePulls = 'facePulls';
  public static readonly Pullups = 'pullups';
  public static readonly Dips = 'dips';
  public static readonly Curls_EzBar = 'curlsEzBar';
  public static readonly InclinePress_Dumbell = 'inclineDbPress';
  public static readonly InclinePress_Barbell = 'inclineBBPress';

  public static readonly DumbellRows = 'dbRows';
  public static readonly Curls_ReverseBarbell = 'reverseCurls';
  public static readonly ReverseFlys = 'reverseFlys';
  public static readonly HammerCurls = 'hammerCurls';

  public static readonly LatRaises = 'latRaise';
  public static readonly TricepExtension = 'tricepExt';

  public static readonly DeadLift = 'deadlift';
  public static readonly DeadLift_Sumo = 'sumoDL';
  public static readonly RDL = 'rdl';
  public static readonly FrontSquat = 'frontSquat';
  public static readonly HatfieldSquat = 'hatfieldSquat';

  public static readonly Lunges = 'lunges';
  public static readonly CalfRaises = 'calfRaises';
  public static readonly LegExtensions = 'legExtensions';
  public static readonly LegCurls = 'legCurls';
  public static readonly LegPress = 'legPress';
}

const lifts: LiftDef[] = [
  {
    id: LiftId.BenchPress,
    name: 'Bench Press',
    type: LiftType.Barbell,
  },
  {
    id: LiftId.OverheadPress,
    name: 'Overhead Press',
    type: LiftType.Barbell,
  },
  {
    id: LiftId.BenchPress_Dumbell,
    name: 'Bench Press',
    type: LiftType.Dumbbell,
  },
  {
    id: LiftId.FacePulls,
    name: 'Face Pulls',
    type: LiftType.Machine,
  },
  {
    id: LiftId.Pullups,
    name: 'Pullups',
    type: LiftType.Bodyweight,
  },
  {
    id: LiftId.Dips,
    name: 'Dips',
    type: LiftType.Bodyweight,
  },
  {
    id: LiftId.Curls_EzBar,
    name: 'Curls',
    type: LiftType.Barbell,
  },
  {
    id: LiftId.InclinePress_Dumbell,
    name: 'Incline Press',
    type: LiftType.Dumbbell,
  },
  {
    id: LiftId.InclinePress_Barbell,
    name: 'Incline Press',
    type: LiftType.Barbell,
  },
  {
    id: LiftId.DumbellRows,
    name: 'Dumbbell Rows',
    type: LiftType.Dumbbell,
  },
  {
    id: LiftId.Curls_ReverseBarbell,
    name: 'Reverse Curls',
    type: LiftType.Barbell,
  },
  {
    id: LiftId.ReverseFlys,
    name: 'Reverse Flys',
    type: LiftType.Machine,
  },
  {
    id: LiftId.HammerCurls,
    name: 'Hammer Curls',
    type: LiftType.Dumbbell,
  },
  {
    id: LiftId.LatRaises,
    name: 'Lat Raises',
    type: LiftType.Dumbbell,
  },
  {
    id: LiftId.TricepExtension,
    name: 'Tricep Extensions',
    type: LiftType.Machine,
  },
  {
    id: LiftId.DeadLift_Sumo,
    name: 'Sumo DL',
    type: LiftType.Barbell,
  },
  {
    id: LiftId.FrontSquat,
    name: 'Front Squat',
    type: LiftType.Barbell,
  },
  {
    id: LiftId.RDL,
    name: 'RDL',
    type: LiftType.Barbell,
  },
  {
    id: LiftId.Lunges,
    name: 'Lunges',
    type: LiftType.Dumbbell,
  },
  {
    id: LiftId.CalfRaises,
    name: 'Calf Raises',
    type: LiftType.Machine,
  },
  {
    id: LiftId.LegExtensions,
    name: 'Leg Extensions',
    type: LiftType.Machine,
  },
  {
    id: LiftId.LegCurls,
    name: 'Leg Curls',
    type: LiftType.Machine,
  },
  {
    id: LiftId.LegPress,
    name: 'Leg Press',
    type: LiftType.Machine,
  },
  // Hammer Strength
  {
    id: 'hsPress',
    name: 'HS Overhead Press',
    type: LiftType.PlateMachine,
  },
  {
    id: 'hsPulldown',
    name: 'HS Pulldown',
    type: LiftType.PlateMachine,
  },
  {
    id: 'hsRows',
    name: 'HS Rows',
    type: LiftType.PlateMachine,
  },
  // Trap bar
  {
    id: 'trapBarDL',
    name: 'Deadlift',
    type: LiftType.TrapBar,
  },
  // SSB
  {
    id: 'ssb',
    name: 'Squat',
    type: LiftType.SSB,
  },
];

export const SystemLifts = lifts.map(def => {
  def.system = true;
  return def;
});
