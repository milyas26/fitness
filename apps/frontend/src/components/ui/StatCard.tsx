import { cn } from '../../lib/utils';
import { useEffect, useState, useRef } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  source?: 'hermes' | 'manual';
  subtitle?: string;
  className?: string;
  children?: React.ReactNode;
  accentColor?: string;
}

export function StatCard({
  title,
  value,
  unit,
  icon,
  source,
  subtitle,
  className,
  children,
  accentColor: _accentColor,
}: StatCardProps) {
  const [animate, setAnimate] = useState(false);
  const prevValue = useRef(value);

  useEffect(() => {
    if (prevValue.current !== value && typeof value === 'number' && typeof prevValue.current === 'number') {
      setAnimate(true);
      const t = setTimeout(() => setAnimate(false), 600);
      prevValue.current = value;
      return () => clearTimeout(t);
    }
    prevValue.current = value;
  }, [value]);

  return (
    <div
      className={cn(
        'group relative rounded-xl bg-card/90 backdrop-blur-sm shadow-card hover:shadow-card-hover hover:shadow-md transition-all duration-300 overflow-hidden animate-fade-in',
        className,
      )}
    >
      <div className="p-3.5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">
            {title}
          </span>
          <div className="flex items-center gap-1.5">
            {source && (
              <span
                className={cn(
                  'text-[9px] px-1.5 py-0.5 rounded-full font-semibold',
                  source === 'hermes'
                    ? 'bg-purple-500/15 text-purple-500'
                    : 'bg-muted text-muted-foreground',
                )}
              >
                {source}
              </span>
            )}
            {icon && (
              <span className="shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                {icon}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-baseline gap-1">
          <span
            className={cn(
              'text-2xl font-extrabold tabular-nums tracking-tight',
              animate && 'animate-scale-in text-primary',
            )}
          >
            {value}
          </span>
          {unit && (
            <span className="text-xs text-muted-foreground font-medium">{unit}</span>
          )}
        </div>
        {subtitle && (
          <p className="text-[11px] text-muted-foreground/80 mt-0.5">{subtitle}</p>
        )}
        {children}
      </div>
    </div>
  );
}
