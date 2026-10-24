import { ReactNode } from 'react';

type Props = {
  // Wide pages (the workout editor) take whatever width their content needs and scroll
  // horizontally. Everything else sits in a centered column and scrolls vertically.
  wide?: boolean;
  children: ReactNode;
};

export default function Page({ wide, children }: Props) {
  return (
    <div style={wide ? { padding: 16, width: 'max-content' } : { padding: 16, maxWidth: 900, margin: '0 auto' }}>
      {children}
    </div>
  );
}
