import { useEffect, useState } from 'react';
import { Lift as LiftType, LiftSet } from '@shared/types/workout.ts';
import SetUtils from '@shared/utils/SetUtils.ts';
import LiftUtils from '@shared/utils/LiftUtils.ts';
import Set from './Set.tsx';
import { settings } from '../store/Settings.ts';
import { liftDefs } from '../store/LiftDefs.ts';

type Props = {
  lift: LiftType;
  // Global "Compact" toggle; whenever it changes every lift snaps to that collapsed state.
  compact: boolean;
  // Global "Reorder" toggle; shows up/down arrows to the left of the dropdown.
  reorder: boolean;
  onChange: (lift: LiftType) => void;
  // Undefined when the lift is already first/last in its workout.
  onMoveUp?: () => void;
  onMoveDown?: () => void;
};

const liftOptions = Object.values(liftDefs)
  .map(def => ({ id: def.id, label: def.displayName }))
  .sort((a, b) => a.label.localeCompare(b.label));

const headerStyle = { fontWeight: 'bold', textAlign: 'center' as const, fontSize: 14 };
const centerStyle = { textAlign: 'center' as const };
const arrowStyle = { width: 28, padding: 0, flex: '0 0 auto' };
// Fixed so the card width doesn't change when the reorder arrows appear; the dropdown shrinks instead.
const LIFT_WIDTH = 340;
const COLUMNS = 5; // Set, Weight, Reps, 1RM, remove

export default function Lift({ lift, compact, reorder, onChange, onMoveUp, onMoveDown }: Props) {
  const def = liftDefs[lift.id];
  const [collapsed, setCollapsed] = useState(compact);

  useEffect(() => setCollapsed(compact), [compact]);

  const setMaxes = lift.sets.filter(x => !x.warmup).map(x => SetUtils.calculate1RM(settings, def, x));
  const top1RM = setMaxes.length > 0 ? Math.max(...setMaxes) : undefined;
  const goalPercent = LiftUtils.goalPercent(settings, def, lift);

  function onSetChange(index: number, updated: LiftSet) {
    onChange({ ...lift, sets: lift.sets.map((x, i) => (i === index ? updated : x)) });
  }

  function onGoalChange(index: number, updated: LiftSet) {
    onChange({ ...lift, goals: lift.goals!.map((x, i) => (i === index ? updated : x)) });
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
      set = { ...lift.sets[lift.sets.length - 1], warmup: undefined, completed: undefined };
    }
    onChange({ ...lift, sets: [...lift.sets, set] });
  }

  // Mirrors EditableLiftItem.addGoal: copy the last goal, else weight/reps of the last set.
  function addGoal() {
    let goal: LiftSet = { weight: 0, reps: 0 };
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
      }}>
      <div style={{ display: 'flex', gap: 4 }}>
        {reorder && (
          <>
            <button type="button" onClick={onMoveUp} disabled={!onMoveUp} title="Move up" style={arrowStyle}>
              ↑
            </button>
            <button type="button" onClick={onMoveDown} disabled={!onMoveDown} title="Move down" style={arrowStyle}>
              ↓
            </button>
          </>
        )}
        <select
          style={{ flex: 1, minWidth: 0 }}
          value={lift.id}
          disabled={collapsed}
          onChange={e => onChange({ ...lift, id: e.target.value })}>
          {liftOptions.map(opt => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setCollapsed(c => !c)}
          title={collapsed ? 'Expand' : 'Collapse'}
          style={{ width: 28, padding: 0 }}>
          {collapsed ? '▸' : '▾'}
        </button>
      </div>

      {/* Sets and goals share one table so their columns stay aligned. */}
      {!collapsed && (
        <table>
          <thead>
            <tr>
              <th style={headerStyle}>Set</th>
              <th style={headerStyle}>Weight</th>
              <th style={headerStyle}>Reps</th>
              <th style={headerStyle}>1RM</th>
              <th />
            </tr>
          </thead>
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
            <tr>
              <th />
              <th style={headerStyle}>Weight</th>
              <th style={headerStyle}>Reps</th>
              <th style={headerStyle}>1RM</th>
              <th />
            </tr>
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
