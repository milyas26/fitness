import { useQuery } from '@tanstack/react-query';
import { nutritionApi } from '../../services/nutrition.service';
import { useDate } from '../../contexts/DateContext';
import { Card, CardContent } from '../../components/ui/Card';
import { Skeleton } from '../../components/ui/Skeleton';
import { Flame, Beef, Wheat, Droplets, UtensilsCrossed, CircleDot } from 'lucide-react';
import { DateNavigator } from '../../components/ui/DateNavigator';
import { cn } from '../../lib/utils';
import type { NutritionEntry } from '@fitness/shared';

const MEAL_ORDER = ['breakfast', 'lunch', 'dinner', 'snack'] as const;

const mealMeta: Record<string, { label: string; icon: string; color: string }> = {
  breakfast: { label: 'Breakfast', icon: '🌅', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  lunch: { label: 'Lunch', icon: '☀️', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  dinner: { label: 'Dinner', icon: '🌙', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
  snack: { label: 'Snacks', icon: '🍎', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
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
    <div className="flex items-center gap-3 py-2.5 px-3 -mx-3 rounded-lg hover:bg-secondary/30 transition-colors group">
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

export default function NutritionPage() {
  const { selectedDate } = useDate();
  const { data, isLoading } = useQuery({
    queryKey: ['nutrition', selectedDate],
    queryFn: () => nutritionApi.getAll(selectedDate),
  });

  if (isLoading)
    return (
      <div className="animate-fade-in">
        <DateNavigator />
        <h2 className="text-[22px] font-extrabold tracking-tight mb-1">Food Log</h2>
        <p className="text-xs text-muted-foreground mb-4">Daily nutrition tracking</p>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );

  const entries = data ?? [];
  const groups = groupByMeal(entries);
  const totalCal = entries.reduce((s, e) => s + e.calories, 0);
  const totalPr = entries.reduce((s, e) => s + e.protein_g, 0);
  const totalCarbs = entries.reduce((s, e) => s + e.carbs_g, 0);
  const totalFat = entries.reduce((s, e) => s + e.fat_g, 0);
  const totalFiber = entries.reduce((s, e) => s + e.fiber_g, 0);
  const hasEntries = entries.length > 0;
  return (
    <div className="animate-fade-in">
      <DateNavigator />
      <h2 className="text-[22px] font-extrabold tracking-tight mb-1">Food Log</h2>
      <p className="text-xs text-muted-foreground mb-4">Daily nutrition tracking</p>

      {hasEntries && (
        <Card variant="elevated" className="mb-4">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                <Flame className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-xl font-extrabold tabular-nums leading-none">{totalCal.toLocaleString()}</p>
                <p className="text-[11px] text-muted-foreground">total kcal today</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {[
                { icon: Beef, label: 'Protein', value: `${totalPr}g`, color: 'text-primary', barColor: 'bg-primary' },
                { icon: Wheat, label: 'Carbs', value: `${totalCarbs}g`, color: 'text-amber-400', barColor: 'bg-amber-400' },
                { icon: Droplets, label: 'Fat', value: `${totalFat}g`, color: 'text-blue-400', barColor: 'bg-blue-400' },
                { icon: UtensilsCrossed, label: 'Fiber', value: `${totalFiber}g`, color: 'text-green-400', barColor: 'bg-green-400' },
              ].map((m) => {
                const val = m.label === 'Protein' ? totalPr : m.label === 'Carbs' ? totalCarbs : m.label === 'Fat' ? totalFat : totalFiber;
                return (
                  <div key={m.label} className="text-center">
                    <m.icon className={cn('w-4 h-4 mx-auto mb-1', m.color)} />
                    <p className="text-sm font-bold tabular-nums">{m.value}</p>
                    <p className="text-[10px] text-muted-foreground">{m.label}</p>
                    <div className="mt-1.5 w-full bg-secondary/60 rounded-full h-1 overflow-hidden">
                      <div className={cn('h-full rounded-full', m.barColor)} style={{ width: `${Math.min((val / Math.max(val || 1, 180)) * 100, 100)}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {!hasEntries ? (
        <Card variant="elevated">
          <CardContent className="py-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-secondary/50 mx-auto mb-4 flex items-center justify-center">
              <UtensilsCrossed className="w-6 h-6 text-muted-foreground/30" />
            </div>
            <p className="text-sm text-muted-foreground font-semibold">No food logged today</p>
            <p className="text-xs text-muted-foreground/50 mt-1.5 max-w-[240px] mx-auto">
              Log meals via Hermes AI bot to see them here
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {MEAL_ORDER.map((meal) => {
            const items = groups[meal];
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
    </div>
  );
}
