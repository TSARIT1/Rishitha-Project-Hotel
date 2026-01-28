import { Menu, Bell, User, Search } from 'lucide-react';
import './Header.css';

const Header = ({ toggleSidebar, currentSection }) => {
  const getCurrentDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
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
          <div className="search-bar">
            <Search size={18} />
            <input type="text" placeholder="Search anything..." />
          </div>

          <button className="header-icon-btn notification-btn">
            <Bell size={20} />
            <span className="notification-badge">15</span>
          </button>

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
