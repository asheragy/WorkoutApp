import { LiftSet } from '@shared/types/workout.ts';
import { GlobalSettings, LiftDef } from '@shared/types/types.ts';
import SetUtils from '@shared/utils/SetUtils.ts';
import Utils from '../utils/Utils.ts';

type Props = {
  set: LiftSet;
  def: LiftDef;
  settings: GlobalSettings;
  // Strict 1-based numbering for now, not the warmup/label logic the phone app uses.
  // Goals pass an empty label so their cells line up with the sets above.
  label: string;
  // Best working-set 1RM of the lift; warmups show their 1RM as a percent of it.
  top1RM?: number;
  onChange: (set: LiftSet) => void;
  onDelete: () => void;
};

const inputStyle = { width: 64, textAlign: 'right' as const };

export default function Set({ set, def, settings, label, top1RM, onChange, onDelete }: Props) {
  const set1RM = SetUtils.calculate1RM(settings, def, set);
  const oneRM = set.warmup
    ? top1RM
      ? Math.round((100 * set1RM) / top1RM) + '%'
      : ''
    : Math.round(set1RM * 10) / 10;

  return (
    <tr>
      <td style={{ textAlign: 'center' }}>{label}</td>
      <td>
        <input
          type="number"
          style={inputStyle}
          step={Utils.weightStep(def)}
          value={set.weight}
          onChange={e => onChange({ ...set, weight: Number(e.target.value) })}
        />
      </td>
      <td>
        <input
          type="number"
          style={inputStyle}
          step={1}
          value={set.reps}
          onChange={e => onChange({ ...set, reps: Number(e.target.value) })}
        />
      </td>
      <td style={{ textAlign: 'center' }}>{oneRM}</td>
      <td>
        <button type="button" onClick={onDelete} title="Remove">
          x
        </button>
      </td>
    </tr>
  );
}
