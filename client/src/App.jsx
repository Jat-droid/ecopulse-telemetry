import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import FleetManager from './pages/FleetManager';
import AnalyticsReports from './pages/AnalyticsReport';
import SpatialGeofencing from './pages/SpatialGeofencing';
import Login from './pages/Login';

// Protected Route Guard: Validates token persistence across browser refreshes
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('ecopulse_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Login Route Guard: Prevents authenticated operators from seeing login page again on refresh
const AnonymousRoute = ({ children }) => {
  const token = localStorage.getItem('ecopulse_token');
  if (token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login is protected against authenticated sessions */}
        <Route path="/login" element={
          <AnonymousRoute>
            <Login />
          </AnonymousRoute>
        } />
        
        {/* Core Management Shell */}
        <Route path="/" element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          {/* Default Route: Telemetry Board */}
          <Route index element={<Dashboard />} />
          
          {/* Internal Application Modules */}
          <Route path="fleet" element={<FleetManager />} /> 
          <Route path="reports" element={<AnalyticsReports />} />
          <Route path="geofence" element={<SpatialGeofencing />} />
        </Route>

        {/* Catch-all safety route redirection */}
        <Route path="*" replace element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}