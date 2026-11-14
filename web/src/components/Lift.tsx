import { useState } from 'react';
import {
  Lift as LiftType,
  LiftSet,
  WeightReps,
} from '@shared/types/workout.ts';
import SetUtils from '@shared/utils/SetUtils.ts';
import LiftUtils from '@shared/utils/LiftUtils.ts';
import Set from './Set.tsx';
import AutoTextarea from './AutoTextarea.tsx';
import { settings } from '../store/Settings.ts';
import { SystemLiftDefs as liftDefs } from '@shared/LiftDatabase.ts';

type Props = {
  lift: LiftType;
  // Global "Compact" toggle; hides the sets/goals table on every lift.
  compact: boolean;
  onChange: (lift: LiftType) => void;
  // Set by LiftGroup in reorder mode; shows an eject button that moves the
  // lift out of its group to the top level of the workout.
  onRemoveFromGroup?: () => void;
  // Set in reorder mode; shows an X that removes the lift from the workout
  // after a confirmation dialog.
  onDelete?: () => void;
};

const liftOptions = Object.values(liftDefs)
  .map(def => ({ id: def.id, label: def.displayName }))
  .sort((a, b) => a.label.localeCompare(b.label));

const headerStyle = {
  fontWeight: 'bold',
  textAlign: 'center' as const,
  fontSize: 14,
};
const centerStyle = { textAlign: 'center' as const };
// Fixed so the card width doesn't change between modes; the dropdown shrinks instead.
const LIFT_WIDTH = 340;
const COLUMNS = 5; // Set, Weight, Reps, 1RM, remove

export default function Lift({
  lift,
  compact,
  onChange,
  onRemoveFromGroup,
  onDelete,
}: Props) {
  const def = liftDefs[lift.id];
  const setMaxes = lift.sets
    .filter(x => !x.warmup)
    .map(x => SetUtils.calculate1RM(settings, def, x));
  const top1RM = setMaxes.length > 0 ? Math.max(...setMaxes) : undefined;
  const goalPercent = LiftUtils.goalPercent(settings, def, lift);
  // The note box is hidden until the pencil is pressed, unless a note exists.
  // Stays open once revealed so a note cleared mid-edit doesn't vanish.
  const [noteRevealed, setNoteRevealed] = useState(false);
  const showNote = noteRevealed || lift.note !== undefined;

  function onSetChange(index: number, updated: LiftSet) {
    onChange({
      ...lift,
      sets: lift.sets.map((x, i) => (i === index ? updated : x)),
    });
  }

  function onGoalChange(index: number, updated: WeightReps) {
    onChange({
      ...lift,
      goals: lift.goals!.map((x, i) => (i === index ? updated : x)),
    });
  }

  function onRemoveSet(index: number) {
    onChange({ ...lift, sets: lift.sets.filter((_, i) => i !== index) });
  }

  function onRemoveGoal(index: number) {
    onChange({ ...lift, goals: lift.goals!.filter((_, i) => i !== index) });
  }

  // Mirrors EditableLiftItem.addSet: copy the last set, clear warmup/completed.
  function addSet() {
    let set: LiftSet = { weight: 0, reps: 0 };
    if (lift.sets.length > 0) {
      set = {
        ...lift.sets[lift.sets.length - 1],
        warmup: undefined,
        completed: undefined,
      };
    }
    onChange({ ...lift, sets: [...lift.sets, set] });
  }

  // Mirrors EditableLiftItem.addGoal: copy the last goal, else weight/reps of the last set.
  function addGoal() {
    let goal: WeightReps = { weight: 0, reps: 0 };
    if (lift.goals && lift.goals.length > 0) {
      goal = { ...lift.goals[lift.goals.length - 1] };
    } else if (lift.sets.length > 0) {
      const last = lift.sets[lift.sets.length - 1];
      goal = { weight: last.weight, reps: last.reps };
    }
    onChange({ ...lift, goals: [...(lift.goals ?? []), goal] });
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        width: LIFT_WIDTH,
        boxSizing: 'border-box',
        border: '1px solid #333',
        borderRadius: 4,
        padding: 8,
      }}
    >
      <div style={{ display: 'flex', gap: 4 }}>
        {/* Plain text in compact mode: the lift can't be changed there, and a
            <select> (even disabled) swallows the pointer events that start a
            drag, so the whole card stays draggable. */}
        {compact ? (
          <span
            style={{
              flex: 1,
              minWidth: 0,
              alignSelf: 'center',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {def.displayName}
          </span>
        ) : (
          <select
            style={{ flex: 1, minWidth: 0 }}
            value={lift.id}
            onChange={e => onChange({ ...lift, id: e.target.value })}
          >
            {liftOptions.map(opt => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        )}
        {!compact && (
          <button
            type="button"
            onClick={() => setNoteRevealed(true)}
            disabled={showNote}
            title="Add note"
            style={{ width: 28, padding: 0, flex: '0 0 auto' }}
          >
            ✎
          </button>
        )}
        {onRemoveFromGroup && (
          <button
            type="button"
            onClick={onRemoveFromGroup}
            title="Remove from group"
            style={{ width: 28, padding: 0, flex: '0 0 auto' }}
          >
            ⏏
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            onClick={() => {
              if (
                window.confirm(`Remove ${def.displayName} from this workout?`)
              )
                onDelete();
            }}
            title="Remove lift"
            style={{ width: 28, padding: 0, flex: '0 0 auto' }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Full mode only. An emptied note is dropped rather than saved as ""
          so the mobile app, which shows any defined note, stays quiet. */}
      {!compact && showNote && (
        <AutoTextarea
          value={lift.note ?? ''}
          placeholder="Note"
          autoFocus={noteRevealed}
          style={{ width: '100%', boxSizing: 'border-box' }}
          onChange={note => onChange({ ...lift, note: note || undefined })}
        />
      )}

      {/* Sets and goals share one table so their columns stay aligned. */}
      {!compact && (
        <table>
          {lift.sets.length > 0 && (
            <thead>
              <tr>
                <th style={headerStyle}>Set</th>
                <th style={headerStyle}>Weight</th>
                <th style={headerStyle}>Reps</th>
                <th style={headerStyle}>1RM</th>
                <th />
              </tr>
            </thead>
          )}
          <tbody>
            {lift.sets.map((set, i) => (
              <Set
                key={i}
                set={set}
                def={def}
                settings={settings}
                label={String(i + 1)}
                top1RM={top1RM}
                onChange={updated => onSetChange(i, updated)}
                onDelete={() => onRemoveSet(i)}
              />
            ))}
            <tr>
              <td colSpan={COLUMNS} style={centerStyle}>
                <button type="button" onClick={addSet}>
                  Add Set
                </button>
              </td>
            </tr>
          </tbody>

          <tbody>
            {goalPercent !== undefined && (
              <tr>
                <td colSpan={COLUMNS} style={centerStyle}>
                  {(goalPercent * 100).toFixed(2) + '%'}
                </td>
              </tr>
            )}
            {(lift.goals?.length ?? 0) > 0 && (
              <tr>
                <th />
                <th style={headerStyle}>Weight</th>
                <th style={headerStyle}>Reps</th>
                <th style={headerStyle}>1RM</th>
                <th />
              </tr>
            )}
            {lift.goals?.map((goal, i) => (
              <Set
                key={i}
                set={goal}
                def={def}
                settings={settings}
                label=""
                onChange={updated => onGoalChange(i, updated)}
                onDelete={() => onRemoveGoal(i)}
              />
            ))}
            <tr>
              <td colSpan={COLUMNS} style={centerStyle}>
                <button type="button" onClick={addGoal}>
                  Add Goal
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}
