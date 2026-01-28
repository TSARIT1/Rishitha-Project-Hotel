import { useState } from 'react';
import { 
  User, Building, Settings as SettingsIcon, Shield, 
  Globe, Bell, CreditCard, Save, Camera, 
  Mail, Phone, MapPin, CheckCircle, Smartphone,
  Languages, Moon, Sun, Info, LogOut
} from 'lucide-react';
import './Settings.css';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'business', label: 'Business Profile', icon: Building },
    { id: 'system', label: 'System Setup', icon: Globe },
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
              <button className="btn btn-outline-danger w-100 rounded-pill d-flex align-items-center justify-content-center gap-2 py-2 fw-bold small">
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
                             <div className="rounded-circle bg-light d-flex align-items-center justify-content-center border" style={{ width: '100px', height: '100px' }}>
                                <User size={48} className="text-muted" />
                             </div>
                             <button className="btn btn-primary btn-icon-sm rounded-circle position-absolute bottom-0 end-0 shadow-sm">
                                <Camera size={14} />
                             </button>
                          </div>
                          <div>
                            <p className="small text-muted mb-2">JPG, GIF or PNG. Max size of 800K</p>
                            <button className="btn btn-outline-primary btn-sm rounded-pill fw-bold px-3">Upload New</button>
                          </div>
                       </div>
                    </div>
                  </div>

                  <div className="row g-4">
                    <div className="col-md-6">
                      <label className="form-label fw-bold small text-muted text-uppercase ls-1">Full Name</label>
                      <input type="text" className="form-control rounded-pill bg-light border-0 px-4 py-2 fw-semibold" defaultValue="Admin User" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold small text-muted text-uppercase ls-1">Email Address</label>
                      <input type="email" className="form-control rounded-pill bg-light border-0 px-4 py-2 fw-semibold" defaultValue="admin@rishitha.com" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold small text-muted text-uppercase ls-1">Language</label>
                      <select className="form-select rounded-pill bg-light border-0 px-4 py-2 fw-semibold">
                        <option>English (US)</option>
                        <option>Hindi</option>
                        <option>Telugu</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold small text-muted text-uppercase ls-1">Timezone</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-0 rounded-start-pill ps-4 text-muted border-end pe-4"><Globe size={18}/></span>
                        <select className="form-select border-0 bg-light rounded-end-pill px-4 py-2 fw-semibold">
                          <option>(GMT+05:30) Mumbai, New Delhi</option>
                          <option>(GMT-08:00) Pacific Time</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <hr className="my-5 opacity-10" />
                  <h5 className="fw-bold mb-4">Interface Customization</h5>
                  <div className="d-flex gap-3">
                    <button className="btn btn-light bg-white border shadow-sm rounded-4 p-4 text-center flex-grow-1 border-primary">
                       <Sun size={24} className="text-warning mb-2 mx-auto d-block" />
                       <span className="fw-bold small">Light Mode</span>
                    </button>
                    <button className="btn btn-light bg-white border shadow-sm rounded-4 p-4 text-center flex-grow-1">
                       <Moon size={24} className="text-primary mb-2 mx-auto d-block" />
                       <span className="fw-bold small">Dark Mode</span>
                    </button>
                    <button className="btn btn-light bg-white border shadow-sm rounded-4 p-4 text-center flex-grow-1">
                       <Smartphone size={24} className="text-secondary mb-2 mx-auto d-block" />
                       <span className="fw-bold small">System Default</span>
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'business' && (
                <div className="fade-in">
                  <h4 className="fw-bold mb-4">Business Profile</h4>
                  <div className="row g-4">
                    <div className="col-12">
                      <label className="form-label fw-bold small text-muted text-uppercase ls-1">Restaurant Name</label>
                      <input type="text" className="form-control rounded-pill bg-light border-0 px-4 py-2 fw-semibold" defaultValue="Rishitha Restaurant & Hotel" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold small text-muted text-uppercase ls-1">Phone Number</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-0 rounded-start-pill ps-4 text-muted border-end pe-4"><Phone size={18}/></span>
                        <input type="text" className="form-control border-0 bg-light rounded-end-pill px-4 py-2 fw-semibold" defaultValue="+91 98765-43210" />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold small text-muted text-uppercase ls-1">Website URL</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-0 rounded-start-pill ps-4 text-muted border-end pe-4"><Globe size={18}/></span>
                        <input type="text" className="form-control border-0 bg-light rounded-end-pill px-4 py-2 fw-semibold" defaultValue="www.rishitha.com" />
                      </div>
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-bold small text-muted text-uppercase ls-1">Address</label>
                      <textarea className="form-control rounded-4 bg-light border-0 px-4 py-3 fw-semibold" rows="3" defaultValue="123, Food Street, Near City Center, Hyderabad, India"></textarea>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold small text-muted text-uppercase ls-1">GST / Tax Number</label>
                      <input type="text" className="form-control rounded-pill bg-light border-0 px-4 py-2 fw-semibold" defaultValue="29AAAAA0000A1Z5" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'system' && (
                <div className="fade-in">
                  <h4 className="fw-bold mb-4">Financial & System setup</h4>
                  <div className="row g-4">
                     <div className="col-md-6">
                        <div className="card bg-light border-0 rounded-4 p-4 h-100">
                           <label className="form-label fw-bold small text-muted text-uppercase ls-1 mb-3">Currency Configuration</label>
                           <div className="d-flex align-items-center gap-2 mb-3">
                              <span className="h2 fw-bold mb-0 text-primary">₹</span>
                              <select className="form-select border-0 bg-white shadow-sm rounded-pill px-3 py-2 fw-bold">
                                 <option>Indian Rupee (INR)</option>
                                 <option>US Dollar (USD)</option>
                              </select>
                           </div>
                           <p className="tiny-text text-muted mb-0">This will be the base currency for all billing and reports.</p>
                        </div>
                     </div>
                     <div className="col-md-6">
                        <div className="card bg-light border-0 rounded-4 p-4 h-100">
                           <label className="form-label fw-bold small text-muted text-uppercase ls-1 mb-3">Tax Configuration</label>
                           <div className="vstack gap-2">
                              <div className="d-flex justify-content-between align-items-center bg-white p-2 px-3 rounded-pill shadow-xs">
                                 <span className="small fw-bold">CGST</span>
                                 <span className="badge bg-primary-soft text-primary rounded-pill">6%</span>
                              </div>
                              <div className="d-flex justify-content-between align-items-center bg-white p-2 px-3 rounded-pill shadow-xs">
                                 <span className="small fw-bold">SGST</span>
                                 <span className="badge bg-primary-soft text-primary rounded-pill">6%</span>
                              </div>
                           </div>
                           <button className="btn btn-link btn-sm text-decoration-none fw-bold mt-2 p-0 text-primary">Manage Tax Rates</button>
                        </div>
                     </div>
                  </div>
                </div>
              )}



              {activeTab === 'notifications' && (
                <div className="fade-in">
                  <h4 className="fw-bold mb-4">Notification Preferences</h4>
                  <div className="vstack gap-3 mt-2">
                     {[
                        { title: 'New Reservation Alerts', desc: 'Email and Push notifications' },
                        { title: 'Inventory Reorder Alerts', desc: 'Alerts when stock is low' },
                        { title: 'Daily Revenue Reports', desc: 'Summary of daily net sales' },
                        { title: 'Order Placement Status', desc: 'Update on kitchen orders' }
                     ].map((item, i) => (
                        <div key={i} className="d-flex align-items-center justify-content-between py-3 border-bottom-dashed">
                           <div>
                              <div className="fw-bold small">{item.title}</div>
                              <div className="tiny-text text-muted">{item.desc}</div>
                           </div>
                           <div className="form-check form-switch custom-switch-sm">
                              <input className="form-check-input shadow-none" type="checkbox" defaultChecked={i < 3} />
                           </div>
                        </div>
                     ))}
                  </div>
                </div>
              )}

              {/* Action Buttons Footer */}
              <div className="mt-auto pt-5 d-flex gap-3 justify-content-end border-top mt-5">
                 <button className="btn btn-light px-5 py-2 fw-bold text-muted rounded-pill shadow-xs bg-white border">Discard Changes</button>
                 <button className="btn btn-primary px-5 py-2 fw-bold rounded-pill shadow-sm d-flex align-items-center gap-2">
                    <Save size={18} /> Update Settings
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
