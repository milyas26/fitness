import { useQuery } from '@tanstack/react-query';
import { recoveryApi } from '../../services/recovery.service';
import { useDate } from '../../contexts/DateContext';
import { Card, CardContent } from '../../components/ui/Card';
import { Skeleton } from '../../components/ui/Skeleton';
import { Bed, Battery, Activity, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';

const sorenessColors: Record<string, string> = {
  none: 'text-green-400',
  mild: 'text-lime-400',
  moderate: 'text-yellow-400',
  severe: 'text-orange-400',
};

function RingProgress({ value, max, color, icon: Icon }: { value: number; max: number; color: string; icon: React.ElementType }) {
  const pct = Math.min((value / max) * 100, 100);
  const circumference = 2 * Math.PI * 28;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center">
      <svg width="72" height="72" className="-rotate-90">
        <circle cx="36" cy="36" r="28" fill="none" stroke="hsl(var(--secondary))" strokeWidth="4" />
        <circle
          cx="36" cy="36" r="28"
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <Icon className="w-4 h-4" style={{ color }} />
        <span className="text-sm font-extrabold tabular-nums mt-0.5">{value}</span>
        <span className="text-[9px] text-muted-foreground">/ {max}</span>
      </div>
    </div>
  );
}

function SorenessRing({ level }: { level: string }) {
  const colorMap: Record<string, { color: string; segments: number }> = {
    none: { color: '#4ade80', segments: 1 },
    mild: { color: '#a3e635', segments: 2 },
    moderate: { color: '#facc15', segments: 3 },
    severe: { color: '#fb923c', segments: 4 },
  };
  const c = colorMap[level] as { color: string; segments: number } | undefined;
  if (!c) return null;
  const circumference = 2 * Math.PI * 26;

  return (
    <div className="relative flex flex-col items-center">
      <svg width="72" height="72" className="-rotate-90">
        <circle cx="36" cy="36" r="26" fill="none" stroke="hsl(var(--secondary))" strokeWidth="4" />
        {Array.from({ length: c.segments }).map((_, i) => {
          const segmentLen = circumference / 4;
          const offset = circumference - (i + 1) * segmentLen;
          return (
            <circle
              key={i}
              cx="36" cy="36" r="26"
              fill="none"
              stroke={c.color}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${segmentLen * 0.85} ${circumference}`}
              strokeDashoffset={offset}
              className="transition-all duration-700 ease-out"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <Activity className={cn('w-4 h-4', sorenessColors[level] || 'text-green-400')} />
        <span className="text-[10px] font-bold capitalize mt-0.5">{level}</span>
      </div>
    </div>
  );
}

export default function RecoveryPage() {
  const { selectedDate } = useDate();
  const { data, isLoading } = useQuery({
    queryKey: ['recovery', selectedDate],
    queryFn: () => recoveryApi.get(selectedDate),
  });

  const { data: range } = useQuery({
    queryKey: ['recovery', 'range'],
    queryFn: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 6);
      return recoveryApi.getRange(start.toISOString().slice(0, 10), end.toISOString().slice(0, 10));
    },
  });

  if (isLoading)
    return (
      <div className="animate-fade-in">
        <h2 className="text-[22px] font-extrabold tracking-tight mb-1">Recovery</h2>
        <p className="text-xs text-muted-foreground mb-4">Sleep, energy & soreness</p>
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );

  return (
    <div className="animate-fade-in">
      <h2 className="text-[22px] font-extrabold tracking-tight mb-1">Recovery</h2>
      <p className="text-xs text-muted-foreground mb-4">Sleep, energy & soreness</p>

      {data ? (
        <Card variant="elevated" className="mb-4">
          <CardContent>
            <div className="flex items-center justify-around py-2">
              <RingProgress value={data.sleep_hours} max={10} color="#818cf8" icon={Bed} />
              <RingProgress value={data.energy_level} max={10} color="#4ade80" icon={Battery} />
              <SorenessRing level={data.muscle_soreness} />
            </div>
            {data.notes && (
              <p className="text-xs text-muted-foreground mt-4 pt-3 border-t border-border/50 leading-relaxed">
                {data.notes}
              </p>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card variant="elevated" className="mb-4">
          <CardContent className="py-8 text-center">
            <div className="w-12 h-12 rounded-full bg-muted mx-auto mb-3 flex items-center justify-center">
              <Bed className="w-5 h-5 text-muted-foreground/40" />
            </div>
            <p className="text-sm text-muted-foreground font-medium">Not logged today</p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              Log your recovery via Hermes bot
            </p>
          </CardContent>
        </Card>
      )}

      {range && range.length > 0 && (
        <Card variant="elevated">
          <CardContent>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-full bg-indigo-500/15 flex items-center justify-center">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <h3 className="text-sm font-bold">7-Day History</h3>
            </div>
            <div className="space-y-0.5">
              {range.slice().reverse().map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between text-xs py-2 px-2 rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <span className="text-muted-foreground font-medium w-16">
                    {new Date(r.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' })}
                  </span>
                  <div className="flex gap-4 tabular-nums">
                    <span className="flex items-center gap-1">
                      <Bed className="w-3 h-3 text-indigo-400/60" />
                      {r.sleep_hours}h
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Battery className="w-3 h-3 text-green-400/60" />
                      {r.energy_level}
                    </span>
                    <span className={cn('capitalize text-muted-foreground', sorenessColors[r.muscle_soreness])}>
                      {r.muscle_soreness}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
