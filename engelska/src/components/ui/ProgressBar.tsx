interface ProgressBarProps {
  value: number; // 0–100
  colorClass?: string;
  label?: string;
  showPercent?: boolean;
}

export default function ProgressBar({
  value,
  colorClass = "bg-blue-500",
  label,
  showPercent = false,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div className="w-full">
      {(label || showPercent) && (
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          {label && <span>{label}</span>}
          {showPercent && <span>{Math.round(pct)}%</span>}
        </div>
      )}
      <div className="progress-bar-track">
        <div
          className={`progress-bar-fill ${colorClass}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
