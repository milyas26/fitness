export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    timestamp: string;
    idempotency_key?: string;
  };
}

export type EntitySource = 'hermes' | 'manual';

export type MealTime = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export type MuscleSoreness = 'none' | 'mild' | 'moderate' | 'severe';

export type WorkoutSplit =
  | 'push'
  | 'pull'
  | 'legs'
  | 'upper'
  | 'lower'
  | 'full_body'
  | 'push_pull_legs'
  | 'bro_split'
  | 'custom';

export type ReportPeriod = 'daily' | 'weekly' | 'monthly';
