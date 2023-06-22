import {LiftDef, LiftType} from '../types/types';

export function lookupDef(id: string, overrides: LiftDef[]): LiftDef {
  var override = overrides.find(x => x.id == id);
  if (override != undefined) return override;

  var match = lifts.find(x => x.id == id);
  if (match == undefined) throw new Error('No lift matching id=' + id);
  return match;
}

export class LiftId {
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
  public static readonly HammerStrength_Pulldown = 'hsPulldown';
  public static readonly Curls_ReverseBarbell = 'reverseCurls';
  public static readonly ReverseFlys = 'reverseFlys';
  public static readonly HammerCurls = 'hammerCurls';

  public static readonly LatRaises = 'latRaise';
  public static readonly TricepExtension = 'tricepExt';
  public static readonly HammerStrength_OverheadPress = 'hsPress';

  public static readonly DeadLift = 'deadlift';
  public static readonly DeadLift_Sumo = 'sumoDL';
  public static readonly DeadLift_TrapBar = 'trapBarDL';
  public static readonly RDL = 'rdl';
  public static readonly FrontSquat = 'frontSquat';
  public static readonly SSBSquat = 'ssb';
  public static readonly HatfieldSquat = 'hatfieldSquat';

  public static readonly Lunges = 'lunges';
  public static readonly CalfRaises = 'calfRaises';
  public static readonly LegExtensions = 'legExtensions';
  public static readonly LegCurls = 'legCurls';
  public static readonly LegPress = 'legPress';
  //public static readonly  = '';

  public static readonly placeHolder = 'placeholder';
}

export const lifts: LiftDef[] = [
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
    name: 'Bench Press (Dumbbell)',
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
    name: 'Incline Press (Dumbell)',
    type: LiftType.Dumbbell,
  },
  {
    id: LiftId.InclinePress_Barbell,
    name: 'Incline Press (Barbell)',
    type: LiftType.Barbell,
  },
  {
    id: LiftId.DumbellRows,
    name: 'Dumbbell Rows',
    type: LiftType.Dumbbell,
  },
  {
    id: LiftId.HammerStrength_Pulldown, // TODO make custom lift
    name: 'HS Pulldown',
    type: LiftType.Machine,
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
    id: LiftId.HammerStrength_OverheadPress,
    name: 'HS Press',
    type: LiftType.Machine,
  },
  {
    id: LiftId.DeadLift_Sumo,
    name: 'Sumo DL',
    type: LiftType.Barbell,
  },
  {
    id: LiftId.DeadLift_TrapBar,
    name: 'Trap Bar DL',
    type: LiftType.Barbell,
  },
  {
    id: LiftId.FrontSquat,
    name: 'Front Squat',
    type: LiftType.Barbell,
  },
  {
    id: LiftId.SSBSquat,
    name: 'SSB Squat',
    type: LiftType.Barbell, // TODO specialty bar?
  },
  {
    id: LiftId.HatfieldSquat,
    name: 'Hatfield Squat',
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
  {
    id: LiftId.placeHolder,
    name: 'Temp Placeholder',
    type: LiftType.Barbell,
  },
  /* Copy paste 
  {
    id: LiftId.,
    name: '',
    type: LiftType.
  },
  */
];

// TODO use this name instead of the other
export const SystemLifts = lifts;
