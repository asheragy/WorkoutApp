import { useState } from 'react';
import { WorkoutTemplate } from '@shared/types/template.ts';
import Lift from './Lift.tsx';
import LiftGroup from './LiftGroup.tsx';
import { isLiftGroup } from '@shared/types/workout.ts';

type Props = {
  workout: WorkoutTemplate;
  compact: boolean;
  reorder: boolean;
  onChange: (workout: WorkoutTemplate) => void;
};

export default function Workout({
  workout,
  compact,
  reorder,
  onChange,
}: Props) {
  const [collapsed, setCollapsed] = useState(false);

  function swapItems(a: number, b: number) {
    const items = [...workout.items];
    [items[a], items[b]] = [items[b], items[a]];
    onChange({ ...workout, items });
  }

  const toggle = (
    <button
      type="button"
      onClick={() => setCollapsed(c => !c)}
      title={collapsed ? 'Expand' : 'Collapse'}
      style={{ width: 28, padding: 0 }}
    >
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
        onClick={() => setCollapsed(false)}
      >
        {toggle}
        <span
          style={{
            writingMode: 'vertical-rl',
            whiteSpace: 'nowrap',
            fontSize: 14,
          }}
        >
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
      }}
    >
      <div style={{ display: 'flex', gap: 4 }}>
        {toggle}
        <input
          type="text"
          style={{ flex: 1 }}
          value={workout.name}
          onChange={e => onChange({ ...workout, name: e.target.value })}
        />
      </div>
      {workout.items.map((item, i) => {
        const shared = {
          compact,
          reorder,
          onMoveUp: i > 0 ? () => swapItems(i, i - 1) : undefined,
          onMoveDown:
            i < workout.items.length - 1
              ? () => swapItems(i, i + 1)
              : undefined,
        };
        const replace = (updated: typeof item) =>
          onChange({
            ...workout,
            items: workout.items.map((x, j) => (j === i ? updated : x)),
          });

        return isLiftGroup(item) ? (
          <LiftGroup
            key={item.instanceId}
            group={item}
            onChange={replace}
            {...shared}
          />
        ) : (
          <Lift
            key={item.instanceId}
            lift={item}
            onChange={replace}
            {...shared}
          />
        );
      })}
    </div>
  );
}
