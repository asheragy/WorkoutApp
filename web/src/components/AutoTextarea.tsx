import { TextareaHTMLAttributes, useLayoutEffect, useRef } from 'react';

type Props = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'value' | 'onChange'
> & {
  value: string;
  onChange: (value: string) => void;
};

// Textarea that grows to fit its content (one line when empty) and can still be
// dragged taller via the browser's resize handle.
export default function AutoTextarea({
  value,
  onChange,
  style,
  ...rest
}: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  return (
    <textarea
      ref={ref}
      rows={1}
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{ minHeight: '1.6em', ...style }}
      {...rest}
    />
  );
}
