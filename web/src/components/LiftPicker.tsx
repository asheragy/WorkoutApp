import { useEffect, useRef, useState } from 'react';
import { SystemLiftDefs as liftDefs } from '@shared/LiftDatabase.ts';

type Props = {
  onSelect: (defId: string) => void;
  onCancel: () => void;
};

const options = Object.values(liftDefs)
  .map(def => ({ id: def.id, label: def.displayName }))
  .sort((a, b) => a.label.localeCompare(b.label));

// Modal for choosing a lift definition. Type to filter, Enter picks the first
// match, Escape or clicking the backdrop cancels.
export default function LiftPicker({ onSelect, onCancel }: Props) {
  const [filter, setFilter] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => inputRef.current?.focus(), []);

  const lower = filter.toLowerCase();
  const matches = options.filter(x => x.label.toLowerCase().includes(lower));

  return (
    <div
      className="modal-backdrop"
      onClick={onCancel}
      onKeyDown={e => e.key === 'Escape' && onCancel()}
    >
      <div className="modal" onClick={e => e.stopPropagation()}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search lifts"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && matches.length > 0) onSelect(matches[0].id);
          }}
        />
        <div className="modal-list">
          {matches.map(opt => (
            <button
              key={opt.id}
              type="button"
              className="modal-item"
              onClick={() => onSelect(opt.id)}
            >
              {opt.label}
            </button>
          ))}
          {matches.length === 0 && (
            <span style={{ padding: 4, opacity: 0.6 }}>No matches</span>
          )}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
