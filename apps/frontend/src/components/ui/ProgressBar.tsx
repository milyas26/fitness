import { cn } from '../../lib/utils';

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  showPercent?: boolean;
  className?: string;
  color?: 'default' | 'green' | 'yellow' | 'red';
}

const colorMap = {
  default: 'bg-gradient-to-r from-primary via-primary to-orange-600',
  green: 'bg-gradient-to-r from-emerald-500 to-green-500',
  yellow: 'bg-gradient-to-r from-amber-400 to-yellow-500',
  red: 'bg-gradient-to-r from-red-400 to-rose-500',
};

const glowMap = {
  default: 'shadow-glow-sm',
  green: 'shadow-glow-green',
  yellow: 'shadow-[0_0_12px_-2px_hsla(45,93%,47%,0.25)]',
  red: 'shadow-[0_0_12px_-2px_hsla(0,72%,51%,0.25)]',
};

export function ProgressBar({
  value,
  max,
  label,
  showPercent = false,
  className,
  color = 'default',
}: ProgressBarProps) {
  const percent = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  const isComplete = percent >= 100;

  return (
    <div className={cn('space-y-1', className)}>
      {(label || showPercent) && (
        <div className="flex justify-between text-[10px] text-muted-foreground font-medium">
          {label && <span>{label}</span>}
          {showPercent && <span>{Math.round(percent)}%</span>}
        </div>
      )}
      <div className="h-1.5 bg-secondary/80 rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-700 ease-out',
            colorMap[color],
            isComplete && glowMap[color],
            isComplete && 'animate-glow-pulse',
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
