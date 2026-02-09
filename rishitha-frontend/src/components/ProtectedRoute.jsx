import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { token, currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="loader">Loading...</div>
      </div>
    );
  }

  if (!token) {
    // User requested strict flow: Landing -> Login -> Dashboard.
    // So if unauthenticated, send them to Landing Page first.
    return <Navigate to="/" replace />;
  }

  if (allowedRoles.length > 0 && currentUser) {
    const userRoles = currentUser.roles || [];
    const hasPermission = allowedRoles.some(role => userRoles.includes(role));

    if (!hasPermission) {
      // Redirect to dashboard or a dedicated unauthorized page
      // For now, redirecting to dashboard if already logged in but unauthorized for this specific route
      // OR could remain on current page if we had history, but <Navigate> is simpler.
      // Ideally, show an "Unauthorized" message or page.
      // Let's redirect to dashboard which presumably is safe for all authenticated users, 
      // or if they are ON dashboard and it's protected, this loop might change. 
      // Safe bet: if they have NO access to requested route, go to dashboard.
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
