import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Package, Receipt, QrCode, ClipboardList, 
  UtensilsCrossed, Users, BarChart3, UserCog, Truck, 
  CalendarCheck, DollarSign, ChefHat, Settings, Briefcase 
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose, currentSection, setCurrentSection }) => {
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', badge: null },
    { icon: Package, label: 'Inventory', path: '/inventory', badge: null },
    { icon: Receipt, label: 'Billing & Invoices', path: '/billing', badge: null },
    { icon: QrCode, label: 'Table QR', path: '/tables', badge: null },
    { icon: ClipboardList, label: 'Order Management', path: '/orders', badge: null },
    { icon: UtensilsCrossed, label: 'Menu', path: '/menu', badge: null },
    { icon: Users, label: 'Customers', path: '/customers', badge: null },
    { icon: BarChart3, label: 'Reports & Analytics', path: '/reports', badge: null },
    { icon: UserCog, label: 'Staff Management', path: '/staff', badge: null },
    { icon: Truck, label: 'Suppliers', path: '/suppliers', badge: null },
    { icon: CalendarCheck, label: 'Reservations', path: '/reservations', badge: 5 },
    { icon: DollarSign, label: 'Expenses', path: '/expenses', badge: null },
    { icon: ChefHat, label: 'Kitchen Display', path: '/kitchen', badge: null },
    { icon: Briefcase, label: 'Carrier', path: '/career', badge: null },
    { icon: Settings, label: 'Settings', path: '/settings', badge: null },
  ];

  const handleMenuClick = (label) => {
    setCurrentSection(label);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo-icon">
              <UtensilsCrossed size={32} />
            </div>
            <div className="logo-text">
              <h2>Rishitha</h2>
              <p>Restaurant & Hotel</p>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <ul className="menu-list">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.path} className={isActive ? 'active' : ''}>
                  <Link 
                    to={item.path}
                    onClick={() => handleMenuClick(item.label)}
                    className="menu-item"
                  >
                    <div className="menu-item-content">
                      <Icon className="menu-icon" size={20} />
                      <span className="menu-label">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="menu-badge">{item.badge}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="status-indicator">
            <div className="status-dot"></div>
            <span>System Online</span>
          </div>
          <p className="version">v2.1.0 • © 2024 Rishitha</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
