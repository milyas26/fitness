import { NavLink } from 'react-router-dom';
import { LayoutDashboard, UtensilsCrossed, Dumbbell, Weight, MoreHorizontal } from 'lucide-react';
import { cn } from '../lib/utils';

const tabs = [
  { to: '/', icon: LayoutDashboard, label: 'Home' },
  { to: '/nutrition', icon: UtensilsCrossed, label: 'Food' },
  { to: '/workout', icon: Dumbbell, label: 'Train' },
  { to: '/body', icon: Weight, label: 'Body' },
  { to: '/more', icon: MoreHorizontal, label: 'More' },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-10">
      <div className="mx-auto max-w-md px-3 pb-4">
        <div className="flex items-center justify-around h-15 px-1 bg-card/80 backdrop-blur-2xl border border-border/30 rounded-2xl shadow-lg shadow-black/5">
          {tabs.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cn(
                  'relative flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-xl min-w-0 transition-all duration-300',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground/70',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={cn(
                      'w-5 h-5 relative transition-transform duration-300',
                      isActive && 'scale-110',
                    )}
                  />
                  <span
                    className={cn(
                      'text-[10px] font-semibold relative transition-all duration-300',
                      isActive ? 'opacity-100' : 'opacity-60',
                    )}
                  >
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
