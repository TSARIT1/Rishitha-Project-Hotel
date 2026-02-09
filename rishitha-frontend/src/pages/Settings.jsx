import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Building, Settings as SettingsIcon, Shield, 
  Globe, Bell, CreditCard, Save, Camera, 
  Mail, Phone, MapPin, CheckCircle, Smartphone,
  Languages, Moon, Sun, Info, LogOut
} from 'lucide-react';
import './Settings.css';


const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  
  // User Profile State
  const [userProfile, setUserProfile] = useState({
    username: '',
    fullName: '',
    email: '',
    language: 'English (US)',
    timezone: '(GMT+05:30) Mumbai, New Delhi',
    profilePicture: null,
    alertReservation: true,
    alertInventory: true,
    alertRevenue: true,
    alertOrders: true
  });

  // Business & System Settings State
  const [settings, setSettings] = useState({
    restaurantName: '',
    phoneNumber: '',
    websiteUrl: '',
    address: '',
    gstNumber: '',
    currency: 'Indian Rupee (INR)',
    taxCgst: 6.0,
    taxSgst: 6.0
  });

  const navigate = useNavigate();

  // Load data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const username = storedUser?.username; // Fallback?

         // Import API
        const { default: api } = await import('../services/api');

        // Fetch User Profile
        if (username) {
             const userRes = await api.get(`/user/profile?username=${username}`);
             if (userRes.data.success) {
                 const u = userRes.data.data;
                 setUserProfile(prev => ({
                     ...prev,
                     username: u.username,
                     fullName: u.fullName || u.username, // Fallback to username if fullname empty
                     email: u.email,
                     language: u.language || 'English (US)',
                     timezone: u.timezone || 'GMT+05:30',
                     profilePicture: u.profilePicture,
                     alertReservation: u.alertReservation,
                     alertInventory: u.alertInventory,
                     alertRevenue: u.alertRevenue,
                     alertOrders: u.alertOrders
                 }));
             }
        }

        // Fetch System Settings
        const settingsRes = await api.get('/settings');
        if (settingsRes.data.success) {
            setSettings(settingsRes.data.data);
        }

      } catch (error) {
        console.error("Error loading settings:", error);
      }
    };
    fetchData();
  }, []);

  const handleProfileChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserProfile(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSettingsChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
        ...prev,
        [name]: value
    }));
  };

  const handleImageUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('file', file);
      // Append username for the backend to know who it is
      formData.append('username', userProfile.username);

      try {
          const { default: api } = await import('../services/api');
          const res = await api.post('/user/upload-photo', formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
          });
          if (res.data.success) {
              setUserProfile(prev => ({ ...prev, profilePicture: res.data.data }));
              alert('Profile picture updated!');
          }
      } catch (error) {
          console.error("Upload failed", error);
          alert('Failed to upload image');
      }
  };

  const handleSave = async () => {
      setLoading(true);
      setMessage(null);
      try {
          const { default: api } = await import('../services/api');
          
          // Save Profile
          const userPayload = {
              ...userProfile,
              // Backend expects specific field names if they match
          };
          // We need to pass username param for the backend to identify user in loose security mode
          await api.put(`/user/profile?username=${userProfile.username}`, userPayload);
          
          // Save Settings
          await api.put('/settings', settings);

          setMessage('Settings updated successfully!');
          setTimeout(() => setMessage(null), 3000);
      } catch (error) {
          console.error("Save failed", error);
          setMessage('Failed to save settings.');
      } finally {
          setLoading(false);
      }
  };

  const handleLogout = () => {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigate('/login');
      // Force refresh or just navigate? Navigate is usually enough.
      // But if there is app state (Context), it might not clear.
      // Simple reload to be safe:
      window.location.href = '/login'; 
  };
  
  // Helper to resolve image url
  const getImageUrl = (path) => {
      if (!path) return null;
      if (path.startsWith('http')) return path;
      return `http://localhost:8080${path}`; // Adjust if port differs
  };

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'business', label: 'Business Profile', icon: Building },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];

  return (
    <div className="container-fluid py-3 settings-bootstrap-page d-flex flex-column" style={{ height: 'calc(100vh - 85px)', overflow: 'hidden' }}>
      
      {/* Page Header */}
      <div className="row align-items-center mb-3 flex-shrink-0 px-2">
        <div className="col">
          <h1 className="h3 fw-bold mb-0 d-flex align-items-center gap-2">
            <SettingsIcon size={28} className="text-primary" />
            System Settings
          </h1>
          <p className="text-muted small mb-0 fw-medium">Configure your restaurant and manage preferences</p>
        </div>
      </div>

      {message && <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'} py-2 px-3 small`}>{message}</div>}

      {/* Main Content Area */}
      <div className="row flex-grow-1 overflow-hidden px-2">
        
        {/* Sidebar Tabs */}
        <div className="col-12 col-md-3 mb-4 mb-md-0">
          <div className="card border-0 shadow-sm glass-card h-100 p-2 overflow-auto custom-thin-scrollbar">
            <div className="nav flex-column nav-pills custom-nav-pills gap-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`nav-link d-flex align-items-center gap-3 py-3 px-4 rounded-4 transition-all ${activeTab === tab.id ? 'active shadow-sm' : 'text-muted'}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <tab.icon size={20} />
                  <span className="fw-bold small">{tab.label}</span>
                </button>
              ))}
            </div>
            
            <div className="mt-auto p-4 border-top">
              <button 
                  onClick={handleLogout}
                  className="btn btn-outline-danger w-100 rounded-pill d-flex align-items-center justify-content-center gap-2 py-2 fw-bold small">
                <LogOut size={16} /> Logout Session
              </button>
            </div>
          </div>
        </div>

        {/* Settings Content Panel */}
        <div className="col-12 col-md-9 h-100 overflow-auto custom-thin-scrollbar pb-4 pr-3">
          <div className="card border-0 shadow-sm rounded-4 h-100 glass-card">
            <div className="card-body p-4 p-lg-5">
              
              {activeTab === 'general' && (
                <div className="fade-in">
                  <h4 className="fw-bold mb-4">General Preferences</h4>
                  
                  <div className="row g-4 mb-5">
                    <div className="col-12 col-xl-8">
                       <label className="form-label fw-bold small">Profile Picture</label>
                       <div className="d-flex align-items-center gap-4">
                          <div className="position-relative">
                             <div className="rounded-circle bg-light d-flex align-items-center justify-content-center border overflow-hidden" style={{ width: '100px', height: '100px' }}>
                                {userProfile.profilePicture ? (
                                    <img src={getImageUrl(userProfile.profilePicture)} alt="Profile" className="w-100 h-100 object-fit-cover" />
                                ) : (
                                    <User size={48} className="text-muted" />
                                )}
                             </div>
                             <button className="btn btn-light btn-icon-sm rounded-circle position-absolute bottom-0 end-0 shadow-sm border"
                                onClick={() => document.getElementById('profile-upload').click()}>
                                <Camera size={16} className="text-primary" />
                             </button>
                             <input type="file" id="profile-upload" className="d-none" accept="image/*" onChange={handleImageUpload} />
                          </div>
                          <div>
                            <p className="small text-muted mb-2">JPG, GIF or PNG. Max size of 800K</p>
                            <button className="btn btn-outline-primary btn-sm rounded-pill fw-bold px-3"
                                onClick={() => document.getElementById('profile-upload').click()}>
                                Upload New
                            </button>
                          </div>
                       </div>
                    </div>
                  </div>

                  <div className="row g-4">
                    <div className="col-md-6">
                      <label className="form-label fw-bold small text-muted text-uppercase ls-1">Full Name</label>
                      <input type="text" className="form-control rounded-pill bg-light border-0 px-4 py-2 fw-semibold" 
                          name="fullName" value={userProfile.fullName || ''} onChange={handleProfileChange} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold small text-muted text-uppercase ls-1">Email Address</label>
                      <input type="email" className="form-control rounded-pill bg-light border-0 px-4 py-2 fw-semibold" 
                            name="email" value={userProfile.email || ''} onChange={handleProfileChange} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold small text-muted text-uppercase ls-1">Language</label>
                      <select className="form-select rounded-pill bg-light border-0 px-4 py-2 fw-semibold"
                            name="language" value={userProfile.language} onChange={handleProfileChange}>
                        <option>English (US)</option>
                        <option>Hindi</option>
                        <option>Telugu</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold small text-muted text-uppercase ls-1">Timezone</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-0 rounded-start-pill ps-4 text-muted border-end pe-4"><Globe size={18}/></span>
                        <select className="form-select border-0 bg-light rounded-end-pill px-4 py-2 fw-semibold"
                                name="timezone" value={userProfile.timezone} onChange={handleProfileChange}>
                          <option>GMT+05:30</option>
                          <option>GMT-08:00</option>
                        </select>
                      </div>
                    </div>
                  </div>


                </div>
              )}

              {activeTab === 'business' && (
                <div className="fade-in">
                  <h4 className="fw-bold mb-4">Business Profile</h4>
                  <div className="row g-4">
                    <div className="col-12">
                      <label className="form-label fw-bold small text-muted text-uppercase ls-1">Restaurant Name</label>
                      <input type="text" className="form-control rounded-pill bg-light border-0 px-4 py-2 fw-semibold" 
                          name="restaurantName" value={settings.restaurantName || ''} onChange={handleSettingsChange} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold small text-muted text-uppercase ls-1">Phone Number</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-0 rounded-start-pill ps-4 text-muted border-end pe-4"><Phone size={18}/></span>
                        <input type="text" className="form-control border-0 bg-light rounded-end-pill px-4 py-2 fw-semibold" 
                             name="phoneNumber" value={settings.phoneNumber || ''} onChange={handleSettingsChange} />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold small text-muted text-uppercase ls-1">Website URL</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-0 rounded-start-pill ps-4 text-muted border-end pe-4"><Globe size={18}/></span>
                        <input type="text" className="form-control border-0 bg-light rounded-end-pill px-4 py-2 fw-semibold" 
                             name="websiteUrl" value={settings.websiteUrl || ''} onChange={handleSettingsChange} />
                      </div>
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-bold small text-muted text-uppercase ls-1">Address</label>
                      <textarea className="form-control rounded-4 bg-light border-0 px-4 py-3 fw-semibold" rows="3" 
                             name="address" value={settings.address || ''} onChange={handleSettingsChange}></textarea>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold small text-muted text-uppercase ls-1">GST / Tax Number</label>
                      <input type="text" className="form-control rounded-pill bg-light border-0 px-4 py-2 fw-semibold" 
                           name="gstNumber" value={settings.gstNumber || ''} onChange={handleSettingsChange} />
                    </div>
                  </div>
                </div>
              )}



              {activeTab === 'notifications' && (
                <div className="fade-in">
                  <h4 className="fw-bold mb-4">Notification Preferences</h4>
                  <div className="vstack gap-3 mt-2">
                     <div className="d-flex align-items-center justify-content-between py-3 border-bottom-dashed">
                        <div>
                           <div className="fw-bold small">New Reservation Alerts</div>
                           <div className="tiny-text text-muted">Email and Push notifications</div>
                        </div>
                        <div className="form-check form-switch custom-switch-sm">
                           <input className="form-check-input shadow-none" type="checkbox" 
                               name="alertReservation" checked={userProfile.alertReservation} onChange={handleProfileChange} />
                        </div>
                     </div>
                     <div className="d-flex align-items-center justify-content-between py-3 border-bottom-dashed">
                        <div>
                           <div className="fw-bold small">Inventory Reorder Alerts</div>
                           <div className="tiny-text text-muted">Alerts when stock is low</div>
                        </div>
                        <div className="form-check form-switch custom-switch-sm">
                           <input className="form-check-input shadow-none" type="checkbox" 
                               name="alertInventory" checked={userProfile.alertInventory} onChange={handleProfileChange} />
                        </div>
                     </div>
                     <div className="d-flex align-items-center justify-content-between py-3 border-bottom-dashed">
                        <div>
                           <div className="fw-bold small">Daily Revenue Reports</div>
                           <div className="tiny-text text-muted">Summary of daily net sales</div>
                        </div>
                        <div className="form-check form-switch custom-switch-sm">
                           <input className="form-check-input shadow-none" type="checkbox" 
                               name="alertRevenue" checked={userProfile.alertRevenue} onChange={handleProfileChange} />
                        </div>
                     </div>
                     <div className="d-flex align-items-center justify-content-between py-3 border-bottom-dashed">
                        <div>
                           <div className="fw-bold small">Order Placement Status</div>
                           <div className="tiny-text text-muted">Update on kitchen orders</div>
                        </div>
                        <div className="form-check form-switch custom-switch-sm">
                           <input className="form-check-input shadow-none" type="checkbox" 
                               name="alertOrders" checked={userProfile.alertOrders} onChange={handleProfileChange} />
                        </div>
                     </div>
                  </div>
                </div>
              )}

              {/* Action Buttons Footer */}
              <div className="mt-auto pt-5 d-flex gap-3 justify-content-end border-top mt-5">
                 <button className="btn btn-light px-5 py-2 fw-bold text-muted rounded-pill shadow-xs bg-white border">Discard Changes</button>
                 <button className="btn btn-primary px-5 py-2 fw-bold rounded-pill shadow-sm d-flex align-items-center gap-2"
                    onClick={handleSave} disabled={loading}>
                    <Save size={18} /> {loading ? 'Saving...' : 'Update Settings'}
                 </button>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;
