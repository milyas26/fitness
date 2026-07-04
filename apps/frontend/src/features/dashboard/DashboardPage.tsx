import { useQuery } from '@tanstack/react-query';
import { useDate } from '../../contexts/DateContext';
import { dashboardApi } from '../../services/dashboard.service';
import { nutritionApi } from '../../services/nutrition.service';
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
  CircleDot,
} from 'lucide-react';
import type { NutritionEntry } from '@fitness/shared';

const MEAL_ORDER = ['breakfast', 'lunch', 'dinner', 'snack'] as const;

const mealMeta: Record<string, { label: string; icon: string }> = {
  breakfast: { label: 'Breakfast', icon: '🌅' },
  lunch: { label: 'Lunch', icon: '☀️' },
  dinner: { label: 'Dinner', icon: '🌙' },
  snack: { label: 'Snacks', icon: '🍎' },
};

function groupByMeal(entries: NutritionEntry[]) {
  const groups: Record<string, NutritionEntry[]> = {};
  for (const meal of MEAL_ORDER) {
    groups[meal] = entries.filter((e) => e.meal_time === meal);
  }
  return groups;
}

function mealSubtotal(entries: NutritionEntry[]) {
  return entries.reduce(
    (acc, e) => ({
      cal: acc.cal + e.calories,
      pr: acc.pr + e.protein_g,
      carbs: acc.carbs + e.carbs_g,
      fat: acc.fat + e.fat_g,
    }),
    { cal: 0, pr: 0, carbs: 0, fat: 0 },
  );
}

function FoodEntryRow({ entry }: { entry: NutritionEntry }) {
  return (
    <div className="flex items-center gap-3 py-2.5 px-3 -mx-3 rounded-lg hover:bg-secondary/30 transition-colors">
      <div className="w-8 h-8 rounded-lg bg-secondary/60 flex items-center justify-center shrink-0">
        <CircleDot className="w-3.5 h-3.5 text-muted-foreground/60" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium truncate">{entry.food_name}</span>
          {entry.source === 'hermes' && (
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 font-semibold shrink-0">
              AI
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-0.5">
          <span className="text-xs font-semibold tabular-nums text-foreground/80">{entry.calories} kcal</span>
          <span className="text-[11px] text-muted-foreground">
            P{entry.protein_g} · C{entry.carbs_g} · F{entry.fat_g}
            {entry.fiber_g ? ` · Fib${entry.fiber_g}` : ''}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { selectedDate } = useDate();
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard', selectedDate],
    queryFn: () => dashboardApi.get(selectedDate),
  });

  const { data: nutritionEntries } = useQuery({
    queryKey: ['nutrition', selectedDate],
    queryFn: () => nutritionApi.getAll(selectedDate),
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

  const getCalStatus = () => {
    if (calPct >= 1) return { emoji: '🔥', text: 'Goal hit!', className: 'text-green-500' };
    if (calPct >= 0.75) return { emoji: '⚡', text: 'Almost there', className: 'text-amber-400' };
    return { emoji: '🍽️', text: 'Keep eating', className: 'text-muted-foreground' };
  };
  const calStatus = getCalStatus();

  const entries = nutritionEntries ?? [];
  const foodGroups = groupByMeal(entries);

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
            className="h-full rounded-full bg-gradient-to-r from-primary via-orange-500 to-amber-500 transition-all duration-1000 ease-out"
            style={{ width: `${Math.min(calPct * 100, 100)}%` }}
          />
        </div>
      </div>

      <div className="mb-4">
        <Card variant="elevated">
          <CardContent className="p-3">
            <div className="flex items-center justify-between gap-1">
              {[
                { icon: Flame, label: 'Calories', value: n?.total_calories ?? 0, target: calTarget, color: 'text-amber-400', bg: 'bg-amber-400' },
                { icon: Beef, label: 'Protein', value: n?.total_protein_g ?? 0, target: prTarget, color: 'text-primary', bg: 'bg-primary' },
                { icon: Wheat, label: 'Carbs', value: n?.total_carbs_g ?? 0, target: carbTarget, color: 'text-amber-500', bg: 'bg-amber-500' },
                { icon: Droplets, label: 'Fat', value: n?.total_fat_g ?? 0, target: fatTarget, color: 'text-blue-400', bg: 'bg-blue-400' },
                { icon: CircleDot, label: 'Fiber', value: n?.total_fiber_g ?? 0, target: fibTarget, color: 'text-green-400', bg: 'bg-green-400' },
              ].map((m) => {
                const pct = Math.min(m.value / (m.target || 1), 1);
                return (
                  <div key={m.label} className="flex-1 text-center min-w-0">
                    <m.icon className={`w-3.5 h-3.5 mx-auto mb-0.5 ${m.color}`} />
                    <p className="text-xs font-bold tabular-nums leading-tight">
                      {m.value}{m.label === 'Calories' ? '' : 'g'}
                    </p>
                    <p className="text-[9px] text-muted-foreground leading-tight">{m.label}</p>
                    <div className="mt-1 mx-auto w-full max-w-[40px] h-1 bg-secondary/60 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${m.bg} transition-all duration-700`} style={{ width: `${pct * 100}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { icon: Dumbbell, label: 'Workout', value: w?.session_count ? 'Done' : 'Rest', sub: w?.session_count ? `${w.total_exercises}ex·${w.total_sets}s` : 'Off day', color: 'text-green-400' },
          { icon: Bed, label: 'Sleep', value: recovery?.sleep_hours ? `${recovery.sleep_hours}h` : '—', sub: recovery?.energy_level ? `⚡${recovery.energy_level}/10` : '', color: 'text-indigo-400' },
          { icon: Weight, label: 'Weight', value: body?.morning_weight_kg ? `${body.morning_weight_kg}kg` : '—', sub: '', color: 'text-cyan-400' },
        ].map((s) => (
          <Card key={s.label} variant="elevated">
            <CardContent className="p-2.5 text-center">
              <s.icon className={`w-4 h-4 mx-auto mb-1 ${s.color}`} />
              <p className="text-sm font-extrabold tabular-nums leading-tight">{s.value}</p>
              <p className="text-[10px] text-muted-foreground leading-tight">{s.label}</p>
              {s.sub && <p className="text-[9px] text-muted-foreground/60 mt-0.5">{s.sub}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      {entries.length > 0 && (
        <div className="space-y-4 mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-foreground/80">Today's Meals</h3>
            <span className="text-[10px] text-muted-foreground">{entries.length} items</span>
          </div>

          {MEAL_ORDER.map((meal) => {
            const items = foodGroups[meal];
            if (!items || items.length === 0) return null;
            const sub = mealSubtotal(items);
            const meta = mealMeta[meal]!;

            return (
              <div key={meal}>
                <div className="flex items-center gap-2 mb-2 px-0.5">
                  <span className="text-sm">{meta.icon}</span>
                  <span className="text-xs font-bold text-foreground/80 uppercase tracking-wider">{meta.label}</span>
                  <span className="text-[10px] text-muted-foreground ml-auto tabular-nums">
                    {sub.cal} kcal · P{sub.pr} C{sub.carbs} F{sub.fat}
                  </span>
                </div>

                <Card variant="elevated">
                  <CardContent className="p-2">
                    {items.map((entry) => (
                      <FoodEntryRow key={entry.id} entry={entry} />
                    ))}
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      )}

      {report && (
        <Card variant="glow" className="mb-4">
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
