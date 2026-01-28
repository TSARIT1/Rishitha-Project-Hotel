import { useState, useEffect } from 'react';
import { 
  QrCode, Download, Printer, RefreshCw, Users, 
  Plus, Search, CheckCircle, AlertCircle, Clock
} from 'lucide-react';
import StatCard from '../components/UI/StatCard';
import './TableQR.css';

const TableQR = () => {
  const [selectedTable, setSelectedTable] = useState(12);
  const [searchTerm, setSearchTerm] = useState('');
  const [qrSize, setQrSize] = useState('250x250');
  const [colorTheme, setColorTheme] = useState('Default (Black)');
  const [qrType, setQrType] = useState('Menu Access');
  const [showNewTableModal, setShowNewTableModal] = useState(false);
  
  // Form data for new table
  const [tableFormData, setTableFormData] = useState({
    tableNo: '',
    capacity: 2,
    location: '',
    waiter: 'John',
    status: 'Available'
  });

  // Table Data State
  const [tablesData, setTablesData] = useState([]);
  
  // Fetch Tables on component mount
  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
        const { default: api } = await import('../api/axiosConfig');
        const response = await api.get('/tables');
        if (response.data.success) {
            setTablesData(response.data.data);
        }
    } catch (error) {
        console.error("Error fetching tables:", error);
    }
  };

  const handleSubmitTable = async (e) => {
    e.preventDefault();
    
    // Create new table payload
    const newTable = {
      tableNo: parseInt(tableFormData.tableNo),
      capacity: parseInt(tableFormData.capacity),
      location: tableFormData.location,
      waiter: tableFormData.waiter,
      status: tableFormData.status,
      currentOrder: null, // Default
      since: null // Default
    };

    try {
        const { default: api } = await import('../api/axiosConfig');
        const response = await api.post('/tables', newTable);
        
        if (response.data.success) {
            setTablesData(prev => [...prev, response.data.data]);
            alert('Table added successfully!');
            handleCloseModal();
        }
    } catch (error) {
        console.error("Error adding table:", error);
        alert('Failed to add table. ' + (error.response?.data?.message || ''));
    }
  };

  const stats = [
    {
      title: 'Total Tables',
      value: tablesData.length,
      icon: QrCode,
      color: 'success',
      change: 'All active',
      trend: 'neutral',
      subtitle: 'tables configured'
    },
    {
      title: 'Occupied Tables',
      value: tablesData.filter(t => t.status === 'Occupied').length,
      icon: Users,
      color: 'warning',
      change: '84 guests', // Could ideally sum capacity or actual guests if available
      trend: 'up',
      subtitle: `Out of ${tablesData.length} tables`
    },
    {
      title: 'Available Tables', // Changed from "Current Guests" as we don't track guest count yet
      value: tablesData.filter(t => t.status === 'Available').length,
      icon: CheckCircle,
      color: 'primary',
      change: 'Ready',
      trend: 'neutral',
      subtitle: 'tables ready'
    },
  ];

  const filteredTables = tablesData.filter(table =>
    table.tableNo.toString().includes(searchTerm) ||
    table.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    table.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusClass = (status) => {
    switch(status) {
      case 'Available': return 'status-available';
      case 'Occupied': return 'status-occupied';
      case 'Reserved': return 'status-reserved';
      default: return '';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Available': return <CheckCircle size={16} />;
      case 'Occupied': return <AlertCircle size={16} />;
      case 'Reserved': return <Clock size={16} />;
      default: return null;
    }
  };

  const handleDownloadQR = () => {
    alert('Downloading QR Code as PNG...');
  };

  const handlePrintLabel = () => {
    alert('Printing table label...');
  };

  const handleRegenerate = () => {
    alert('Regenerating QR Code...');
  };

  const handleUpdateSettings = () => {
    alert('QR Settings updated successfully!');
  };

  const handleMarkAvailable = () => {
    alert('Marking selected tables as Available...');
  };

  const handleMarkOccupied = () => {
    alert('Marking selected tables as Occupied...');
  };

  const handleMarkReserved = () => {
    alert('Marking selected tables as Reserved...');
  };

  const handleNeedsCleaning = () => {
    alert('Marking selected tables as Needs Cleaning...');
  };

  const handleAddTable = () => {
    setShowNewTableModal(true);
  };

  const handleCloseModal = () => {
    setShowNewTableModal(false);
    // Reset form
    setTableFormData({
      tableNo: '',
      capacity: 2,
      location: '',
      waiter: 'John',
      status: 'Available'
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTableFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };



  const selectedTableData = tablesData.find(t => t.tableNo === selectedTable);

  return (
    <div className="container-fluid py-3 table-qr-bootstrap-page d-flex flex-column" style={{ height: 'calc(100vh - 85px)', overflow: 'hidden' }}>
      
      {/* Top Stats Row */}
      <div className="row g-3 mb-3 flex-shrink-0 px-2">
        {stats.map((stat, index) => (
          <div key={index} className="col-12 col-md-4">
            <div className="card h-100 border-0 shadow-sm glass-card stat-card-modern">
              <div className="card-body p-3 d-flex align-items-center">
                <div className={`stat-icon bg-${stat.color}-soft text-${stat.color} me-3`}>
                  <stat.icon size={22} />
                </div>
                <div className="flex-grow-1">
                  <div className="text-muted small fw-semibold text-uppercase ls-1">{stat.title}</div>
                  <div className="h4 mb-0 fw-bold">{stat.value}</div>
                  <div className="d-flex align-items-center gap-1 mt-1">
                    <span className={`badge bg-${stat.trend === 'up' ? 'success' : stat.trend === 'warning' ? 'warning' : 'info'}-subtle text-${stat.trend === 'up' ? 'success' : stat.trend === 'warning' ? 'warning' : 'info'} border-0 px-2`}>
                      {stat.change}
                    </span>
                    <span className="text-muted tiny-text">{stat.subtitle}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Table Modal */}
      {showNewTableModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={handleCloseModal}>
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-danger text-white border-0">
                <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                  <Plus size={24} />
                  Add New Table
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={handleCloseModal}></button>
              </div>
              <form onSubmit={handleSubmitTable}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    {/* Table Information */}
                    <div className="col-12">
                      <h6 className="fw-bold text-muted mb-3 d-flex align-items-center gap-2">
                        <QrCode size={18} />
                        Table Information
                      </h6>
                    </div>
                    
                    <div className="col-md-6">
                      <label className="form-label fw-bold small text-muted text-uppercase">Table Number *</label>
                      <input
                        type="number"
                        className="form-control rounded-pill px-3"
                        name="tableNo"
                        value={tableFormData.tableNo}
                        onChange={handleInputChange}
                        placeholder="e.g., 13"
                        min="1"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold small text-muted text-uppercase">Capacity *</label>
                      <select
                        className="form-select rounded-pill px-3"
                        name="capacity"
                        value={tableFormData.capacity}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="2">2 Persons</option>
                        <option value="4">4 Persons</option>
                        <option value="6">6 Persons</option>
                        <option value="8">8 Persons</option>
                        <option value="10">10 Persons</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-bold small text-muted text-uppercase">Location *</label>
                      <input
                        type="text"
                        className="form-control rounded-pill px-3"
                        name="location"
                        value={tableFormData.location}
                        onChange={handleInputChange}
                        placeholder="e.g., Main Hall, Window Side"
                        required
                      />
                    </div>

                    {/* Assignment Details */}
                    <div className="col-12 mt-4">
                      <h6 className="fw-bold text-muted mb-3">Assignment Details</h6>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold small text-muted text-uppercase">Assigned Waiter *</label>
                      <select
                        className="form-select rounded-pill px-3"
                        name="waiter"
                        value={tableFormData.waiter}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="John">John</option>
                        <option value="Sarah">Sarah</option>
                        <option value="Mike">Mike</option>
                        <option value="Emma">Emma</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold small text-muted text-uppercase">Initial Status *</label>
                      <select
                        className="form-select rounded-pill px-3"
                        name="status"
                        value={tableFormData.status}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="Available">Available</option>
                        <option value="Occupied">Occupied</option>
                        <option value="Reserved">Reserved</option>
                      </select>
                    </div>

                    {/* Info Alert */}
                    <div className="col-12 mt-3">
                      <div className="alert alert-info mb-0 d-flex align-items-start gap-2">
                        <QrCode size={16} className="mt-1" />
                        <div className="small">
                          A QR code will be automatically generated for this table.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light rounded-pill px-4 fw-bold" onClick={handleCloseModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-danger rounded-pill px-4 fw-bold d-flex align-items-center gap-2">
                    <Plus size={18} />
                    Add Table
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="row g-3 flex-grow-1 overflow-hidden px-2">
        {/* Left Column: QR Display & Settings */}
        <div className="col-12 col-lg-4 d-flex flex-column overflow-auto custom-thin-scrollbar pr-lg-2" style={{ maxHeight: '100%' }}>
          {/* Main QR Card */}
          <div className="card border-0 shadow-sm rounded-3 mb-3">
            <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
                <QrCode size={20} className="text-primary" />
                Table {selectedTable} QR
              </h5>
              <button className="btn btn-primary-soft btn-sm p-2 rounded" onClick={handleRegenerate}>
                <RefreshCw size={16} />
              </button>
            </div>
            <div className="card-body p-4">
              <div className="qr-code-wrapper bg-light rounded-4 p-4 mb-4 text-center border">
                <div className="qr-placeholder bg-white d-inline-block p-3 rounded-3 shadow-sm">
                  <QrCode size={180} className="text-dark opacity-50" />
                </div>
                <div className="mt-3">
                  <code className="text-primary small fw-bold">rishitha.com/menu/{selectedTable}</code>
                </div>
              </div>

              <div className="row g-2 mb-4">
                <div className="col-6">
                  <div className="p-2 border rounded-3 bg-light text-center">
                    <div className="tiny-text text-muted text-uppercase fw-bold">Capacity</div>
                    <div className="fw-bold">{selectedTableData?.capacity} Persons</div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-2 border rounded-3 bg-light text-center">
                    <div className="tiny-text text-muted text-uppercase fw-bold">Status</div>
                    <span className={`status-pill ${getStatusClass(selectedTableData?.status)} x-small-text`}>
                      {selectedTableData?.status}
                    </span>
                  </div>
                </div>
                <div className="col-12">
                  <div className="p-2 border rounded-3 bg-light">
                    <div className="tiny-text text-muted text-uppercase fw-bold px-1">Location</div>
                    <div className="fw-bold px-1 small">{selectedTableData?.location}</div>
                  </div>
                </div>
              </div>

              <div className="d-flex gap-2">
                <button className="btn btn-outline-primary btn-sm flex-grow-1 py-2 d-flex align-items-center justify-content-center gap-2" onClick={handleDownloadQR}>
                  <Download size={16} /> Download
                </button>
                <button className="btn btn-outline-info btn-sm flex-grow-1 py-2 d-flex align-items-center justify-content-center gap-2" onClick={handlePrintLabel}>
                  <Printer size={16} /> Print Label
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="card border-0 shadow-sm rounded-3 mb-3">
            <div className="card-header bg-white border-bottom py-3">
              <h6 className="mb-0 fw-bold">Quick Table Actions</h6>
            </div>
            <div className="card-body p-2 p-md-3">
              <div className="row g-2">
                <div className="col-6">
                  <button className="btn btn-outline-success w-100 py-2 d-flex flex-column align-items-center gap-1 border-0 bg-success-soft" onClick={handleMarkAvailable}>
                    <CheckCircle size={18} /> <span className="x-small-text fw-bold">Available</span>
                  </button>
                </div>
                <div className="col-6">
                  <button className="btn btn-outline-warning w-100 py-2 d-flex flex-column align-items-center gap-1 border-0 bg-warning-soft" onClick={handleMarkOccupied}>
                    <AlertCircle size={18} /> <span className="x-small-text fw-bold text-dark">Occupied</span>
                  </button>
                </div>
                <div className="col-6">
                  <button className="btn btn-outline-info w-100 py-2 d-flex flex-column align-items-center gap-1 border-0 bg-info-soft" onClick={handleMarkReserved}>
                    <Clock size={18} /> <span className="x-small-text fw-bold">Reserved</span>
                  </button>
                </div>
                <div className="col-6">
                  <button className="btn btn-outline-danger w-100 py-2 d-flex flex-column align-items-center gap-1 border-0 bg-danger-soft" onClick={handleNeedsCleaning}>
                    <RefreshCw size={18} /> <span className="x-small-text fw-bold">Cleaning</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Card */}
          <div className="card border-0 shadow-sm rounded-3 mb-3">
            <div className="card-header bg-white border-bottom py-3">
              <h6 className="mb-0 fw-bold">QR Configuration</h6>
            </div>
            <div className="card-body p-3">
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="tiny-text fw-bold text-muted text-uppercase mb-1">QR Size</label>
                  <input type="text" className="form-control form-control-sm border-light shadow-none bg-light" value={qrSize} onChange={(e) => setQrSize(e.target.value)} />
                </div>
                <div className="col-12 col-md-6">
                   <label className="tiny-text fw-bold text-muted text-uppercase mb-1">Type</label>
                   <select className="form-select form-select-sm border-light shadow-none bg-light" value={qrType} onChange={(e) => setQrType(e.target.value)}>
                      <option>Menu Access</option>
                      <option>Order Placement</option>
                      <option>Feedback</option>
                   </select>
                </div>
                <div className="col-12">
                   <button className="btn btn-primary w-100 btn-sm py-2 fw-bold shadow-sm" onClick={handleUpdateSettings}>
                      Update QR Configuration
                   </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Tables List */}
        <div className="col-12 col-lg-8 h-100 d-flex flex-column overflow-hidden">
          <div className="card border-0 shadow-sm rounded-3 d-flex flex-column h-100 overflow-hidden">
            <div className="card-header bg-white border-bottom py-3 px-4 d-flex justify-content-between align-items-center flex-shrink-0">
              <div className="d-flex align-items-center gap-3">
                <h5 className="mb-0 fw-bold">Table Records</h5>
                <div className="input-group input-group-sm border-0 bg-light rounded-pill px-2" style={{ maxWidth: '300px' }}>
                  <span className="input-group-text bg-transparent border-0 text-muted">
                    <Search size={16} />
                  </span>
                  <input
                    type="text"
                    className="form-control bg-transparent border-0 shadow-none py-2"
                    placeholder="Search tables..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <button className="btn btn-danger-custom btn-sm px-3 py-2 d-flex align-items-center gap-2" onClick={handleAddTable}>
                <Plus size={18} /> New Table
              </button>
            </div>
            
            <div className="table-responsive flex-grow-1 custom-thin-scrollbar">
              <table className="table table-hover align-middle mb-0 table-qr-modern">
                <thead className="table-light sticky-top z-1">
                  <tr>
                    <th className="ps-4 py-3">No</th>
                    <th className="py-3">Details</th>
                    <th className="py-3">Location</th>
                    <th className="py-3 text-center">Active Order</th>
                    <th className="py-3">Staff</th>
                    <th className="py-3 text-center">Duration</th>
                    <th className="py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTables.map((table) => (
                    <tr 
                      key={table.tableNo}
                      className={selectedTable === table.tableNo ? 'selected-row-active table-primary' : ''}
                      onClick={() => setSelectedTable(table.tableNo)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td className="ps-4">
                        <span className={`badge ${selectedTable === table.tableNo ? 'bg-primary' : 'bg-light text-dark border'} fw-bold p-2 px-3`}>
                          #{table.tableNo}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                           <Users size={14} className="text-muted" />
                           <span className="fw-semibold small">{table.capacity} Persons</span>
                        </div>
                      </td>
                      <td className="small text-muted text-nowrap">{table.location}</td>
                      <td className="text-center">
                        {table.currentOrder ? (
                          <span className="badge bg-secondary-subtle text-secondary-emphasis px-3">{table.currentOrder}</span>
                        ) : (
                          <span className="text-muted opacity-50">-</span>
                        )}
                      </td>
                      <td className="small fw-medium">{table.waiter}</td>
                      <td className="text-center small text-muted">{table.since || '-'}</td>
                      <td>
                        <span className={`status-pill ${getStatusClass(table.status)} x-small-text d-flex align-items-center gap-1`}>
                          {getStatusIcon(table.status)}
                          {table.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer Summary */}
            <div className="card-footer bg-light border-top py-3 px-4 flex-shrink-0 d-flex justify-content-between align-items-center">
              <div className="d-flex gap-4">
                 <div className="d-flex align-items-center gap-2">
                    <div className="p-1 rounded bg-warning-soft text-warning"><Users size={14}/></div>
                    <span className="tiny-text fw-bold text-muted">24 OCCUPIED</span>
                 </div>
                 <div className="d-flex align-items-center gap-2">
                    <div className="p-1 rounded bg-success-soft text-success"><CheckCircle size={14}/></div>
                    <span className="tiny-text fw-bold text-muted">12 AVAILABLE</span>
                 </div>
              </div>
              <div className="tiny-text text-muted fw-bold text-uppercase ls-1">
                 Total 36 Tables Configured
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableQR;
