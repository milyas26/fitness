import { cn } from '../../lib/utils';

interface CardProps {
  className?: string;
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'glow';
  style?: React.CSSProperties;
}

export function Card({ className, children, variant = 'default', style }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl transition-all duration-300',
        variant === 'default' && 'bg-card shadow-card hover:shadow-card-hover',
        variant === 'elevated' && 'bg-card/90 backdrop-blur-sm shadow-sm hover:shadow-md',
        variant === 'glow' && 'bg-card/95 ring-1 ring-primary/10 shadow-glow-sm hover:shadow-glow',
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
