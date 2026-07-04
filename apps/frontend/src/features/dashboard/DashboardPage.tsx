import { useQuery } from '@tanstack/react-query';
import { useDate } from '../../contexts/DateContext';
import { dashboardApi } from '../../services/dashboard.service';
import { StatCard } from '../../components/ui/StatCard';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { StatCardSkeleton } from '../../components/ui/Skeleton';
import { Card, CardContent } from '../../components/ui/Card';
import { Markdown } from '../../components/ui/Markdown';
import { DateNavigator } from '../../components/ui/DateNavigator';
import {
  Flame,
  Beef,
  Wheat,
  Droplets,
  Dumbbell,
  Bed,
  Weight,
  TrendingUp,
  Sparkles,
} from 'lucide-react';

const statColors = {
  calories: 'linear-gradient(90deg, hsl(18,75%,55%), hsl(30,80%,55%))',
  protein: 'linear-gradient(90deg, hsl(18,75%,50%), hsl(350,60%,55%))',
  carbs: 'linear-gradient(90deg, hsl(38,80%,55%), hsl(30,70%,50%))',
  fat: 'linear-gradient(90deg, hsl(210,70%,55%), hsl(220,60%,50%))',
  fiber: 'linear-gradient(90deg, hsl(150,50%,50%), hsl(160,45%,45%))',
  workout: 'linear-gradient(90deg, hsl(142,55%,45%), hsl(160,50%,40%))',
  sleep: 'linear-gradient(90deg, hsl(240,55%,60%), hsl(260,50%,55%))',
  weight: 'linear-gradient(90deg, hsl(190,55%,50%), hsl(200,50%,45%))',
};

export default function DashboardPage() {
  const { selectedDate } = useDate();
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard', selectedDate],
    queryFn: () => dashboardApi.get(selectedDate),
  });

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <div className="mb-5">
          <div className="h-8 w-40 bg-secondary rounded-lg animate-pulse mb-1" />
          <div className="h-4 w-24 bg-secondary rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  const n = data?.nutrition;
  const w = data?.workout;
  const recovery = data?.recovery as Record<string, unknown> | null;
  const body = data?.body as Record<string, unknown> | null;
  const settings = data?.settings as Record<string, unknown> | null;
  const report = data?.dailyReport as Record<string, unknown> | null;

  const calTarget = (settings?.daily_calories as number) || 3200;
  const prTarget = (settings?.daily_protein_g as number) || 180;
  const carbTarget = (settings?.daily_carbs_g as number) || 400;
  const fatTarget = (settings?.daily_fat_g as number) || 90;
  const fibTarget = (settings?.daily_fiber_g as number) || 35;

  const calPct = Math.min(((n?.total_calories as number) ?? 0) / calTarget, 1);
  const colorFor = (val: number, target: number) =>
    val / target > 0.85 ? 'green' : ('default' as const);

  const getCalStatus = () => {
    if (calPct >= 1) return { emoji: '🔥', text: 'Goal hit!', className: 'text-green-500' };
    if (calPct >= 0.75) return { emoji: '⚡', text: 'Almost there', className: 'text-amber-400' };
    return { emoji: '🍽️', text: 'Keep eating', className: 'text-muted-foreground' };
  };
  const calStatus = getCalStatus();

  return (
    <div className="animate-fade-in">
      <DateNavigator />
      <div className="mb-5">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-[22px] font-extrabold tracking-tight leading-none">
              Bulking
              <span className="text-primary"> Journal</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-1.5">{calStatus.emoji} {calStatus.text}</p>
          </div>
          <div className="text-right">
            <div className="flex items-baseline gap-0.5 justify-end">
              <span className="text-[28px] font-extrabold tabular-nums tracking-tight leading-none">
                {Math.round(calPct * 100)}
              </span>
              <span className="text-sm font-semibold text-muted-foreground">%</span>
            </div>
            <p className="text-[10px] text-muted-foreground/70">daily target</p>
          </div>
        </div>
        <div className="mt-3 h-2 bg-secondary/80 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary via-orange-500 to-amber-500 transition-all duration-1000 ease-out shadow-glow-sm"
            style={{ width: `${Math.min(calPct * 100, 100)}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <StatCard
          title="Calories"
          value={n?.total_calories ?? 0}
          unit={`/ ${calTarget}`}
          icon={<Flame className="w-4 h-4 text-amber-400" />}
          accentColor={statColors.calories}
          className="animate-fade-in [animation-delay:0ms]"
        >
          <ProgressBar
            value={n?.total_calories ?? 0}
            max={calTarget}
            className="mt-2.5"
            color={colorFor(n?.total_calories ?? 0, calTarget)}
          />
        </StatCard>

        <StatCard
          title="Protein"
          value={n?.total_protein_g ?? 0}
          unit={`/ ${prTarget}g`}
          icon={<Beef className="w-4 h-4 text-primary" />}
          accentColor={statColors.protein}
          className="animate-fade-in [animation-delay:50ms]"
        >
          <ProgressBar
            value={n?.total_protein_g ?? 0}
            max={prTarget}
            className="mt-2.5"
            color={colorFor(n?.total_protein_g ?? 0, prTarget)}
          />
        </StatCard>

        <StatCard
          title="Carbs"
          value={n?.total_carbs_g ?? 0}
          unit={`/ ${carbTarget}g`}
          icon={<Wheat className="w-4 h-4 text-amber-400" />}
          accentColor={statColors.carbs}
          className="animate-fade-in [animation-delay:100ms]"
        >
          <ProgressBar value={n?.total_carbs_g ?? 0} max={carbTarget} className="mt-2.5" />
        </StatCard>

        <StatCard
          title="Fat"
          value={n?.total_fat_g ?? 0}
          unit={`/ ${fatTarget}g`}
          icon={<Droplets className="w-4 h-4 text-blue-400" />}
          accentColor={statColors.fat}
          className="animate-fade-in [animation-delay:150ms]"
        >
          <ProgressBar value={n?.total_fat_g ?? 0} max={fatTarget} className="mt-2.5" />
        </StatCard>

        <StatCard
          title="Fiber"
          value={n?.total_fiber_g ?? 0}
          unit={`/ ${fibTarget}g`}
          accentColor={statColors.fiber}
          className="animate-fade-in [animation-delay:200ms]"
        >
          <ProgressBar value={n?.total_fiber_g ?? 0} max={fibTarget} className="mt-2.5" />
        </StatCard>

        <StatCard
          title="Workout"
          value={w?.session_count ? 'Done' : 'Rest'}
          subtitle={
            w?.session_count
              ? `${w.total_exercises} ex · ${w.total_sets} sets`
              : 'Recovery day'
          }
          icon={<Dumbbell className="w-4 h-4 text-green-400" />}
          accentColor={statColors.workout}
          className="animate-fade-in [animation-delay:250ms]"
        />

        <StatCard
          title="Sleep"
          value={recovery?.sleep_hours ? `${recovery.sleep_hours}h` : '—'}
          subtitle={recovery?.energy_level ? `Energy ${recovery.energy_level}/10` : ''}
          icon={<Bed className="w-4 h-4 text-indigo-400" />}
          accentColor={statColors.sleep}
          className="animate-fade-in [animation-delay:300ms]"
        />

        <StatCard
          title="Weight"
          value={body?.morning_weight_kg ? `${body.morning_weight_kg}kg` : '—'}
          subtitle={settings ? `Target ${settings.target_weight_kg}kg` : ''}
          icon={<Weight className="w-4 h-4 text-cyan-400" />}
          accentColor={statColors.weight}
          className="animate-fade-in [animation-delay:350ms]"
        />
      </div>

      {report && (
        <Card variant="glow" accent className="mb-4">
          <CardContent className="py-3.5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-full bg-purple-500/15 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <span className="text-sm font-bold">AI Report</span>
              {report.bulking_score != null && (
                <span className="ml-auto text-[11px] px-2.5 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-violet-500/20 text-purple-400 font-bold">
                  {String(report.bulking_score)}/100
                </span>
              )}
            </div>
            <div className="flex gap-1.5 mb-3 flex-wrap">
              {(['nutrition_score', 'workout_score', 'recovery_score'] as const).map((key) => {
                const val = report[key] as number | null;
                if (val == null) return null;
                const label = key === 'nutrition_score' ? 'Nutrition' : key === 'workout_score' ? 'Workout' : 'Recovery';
                return (
                  <span
                    key={key}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/80 text-muted-foreground font-medium"
                  >
                    <TrendingUp className="w-2.5 h-2.5 inline mr-1 -mt-px" />
                    {label}: {val.toFixed(0)}
                  </span>
                );
              })}
            </div>
            <Markdown content={String(report.content_md || '')} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
