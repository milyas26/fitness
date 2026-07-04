import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsApi } from '../../services/settings.service';
import { Card, CardContent } from '../../components/ui/Card';
import { Skeleton } from '../../components/ui/Skeleton';
import { WORKOUT_SPLITS } from '@fitness/shared';
import type { Settings } from '@fitness/shared';
import { Pencil, Check, X, User, Target, Dumbbell } from 'lucide-react';

interface FieldProps {
  label: string;
  value: number | string;
  unit?: string;
  editing: boolean;
  onChange?: (value: string) => void;
}

function Field({ label, value, unit, editing, onChange }: FieldProps) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-border/30 last:border-0">
      <span className="text-sm text-muted-foreground font-medium">{label}</span>
      {editing && onChange ? (
        <input
          type={unit === 'cm' || unit === 'kg' || unit === 'kcal' || unit === 'g' || unit === 'ml' ? 'number' : 'text'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-28 text-sm font-semibold text-right bg-secondary/50 border border-border rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 tabular-nums transition-colors"
          step={unit === 'kg' || unit === 'cm' ? '0.1' : '1'}
          min={0}
        />
      ) : (
        <span className="text-sm font-semibold tabular-nums">
          {String(value ?? '—')}
          {unit ? <span className="text-muted-foreground font-normal"> {unit}</span> : ''}
        </span>
      )}
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  editing,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  editing: boolean;
  onChange?: (value: string) => void;
}) {
  const display = value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="flex justify-between items-center py-3 border-b border-border/30 last:border-0">
      <span className="text-sm text-muted-foreground font-medium">{label}</span>
      {editing && onChange ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-40 text-sm font-semibold text-right bg-secondary/50 border border-border rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors"
        >
          {options.map((opt) => (
            <option key={opt} value={opt} className="bg-card text-foreground">
              {opt.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
            </option>
          ))}
        </select>
      ) : (
        <span className="text-sm font-semibold">{display}</span>
      )}
    </div>
  );
}

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Partial<Settings>>({});

  const { data, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsApi.get(),
  });

  useEffect(() => {
    if (data && !editing) {
      setForm(data as unknown as Settings);
    }
  }, [data, editing]);

  const mutation = useMutation({
    mutationFn: (updates: Partial<Settings>) => settingsApi.patch(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setEditing(false);
    },
  });

  const s = data as Settings | null;

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <h2 className="text-[22px] font-extrabold tracking-tight mb-1">Settings</h2>
        <p className="text-xs text-muted-foreground mb-4">Targets & personal info</p>
        <Skeleton className="h-80 w-full rounded-xl" />
      </div>
    );
  }

  const startEdit = () => {
    setForm(s ?? {});
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
  };

  const saveEdit = () => {
    mutation.mutate(form);
  };

  const update = (key: keyof Settings, value: string) => {
    const num = Number(value);
    setForm((prev) => ({
      ...prev,
      [key]: isNaN(num) ? value : num,
    }));
  };

  const current = editing ? form : s;

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-[22px] font-extrabold tracking-tight">Settings</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Targets & personal info</p>
        </div>
        {editing ? (
          <div className="flex items-center gap-1.5">
            <button
              onClick={saveEdit}
              disabled={mutation.isPending}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-all disabled:opacity-50 shadow-md shadow-primary/20"
            >
              <Check className="w-3.5 h-3.5" />
              Save
            </button>
            <button
              onClick={cancelEdit}
              className="p-2 rounded-xl hover:bg-secondary transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={startEdit}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border/60 hover:bg-secondary hover:border-border transition-all text-xs font-semibold shadow-sm"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit
          </button>
        )}
      </div>

      <Card variant="elevated" className="mb-4">
        <CardContent className="py-4">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-7 h-7 rounded-full bg-cyan-500/15 flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <h3 className="text-sm font-bold">Personal</h3>
          </div>
          <Field label="Height" value={current?.height_cm ?? ''} unit="cm" editing={editing} onChange={(v) => update('height_cm', v)} />
          <Field label="Target Weight" value={current?.target_weight_kg ?? ''} unit="kg" editing={editing} onChange={(v) => update('target_weight_kg', v)} />
        </CardContent>
      </Card>

      <Card variant="elevated" className="mb-4">
        <CardContent className="py-4">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center">
              <Target className="w-3.5 h-3.5 text-primary" />
            </div>
            <h3 className="text-sm font-bold">Daily Targets</h3>
          </div>
          <Field label="Calories" value={current?.daily_calories ?? ''} unit="kcal" editing={editing} onChange={(v) => update('daily_calories', v)} />
          <Field label="Protein" value={current?.daily_protein_g ?? ''} unit="g" editing={editing} onChange={(v) => update('daily_protein_g', v)} />
          <Field label="Carbs" value={current?.daily_carbs_g ?? ''} unit="g" editing={editing} onChange={(v) => update('daily_carbs_g', v)} />
          <Field label="Fat" value={current?.daily_fat_g ?? ''} unit="g" editing={editing} onChange={(v) => update('daily_fat_g', v)} />
          <Field label="Fiber" value={current?.daily_fiber_g ?? ''} unit="g" editing={editing} onChange={(v) => update('daily_fiber_g', v)} />
          <Field label="Water" value={current?.daily_water_ml ?? ''} unit="ml" editing={editing} onChange={(v) => update('daily_water_ml', v)} />
        </CardContent>
      </Card>

      <Card variant="elevated">
        <CardContent className="py-4">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-7 h-7 rounded-full bg-green-500/15 flex items-center justify-center">
              <Dumbbell className="w-3.5 h-3.5 text-green-400" />
            </div>
            <h3 className="text-sm font-bold">Training</h3>
          </div>
          <SelectField label="Split" value={(current?.current_split as string) ?? 'full_body'} options={WORKOUT_SPLITS} editing={editing} onChange={(v) => update('current_split', v)} />
          <Field label="Days / Week" value={current?.workout_days_per_week ?? ''} editing={editing} onChange={(v) => update('workout_days_per_week', v)} />
        </CardContent>
      </Card>
    </div>
  );
}
