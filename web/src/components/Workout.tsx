import { useState } from 'react';
import { Workout as WorkoutType } from '@shared/types/workout.ts';
import Lift from './Lift.tsx';

type Props = {
  workout: WorkoutType;
  compact: boolean;
  reorder: boolean;
  onChange: (workout: WorkoutType) => void;
};

export default function Workout({ workout, compact, reorder, onChange }: Props) {
  const [collapsed, setCollapsed] = useState(false);

  function swapLifts(a: number, b: number) {
    const lifts = [...workout.lifts];
    [lifts[a], lifts[b]] = [lifts[b], lifts[a]];
    onChange({ ...workout, lifts });
  }

  const toggle = (
    <button
      type="button"
      onClick={() => setCollapsed(c => !c)}
      title={collapsed ? 'Expand' : 'Collapse'}
      style={{ width: 28, padding: 0 }}>
      {collapsed ? '▶' : '◀'}
    </button>
  );

  if (collapsed) {
    return (
      <div
        style={{
          flex: '0 0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          border: '1px solid #555',
          borderRadius: 4,
          padding: 8,
          cursor: 'pointer',
        }}
        onClick={() => setCollapsed(false)}>
        {toggle}
        <span style={{ writingMode: 'vertical-rl', whiteSpace: 'nowrap', fontSize: 14 }}>
          {workout.name || '(unnamed)'}
        </span>
      </div>
    );
  }

  return (
    <div
      style={{
        flex: '0 0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        border: '1px solid #555',
        borderRadius: 4,
        padding: 8,
      }}>
      <div style={{ display: 'flex', gap: 4 }}>
        {toggle}
        <input
          type="text"
          style={{ flex: 1 }}
          value={workout.name}
          onChange={e => onChange({ ...workout, name: e.target.value })}
        />
      </div>
      {workout.lifts.map((lift, i) => (
        <Lift
          key={lift.instanceId}
          lift={lift}
          compact={compact}
          reorder={reorder}
          onMoveUp={i > 0 ? () => swapLifts(i, i - 1) : undefined}
          onMoveDown={i < workout.lifts.length - 1 ? () => swapLifts(i, i + 1) : undefined}
          onChange={updated =>
            onChange({ ...workout, lifts: workout.lifts.map((x, j) => (j === i ? updated : x)) })
          }
        />
      ))}
    </div>
  );
}
