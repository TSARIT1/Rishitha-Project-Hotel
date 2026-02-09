import { useState, useEffect, useRef } from 'react';
import { Menu, Bell, User, Search, X, ChevronRight, ShoppingBag, Users, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api'; // Ensure you have this configured
import './Header.css';

const Header = ({ toggleSidebar, currentSection }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
  // Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const getCurrentDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };

  // Debounce Search
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 1) {
        setIsSearching(true);
        try {
          const response = await api.get(`/search?query=${searchQuery}`);
          setSearchResults(response.data);
          setShowResults(true);
        } catch (error) {
          console.error("Search failed:", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults(null);
        setShowResults(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchRef]);

  const handleResultClick = (path) => {
    navigate(path);
    setShowResults(false);
    setSearchQuery('');
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <button className="menu-toggle" onClick={toggleSidebar}>
            <Menu size={24} />
          </button>
          <div className="header-title">
            <h1>{currentSection}</h1>
            <p className="header-date">{getCurrentDate()}</p>
          </div>
        </div>

        <div className="header-right">
          <div className="search-bar" ref={searchRef} style={{position: 'relative', overflow: 'visible'}}>
            <Search size={18} className="search-icon" />
            <input 
                type="text" 
                placeholder="Search anything..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length > 1 && setShowResults(true)}
            />
            {searchQuery && (
                <button 
                    className="btn btn-link p-0 text-muted position-absolute end-0 me-2" 
                    style={{top: '50%', transform: 'translateY(-50%)'}}
                    onClick={() => { setSearchQuery(''); setSearchResults(null); }}
                >
                    <X size={14} />
                </button>
            )}

            {/* Search Results Dropdown */}
            {showResults && searchResults && (
                <div className="search-dropdown glass-card shadow-lg" style={{
                    position: 'absolute',
                    top: '110%',
                    left: 0,
                    right: 0,
                    width: '350px',
                    maxHeight: '400px',
                    overflowY: 'auto',
                    zIndex: 1060,
                    padding: '0.5rem',
                    backgroundColor: 'var(--white)'
                }}>
                    {/* Menu Items */}
                    {searchResults.menuItems?.length > 0 && (
                        <div className="mb-2">
                            <h6 className="px-3 py-2 text-muted fw-bold text-uppercase small mb-0 d-flex align-items-center gap-2">
                                <ShoppingBag size={14} /> Menu Items
                            </h6>
                            {searchResults.menuItems.slice(0, 3).map(item => (
                                <div 
                                    key={item.id} 
                                    className="search-item d-flex align-items-center justify-content-between px-3 py-2 rounded-2 hover-bg-light cursor-pointer"
                                    onClick={() => handleResultClick('/menu')}
                                >
                                    <div>
                                        <div className="fw-medium">{item.name}</div>
                                        <div className="small text-muted">{item.category} • ₹{item.price}</div>
                                    </div>
                                    <ChevronRight size={14} className="text-muted" />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Customers */}
                    {searchResults.customers?.length > 0 && (
                        <div className="mb-2">
                            <h6 className="px-3 py-2 text-muted fw-bold text-uppercase small mb-0 d-flex align-items-center gap-2">
                                <Users size={14} /> Customers
                            </h6>
                            {searchResults.customers.slice(0, 3).map(customer => (
                                <div 
                                    key={customer.id} 
                                    className="search-item d-flex align-items-center justify-content-between px-3 py-2 rounded-2 hover-bg-light cursor-pointer"
                                    onClick={() => handleResultClick('/customers')}
                                >
                                    <div>
                                        <div className="fw-medium">{customer.name}</div>
                                        <div className="small text-muted">{customer.phone}</div>
                                    </div>
                                    <ChevronRight size={14} className="text-muted" />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Orders */}
                    {searchResults.orders?.length > 0 && (
                        <div className="mb-2">
                            <h6 className="px-3 py-2 text-muted fw-bold text-uppercase small mb-0 d-flex align-items-center gap-2">
                                <FileText size={14} /> Orders
                            </h6>
                            {searchResults.orders.slice(0, 3).map(order => (
                                <div 
                                    key={order.id} 
                                    className="search-item d-flex align-items-center justify-content-between px-3 py-2 rounded-2 hover-bg-light cursor-pointer"
                                    onClick={() => handleResultClick('/orders')}
                                >
                                    <div>
                                        <div className="fw-medium">Order #{order.id}</div>
                                        <div className="small text-muted">{order.customerName} • {order.status}</div>
                                    </div>
                                    <ChevronRight size={14} className="text-muted" />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* No Results */}
                    {(!searchResults.menuItems?.length && !searchResults.customers?.length && !searchResults.orders?.length) && (
                        <div className="text-center py-4 text-muted">
                            <Search size={24} className="mb-2 opacity-50" />
                            <p className="mb-0 small">No results found for "{searchQuery}"</p>
                        </div>
                    )}
                </div>
            )}
          </div>

          <div className="notification-wrapper" style={{ position: 'relative' }}>
            <button 
              className="header-icon-btn notification-btn"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={20} />
              {notifications.length > 0 && (
                <span className="notification-badge">{notifications.length}</span>
              )}
            </button>
            
            {showNotifications && (
              <div className="notification-dropdown glass" style={{
                position: 'absolute',
                top: '100%',
                right: '0',
                width: '300px',
                marginTop: '10px',
                padding: '1rem',
                borderRadius: '12px',
                zIndex: 1000,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Notifications</h3>
                {notifications.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem 0' }}>
                    No new notifications
                  </p>
                ) : (
                  <ul className="notification-list">
                    {/* Notification items would go here */}
                  </ul>
                )}
              </div>
            )}
          </div>

          <div className="user-menu">
            <div className="user-avatar">
              <User size={20} />
            </div>
            <div className="user-info">
              <span className="user-name">Admin User</span>
              <span className="user-role">Administrator</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
