interface BadgeProps {
  label: string;
  color?: string;
}

export function Badge({ label, color = "#2563eb" }: BadgeProps) {
  return (
    <span
      className="inline-block px-2 py-0.5 rounded text-xs font-medium text-white"
      style={{ backgroundColor: color }}
    >
      {label}
    </span>
  );
}
