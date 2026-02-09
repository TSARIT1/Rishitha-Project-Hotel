import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Billing from './pages/Billing';
import TableQR from './pages/TableQR';
import OrderManagement from './pages/OrderManagement';
import Menu from './pages/Menu';
import Customers from './pages/Customers';
import Reports from './pages/Reports';
import Staff from './pages/Staff';
import Suppliers from './pages/Suppliers';
import Reservations from './pages/Reservations';
import Expenses from './pages/Expenses';
import Kitchen from './pages/Kitchen';
import Careers from './pages/Careers';
import Settings from './pages/Settings';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import MenuOrder from './pages/MenuOrder';
import './App.css';

function AppContent({ sidebarOpen, setSidebarOpen, toggleSidebar, currentSection, setCurrentSection }) {
  const location = useLocation();
  const isLandingPage = location.pathname === '/' || location.pathname === '/landing' || location.pathname === '/login' || location.pathname === '/forgot-password' || location.pathname.startsWith('/menu/');

  useEffect(() => {
    const path = location.pathname;
    if (path === '/dashboard') setCurrentSection('Dashboard');
    else if (path === '/inventory') setCurrentSection('Inventory');
    else if (path === '/billing') setCurrentSection('Billing & Invoices');
    else if (path === '/tables') setCurrentSection('Table QR');
    else if (path === '/orders') setCurrentSection('Order Management');
    else if (path === '/menu') setCurrentSection('Menu');
    else if (path === '/customers') setCurrentSection('Customers');
    else if (path === '/reports') setCurrentSection('Reports & Analytics');
    else if (path === '/staff') setCurrentSection('Staff Management');
    else if (path === '/suppliers') setCurrentSection('Suppliers');
    else if (path === '/reservations') setCurrentSection('Reservations');
    else if (path === '/expenses') setCurrentSection('Expenses');
    else if (path === '/kitchen') setCurrentSection('Kitchen Display');
    else if (path === '/career') setCurrentSection('Carrier');
    else if (path === '/settings') setCurrentSection('Settings');
  }, [location, setCurrentSection]);

  if (isLandingPage) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/menu/:tableNo" element={<MenuOrder />} />
      </Routes>
    );
  }

  return (
    <div className="app-container">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        currentSection={currentSection}
        setCurrentSection={setCurrentSection}
      />
      <div className={`main-wrapper ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Header 
          toggleSidebar={toggleSidebar}
          currentSection={currentSection}
        />
        <main className="main-content">
          <Routes>
            {/* Routes accessible by all authenticated users (Staff & Admin) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/orders" element={<OrderManagement />} />
              <Route path="/tables" element={<TableQR />} />
              <Route path="/kitchen" element={<Kitchen />} />
              <Route path="/reservations" element={<Reservations />} />
              <Route path="/menu" element={<Menu />} /> {/* Assuming staff needs to check menu too */}
            </Route>

            {/* Routes accessible only by Admin (and potentially Staff for some operational tasks, but let's restrict sensitive ones) */}
            {/* For now, assuming 'STAFF' can do most things, but 'ADMIN' controls settings/staff/financials */}
            
            <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'STAFF']} />}> 
               {/* Shared operational routes that might need restricting from basic 'USER' role if it exists */}
               <Route path="/inventory" element={<Inventory />} />
               <Route path="/customers" element={<Customers />} />
               <Route path="/billing" element={<Billing />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route path="/staff" element={<Staff />} />
              <Route path="/suppliers" element={<Suppliers />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/career" element={<Careers />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentSection, setCurrentSection] = useState('Dashboard');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <AppContent 
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            toggleSidebar={toggleSidebar}
            currentSection={currentSection}
            setCurrentSection={setCurrentSection}
          />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
