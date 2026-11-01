import { useEffect } from 'react';

export type ToastMessage = { text: string; error?: boolean };

type Props = {
  toast: ToastMessage | null;
  onDone: () => void;
};

const INFO_MS = 3000;
const ERROR_MS = 8000;

// Short-lived notice in the bottom-right corner. Info messages clear after a
// few seconds, errors stay longer; clicking dismisses either immediately.
export default function Toast({ toast, onDone }: Props) {
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(onDone, toast.error ? ERROR_MS : INFO_MS);
    return () => clearTimeout(id);
  }, [toast, onDone]);

  if (!toast) return null;

  return (
    <div
      className={'toast' + (toast.error ? ' error' : '')}
      role="status"
      onClick={onDone}
    >
      {toast.text}
    </div>
  );
}
