import { LiftGroup as LiftGroupType } from '@shared/types/workout.ts';
import Lift from './Lift.tsx';

type Props = {
  group: LiftGroupType;
  compact: boolean;
  // Global "Reorder" toggle; shows arrows for the group itself and for lifts within it.
  reorder: boolean;
  onChange: (group: LiftGroupType) => void;
  // Move the whole group within the workout. Undefined when already first/last.
  onMoveUp?: () => void;
  onMoveDown?: () => void;
};

const arrowStyle = { width: 28, padding: 0, flex: '0 0 auto' };

export default function LiftGroup({
  group,
  compact,
  reorder,
  onChange,
  onMoveUp,
  onMoveDown,
}: Props) {
  function swapLifts(a: number, b: number) {
    const lifts = [...group.lifts];
    [lifts[a], lifts[b]] = [lifts[b], lifts[a]];
    onChange({ ...group, lifts });
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        border: '1px dashed #666',
        borderRadius: 4,
        padding: 8,
      }}
    >
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        {reorder && (
          <>
            <button
              type="button"
              onClick={onMoveUp}
              disabled={!onMoveUp}
              title="Move group up"
              style={arrowStyle}
            >
              ↑
            </button>
            <button
              type="button"
              onClick={onMoveDown}
              disabled={!onMoveDown}
              title="Move group down"
              style={arrowStyle}
            >
              ↓
            </button>
          </>
        )}
        <span style={{ flex: 1, fontSize: 14, fontStyle: 'italic' }}>
          One of
        </span>
      </div>
      {group.lifts.map((lift, i) => (
        <Lift
          key={lift.instanceId}
          lift={lift}
          compact={compact}
          reorder={reorder}
          onMoveUp={i > 0 ? () => swapLifts(i, i - 1) : undefined}
          onMoveDown={
            i < group.lifts.length - 1 ? () => swapLifts(i, i + 1) : undefined
          }
          onChange={updated =>
            onChange({
              ...group,
              lifts: group.lifts.map((x, j) => (j === i ? updated : x)),
            })
          }
        />
      ))}
    </div>
  );
}
