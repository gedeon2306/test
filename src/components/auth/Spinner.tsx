interface SpinnerProps {
  color?: string;
}

export const Spinner = ({ color = '#1a1a1a' }: SpinnerProps) => (
  <div style={{
    width: '16px', height: '16px', borderRadius: '50%', flexShrink: 0,
    border: `2px solid ${color}25`,
    borderTop: `2px solid ${color}`,
    animation: 'spin 0.7s linear infinite',
  }} />
);
