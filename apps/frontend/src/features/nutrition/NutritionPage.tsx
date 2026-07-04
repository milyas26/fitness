import { useQuery } from '@tanstack/react-query';
import { nutritionApi } from '../../services/nutrition.service';
import { useDate } from '../../contexts/DateContext';
import { Card, CardContent } from '../../components/ui/Card';
import { Skeleton } from '../../components/ui/Skeleton';
import { Flame, Beef, UtensilsCrossed } from 'lucide-react';
import { DateNavigator } from '../../components/ui/DateNavigator';
import { cn } from '../../lib/utils';

const mealLabels: Record<string, string> = {
  breakfast: 'BF',
  lunch: 'LN',
  dinner: 'DN',
  snack: 'SN',
};

const mealColors: Record<string, string> = {
  breakfast: 'bg-amber-500/15 text-amber-600',
  lunch: 'bg-orange-500/15 text-orange-600',
  dinner: 'bg-red-500/15 text-red-600',
  snack: 'bg-blue-500/15 text-blue-600',
};

export default function NutritionPage() {
  const { selectedDate } = useDate();
  const { data, isLoading } = useQuery({
    queryKey: ['nutrition', selectedDate],
    queryFn: () => nutritionApi.getAll(selectedDate),
  });

  const totalCal = data?.reduce((s, e) => s + e.calories, 0) ?? 0;
  const totalPr = data?.reduce((s, e) => s + e.protein_g, 0) ?? 0;

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

  return (
    <div className="animate-fade-in">
      <DateNavigator />
      <h2 className="text-[22px] font-extrabold tracking-tight mb-1">Food Log</h2>
      <p className="text-xs text-muted-foreground mb-4">Daily nutrition tracking</p>

      {data && data.length > 0 && (
        <div className="flex items-center gap-5 mb-4 p-3.5 rounded-xl bg-card border border-border/40 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-amber-500/15 flex items-center justify-center">
              <Flame className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <p className="text-lg font-extrabold tabular-nums leading-none">{totalCal}</p>
              <p className="text-[10px] text-muted-foreground">kcal</p>
            </div>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center">
              <Beef className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-lg font-extrabold tabular-nums leading-none">{totalPr}g</p>
              <p className="text-[10px] text-muted-foreground">protein</p>
            </div>
          </div>
        </div>
      )}

      {!data || data.length === 0 ? (
        <Card variant="elevated">
          <CardContent className="py-8 text-center">
            <div className="w-12 h-12 rounded-full bg-muted mx-auto mb-3 flex items-center justify-center">
              <UtensilsCrossed className="w-5 h-5 text-muted-foreground/40" />
            </div>
            <p className="text-sm text-muted-foreground font-medium">No food logged today</p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              Log meals via Hermes bot to see them here
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {data.map((e, i) => (
            <Card
              key={e.id}
              variant="elevated"
              className="animate-fade-in hover:border-primary/20 transition-colors"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <CardContent className="p-3.5">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold truncate">{e.food_name}</span>
                      <span
                        className={cn(
                          'text-[10px] px-1.5 py-0.5 rounded-md font-semibold shrink-0',
                          mealColors[e.meal_time] || 'bg-muted text-muted-foreground',
                        )}
                      >
                        {mealLabels[e.meal_time] || e.meal_time}
                      </span>
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-1">
                      {e.calories} kcal · P{e.protein_g} C{e.carbs_g} F{e.fat_g}
                      {e.fiber_g ? ` · Fib${e.fiber_g}g` : ''}
                      <span
                        className={cn(
                          'ml-2 text-[10px] font-medium',
                          e.source === 'hermes' ? 'text-purple-400' : 'text-muted-foreground/50',
                        )}
                      >
                        {e.source}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

