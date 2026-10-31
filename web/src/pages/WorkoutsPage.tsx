import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { RoutineTemplate } from '@shared/types/template.ts';
import TemplateRepository from '../store/TemplateRepository.ts';
import { saveRoutine } from '../store/RoutineFile.ts';
import Workout from '../components/Workout.tsx';
import Page from '../components/Page.tsx';
import AutoTextarea from '../components/AutoTextarea.tsx';

type SaveState =
  | { kind: 'idle' }
  | { kind: 'saving' }
  | { kind: 'saved' }
  | { kind: 'error'; message: string };

export default function WorkoutsPage() {
  const { routineId = '' } = useParams();
  const [template, setTemplate] = useState<RoutineTemplate>();
  const [compact, setCompact] = useState(false);
  const [reorder, setReorder] = useState(false);
  const [save, setSave] = useState<SaveState>({ kind: 'idle' });

  useEffect(() => {
    TemplateRepository.get(routineId).then(setTemplate);
    setSave({ kind: 'idle' });
  }, [routineId]);

  const onSave = useCallback(async () => {
    if (!template) return;
    setSave({ kind: 'saving' });
    try {
      await saveRoutine(template);
      setSave({ kind: 'saved' });
    } catch (e) {
      setSave({
        kind: 'error',
        message: e instanceof Error ? e.message : String(e),
      });
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

  return (
    <Page wide>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <input
            type="checkbox"
            checked={compact}
            onChange={e => setCompact(e.target.checked)}
          />
          Compact
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <input
            type="checkbox"
            checked={reorder}
            onChange={e => setReorder(e.target.checked)}
          />
          Reorder
        </label>
        <button
          type="button"
          onClick={onSave}
          disabled={!template || save.kind === 'saving'}
          title="Ctrl+S"
        >
          Save
        </button>
        {save.kind === 'saving' && (
          <span style={{ opacity: 0.7 }}>Saving…</span>
        )}
        {save.kind === 'saved' && (
          <span style={{ opacity: 0.7 }}>
            Saved to src/core/routines/{routineId}.json
          </span>
        )}
        {save.kind === 'error' && (
          <span style={{ color: '#f66' }}>{save.message}</span>
        )}
      </div>
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
              setSave({ kind: 'idle' });
            }}
          />
        </label>
      )}
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
            compact={compact}
            reorder={reorder}
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
              setSave({ kind: 'idle' });
            }}
          />
        ))}
      </div>
    </Page>
  );
}
