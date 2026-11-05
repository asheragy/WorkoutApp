import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { RoutineTemplate } from '@shared/types/template.ts';
import TemplateRepository from '../store/TemplateRepository.ts';
import { FILE_NAME, saveRoutine } from '../store/RoutineFile.ts';
import Workout, { ITEM_DROPPABLE_TYPE } from '../components/Workout.tsx';
import { GROUP_DROPPABLE_TYPE } from '../components/LiftGroup.tsx';
import LiftUtils from '@shared/utils/LiftUtils.ts';
import { isLiftGroup, WorkoutItem } from '@shared/types/workout.ts';
import Page from '../components/Page.tsx';
import AutoTextarea from '../components/AutoTextarea.tsx';
import Toast, { ToastMessage } from '../components/Toast.tsx';

// Editor view mode. "reorder" collapses every lift and lets the top-level items
// be dragged between workouts; "preview" replaces the lift cards with a
// read-only text summary.
type Mode = 'full' | 'reorder' | 'preview';
const MODES: { value: Mode; label: string }[] = [
  { value: 'full', label: 'Full' },
  { value: 'reorder', label: 'Reorder' },
  { value: 'preview', label: 'Preview' },
];

export default function WorkoutsPage() {
  const { routineId = '' } = useParams();
  const [template, setTemplate] = useState<RoutineTemplate>();
  const [mode, setMode] = useState<Mode>('full');
  const compact = mode === 'reorder';
  const reorder = mode === 'reorder';
  const preview = mode === 'preview';
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const clearToast = useCallback(() => setToast(null), []);

  useEffect(() => {
    TemplateRepository.get(routineId).then(setTemplate);
    setToast(null);
  }, [routineId]);

  const onSave = useCallback(async () => {
    if (!template) return;
    const id = template.routine.id;
    const existing = TemplateRepository.fileName(id);
    // A routine created this session has no file yet: ask for one. The .json
    // extension is implied, so strip it if typed.
    const isNew = existing === undefined;
    let file = existing ?? '';
    if (isNew) {
      const entered = window
        .prompt('File name for this routine (saved as <name>.json)')
        ?.trim()
        .replace(/\.json$/i, '');
      if (!entered) {
        setToast({ text: 'Not saved: no file name entered', error: true });
        return;
      }
      if (!FILE_NAME.test(entered)) {
        setToast({
          text: `Not saved: file name may only use letters, digits, _ and -`,
          error: true,
        });
        return;
      }
      file = entered;
    }
    setSaving(true);
    try {
      await saveRoutine(template, file, isNew);
      if (isNew) TemplateRepository.setFile(id, file);
      setToast({ text: `Saved to src/core/routines/${file}.json` });
    } catch (e) {
      setToast({
        text: e instanceof Error ? e.message : String(e),
        error: true,
      });
    } finally {
      setSaving(false);
    }
  }, [template]);

  // Ctrl+S / Cmd+S saves instead of opening the browser's save dialog.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        onSave();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onSave]);

  const workouts = template?.workouts ?? [];

  // New empty workout at the end; routineId is left blank the same way the
  // routine files leave it. The name is typed into the column's header.
  const addWorkout = useCallback(() => {
    setTemplate(
      prev =>
        prev && {
          ...prev,
          workouts: [...prev.workouts, { routineId: '', name: '', items: [] }],
        },
    );
  }, []);

  const deleteWorkout = useCallback((i: number) => {
    setTemplate(
      prev =>
        prev && { ...prev, workouts: prev.workouts.filter((_, j) => j !== i) },
    );
  }, []);

  // Drop handler for reorder mode. Top-level droppable ids are workout
  // indexes (workouts have no stable id of their own) and group droppable ids
  // are group instanceIds, so a drop can span two columns. Every case is
  // applied as a single update.
  const onDragEnd = useCallback((result: DropResult) => {
    const { source, destination, combine, type } = result;
    if (!destination && !combine) return;
    setTemplate(prev => {
      if (!prev) return prev;
      const workouts = prev.workouts.map(w => ({ ...w, items: [...w.items] }));
      const setItems = (i: number, items: WorkoutItem[]) => {
        workouts[i] = { ...workouts[i], items };
      };
      const workoutOf = (itemId: string) => {
        const i = workouts.findIndex(w =>
          w.items.some(x => x.instanceId === itemId),
        );
        if (i < 0) throw new Error(`Item not found: ${itemId}`);
        return i;
      };

      if (type === GROUP_DROPPABLE_TYPE) {
        // Lift moved within a group or to another group, possibly in another
        // workout. The library never hands a group-type drag a combine.
        if (!destination) return prev;
        const from = workoutOf(source.droppableId);
        const to = workoutOf(destination.droppableId);
        if (from === to) {
          setItems(
            from,
            LiftUtils.moveGroupLift(
              workouts[from].items,
              source.droppableId,
              source.index,
              destination.droppableId,
              destination.index,
            ),
          );
        } else {
          const [taken, lift] = LiftUtils.takeFromGroup(
            workouts[from].items,
            source.droppableId,
            source.index,
          );
          setItems(from, taken);
          setItems(
            to,
            LiftUtils.insertIntoGroup(
              workouts[to].items,
              destination.droppableId,
              destination.index,
              lift,
            ),
          );
        }
        return { ...prev, workouts };
      }

      const from = Number(source.droppableId);
      const [item] = workouts[from].items.splice(source.index, 1);

      if (combine) {
        // Top-level lift dropped onto another item: join its group, or form a
        // new one with it. Groups can't be nested so a dropped group is a no-op.
        if (isLiftGroup(item)) return prev;
        const to = Number(combine.droppableId);
        const targetIndex = workouts[to].items.findIndex(
          x => x.instanceId === combine.draggableId,
        );
        const where = from === to && source.index <= targetIndex ? 'first' : 'last';
        setItems(
          to,
          LiftUtils.joinGroup(
            workouts[to].items,
            combine.draggableId,
            item,
            where,
          ),
        );
        return { ...prev, workouts };
      }

      if (!destination) return prev;
      const to = Number(destination.droppableId);
      if (from === to && source.index === destination.index) return prev;
      workouts[to].items.splice(destination.index, 0, item);
      return { ...prev, workouts };
    });
  }, []);

  return (
    <Page wide>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {MODES.map(m => (
          <label
            key={m.value}
            style={{ display: 'flex', alignItems: 'center', gap: 4 }}
          >
            <input
              type="radio"
              name="mode"
              value={m.value}
              checked={mode === m.value}
              onChange={() => setMode(m.value)}
            />
            {m.label}
          </label>
        ))}
        <button
          type="button"
          onClick={onSave}
          disabled={!template || saving}
          title="Ctrl+S"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
      <Toast toast={toast} onDone={clearToast} />
      {template && (
        <label
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 8,
            marginTop: 12,
          }}
        >
          <span style={{ paddingTop: 3 }}>Description</span>
          <AutoTextarea
            value={template.routine.description ?? ''}
            placeholder="Notes about this routine"
            style={{ flex: 1, maxWidth: 600 }}
            onChange={description => {
              setTemplate(
                prev =>
                  prev && {
                    ...prev,
                    routine: { ...prev.routine, description },
                  },
              );
            }}
          />
        </label>
      )}
      <DragDropContext onDragEnd={onDragEnd}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: 16,
            marginTop: 16,
          }}
        >
          {workouts.map((w, i) => (
            <Workout
              key={i}
              workout={w}
              droppableId={String(i)}
              compact={compact}
              reorder={reorder}
              preview={preview}
              // Only an empty workout can be deleted, so no confirmation.
              onDelete={
                reorder && w.items.length === 0
                  ? () => deleteWorkout(i)
                  : undefined
              }
              onChange={updated => {
                setTemplate(
                  prev =>
                    prev && {
                      ...prev,
                      workouts: prev.workouts.map((x, j) =>
                        j === i ? updated : x,
                      ),
                    },
                );
              }}
            />
          ))}
          {reorder && template && (
            // Sits where the new column will appear.
            <button
              type="button"
              onClick={addWorkout}
              style={{ flex: '0 0 auto', alignSelf: 'flex-start' }}
            >
              Add Workout
            </button>
          )}
        </div>
      </DragDropContext>
    </Page>
  );
}
