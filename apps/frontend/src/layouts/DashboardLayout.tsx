import { Outlet } from 'react-router-dom';
import { DateProvider } from '../contexts/DateContext';
import BottomNav from './BottomNav';

export default function DashboardLayout() {
  return (
    <DateProvider>
      <div className="mx-auto max-w-md min-h-screen bg-background flex flex-col relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-20 w-72 h-72 bg-primary/3 rounded-full blur-3xl" />
          <div className="absolute top-1/3 -left-20 w-60 h-60 bg-blue-500/3 rounded-full blur-3xl" />
        </div>
        <main className="flex-1 px-4 pt-5 pb-28 overflow-y-auto relative">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </DateProvider>
  );
}
