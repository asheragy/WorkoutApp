import {
  Draggable,
  DraggableProvidedDragHandleProps,
  Droppable,
} from '@hello-pangea/dnd';
import { LiftGroup as LiftGroupType } from '@shared/types/workout.ts';
import Lift from './Lift.tsx';

// Droppable type for the lists inside groups. Distinct from the workout's
// top-level list so a lift inside a group can only be dropped into a group,
// never between top-level items (and vice versa).
export const GROUP_DROPPABLE_TYPE = 'group';

type Props = {
  group: LiftGroupType;
  compact: boolean;
  // Drag-and-drop mode: the lifts inside become a sortable list and each gets
  // an eject button. The group itself is dragged by its header.
  reorder: boolean;
  // Drag handle for moving the whole group; set by Workout in reorder mode.
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
  onChange: (group: LiftGroupType) => void;
  // Eject a lift to the top level of the workout (needs the workout's items,
  // so the parent handles it).
  onRemoveLift: (liftId: string) => void;
};

export default function LiftGroup({
  group,
  compact,
  reorder,
  dragHandleProps,
  onChange,
  onRemoveLift,
}: Props) {
  const renderLift = (lift: LiftGroupType['lifts'][number], i: number) => (
    <Lift
      key={lift.instanceId}
      lift={lift}
      compact={compact}
      onRemoveFromGroup={
        reorder ? () => onRemoveLift(lift.instanceId) : undefined
      }
      onChange={updated =>
        onChange({
          ...group,
          lifts: group.lifts.map((x, j) => (j === i ? updated : x)),
        })
      }
    />
  );

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
      <div
        {...dragHandleProps}
        style={{
          fontSize: 14,
          fontStyle: 'italic',
          cursor: reorder ? 'grab' : undefined,
        }}
      >
        {reorder && <span title="Drag to move group">⠿ </span>}
        One of
      </div>
      {!reorder && group.lifts.map(renderLift)}
      {reorder && (
        <Droppable droppableId={group.instanceId} type={GROUP_DROPPABLE_TYPE}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                borderRadius: 4,
                background: snapshot.isDraggingOver ? '#2a2a2a' : undefined,
              }}
            >
              {group.lifts.map((lift, i) => (
                <Draggable
                  key={lift.instanceId}
                  draggableId={lift.instanceId}
                  index={i}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...provided.draggableProps.style,
                        opacity: snapshot.isDragging ? 0.8 : 1,
                      }}
                    >
                      {renderLift(lift, i)}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      )}
    </div>
  );
}
