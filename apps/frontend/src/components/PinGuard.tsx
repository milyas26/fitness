import { useState, useEffect, useRef } from 'react';
import { Lock, Delete } from 'lucide-react';

const STORAGE_KEY = 'app_pin_verified';
const CORRECT_PIN = '2302';

interface PinGuardProps {
  children: React.ReactNode;
}

export default function PinGuard({ children }: PinGuardProps) {
  const [verified, setVerified] = useState<boolean | null>(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const errorTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === CORRECT_PIN) {
      setVerified(true);
    } else {
      setVerified(false);
    }
  }, []);

  const handleKeyPress = (digit: string) => {
    if (pin.length >= 4) return;
    setError(false);
    if (errorTimer.current) clearTimeout(errorTimer.current);
    const next = pin + digit;
    setPin(next);
    if (next.length === 4) {
      if (next === CORRECT_PIN) {
        localStorage.setItem(STORAGE_KEY, CORRECT_PIN);
        setVerified(true);
      } else {
        setError(true);
        errorTimer.current = setTimeout(() => {
          setPin('');
        }, 500);
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(false);
  };

  if (verified === null || verified) return <>{children}</>;

  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'delete'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background p-4">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-20 w-72 h-72 bg-primary/3 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-blue-500/3 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Enter PIN</h2>
          <p className="text-sm text-muted-foreground">Enter your 4-digit security PIN</p>
        </div>

        <div className="flex gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all duration-200 ${
                error
                  ? 'border-red-500 bg-red-500/10 animate-shake'
                  : pin.length > i
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-card'
              }`}
            >
              {pin.length > i && (
                <div className={`w-3 h-3 rounded-full ${error ? 'bg-red-500' : 'bg-primary'}`} />
              )}
            </div>
          ))}
        </div>

        {error && (
          <p className="text-sm text-red-500 font-medium">Wrong PIN. Try again.</p>
        )}

        <div className="grid grid-cols-3 gap-3 w-full max-w-[240px]">
          {digits.map((d) => {
            if (d === '') return <div key="empty" />;
            if (d === 'delete') {
              return (
                <button
                  key="delete"
                  onClick={handleDelete}
                  className="h-14 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground active:bg-muted transition-colors"
                >
                  <Delete className="w-5 h-5" />
                </button>
              );
            }
            return (
              <button
                key={d}
                onClick={() => handleKeyPress(d)}
                className="h-14 rounded-xl bg-card border border-border font-semibold text-lg text-foreground active:bg-muted transition-colors"
              >
                {d}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
