import { useState, useEffect } from 'react';
import { 
  UtensilsCrossed, Plus, Printer, Search, TrendingUp, 
  DollarSign, Info, Edit, Trash2, Eye, Star
} from 'lucide-react';
import './MenuManagement.css';

const MenuManagement = () => {
  const [activeCategory, setActiveCategory] = useState('All Items');
  const [searchTerm, setSearchTerm] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('All Availability');
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Form data for new menu item
  const [menuFormData, setMenuFormData] = useState({
    name: '',
    category: 'Starters',
    price: '',
    cost: '',
    available: true,
    seasonal: false
  });

  // Menu items data
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
        const { default: api } = await import('../api/axiosConfig');
        const response = await api.get('/menu');
        if (response.data.success) {
            // Calculate margin for each item for display
            const processedItems = response.data.data.map(item => ({
                ...item,
                margin: Math.round(((item.price - item.cost) / item.price) * 100) || 0
            }));
            setMenuItems(processedItems);
        }
    } catch (error) {
        console.error('Error fetching menu items:', error);
    }
  };

  const categories = [
    'All Items', 'Starters', 'Main Course', 'Desserts', 
    'Beverages', 'Specials', 'Breakfast', 'Lunch Specials'
  ];

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'All Items' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAvailability = availabilityFilter === 'All Availability' ||
                               (availabilityFilter === 'Available' && item.available) ||
                               (availabilityFilter === 'Out of Stock' && !item.available);
    return matchesCategory && matchesSearch && matchesAvailability;
  });

  // Analytics calculations
  const totalItems = menuItems.length;
  const availableItems = menuItems.filter(item => item.available).length;
  const outOfStock = menuItems.filter(item => !item.available).length;
  const seasonalItems = menuItems.filter(item => item.seasonal).length;

  // Top selling items (top 5)
  const topSellingItems = [...menuItems]
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);

  // Highest margin items (top 5)
  const highestMarginItems = [...menuItems]
    .sort((a, b) => b.margin - a.margin)
    .slice(0, 5);

  const handleAddItem = () => {
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    // Reset form
    setMenuFormData({
      name: '',
      category: 'Starters',
      price: '',
      cost: '',
      available: true,
      seasonal: false
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMenuFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmitMenuItem = async (e) => {
    e.preventDefault();
    
    // Calculate margin
    const price = parseFloat(menuFormData.price);
    const cost = parseFloat(menuFormData.cost);
    // const margin = Math.round(((price - cost) / price) * 100);
    
    // Create new menu item payload
    const newMenuItem = {
      name: menuFormData.name,
      category: menuFormData.category,
      price: price,
      cost: cost,
      sales: 0,
      rating: 0,
      available: menuFormData.available,
      seasonal: menuFormData.seasonal
    };

    try {
        const { default: api } = await import('../api/axiosConfig');
        const response = await api.post('/menu', newMenuItem);
        if (response.data.success) {
            alert('Menu Item Added!');
            fetchMenuItems();
            handleCloseModal();
        }
    } catch (error) {
        console.error('Error adding menu item:', error);
        alert('Failed to add menu item');
    }
  };

  const handlePrintMenu = () => {
    alert('Printing menu...');
  };

  const handleViewItem = (id) => {
    alert(`View item ${id} - Modal would open here`);
  };

  const handleEditItem = (id) => {
    alert(`Edit item ${id} - Modal would open here`);
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
        try {
            const { default: api } = await import('../api/axiosConfig');
            const response = await api.delete(`/menu/${id}`);
            if (response.data.success) {
                setMenuItems(prev => prev.filter(item => item.id !== id));
            }
        } catch (error) {
            console.error('Error deleting menu item:', error);
            alert('Failed to delete menu item');
        }
    }
  };

  return (
    <div className="menu-management-page animate-fadeIn">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <div>
            <h1>Menu</h1>
            <p className="page-date">Monday, January 5, 2026</p>
          </div>
          <div className="header-actions">
            <button className="btn-add-item" onClick={handleAddItem}>
              <Plus size={20} />
              <span>Add Menu Item</span>
            </button>
            <button className="btn-print-menu" onClick={handlePrintMenu}>
              <Printer size={20} />
              <span>Print Menu</span>
            </button>
          </div>
        </div>
      </div>

      {/* Menu Management Section */}
      <div className="menu-section">
        <h2>Menu Management</h2>

        {/* Category Tabs */}
        <div className="category-tabs">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-btn ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Search and Filter */}
        <div className="search-filter-row">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="availability-filter"
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
          >
            <option>All Availability</option>
            <option>Available</option>
            <option>Out of Stock</option>
          </select>
        </div>

        {/* Menu Items Grid */}
        <div className="menu-items-grid">
          {filteredItems.map((item) => (
            <div key={item.id} className="menu-item-card">
              <div className="item-header">
                <h3>{item.name}</h3>
                <div className="item-badges">
                  {item.seasonal && <span className="seasonal-badge">Seasonal</span>}
                  <span className={`availability-badge ${item.available ? 'available' : 'out-of-stock'}`}>
                    {item.available ? 'Available' : 'Out of Stock'}
                  </span>
                </div>
              </div>

              <div className="item-details">
                <div className="detail-row">
                  <span className="label">Category:</span>
                  <span className="value">{item.category}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Price:</span>
                  <span className="value price">${item.price.toFixed(2)}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Cost:</span>
                  <span className="value">${item.cost.toFixed(2)}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Margin:</span>
                  <span className="value margin">{item.margin}%</span>
                </div>
                <div className="detail-row">
                  <span className="label">Sales:</span>
                  <span className="value">{item.sales} orders</span>
                </div>
                <div className="detail-row">
                  <span className="label">Rating:</span>
                  <span className="value rating">
                    <Star size={14} fill="currentColor" />
                    {item.rating}
                  </span>
                </div>
              </div>

              <div className="item-actions">
                <button className="action-btn view-btn" onClick={() => handleViewItem(item.id)} title="View">
                  <Eye size={16} />
                </button>
                <button className="action-btn edit-btn" onClick={() => handleEditItem(item.id)} title="Edit">
                  <Edit size={16} />
                </button>
                <button className="action-btn delete-btn" onClick={() => handleDeleteItem(item.id)} title="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="no-results">
            <UtensilsCrossed size={48} />
            <p>No menu items found</p>
          </div>
        )}
      </div>

      {/* Analytics Grid */}
      <div className="analytics-grid">
        {/* Top Selling Items */}
        <div className="analytics-card">
          <div className="card-header">
            <TrendingUp size={20} />
            <h3>Top Selling Items</h3>
          </div>
          <div className="analytics-list">
            {topSellingItems.map((item, index) => (
              <div key={item.id} className="analytics-item">
                <span className="rank">#{index + 1}</span>
                <div className="item-info">
                  <span className="item-name">{item.name}</span>
                  <span className="item-stat">{item.sales} sales</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Highest Margin Items */}
        <div className="analytics-card">
          <div className="card-header">
            <DollarSign size={20} />
            <h3>Highest Margin Items</h3>
          </div>
          <div className="analytics-list">
            {highestMarginItems.map((item, index) => (
              <div key={item.id} className="analytics-item">
                <span className="rank">#{index + 1}</span>
                <div className="item-info">
                  <span className="item-name">{item.name}</span>
                  <span className="item-stat">{item.margin}% margin</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Menu Performance */}
        <div className="analytics-card">
          <div className="card-header">
            <Info size={20} />
            <h3>Menu Performance</h3>
          </div>
          <div className="performance-stats">
            <div className="stat-row">
              <span className="stat-label">Total Menu Items:</span>
              <span className="stat-value">{totalItems}</span>
              <div className="stat-bar">
                <div className="stat-fill" style={{ width: '100%', background: 'var(--success)' }}></div>
              </div>
            </div>
            <div className="stat-row">
              <span className="stat-label">Available Items:</span>
              <span className="stat-value">{availableItems}</span>
              <div className="stat-bar">
                <div className="stat-fill" style={{ width: `${(availableItems/totalItems)*100}%`, background: 'var(--info)' }}></div>
              </div>
            </div>
            <div className="stat-row">
              <span className="stat-label">Out of Stock:</span>
              <span className="stat-value">{outOfStock}</span>
              <div className="stat-bar">
                <div className="stat-fill" style={{ width: `${(outOfStock/totalItems)*100}%`, background: 'var(--danger)' }}></div>
              </div>
            </div>
            <div className="stat-row">
              <span className="stat-label">Seasonal Items:</span>
              <span className="stat-value">{seasonalItems}</span>
              <div className="stat-bar">
                <div className="stat-fill" style={{ width: `${(seasonalItems/totalItems)*100}%`, background: 'var(--warning)' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Menu Item Modal */}
      {showAddModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }} onClick={handleCloseModal}>
          <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-success text-white border-0">
                <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                  <Plus size={24} />
                  Add Menu Item
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={handleCloseModal}></button>
              </div>
              <form onSubmit={handleSubmitMenuItem}>
                <div className="modal-body p-4">
                  <div className="row g-4">
                    {/* Item Information */}
                    <div className="col-12">
                      <h6 className="fw-bold text-muted mb-3 d-flex align-items-center gap-2">
                        <UtensilsCrossed size={18} />
                        Item Information
                      </h6>
                    </div>
                    
                    <div className="col-md-8">
                      <label className="form-label fw-bold small text-muted text-uppercase">Item Name *</label>
                      <input
                        type="text"
                        className="form-control rounded-pill px-3"
                        name="name"
                        value={menuFormData.name}
                        onChange={handleInputChange}
                        placeholder="e.g., Caesar Salad"
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-bold small text-muted text-uppercase">Category *</label>
                      <select
                        className="form-select rounded-pill px-3"
                        name="category"
                        value={menuFormData.category}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="Starters">Starters</option>
                        <option value="Main Course">Main Course</option>
                        <option value="Desserts">Desserts</option>
                        <option value="Beverages">Beverages</option>
                        <option value="Specials">Specials</option>
                        <option value="Breakfast">Breakfast</option>
                        <option value="Lunch Specials">Lunch Specials</option>
                      </select>
                    </div>

                    {/* Pricing Details */}
                    <div className="col-12 mt-4">
                      <h6 className="fw-bold text-muted mb-3">Pricing Details</h6>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold small text-muted text-uppercase">Selling Price ($) *</label>
                      <input
                        type="number"
                        className="form-control rounded-pill px-3"
                        name="price"
                        value={menuFormData.price}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold small text-muted text-uppercase">Cost Price ($) *</label>
                      <input
                        type="number"
                        className="form-control rounded-pill px-3"
                        name="cost"
                        value={menuFormData.cost}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>

                    {/* Margin Preview */}
                    {menuFormData.price && menuFormData.cost && (
                      <div className="col-12">
                        <div className="alert alert-info mb-0 d-flex justify-content-between align-items-center">
                          <span className="fw-bold">Profit Margin:</span>
                          <span className="h5 mb-0 fw-bold">
                            {Math.round(((parseFloat(menuFormData.price) - parseFloat(menuFormData.cost)) / parseFloat(menuFormData.price)) * 100)}%
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Settings */}
                    <div className="col-12 mt-4">
                      <h6 className="fw-bold text-muted mb-3">Settings</h6>
                    </div>

                    <div className="col-md-6">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="available"
                          checked={menuFormData.available}
                          onChange={handleInputChange}
                          id="availableSwitch"
                        />
                        <label className="form-check-label fw-bold" htmlFor="availableSwitch">
                          Available for Sale
                        </label>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="seasonal"
                          checked={menuFormData.seasonal}
                          onChange={handleInputChange}
                          id="seasonalSwitch"
                        />
                        <label className="form-check-label fw-bold" htmlFor="seasonalSwitch">
                          Seasonal Item
                        </label>
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
                    Add to Menu
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

export default MenuManagement;
