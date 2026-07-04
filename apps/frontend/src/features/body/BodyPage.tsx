import { useQuery } from '@tanstack/react-query';
import { bodyApi } from '../../services/body.service';
import { useDate } from '../../contexts/DateContext';
import { Card, CardContent } from '../../components/ui/Card';
import { Skeleton } from '../../components/ui/Skeleton';
import { Weight, TrendingUp, Ruler } from 'lucide-react';
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart,
} from 'recharts';

export default function BodyPage() {
  const { selectedDate } = useDate();
  const { data: todayData, isLoading: loadingToday } = useQuery({
    queryKey: ['body', selectedDate],
    queryFn: () => bodyApi.get(selectedDate),
  });
  const { data: trend } = useQuery({
    queryKey: ['body', 'trends'],
    queryFn: () => bodyApi.getTrend(30),
  });

  return (
    <div className="animate-fade-in">
      <h2 className="text-[22px] font-extrabold tracking-tight mb-1">Body Metrics</h2>
      <p className="text-xs text-muted-foreground mb-4">Weight & measurements tracking</p>

      <Card variant="elevated" className="mb-4">
        <CardContent>
          {loadingToday ? (
            <Skeleton className="h-14 w-full" />
          ) : todayData ? (
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-cyan-500/15 flex items-center justify-center shrink-0">
                  <Weight className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-xl font-extrabold tabular-nums leading-none">
                    {todayData.morning_weight_kg}
                    <span className="text-sm font-medium text-muted-foreground ml-0.5">kg</span>
                  </p>
                  <p className="text-[10px] text-muted-foreground">Morning weight</p>
                </div>
              </div>
              {todayData.waist_cm && (
                <>
                  <div className="w-px h-10 bg-border" />
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-violet-500/15 flex items-center justify-center shrink-0">
                      <Ruler className="w-5 h-5 text-violet-400" />
                    </div>
                    <div>
                      <p className="text-xl font-extrabold tabular-nums leading-none">
                        {todayData.waist_cm}
                        <span className="text-sm font-medium text-muted-foreground ml-0.5">cm</span>
                      </p>
                      <p className="text-[10px] text-muted-foreground">Waist</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-2">
              Not logged today
            </p>
          )}
        </CardContent>
      </Card>

      <Card variant="elevated">
        <CardContent>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5 text-primary" />
            </div>
            <h3 className="text-sm font-bold">30-Day Trend</h3>
          </div>
          {trend && trend.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <ComposedChart data={trend}>
                <defs>
                  <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(18, 75%, 50%)" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="hsl(18, 75%, 50%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10 }}
                  tickFormatter={(v: string) => {
                    const d = new Date(v + 'T12:00:00');
                    return d.toLocaleDateString('en', { month: 'short', day: 'numeric' });
                  }}
                  stroke="hsl(var(--muted-foreground))"
                  axisLine={false}
                  tickLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  domain={['dataMin - 1', 'dataMax + 1']}
                  tick={{ fontSize: 10 }}
                  width={40}
                  stroke="hsl(var(--muted-foreground))"
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '10px',
                    fontSize: '11px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  }}
                  labelFormatter={(v: string) =>
                    new Date(v + 'T12:00:00').toLocaleDateString('en', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })
                  }
                />
                <Area
                  type="monotone"
                  dataKey="weight_kg"
                  fill="url(#weightGradient)"
                  stroke="none"
                />
                <Line
                  type="monotone"
                  dataKey="weight_kg"
                  stroke="hsl(18, 75%, 50%)"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 4, fill: 'hsl(18, 75%, 50%)', stroke: 'hsl(var(--card))', strokeWidth: 2 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-xs text-muted-foreground text-center py-6">No trend data yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
