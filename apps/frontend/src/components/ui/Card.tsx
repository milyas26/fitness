import { cn } from '../../lib/utils';

interface CardProps {
  className?: string;
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'glow';
  accent?: boolean;
  style?: React.CSSProperties;
}

export function Card({ className, children, variant = 'default', accent = false, style }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border bg-card transition-all duration-300',
        variant === 'default' && 'border-border/60 shadow-card hover:shadow-card-hover',
        variant === 'elevated' && 'border-border/40 shadow-lg hover:shadow-xl',
        variant === 'glow' && 'ring-glow shadow-glow-sm',
        accent && 'stripe-accent pt-px',
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children }: CardProps) {
  return <div className={cn('mb-4 flex items-center gap-2', className)}>{children}</div>;
}

export function CardTitle({ className, children }: CardProps) {
  return (
    <h3 className={cn('text-sm font-semibold tracking-tight text-foreground/90', className)}>
      {children}
    </h3>
  );
}

export function CardContent({ className, children }: CardProps) {
  return <div className={cn('p-4', className)}>{children}</div>;
}
