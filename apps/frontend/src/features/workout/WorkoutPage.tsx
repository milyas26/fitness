import { useQuery } from '@tanstack/react-query';
import { workoutApi } from '../../services/workout.service';
import { useDate } from '../../contexts/DateContext';
import { Card, CardContent } from '../../components/ui/Card';
import { Skeleton } from '../../components/ui/Skeleton';
import { Dumbbell, Clock, TrendingUp } from 'lucide-react';
import { DateNavigator } from '../../components/ui/DateNavigator';
import { cn } from '../../lib/utils';

const splitColors: Record<string, string> = {
  push: 'bg-red-500/15 text-red-500',
  pull: 'bg-blue-500/15 text-blue-500',
  legs: 'bg-green-500/15 text-green-500',
  full_body: 'bg-purple-500/15 text-purple-500',
  upper: 'bg-orange-500/15 text-orange-500',
  lower: 'bg-cyan-500/15 text-cyan-500',
  push_pull: 'bg-amber-500/15 text-amber-500',
  push_pull_legs: 'bg-indigo-500/15 text-indigo-500',
};

export default function WorkoutPage() {
  const { selectedDate } = useDate();
  const { data, isLoading } = useQuery({
    queryKey: ['workout', selectedDate],
    queryFn: () => workoutApi.getAll(selectedDate),
  });

  if (isLoading)
    return (
      <div className="animate-fade-in">
        <DateNavigator />
        <h2 className="text-[22px] font-extrabold tracking-tight mb-1">Training</h2>
        <p className="text-xs text-muted-foreground mb-4">Workout sessions & exercises</p>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );

  return (
    <div className="animate-fade-in">
      <DateNavigator />
      <h2 className="text-[22px] font-extrabold tracking-tight mb-1">Training</h2>
      <p className="text-xs text-muted-foreground mb-4">Workout sessions & exercises</p>

      {!data || data.length === 0 ? (
        <Card variant="elevated">
          <CardContent className="py-8 text-center">
            <div className="w-12 h-12 rounded-full bg-muted mx-auto mb-3 flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-muted-foreground/40" />
            </div>
            <p className="text-sm text-muted-foreground font-medium">No workouts today</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Rest day or log via Hermes bot</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {data.map((s, i) => {
            const vol = s.exercises.reduce((sm, e) => sm + e.weight_kg * e.reps * e.sets, 0);
            const tsets = s.exercises.reduce((sm, e) => sm + e.sets, 0);
            const displaySplit = s.split.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
            return (
              <Card
                key={s.id}
                variant="elevated"
                className="animate-fade-in"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <CardContent className="p-3.5">
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wide',
                          splitColors[s.split] || 'bg-muted text-muted-foreground',
                        )}
                      >
                        {displaySplit}
                      </span>
                      {s.duration_minutes && (
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {s.duration_minutes} min
                        </span>
                      )}
                    </div>
                    <span
                      className={cn(
                        'text-[10px] px-1.5 py-0.5 rounded-full font-semibold',
                        s.source === 'hermes'
                          ? 'bg-purple-500/15 text-purple-500'
                          : 'bg-muted text-muted-foreground',
                      )}
                    >
                      {s.source}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mb-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Dumbbell className="w-3 h-3" />
                      {s.exercises.length} exercises
                    </span>
                    <span>{tsets} sets</span>
                    <span className="flex items-center gap-1 font-semibold text-foreground/80">
                      <TrendingUp className="w-3 h-3" />
                      {vol.toLocaleString()} kg
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    {s.exercises.map((ex) => (
                      <div
                        key={ex.id}
                        className="flex justify-between items-center text-xs py-1.5 px-2 rounded-lg bg-secondary/40"
                      >
                        <span className="font-medium truncate mr-2">{ex.name}</span>
                        <span className="text-muted-foreground tabular-nums shrink-0">
                          {ex.weight_kg}kg × {ex.reps} × {ex.sets}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
