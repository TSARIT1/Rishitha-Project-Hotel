import { useState, useEffect } from 'react';
import { 
  Package, DollarSign, AlertTriangle, Truck, 
  Plus, Filter, Search, Edit, Trash2, Eye 
} from 'lucide-react';
import StatCard from '../components/UI/StatCard';
import './Inventory.css';

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [supplierFilter, setSupplierFilter] = useState('All Suppliers');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form data for new item


  // Form data for new item
  const [formData, setFormData] = useState({
    name: '',
    category: 'Proteins',
    supplier: 'Fresh Foods Ltd.',
    currentStock: '',
    unit: 'kg',
    unitCost: '',
    minLevel: '',
    maxLevel: '',
    expiryDate: ''
  });

  // State for inventory data
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch inventory items on mount
  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const { default: api } = await import('../services/api');
      const response = await api.get('/inventory');
      if (response.data.success) {
        setInventoryData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
      // Fallback or error notification
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: 'Total Items',
      value: inventoryData.length,
      icon: Package,
      color: 'success',
      change: '+12',
      trend: 'up',
      subtitle: 'items in stock'
    },
    // ... keep other stats or calculate them dynamically if needed
    {
      title: 'Inventory Value',
      value: `₹${inventoryData.reduce((acc, item) => acc + (item.currentStock * item.unitCost), 0).toFixed(2)}`,
      icon: DollarSign,
      color: 'warning',
      change: '+₹2,340',
      trend: 'up',
      subtitle: 'total value'
    },
    {
      title: 'Low Stock Items',
      value: inventoryData.filter(i => i.status === 'Low Stock').length,
      icon: AlertTriangle,
      color: 'primary',
      change: 'Needs attention',
      trend: 'warning',
      subtitle: 'reorder required'
    },
    {
      title: 'Pending Orders',
      value: '12',
      icon: Truck,
      color: 'info',
      change: '3 arriving today',
      trend: 'neutral',
      subtitle: 'supplier orders'
    },
  ];

  const categories = ['All Categories', 'Proteins', 'Vegetables', 'Dairy', 'Beverages', 'Spices', 'Grains', 'Oil & Fats', 'Desserts'];
  const statuses = ['All Status', 'In Stock', 'Low Stock', 'Out of Stock', 'Expiring Soon'];
  const suppliers = ['All Suppliers', 'Fresh Foods Ltd.', 'Grain Masters', 'Dairy Delight', 'Oil Distributors', 'Spice World', 'Sweet Supplies'];

  const filteredData = inventoryData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All Categories' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'All Status' || item.status === statusFilter;
    const matchesSupplier = supplierFilter === 'All Suppliers' || item.supplier === supplierFilter;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesSupplier;
  });

  const getStatusClass = (status) => {
    switch(status) {
      case 'In Stock': return 'status-in-stock';
      case 'Low Stock': return 'status-low-stock';
      case 'Out of Stock': return 'status-out-stock';
      default: return '';
    }
  };

  const handleAddItem = () => {
    setIsEditing(false);
    setSelectedItem(null);
    setFormData({
      name: '',
      category: 'Proteins',
      supplier: 'Fresh Foods Ltd.',
      currentStock: '',
      unit: 'kg',
      unitCost: '',
      minLevel: '',
      maxLevel: '',
      expiryDate: ''
    });
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    // Reset form data
    setFormData({
      name: '',
      category: 'Proteins',
      supplier: 'Fresh Foods Ltd.',
      currentStock: '',
      unit: 'kg',
      unitCost: '',
      minLevel: '',
      maxLevel: '',
      expiryDate: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitItem = async (e) => {
    e.preventDefault();
    
    // Prepare payload
    const itemPayload = {
      name: formData.name,
      category: formData.category,
      supplier: formData.supplier,
      currentStock: parseFloat(formData.currentStock),
      unit: formData.unit,
      unitCost: parseFloat(formData.unitCost),
      minLevel: parseFloat(formData.minLevel),
      maxLevel: parseFloat(formData.maxLevel),
      expiryDate: formData.expiryDate || null
    };

    try {
        const { default: api } = await import('../services/api');
        let response;
        
        if (isEditing && selectedItem) {
            response = await api.put(`/inventory/${selectedItem.id}`, itemPayload);
        } else {
            response = await api.post('/inventory', itemPayload);
        }
        
        if (response.data.success) {
            const returnedItem = response.data.data;
            if (isEditing) {
                setInventoryData(prev => prev.map(item => item.id === selectedItem.id ? returnedItem : item));
                alert('Item updated successfully!');
            } else {
                setInventoryData(prev => [...prev, returnedItem]);
                alert('Item added successfully!');
            }
            
            // Automatic Alert Logic
            if (returnedItem.status === 'Low Stock') {
                alert(`⚠️ Warning: ${returnedItem.name} is now Low Stock! (${returnedItem.currentStock} ${returnedItem.unit})`);
            } else if (returnedItem.status === 'Out of Stock') {
                alert(`🚨 CRITICAL: ${returnedItem.name} is OUT OF STOCK!`);
            }

            handleCloseModal();
        }
    } catch (error) {
        console.error('Error saving item:', error);
        alert('Failed to save item. Please try again.');
    }
  };

  const handleReorderList = () => {
    alert('Reorder List functionality - Would show items needing reorder');
  };

  const handleEdit = (id) => {
    const item = inventoryData.find(i => i.id === id);
    if (item) {
        setSelectedItem(item);
        setFormData({
            name: item.name,
            category: item.category,
            supplier: item.supplier,
            currentStock: item.currentStock,
            unit: item.unit,
            unitCost: item.unitCost,
            minLevel: item.minLevel,
            maxLevel: item.maxLevel,
            expiryDate: item.expiryDate ? item.expiryDate.split('T')[0] : '',
            status: item.status
        });
        setIsEditing(true);
        setShowAddModal(true);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
          const { default: api } = await import('../services/api');
          await api.delete(`/inventory/${id}`);
          setInventoryData(prev => prev.filter(item => item.id !== id));
      } catch (error) {
          console.error('Error deleting item:', error);
          alert('Failed to delete item.');
      }
    }
  };

  const handleView = (id) => {
    const item = inventoryData.find(i => i.id === id);
    if (item) {
        setSelectedItem(item);
        setShowViewModal(true);
    }
  };

  return (
    <div className="container-fluid py-3 inventory-bootstrap-page d-flex flex-column" style={{ height: 'calc(100vh - 85px)', overflow: 'hidden' }}>
      
      {/* Stats Section */}
      <div className="row g-3 mb-3 flex-shrink-0 px-2">
        {stats.map((stat, index) => (
          <div key={index} className="col-12 col-md-6 col-xl-3">
            <div className={`card h-100 border-0 shadow-sm glass-card stat-card-modern`}>
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

      {/* Filter Bar */}
      <div className="card border-0 shadow-sm mb-3 flex-shrink-0 bg-white mx-2 rounded-3">
        <div className="card-body p-2 p-lg-3">
          <div className="row g-2 align-items-center">
            <div className="col-12 col-lg-5">
              <div className="input-group input-group-modern">
                <span className="input-group-text bg-white border-end-0 border-light ps-3">
                  <Search size={18} className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 border-light ps-1 shadow-none"
                  placeholder="Search item name, ID, or supplier..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="col-6 col-lg-2">
              <select 
                className="form-select border-light shadow-none cursor-pointer"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="col-6 col-lg-2">
              <select 
                className="form-select border-light shadow-none cursor-pointer"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div className="col-12 col-lg-3 d-flex gap-2">
              <button className="btn btn-primary d-flex align-items-center justify-content-center gap-2 flex-grow-1 shadow-sm fw-bold border-0 bg-danger" onClick={handleAddItem}>
                <Plus size={18} />
                <span>Add Item</span>
              </button>
              <button className="btn btn-outline-secondary d-flex align-items-center justify-content-center gap-2 flex-grow-1 shadow-sm fw-semibold border-light" onClick={handleReorderList}>
                <Package size={18} />
                <span>Sync</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="card border-0 shadow-sm flex-grow-1 overflow-hidden bg-white mx-2 rounded-3 d-flex flex-column mb-3">
        <div className="card-header bg-white border-bottom py-3 px-4 d-flex justify-content-between align-items-center flex-shrink-0">
          <div className="d-flex align-items-center gap-2">
            <div className="bg-danger-soft p-2 rounded text-danger">
              <Package size={20} />
            </div>
            <h5 className="mb-0 fw-bold">Live Inventory</h5>
          </div>
          <div className="d-flex align-items-center gap-3">
            <span className="text-muted small fw-medium">
              Showing <strong>{filteredData.length}</strong> entries
            </span>
          </div>
        </div>
        
        <div className="table-responsive flex-grow-1 custom-thin-scrollbar">
          <table className="table table-hover align-middle mb-0 inventory-table-modern">
            <thead className="table-light sticky-top z-1">
              <tr>
                <th className="ps-4 py-3 text-muted fw-bold small text-uppercase ls-1">Item Details</th>
                <th className="py-3 text-muted fw-bold small text-uppercase ls-1">Category</th>
                <th className="py-3 text-muted fw-bold small text-uppercase ls-1">Supplier</th>
                <th className="py-3 text-muted fw-bold small text-uppercase ls-1 text-center">Stock Level</th>
                <th className="py-3 text-muted fw-bold small text-uppercase ls-1">Financials</th>
                <th className="py-3 text-muted fw-bold small text-uppercase ls-1 text-center">Status</th>
                <th className="pe-4 py-3 text-muted fw-bold small text-uppercase ls-1 text-end">Options</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id}>
                  <td className="ps-4">
                    <div className="d-flex align-items-center">
                      <div className="item-id-tag me-3">#{item.id.toString().padStart(3, '0')}</div>
                      <div>
                        <div className="fw-bold text-dark">{item.name}</div>
                        <div className="text-muted tiny-text">SKU: {item.id * 1234}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge bg-light text-dark-emphasis border px-3 py-2 fw-medium rounded-pill">
                      {item.category}
                    </span>
                  </td>
                  <td>
                    <div className="text-dark small fw-medium">{item.supplier}</div>
                  </td>
                  <td className="text-center">
                    <div className="d-inline-block" style={{ minWidth: '100px' }}>
                      <div className="d-flex justify-content-between mb-1 py-1">
                        <span className="tiny-text fw-bold text-dark">{item.currentStock} {item.unit}</span>
                        <span className="tiny-text text-muted">/ {item.maxLevel}</span>
                      </div>
                      <div className="progress rounded-pill bg-light" style={{ height: '6px' }}>
                        <div 
                          className={`progress-bar rounded-pill bg-${item.status === 'Low Stock' ? 'warning' : 'success'}`} 
                          role="progressbar" 
                          style={{ width: `${Math.min(100, (item.currentStock / item.maxLevel) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="fw-bold text-dark small">₹{item.unitCost.toFixed(2)} <span className="text-muted fw-normal">/ {item.unit}</span></div>
                    <div className="text-success small fw-bold mt-1">Total: ₹{(item.currentStock * item.unitCost).toFixed(2)}</div>
                  </td>
                  <td className="text-center">
                    <span className={`status-pill ${item.status === 'In Stock' ? 'status-success' : 'status-warning'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="pe-4">
                    <div className="d-flex gap-2 justify-content-end">
                      <button className="btn btn-action-square text-info" onClick={() => handleView(item.id)} title="View"><Eye size={16} /></button>
                      <button className="btn btn-action-square text-primary" onClick={() => handleEdit(item.id)} title="Edit"><Edit size={16} /></button>
                      <button className="btn btn-action-square text-danger" onClick={() => handleDelete(item.id)} title="Delete"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredData.length === 0 && (
            <div className="text-center py-5">
              <div className="bg-light d-inline-block p-4 rounded-circle mb-3">
                <Package size={48} className="text-muted opacity-50" />
              </div>
              <h5 className="text-muted fw-bold">No inventory found</h5>
              <p className="text-muted small">Try adjusting your filters or search terms</p>
            </div>
          )}
        </div>
      </div>

      {/* View Modal */}
      {showViewModal && selectedItem && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowViewModal(false)}>
          <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-info text-white border-0">
                <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                  <Eye size={24} />
                  Item Details - {selectedItem.name}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowViewModal(false)}></button>
              </div>
              <div className="modal-body p-4">
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="p-3 bg-light rounded-3 h-100">
                      <div className="small text-muted text-uppercase fw-bold mb-1">Item Information</div>
                      <div className="mb-2"><strong>ID:</strong> #{String(selectedItem.id).padStart(3, '0')}</div>
                      <div className="mb-2"><strong>Category:</strong> {selectedItem.category}</div>
                      <div className="mb-0"><strong>Supplier:</strong> {selectedItem.supplier}</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="p-3 bg-light rounded-3 h-100">
                      <div className="small text-muted text-uppercase fw-bold mb-1">Stock Status</div>
                      <div className="mb-2">
                        <strong>Current Level:</strong> {selectedItem.currentStock} {selectedItem.unit}
                        <span className={`badge ms-2 ${selectedItem.status === 'In Stock' ? 'bg-success' : 'bg-warning'}`}>{selectedItem.status}</span>
                      </div>
                      <div className="mb-0">
                        <small className="text-muted">Min: {selectedItem.minLevel} / Max: {selectedItem.maxLevel}</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="p-3 bg-light rounded-3 h-100">
                      <div className="small text-muted text-uppercase fw-bold mb-1">Financials</div>
                      <div className="mb-2"><strong>Unit Cost:</strong> ₹{selectedItem.unitCost.toFixed(2)}</div>
                      <div className="mb-0"><strong>Total Value:</strong> ₹{(selectedItem.currentStock * selectedItem.unitCost).toFixed(2)}</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="p-3 bg-light rounded-3 h-100">
                       <div className="small text-muted text-uppercase fw-bold mb-1">Other</div>
                       <div className="mb-0"><strong>Expiry Date:</strong> {selectedItem.expiryDate ? new Date(selectedItem.expiryDate).toLocaleDateString() : 'N/A'}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0 p-4 pt-0">
                <button type="button" className="btn btn-light rounded-pill px-4 fw-bold" onClick={() => setShowViewModal(false)}>
                  Close
                </button>
                <button type="button" className="btn btn-primary rounded-pill px-4 fw-bold d-flex align-items-center gap-2" onClick={() => { setShowViewModal(false); handleEdit(selectedItem.id); }}>
                  <Edit size={18} />
                  Edit Item
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={handleCloseModal}>
          <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-danger text-white border-0">
                <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                  {isEditing ? <Edit size={24} /> : <Plus size={24} />}
                  {isEditing ? 'Edit Inventory Item' : 'Add New Inventory Item'}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={handleCloseModal}></button>
              </div>
              <form onSubmit={handleSubmitItem}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    {/* Item Details Section */}
                    <div className="col-12">
                      <h6 className="fw-bold text-muted mb-3 d-flex align-items-center gap-2">
                        <Package size={18} />
                        Item Details
                      </h6>
                    </div>
                    
                    <div className="col-md-8">
                      <label className="form-label fw-bold small text-muted text-uppercase">Item Name *</label>
                      <input
                        type="text"
                        className="form-control rounded-pill px-3"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g., Chicken Breast"
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-bold small text-muted text-uppercase">Unit *</label>
                      <select
                        className="form-select rounded-pill px-3"
                        name="unit"
                        value={formData.unit}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="kg">kg</option>
                        <option value="L">L</option>
                        <option value="pcs">pcs</option>
                        <option value="box">box</option>
                      </select>
                    </div>

                    {/* Category Section */}
                    <div className="col-12 mt-4">
                      <h6 className="fw-bold text-muted mb-3">Category & Supplier</h6>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold small text-muted text-uppercase">Category *</label>
                      <select
                        className="form-select rounded-pill px-3"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="Proteins">Proteins</option>
                        <option value="Vegetables">Vegetables</option>
                        <option value="Dairy">Dairy</option>
                        <option value="Beverages">Beverages</option>
                        <option value="Spices">Spices</option>
                        <option value="Grains">Grains</option>
                        <option value="Oil & Fats">Oil & Fats</option>
                        <option value="Desserts">Desserts</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold small text-muted text-uppercase">Supplier *</label>
                      <select
                        className="form-select rounded-pill px-3"
                        name="supplier"
                        value={formData.supplier}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="Fresh Foods Ltd.">Fresh Foods Ltd.</option>
                        <option value="Grain Masters">Grain Masters</option>
                        <option value="Dairy Delight">Dairy Delight</option>
                        <option value="Oil Distributors">Oil Distributors</option>
                        <option value="Spice World">Spice World</option>
                        <option value="Sweet Supplies">Sweet Supplies</option>
                      </select>
                    </div>

                    {/* Stock Level Section */}
                    <div className="col-12 mt-4">
                      <h6 className="fw-bold text-muted mb-3">Stock Level</h6>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-bold small text-muted text-uppercase">Current Stock *</label>
                      <input
                        type="number"
                        className="form-control rounded-pill px-3"
                        name="currentStock"
                        value={formData.currentStock}
                        onChange={handleInputChange}
                        placeholder="0"
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-bold small text-muted text-uppercase">Min Level *</label>
                      <input
                        type="number"
                        className="form-control rounded-pill px-3"
                        name="minLevel"
                        value={formData.minLevel}
                        onChange={handleInputChange}
                        placeholder="0"
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-bold small text-muted text-uppercase">Max Level *</label>
                      <input
                        type="number"
                        className="form-control rounded-pill px-3"
                        name="maxLevel"
                        value={formData.maxLevel}
                        onChange={handleInputChange}
                        placeholder="0"
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>

                    {/* Financials Section */}
                    <div className="col-12 mt-4">
                      <h6 className="fw-bold text-muted mb-3">Financials</h6>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold small text-muted text-uppercase">Unit Cost ($) *</label>
                      <input
                        type="number"
                        className="form-control rounded-pill px-3"
                        name="unitCost"
                        value={formData.unitCost}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold small text-muted text-uppercase">Expiry Date</label>
                      <input
                        type="date"
                        className="form-control rounded-pill px-3"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                      />
                    </div>


                  </div>
                </div>

                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light rounded-pill px-4 fw-bold" onClick={handleCloseModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-danger rounded-pill px-4 fw-bold d-flex align-items-center gap-2">
                    {isEditing ? <Edit size={18} /> : <Plus size={18} />}
                    {isEditing ? 'Update Item' : 'Add Item'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
