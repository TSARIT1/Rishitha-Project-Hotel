import { useState, useEffect } from 'react';
import { 
  Truck, Package, Phone, ShoppingBag, Star, 
  Timer, Search, Filter, Plus, Download, 
  Eye, Edit, Trash2, Mail, ExternalLink,
  ChevronRight, AlertCircle, CheckCircle, Clock, X
} from 'lucide-react';
import './Suppliers.css';

const Suppliers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');

  const [suppliers, setSuppliers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const [newSupplier, setNewSupplier] = useState({
    name: '',
    contact: '',
    category: 'Vegetables',
    email: '',
    phone: ''
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
        const { default: api } = await import('../api/axiosConfig');
        const response = await api.get('/suppliers');
        if (response.data.success) {
            setSuppliers(response.data.data);
        }
    } catch (error) {
        console.error("Error fetching suppliers:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSupplier(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setNewSupplier({
      name: '',
      contact: '',
      category: 'Vegetables',
      email: '',
      phone: ''
    });
    setIsEditing(false);
    setSelectedSupplier(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleEdit = (supplier) => {
    setSelectedSupplier(supplier);
    setNewSupplier({
      name: supplier.name,
      contact: supplier.contact,
      category: supplier.category,
      email: supplier.email,
      phone: supplier.phone
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleView = (supplier) => {
    setSelectedSupplier(supplier);
    setShowViewModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        const { default: api } = await import('../api/axiosConfig');
        const response = await api.delete(`/suppliers/${id}`);
        if (response.data.success) {
           setSuppliers(prev => prev.filter(s => s.id !== id));
           alert('Supplier deleted successfully');
        }
      } catch (error) {
        console.error("Error deleting supplier:", error);
        alert('Failed to delete supplier: ' + (error.response?.data?.message || ''));
      }
    }
  };

  const handleAddSupplier = async (e) => {
    e.preventDefault();
    
    const supplierPayload = {
      ...newSupplier,
      rating: isEditing ? selectedSupplier.rating : 5.0, // Default for new
      status: isEditing ? selectedSupplier.status : 'Active'
    };

    try {
        const { default: api } = await import('../api/axiosConfig');
        let response;
        if (isEditing && selectedSupplier) {
            response = await api.put(`/suppliers/${selectedSupplier.id}`, supplierPayload);
        } else {
            response = await api.post('/suppliers', supplierPayload);
        }
        
        if (response.data.success) {
            if (isEditing) {
                setSuppliers(prev => prev.map(s => s.id === selectedSupplier.id ? response.data.data : s));
                alert('Supplier updated successfully!');
            } else {
                setSuppliers(prev => [...prev, response.data.data]);
                alert('Supplier added successfully!');
            }
            handleCloseModal();
        }
    } catch (error) {
        console.error("Error saving supplier:", error);
        alert('Failed to save supplier. ' + (error.response?.data?.message || ''));
    }
  };

  const stats = [
    { title: 'Active Suppliers', value: suppliers.length, icon: Truck, color: 'primary', trend: '+2 this month' },
    { title: 'Open POs', value: '7', icon: ShoppingBag, color: 'warning', trend: '₹2.4L value' },
    { title: 'Inventory Value', value: '₹5.8L', icon: Package, color: 'success', trend: 'Healthy level' },
    { title: 'On-time Delivery', value: '94%', icon: Timer, color: 'info', trend: 'Excellent' },
  ];

  const filteredSuppliers = suppliers.filter(sup => {
    const matchesSearch = sup.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         sup.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (sup.supplierId && sup.supplierId.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'All Categories' || sup.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getRatingStars = (rating) => {
    return (
      <div className="d-flex align-items-center gap-1">
        <Star size={14} className="text-warning fill-warning" />
        <span className="fw-bold small">{rating}</span>
      </div>
    );
  };

  return (
    <div className="container-fluid py-3 suppliers-bootstrap-page d-flex flex-column" style={{ height: 'calc(100vh - 85px)', overflow: 'hidden' }}>
      
      {/* Page Header */}
      <div className="row align-items-center mb-3 flex-shrink-0 px-2">
        <div className="col">
          <h1 className="h3 fw-bold mb-0 d-flex align-items-center gap-2">
            <Truck size={28} className="text-primary" />
            Supplier Management
          </h1>
          <p className="text-muted small mb-0 fw-medium">Manage procurement, relationships, and delivery cycles</p>
        </div>
        <div className="col-auto d-flex gap-2">
          <button className="btn btn-outline-primary shadow-sm d-flex align-items-center gap-2 px-3 py-2 fw-semibold bg-white rounded-pill border-0">
            <Download size={18} /> Export List
          </button>
          <button 
            className="btn btn-primary shadow-sm d-flex align-items-center gap-2 px-3 py-2 fw-semibold rounded-pill"
            onClick={() => { resetForm(); setIsModalOpen(true); }}
          >
            <Plus size={18} /> Add Supplier
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow-1 overflow-auto custom-thin-scrollbar px-2">
        
        {/* Stats Grid */}
        <div className="row g-3 mb-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="col-12 col-md-6 col-xl-3">
              <div className={`card h-100 border-0 shadow-sm glass-card stat-card-modern bg-${stat.color}-soft`}>
                <div className="card-body p-3 d-flex align-items-center">
                  <div className={`stat-icon bg-${stat.color} text-white me-3 shadow-sm`}>
                    <stat.icon size={22} />
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between">
                      <span className="tiny-text fw-bold text-muted text-uppercase ls-1">{stat.title}</span>
                      <span className={`tiny-text fw-bold text-${stat.color}`}>{stat.trend}</span>
                    </div>
                    <h4 className="fw-bold mb-0">{stat.value}</h4>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Directory Card */}
        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-header bg-white border-bottom-0 py-4 px-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
              <Package size={20} className="text-primary" />
              Supplier Directory
            </h5>
            <div className="d-flex gap-2 flex-grow-1 flex-md-grow-0" style={{ maxWidth: '600px' }}>
              <div className="input-group border-0 bg-light rounded-pill px-3 py-1 flex-grow-1">
                <span className="input-group-text bg-transparent border-0 text-muted">
                  <Search size={18} />
                </span>
                <input
                  type="text"
                  className="form-control bg-transparent border-0 shadow-none px-0"
                  placeholder="Search by name, contact or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select 
                className="form-select border-0 bg-light rounded-pill px-3 shadow-none fw-semibold small" 
                style={{ width: 'auto' }}
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option>All Categories</option>
                <option>Vegetables</option>
                <option>Meat & Poultry</option>
                <option>Seafood</option>
                <option>Bakery</option>
                <option>Dairy</option>
                <option>General Grocery</option>
              </select>
            </div>
          </div>
          
          <div className="table-responsive px-4 pb-4 custom-thin-scrollbar" style={{ minHeight: '350px' }}>
            <table className="table table-hover align-middle mb-0 supplier-table-modern">
              <thead className="table-light sticky-top z-1">
                <tr>
                  <th className="ps-0 py-3">SUPPLIER</th>
                  <th className="py-3">CONTACT PERSON</th>
                  <th className="py-3">CATEGORY</th>
                  <th className="py-3 text-center">RATING</th>
                  <th className="py-3 text-center">STATUS</th>
                  <th className="py-3">COMMUNICATION</th>
                  <th className="pe-0 py-3 text-end">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredSuppliers.map((sup) => (
                  <tr key={sup.id}>
                    <td className="ps-0">
                      <div className="fw-bold text-dark">{sup.name}</div>
                      <div className="tiny-text text-muted">ID: {sup.supplierId || sup.id}</div>
                    </td>
                    <td>
                      <div className="small fw-semibold">{sup.contact}</div>
                      <div className="tiny-text text-muted">{sup.phone}</div>
                    </td>
                    <td><span className="badge bg-light text-dark fw-medium border">{sup.category}</span></td>
                    <td className="text-center">
                      {getRatingStars(sup.rating)}
                    </td>
                    <td className="text-center">
                      <span className={`status-pill ${sup.status === 'Active' ? 'type-new' : 'type-vip'} x-small-text fw-bold`}>
                        {sup.status}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex flex-column gap-1">
                        <div className="tiny-text text-primary d-flex align-items-center gap-1"><Mail size={12}/> {sup.email}</div>
                        <div className="tiny-text text-muted d-flex align-items-center gap-1"><ExternalLink size={12}/> Website Portal</div>
                      </div>
                    </td>
                    <td className="pe-0 text-end">
                      <div className="btn-group btn-group-sm">
                        <button className="btn btn-action-square text-info" title="View Portal" onClick={() => handleView(sup)}><Eye size={14}/></button>
                        <button className="btn btn-action-square text-primary" title="Edit Contract" onClick={() => handleEdit(sup)}><Edit size={14}/></button>
                        <button className="btn btn-action-square text-danger" title="Terminate" onClick={() => handleDelete(sup.id)}><Trash2 size={14}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Procurement & Performance Row */}
        <div className="row g-4 mb-4">
          <div className="col-12 col-xl-7">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-header bg-white border-bottom-0 py-4 px-4 d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                  <ShoppingBag size={20} className="text-primary" />
                  Recent Purchase Orders
                </h5>
                <button className="btn btn-link btn-sm text-decoration-none fw-bold p-0">View All Orders</button>
              </div>
              <div className="card-body p-4 pt-0">
                <div className="vstack gap-3">
                  {[
                    { po: 'PO-9842', supplier: 'Ocean Catch', date: 'Today', amount: '₹14,500', status: 'Pending' },
                    { po: 'PO-9840', supplier: 'Fresh Produce Co.', date: 'Yesterday', amount: '₹8,400', status: 'Shipped' },
                    { po: 'PO-9838', supplier: 'Elite Meats', date: '6 Jan', amount: '₹32,000', status: 'Delivered' }
                  ].map((order, i) => (
                    <div key={i} className="d-flex align-items-center p-3 rounded-4 bg-light bg-opacity-50 border border-transparent hover-border-primary transition-all">
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center gap-2">
                          <span className="fw-bold text-dark">{order.po}</span>
                          <span className="tiny-text text-muted">• {order.date}</span>
                        </div>
                        <div className="small text-muted">{order.supplier}</div>
                      </div>
                      <div className="text-end me-3">
                        <div className="fw-bold text-dark">{order.amount}</div>
                      </div>
                      <span className={`status-pill ${order.status === 'Delivered' ? 'type-new' : order.status === 'Pending' ? 'type-vip' : 'bg-info-soft text-info'} x-small-text fw-bold`}>
                        {order.status}
                      </span>
                      <ChevronRight size={18} className="text-muted ms-2" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-xl-5">
            <div className="card border-0 shadow-sm rounded-4 h-100 analytics-card-bg">
              <div className="card-header bg-transparent border-bottom-0 py-4 px-4">
                <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                  <Star size={20} className="text-warning" />
                  Top Performance Partners
                </h5>
              </div>
              <div className="card-body p-4 pt-1">
                <div className="vstack gap-3">
                  {[
                    { name: 'Metro Wholesale', rating: 4.9, score: 98, color: 'success' },
                    { name: 'Fresh Produce Co.', rating: 4.8, score: 95, color: 'primary' },
                    { name: 'Dairy Pure', rating: 4.7, score: 92, color: 'info' }
                  ].map((partner, i) => (
                    <div key={i} className="p-3 bg-white bg-opacity-75 rounded-4 border border-white">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="fw-bold small text-dark">{partner.name}</span>
                        <div className="d-flex align-items-center gap-1">
                           <Star size={12} className="text-warning fill-warning" />
                           <span className="tiny-text fw-bold">{partner.rating}</span>
                        </div>
                      </div>
                      <div className="progress rounded-pill shadow-none" style={{ height: '6px' }}>
                        <div className={`progress-bar bg-${partner.color}`} style={{ width: `${partner.score}%` }}></div>
                      </div>
                      <div className="d-flex justify-content-between tiny-text fw-bold text-muted mt-1">
                        <span className="text-uppercase ls-1">Delivery Score</span>
                        <span>{partner.score}%</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-warning-soft rounded-4 border border-warning-subtle text-center">
                   <AlertCircle size={20} className="text-warning mb-2" />
                   <div className="fw-bold text-dark small">Vendor Review Due</div>
                   <p className="tiny-text text-muted mb-0">Ocean Catch performance dropped by 12%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Add Supplier Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass-card border-0 shadow-lg p-4" style={{ maxWidth: '500px', width: '100%' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                <Truck className="text-primary" size={24} />
                {isEditing ? 'Edit Supplier' : 'Add New Supplier'}
              </h5>
              <button onClick={handleCloseModal} className="btn btn-link text-muted p-0">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAddSupplier}>
              <div className="mb-3">
                <label className="form-label small fw-bold text-muted text-uppercase ls-1">Company Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control bg-light border-0 shadow-none fw-semibold"
                  value={newSupplier.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="row g-3 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-bold text-muted text-uppercase ls-1">Contact Person</label>
                  <input
                    type="text"
                    name="contact"
                    className="form-control bg-light border-0 shadow-none fw-semibold"
                    value={newSupplier.contact}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-bold text-muted text-uppercase ls-1">Category</label>
                  <select
                    name="category"
                    className="form-select bg-light border-0 shadow-none fw-semibold"
                    value={newSupplier.category}
                    onChange={handleInputChange}
                  >
                    <option>Vegetables</option>
                    <option>Meat & Poultry</option>
                    <option>Seafood</option>
                    <option>Bakery</option>
                    <option>Dairy</option>
                    <option>General Grocery</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold text-muted text-uppercase ls-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  className="form-control bg-light border-0 shadow-none fw-semibold"
                  value={newSupplier.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold text-muted text-uppercase ls-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-control bg-light border-0 shadow-none fw-semibold"
                  value={newSupplier.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="d-flex gap-2 justify-content-end">
                <button 
                  type="button" 
                  className="btn btn-light border-0 fw-semibold px-4"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary fw-semibold px-4 shadow-sm"
                >
                  {isEditing ? 'Update Supplier' : 'Add Supplier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Supplier Modal */}
      {showViewModal && selectedSupplier && (
        <div className="modal-overlay">
          <div className="modal-content glass-card border-0 shadow-lg p-4" style={{ maxWidth: '500px', width: '100%' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                <Eye className="text-info" size={24} />
                Supplier Details
              </h5>
              <button onClick={() => setShowViewModal(false)} className="btn btn-link text-muted p-0">
                <X size={24} />
              </button>
            </div>
            
            <div className="mb-4">
               <h4 className="fw-bold mb-1">{selectedSupplier.name}</h4>
               <span className="badge bg-light text-dark border mb-3">{selectedSupplier.supplierId || selectedSupplier.id}</span>

               <div className="p-3 bg-light rounded-3 mb-3">
                  <div className="row g-2">
                     <div className="col-6">
                        <small className="text-muted fw-bold d-block text-uppercase">Contact</small>
                        <span className="fw-semibold">{selectedSupplier.contact}</span>
                     </div>
                     <div className="col-6">
                        <small className="text-muted fw-bold d-block text-uppercase">Phone</small>
                        <span className="fw-semibold">{selectedSupplier.phone}</span>
                     </div>
                     <div className="col-12 pt-2">
                        <small className="text-muted fw-bold d-block text-uppercase">Email</small>
                        <span className="fw-semibold">{selectedSupplier.email}</span>
                     </div>
                  </div>
               </div>
               
               <div className="d-flex justify-content-between align-items-center p-3 border rounded-3">
                  <div>
                     <small className="text-muted fw-bold d-block text-uppercase">Category</small>
                     <span className="fw-semibold badge bg-primary-soft text-primary">{selectedSupplier.category}</span>
                  </div>
                  <div className="text-end">
                     <small className="text-muted fw-bold d-block text-uppercase">Rating</small>
                     {getRatingStars(selectedSupplier.rating)}
                  </div>
               </div>
            </div>

            <div className="d-flex gap-2 justify-content-end">
              <button 
                type="button" 
                className="btn btn-light border-0 fw-semibold px-4"
                onClick={() => setShowViewModal(false)}
              >
                Close
              </button>
              <button 
                type="button" 
                className="btn btn-primary fw-semibold px-4 shadow-sm"
                onClick={() => { setShowViewModal(false); handleEdit(selectedSupplier); }}
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Suppliers;
