import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { RoutineTemplate } from '@shared/types/template.ts';
import TemplateRepository from '../store/TemplateRepository.ts';
import { saveRoutine } from '../store/RoutineFile.ts';
import Workout from '../components/Workout.tsx';
import Page from '../components/Page.tsx';
import AutoTextarea from '../components/AutoTextarea.tsx';
import Toast, { ToastMessage } from '../components/Toast.tsx';

// Editor view mode. "reorder" collapses every lift and shows the move arrows;
// "preview" replaces the lift cards with a read-only text summary.
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
    setSaving(true);
    try {
      const file = TemplateRepository.fileName(template.routine.id);
      await saveRoutine(template, file);
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
            preview={preview}
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
      </div>
    </Page>
  );
}
