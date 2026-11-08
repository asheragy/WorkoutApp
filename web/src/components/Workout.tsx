import { useState } from 'react';
import uuid from 'react-native-uuid';
import {
  Draggable,
  DraggableProvidedDragHandleProps,
  Droppable,
} from '@hello-pangea/dnd';
import Lift from './Lift.tsx';
import LiftGroup from './LiftGroup.tsx';
import LiftPicker from './LiftPicker.tsx';
import LiftUtils from '@shared/utils/LiftUtils.ts';
import WorkoutPreview from './WorkoutPreview.tsx';
import SetUtils from '@shared/utils/SetUtils.ts';
import { SystemLiftDefs as liftDefs } from '@shared/LiftDatabase.ts';
import {
  isLiftGroup,
  Lift as LiftType,
  Workout as WorkoutTemplate,
  WorkoutItem,
} from '@shared/types/workout.ts';

// Droppable type for the workout's top-level item list; see LiftGroup for the
// nested one.
export const ITEM_DROPPABLE_TYPE = 'item';

type Props = {
  workout: WorkoutTemplate;
  // Id of this workout's drop list for the page-level DragDropContext.
  droppableId: string;
  compact: boolean;
  // Drag-and-drop mode: top-level items can be dragged within this workout or
  // into another one, and dropped onto another item to join a group.
  reorder: boolean;
  // Read-only text summary instead of the editable lift cards.
  preview: boolean;
  onChange: (workout: WorkoutTemplate) => void;
  // Set by the page in reorder mode when the workout has no items; shows an X
  // that removes the workout from the routine.
  onDelete?: () => void;
};

export default function Workout({
  workout,
  droppableId,
  compact,
  reorder,
  preview,
  onChange,
  onDelete,
}: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [picking, setPicking] = useState(false);

  // Mirrors WorkoutEditScreen.onExerciseAdded: new lift at the end, no sets.
  function addLift(defId: string) {
    const lift: LiftType = {
      id: defId,
      instanceId: uuid.v4(),
      sets: [],
      goals: [],
    };
    setPicking(false);
    onChange({ ...workout, items: [...workout.items, lift] });
  }

  // Same number the app's Home screen shows: working sets split across group members.
  const totalSets = SetUtils.formatSetCount(
    SetUtils.getWorkingSets(liftDefs, [workout]).find(x => x.group === 'Total')!
      .sets,
  );

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
        {preview ? (
          <span style={{ flex: 1, fontWeight: 'bold', alignSelf: 'center' }}>
            {workout.name || '(unnamed)'}
          </span>
        ) : (
          <input
            type="text"
            style={{ flex: 1 }}
            value={workout.name}
            onChange={e => onChange({ ...workout, name: e.target.value })}
          />
        )}
        <span
          style={{ alignSelf: 'center', whiteSpace: 'nowrap', fontSize: 14 }}
        >
          {totalSets} Sets
        </span>
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            title="Remove workout"
            style={{ width: 28, padding: 0, flex: '0 0 auto' }}
          >
            ✕
          </button>
        )}
      </div>
      {preview && <WorkoutPreview workout={workout} />}
      {!preview && !reorder && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {workout.items.map((item, i) => renderItem(item, i))}
        </div>
      )}
      {reorder && (
        <Droppable
          droppableId={droppableId}
          type={ITEM_DROPPABLE_TYPE}
          isCombineEnabled
        >
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                // Keeps an empty workout droppable and highlights the target list.
                minHeight: 40,
                borderRadius: 4,
                background: snapshot.isDraggingOver ? '#2a2a2a' : undefined,
              }}
            >
              {workout.items.map((item, i) => (
                <Draggable
                  key={item.instanceId}
                  draggableId={item.instanceId}
                  index={i}
                >
                  {(provided, snapshot) => (
                    // A group is dragged by its header (the handle is passed
                    // down) so the lifts inside it stay draggable themselves.
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...(isLiftGroup(item) ? {} : provided.dragHandleProps)}
                      style={{
                        ...provided.draggableProps.style,
                        opacity: snapshot.isDragging ? 0.8 : 1,
                      }}
                    >
                      {renderItem(
                        item,
                        i,
                        isLiftGroup(item)
                          ? provided.dragHandleProps
                          : undefined,
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      )}
      {reorder && (
        <button type="button" onClick={() => setPicking(true)}>
          Add
        </button>
      )}
      {picking && (
        <LiftPicker onSelect={addLift} onCancel={() => setPicking(false)} />
      )}
    </div>
  );

  function renderItem(
    item: WorkoutItem,
    i: number,
    dragHandleProps?: DraggableProvidedDragHandleProps | null,
  ) {
    const replace = (updated: typeof item) =>
      onChange({
        ...workout,
        items: workout.items.map((x, j) => (j === i ? updated : x)),
      });

    return isLiftGroup(item) ? (
      <LiftGroup
        key={item.instanceId}
        group={item}
        compact={compact}
        reorder={reorder}
        dragHandleProps={dragHandleProps}
        onChange={replace}
        onRemoveLift={liftId =>
          onChange({
            ...workout,
            items: LiftUtils.removeFromGroup(
              workout.items,
              item.instanceId,
              liftId,
            ),
          })
        }
        onDeleteLift={liftId => {
          const liftIndex = item.lifts.findIndex(x => x.instanceId === liftId);
          const [items] = LiftUtils.takeFromGroup(
            workout.items,
            item.instanceId,
            liftIndex,
          );
          onChange({ ...workout, items });
        }}
      />
    ) : (
      <Lift
        key={item.instanceId}
        lift={item}
        compact={compact}
        onChange={replace}
        onDelete={
          reorder
            ? () =>
                onChange({
                  ...workout,
                  items: workout.items.filter((_, j) => j !== i),
                })
            : undefined
        }
      />
    );
  }
}
