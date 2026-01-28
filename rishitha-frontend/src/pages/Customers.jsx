import { useState } from 'react';
import { 
  Users, Crown, Star, RefreshCw, Plus, Download, 
  Search, Eye, Edit, Trash2, TrendingUp, Calendar
} from 'lucide-react';
import './Customers.css';

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [customerTypeFilter, setCustomerTypeFilter] = useState('All Customer Types');
  const [sortBy, setSortBy] = useState('Recent Visits');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Form data for new customer
  const [customerFormData, setCustomerFormData] = useState({
    name: '',
    email: '',
    contact: '',
    type: 'Regular',
    preferredTable: ''
  });

  // Sample customers data
  const [customersData, setCustomersData] = useState([
    { id: 'C001', name: 'John Smith', contact: '+1-555-0101', email: 'john.smith@email.com', type: 'VIP', visits: 45, spending: 2340.50, lastVisit: '2026-01-04', preferredTable: 12, loyaltyPoints: 2340 },
    { id: 'C002', name: 'Emma Johnson', contact: '+1-555-0102', email: 'emma.j@email.com', type: 'Regular', visits: 28, spending: 1456.80, lastVisit: '2026-01-03', preferredTable: 5, loyaltyPoints: 1456 },
    { id: 'C003', name: 'Michael Brown', contact: '+1-555-0103', email: 'michael.b@email.com', type: 'VIP', visits: 52, spending: 3120.00, lastVisit: '2026-01-05', preferredTable: 8, loyaltyPoints: 3120 },
    { id: 'C004', name: 'Sarah Davis', contact: '+1-555-0104', email: 'sarah.davis@email.com', type: 'Regular', visits: 15, spending: 780.25, lastVisit: '2026-01-02', preferredTable: 3, loyaltyPoints: 780 },
    { id: 'C005', name: 'David Wilson', contact: '+1-555-0105', email: 'david.w@email.com', type: 'New', visits: 3, spending: 156.90, lastVisit: '2026-01-05', preferredTable: 7, loyaltyPoints: 156 },
    { id: 'C006', name: 'Lisa Anderson', contact: '+1-555-0106', email: 'lisa.a@email.com', type: 'VIP', visits: 38, spending: 2890.40, lastVisit: '2026-01-04', preferredTable: 15, loyaltyPoints: 2890 },
    { id: 'C007', name: 'James Taylor', contact: '+1-555-0107', email: 'james.t@email.com', type: 'Regular', visits: 22, spending: 1234.60, lastVisit: '2026-01-03', preferredTable: 10, loyaltyPoints: 1234 },
    { id: 'C008', name: 'Jennifer Martinez', contact: '+1-555-0108', email: 'jennifer.m@email.com', type: 'Regular', visits: 19, spending: 945.30, lastVisit: '2026-01-05', preferredTable: 6, loyaltyPoints: 945 },
    { id: 'C009', name: 'Robert Garcia', contact: '+1-555-0109', email: 'robert.g@email.com', type: 'VIP', visits: 41, spending: 2567.80, lastVisit: '2026-01-04', preferredTable: 14, loyaltyPoints: 2567 },
    { id: 'C010', name: 'Mary Rodriguez', contact: '+1-555-0110', email: 'mary.r@email.com', type: 'Regular', visits: 17, spending: 823.50, lastVisit: '2026-01-02', preferredTable: 4, loyaltyPoints: 823 },
    { id: 'C011', name: 'William Lee', contact: '+1-555-0111', email: 'william.l@email.com', type: 'New', visits: 2, spending: 98.40, lastVisit: '2026-01-05', preferredTable: 9, loyaltyPoints: 98 },
    { id: 'C012', name: 'Patricia White', contact: '+1-555-0112', email: 'patricia.w@email.com', type: 'VIP', visits: 47, spending: 3456.70, lastVisit: '2026-01-05', preferredTable: 18, loyaltyPoints: 3456 },
    { id: 'C013', name: 'Charles Harris', contact: '+1-555-0113', email: 'charles.h@email.com', type: 'Regular', visits: 25, spending: 1567.20, lastVisit: '2026-01-03', preferredTable: 11, loyaltyPoints: 1567 },
    { id: 'C014', name: 'Linda Clark', contact: '+1-555-0114', email: 'linda.c@email.com', type: 'Regular', visits: 20, spending: 1089.90, lastVisit: '2026-01-04', preferredTable: 2, loyaltyPoints: 1089 },
    { id: 'C015', name: 'Thomas Lewis', contact: '+1-555-0115', email: 'thomas.l@email.com', type: 'New', visits: 4, spending: 234.80, lastVisit: '2026-01-05', preferredTable: 13, loyaltyPoints: 234 },
  ]);

  const stats = [
    { icon: Users, label: 'Total Customers', value: '1,245', color: 'info' },
    { icon: Crown, label: 'VIP Customers', value: '42', color: 'warning' },
    { icon: Star, label: 'Avg. Rating', value: '4.8/5', color: 'success' },
    { icon: RefreshCw, label: 'Return Rate', value: '68%', color: 'primary' },
  ];

  const filteredCustomers = customersData.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.contact.includes(searchTerm) ||
      customer.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = customerTypeFilter === 'All Customer Types' || customer.type === customerTypeFilter;
    return matchesSearch && matchesType;
  });

  // Pagination
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCustomers = filteredCustomers.slice(startIndex, endIndex);

  // Top customers by spending
  const topCustomers = [...customersData]
    .sort((a, b) => b.spending - a.spending)
    .slice(0, 5);

  const getCustomerTypeClass = (type) => {
    switch(type) {
      case 'VIP': return 'type-vip';
      case 'Regular': return 'type-regular';
      case 'New': return 'type-new';
      default: return '';
    }
  };

  const handleAddCustomer = () => {
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    // Reset form
    setCustomerFormData({
      name: '',
      email: '',
      contact: '',
      type: 'Regular',
      preferredTable: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitCustomer = (e) => {
    e.preventDefault();
    
    // Get current date
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    // Create new customer
    const newCustomer = {
      id: `C${String(customersData.length + 1).padStart(3, '0')}`,
      name: customerFormData.name,
      contact: customerFormData.contact,
      email: customerFormData.email,
      type: customerFormData.type,
      visits: 0,
      spending: 0,
      lastVisit: dateStr,
      preferredTable: parseInt(customerFormData.preferredTable) || 1,
      loyaltyPoints: 0
    };

    // Add to customers list
    setCustomersData(prev => [...prev, newCustomer]);
    
    // Close modal and reset form
    handleCloseModal();
  };

  const handleExport = () => {
    alert('Exporting customer data...');
  };

  const handleViewCustomer = (id) => {
    alert(`View customer ${id} - Modal would open here`);
  };

  const handleEditCustomer = (id) => {
    alert(`Edit customer ${id} - Modal would open here`);
  };

  const handleDeleteCustomer = (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      setCustomersData(prev => prev.filter(customer => customer.id !== id));
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container-fluid py-3 customers-bootstrap-page d-flex flex-column" style={{ height: 'calc(100vh - 85px)', overflow: 'hidden' }}>
      
      {/* Page Header Area */}
      <div className="row align-items-center mb-3 flex-shrink-0 px-2">
        <div className="col">
          <h1 className="h3 fw-bold mb-0 d-flex align-items-center gap-2">
            <Users size={28} className="text-primary" />
            Customers
          </h1>
          <p className="text-muted small mb-0 fw-medium">Monday, January 5, 2026</p>
        </div>
        <div className="col-auto d-flex gap-2">
          <button className="btn btn-success shadow-sm d-flex align-items-center gap-2 px-3 py-2 fw-semibold" onClick={handleAddCustomer}>
            <Plus size={18} /> Add Customer
          </button>
          <button className="btn btn-danger-custom shadow-sm d-flex align-items-center gap-2 px-3 py-2 fw-semibold" onClick={handleExport}>
            <Download size={18} /> Export
          </button>
        </div>
      </div>

      {/* Main Content Area - Scrollable */}
      <div className="flex-grow-1 overflow-auto custom-thin-scrollbar px-2 pb-4">
        
        {/* Management Card */}
        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-header bg-white border-bottom-0 py-4 px-4">
            <h4 className="card-title fw-bold mb-4 text-dark">Customer Management</h4>
            
            {/* Stats Row within management area */}
            <div className="row g-3">
              {stats.map((stat, index) => (
                <div key={index} className="col-12 col-md-3">
                  <div className={`card h-100 border-0 shadow-sm glass-card stat-card-modern hover-lift bg-${stat.color}-soft`}>
                    <div className="card-body p-3 d-flex align-items-center">
                      <div className={`stat-icon bg-${stat.color} text-white me-3`}>
                        <stat.icon size={22} />
                      </div>
                      <div>
                        <div className="h4 mb-0 fw-bold">{stat.value}</div>
                        <div className="text-muted tiny-text fw-bold text-uppercase ls-1">{stat.label}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add Customer Modal */}
          {showAddModal && (
            <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }} onClick={handleCloseModal}>
              <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
                <div className="modal-content border-0 shadow-lg">
                  <div className="modal-header bg-success text-white border-0">
                    <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                      <Plus size={24} />
                      Add New Customer
                    </h5>
                    <button type="button" className="btn-close btn-close-white" onClick={handleCloseModal}></button>
                  </div>
                  <form onSubmit={handleSubmitCustomer}>
                    <div className="modal-body p-4">
                      <div className="row g-4">
                        {/* Customer Information */}
                        <div className="col-12">
                          <h6 className="fw-bold text-muted mb-3 d-flex align-items-center gap-2">
                            <Users size={18} />
                            Customer Information
                          </h6>
                        </div>
                        
                        <div className="col-md-6">
                          <label className="form-label fw-bold small text-muted text-uppercase">Full Name *</label>
                          <input
                            type="text"
                            className="form-control rounded-pill px-3"
                            name="name"
                            value={customerFormData.name}
                            onChange={handleInputChange}
                            placeholder="e.g., John Doe"
                            required
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label fw-bold small text-muted text-uppercase">Email Address *</label>
                          <input
                            type="email"
                            className="form-control rounded-pill px-3"
                            name="email"
                            value={customerFormData.email}
                            onChange={handleInputChange}
                            placeholder="e.g., john.doe@email.com"
                            required
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label fw-bold small text-muted text-uppercase">Contact Number *</label>
                          <input
                            type="tel"
                            className="form-control rounded-pill px-3"
                            name="contact"
                            value={customerFormData.contact}
                            onChange={handleInputChange}
                            placeholder="e.g., +1-555-0123"
                            required
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label fw-bold small text-muted text-uppercase">Customer Type *</label>
                          <select
                            className="form-select rounded-pill px-3"
                            name="type"
                            value={customerFormData.type}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="New">New Customer</option>
                            <option value="Regular">Regular Customer</option>
                            <option value="VIP">VIP Customer</option>
                          </select>
                        </div>

                        {/* Preferences */}
                        <div className="col-12 mt-4">
                          <h6 className="fw-bold text-muted mb-3">Preferences</h6>
                        </div>

                        <div className="col-md-6">
                          <label className="form-label fw-bold small text-muted text-uppercase">Preferred Table Number *</label>
                          <input
                            type="number"
                            className="form-control rounded-pill px-3"
                            name="preferredTable"
                            value={customerFormData.preferredTable}
                            onChange={handleInputChange}
                            placeholder="e.g., 12"
                            min="1"
                            required
                          />
                        </div>

                        {/* Info Alert */}
                        <div className="col-12 mt-3">
                          <div className="alert alert-info mb-0 d-flex align-items-start gap-2">
                            <Star size={16} className="mt-1" />
                            <div className="small">
                              New customers start with 0 visits, 0 spending, and 0 loyalty points.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="modal-footer border-0 p-4 pt-0">
                      <button type="button" className="btn btn-light rounded-pill px-4 fw-bold" onClick={handleCloseModal}>
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-success rounded-pill px-4 fw-bold d-flex align-items-center gap-2">
                        <Plus size={18} />
                        Add Customer
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          <div className="card-body px-4 pt-0">
            {/* Filters Row */}
            <div className="row g-2 mb-4 align-items-end">
              <div className="col-12 col-lg-4">
                <div className="input-group border-0 bg-light rounded-3 px-2">
                  <span className="input-group-text bg-transparent border-0 text-muted">
                    <Search size={18} />
                  </span>
                  <input
                    type="text"
                    className="form-control bg-transparent border-0 shadow-none py-2"
                    placeholder="Search customers by name, email, contact..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-6 col-md-3 col-lg-2">
                <label className="tiny-text fw-bold text-muted text-uppercase mb-1 ms-1">Type</label>
                <select className="form-select border-0 bg-light shadow-none" value={customerTypeFilter} onChange={(e) => setCustomerTypeFilter(e.target.value)}>
                   <option>All Customer Types</option>
                   <option>VIP</option>
                   <option>Regular</option>
                   <option>New</option>
                </select>
              </div>
              <div className="col-6 col-md-3 col-lg-2">
                <label className="tiny-text fw-bold text-muted text-uppercase mb-1 ms-1">Sort By</label>
                <select className="form-select border-0 bg-light shadow-none" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                   <option>Recent Visits</option>
                   <option>Total Spending</option>
                   <option>Name</option>
                   <option>Loyalty Points</option>
                </select>
              </div>
              <div className="col-6 col-md-3 col-lg-2">
                <label className="tiny-text fw-bold text-muted text-uppercase mb-1 ms-1">Last Visit</label>
                <input type="date" className="form-control border-0 bg-light shadow-none" />
              </div>
              <div className="col-6 col-md-3 col-lg-2">
                <button className="btn btn-primary w-100 py-2 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm">
                   <Search size={18} /> Search
                </button>
              </div>
            </div>

            {/* Customers Table Container */}
            <div className="table-responsive custom-thin-scrollbar rounded-3 border" style={{ minHeight: '400px' }}>
              <table className="table table-hover align-middle mb-0 customer-table-modern">
                <thead className="table-light sticky-top z-1">
                  <tr>
                    <th className="ps-4 py-3">ID</th>
                    <th className="py-3">Customer Name</th>
                    <th className="py-3">Contact Details</th>
                    <th className="py-3">Type</th>
                    <th className="py-3 text-center">Visits</th>
                    <th className="py-3 text-end">Spending</th>
                    <th className="py-3">Last Visit</th>
                    <th className="py-3">Preferred</th>
                    <th className="py-3 text-center">Loyalty</th>
                    <th className="pe-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentCustomers.map((customer) => (
                    <tr key={customer.id}>
                      <td className="ps-4">
                        <span className="badge bg-primary-soft text-primary fw-bold p-2 px-3 border border-primary-subtle rounded-pill">
                          {customer.id}
                        </span>
                      </td>
                      <td>
                        <div className="fw-bold text-dark">{customer.name}</div>
                        <div className="tiny-text text-muted">{customer.email}</div>
                      </td>
                      <td className="small fw-medium text-muted">{customer.contact}</td>
                      <td>
                        <span className={`status-pill ${getCustomerTypeClass(customer.type)} x-small-text`}>
                          {customer.type}
                        </span>
                      </td>
                      <td className="text-center fw-bold text-info small">{customer.visits}</td>
                      <td className="text-end fw-bold text-success text-nowrap">
                        ${customer.spending.toFixed(2)}
                      </td>
                      <td className="small text-muted">{new Date(customer.lastVisit).toLocaleDateString()}</td>
                      <td>
                        <div className="badge bg-light text-dark fw-medium border small">
                           Table {customer.preferredTable}
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="d-flex align-items-center justify-content-center gap-1">
                           <Star size={12} className="text-warning fill-warning" />
                           <span className="fw-bold text-warning small">{customer.loyaltyPoints}</span>
                        </div>
                      </td>
                      <td className="pe-4 text-center">
                        <div className="btn-group btn-group-sm">
                           <button className="btn btn-outline-info border-0 p-2" onClick={() => handleViewCustomer(customer.id)} title="View Detail"><Eye size={16}/></button>
                           <button className="btn btn-outline-success border-0 p-2" onClick={() => handleEditCustomer(customer.id)} title="Edit Profile"><Edit size={16}/></button>
                           <button className="btn btn-outline-danger border-0 p-2" onClick={() => handleDeleteCustomer(customer.id)} title="Delete Record"><Trash2 size={16}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card-footer bg-white border-top py-3 px-4 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
             <div className="text-muted small fw-medium">
                Showing <span className="text-dark fw-bold">{startIndex + 1}</span> to <span className="text-dark fw-bold">{Math.min(endIndex, filteredCustomers.length)}</span> of <span className="text-dark fw-bold">{filteredCustomers.length}</span> customers
             </div>
             <nav>
                <ul className="pagination pagination-sm mb-0">
                   <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button className="page-link shadow-none border-0 bg-light rounded-start px-3" onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
                   </li>
                   {[...Array(totalPages)].map((_, index) => (
                      <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                         <button className="page-link shadow-none border-0 mx-1 rounded-2 fw-bold" onClick={() => handlePageChange(index + 1)}>
                            {index + 1}
                         </button>
                      </li>
                   ))}
                   <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button className="page-link shadow-none border-0 bg-light rounded-end px-3" onClick={() => handlePageChange(currentPage + 1)}>Next</button>
                   </li>
                </ul>
             </nav>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="row g-4 mb-3">
           {/* Visit Pattern */}
           <div className="col-12 col-lg-8">
              <div className="card border-0 shadow-sm rounded-4 h-100 analytics-card-bg">
                 <div className="card-header bg-transparent border-bottom-0 py-4 px-4">
                    <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                       <Calendar size={20} className="text-primary" />
                       Customer Visit Patterns
                    </h5>
                 </div>
                 <div className="card-body px-4 pb-4">
                    <div className="chart-area-placeholder bg-white-50 rounded-4 d-flex align-items-center justify-content-center p-5 border border-dashed border-2">
                       <div className="text-center">
                          <TrendingUp size={48} className="text-muted opacity-25 mb-3" />
                          <p className="text-muted small fw-medium mb-0">Analytics Visualization Module</p>
                          <span className="tiny-text text-muted text-uppercase fw-bold ls-1">Historical Data Integration Active</span>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Top Customers */}
           <div className="col-12 col-lg-4">
              <div className="card border-0 shadow-sm rounded-4 h-100">
                 <div className="card-header bg-white border-bottom-0 py-4 px-4">
                    <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                       <Crown size={20} className="text-warning" />
                       High-Value Customers
                    </h5>
                 </div>
                 <div className="card-body px-4 pt-0 pb-4 overflow-auto custom-thin-scrollbar" style={{ maxHeight: '350px' }}>
                    <div className="d-flex flex-column gap-3">
                       {topCustomers.map((customer, index) => (
                          <div key={customer.id} className="p-3 bg-light rounded-3 shadow-none hover-lift d-flex align-items-center gap-3 border border-transparent hover-border-primary">
                             <div className={`rank-badge bg-${index === 0 ? 'warning' : index === 1 ? 'secondary' : 'bronze'}-soft text-dark fw-bold rounded-circle d-flex align-items-center justify-content-center rank-num`} style={{ width: '32px', height: '32px' }}>
                                {index + 1}
                             </div>
                             <div className="flex-grow-1">
                                <div className="fw-bold small text-dark">{customer.name}</div>
                                <div className="tiny-text text-muted">{customer.visits} Visits Recorded</div>
                             </div>
                             <div className="text-end">
                                <div className="fw-bold text-success small">${customer.spending.toFixed(0)}</div>
                                <div className="tiny-text text-muted fw-bold">TOTAL</div>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
                 <div className="card-footer bg-white border-0 text-center py-3">
                    <button className="btn btn-link btn-sm text-decoration-none fw-bold text-primary">View Full Ranking</button>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Customers;
