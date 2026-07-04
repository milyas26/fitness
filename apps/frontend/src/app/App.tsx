import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import DashboardPage from '../features/dashboard/DashboardPage';
import WorkoutPage from '../features/workout/WorkoutPage';
import RecoveryPage from '../features/recovery/RecoveryPage';
import BodyPage from '../features/body/BodyPage';
import ReportsPage from '../features/reports/ReportsPage';
import SettingsPage from '../features/settings/SettingsPage';
import MorePage from '../features/more/MorePage';

export default function App() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/dashboard" element={<Navigate to="/" replace />} />
        <Route path="/nutrition" element={<Navigate to="/" replace />} />
        <Route path="/workout" element={<WorkoutPage />} />
        <Route path="/recovery" element={<RecoveryPage />} />
        <Route path="/body" element={<BodyPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/more" element={<MorePage />} />
      </Route>
    </Routes>
  );
}
