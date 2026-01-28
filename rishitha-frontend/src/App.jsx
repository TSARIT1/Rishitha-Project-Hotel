import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
import MenuOrder from './pages/MenuOrder';
import './App.css';

function AppContent({ sidebarOpen, setSidebarOpen, toggleSidebar, currentSection, setCurrentSection }) {
  const location = useLocation();
  const isLandingPage = location.pathname === '/' || location.pathname === '/landing' || location.pathname === '/login' || location.pathname.startsWith('/menu/');

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
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/tables" element={<TableQR />} />
            <Route path="/orders" element={<OrderManagement />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/reservations" element={<Reservations />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/kitchen" element={<Kitchen />} />
            <Route path="/career" element={<Careers />} />
            <Route path="/settings" element={<Settings />} />
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
    <Router>
      <AppContent 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        toggleSidebar={toggleSidebar}
        currentSection={currentSection}
        setCurrentSection={setCurrentSection}
      />
    </Router>
  );
}

export default App;
