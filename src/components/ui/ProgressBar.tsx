interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
}

export function ProgressBar({ current, total, className = "" }: ProgressBarProps) {
  const percent = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div
      className={`w-full ${className}`}
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-label={`Frage ${current} von ${total}`}
    >
      <div className="flex justify-between text-sm font-medium text-neutral-500 mb-2">
        <span className="text-neutral-900 font-semibold">Frage {current} von {total}</span>
        <span className="tabular-nums">{percent} %</span>
      </div>
      <div className="h-3 bg-neutral-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
