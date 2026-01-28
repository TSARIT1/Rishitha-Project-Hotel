import { useState, useEffect } from 'react';
import { 
  ClipboardList, Clock, ChefHat, CheckCircle, XCircle, 
  Plus, Search, Eye, Edit, Trash2, DollarSign, Users,
  Calendar, Filter
} from 'lucide-react';
import './OrderManagement.css';

const OrderManagement = () => {
  const [activeTab, setActiveTab] = useState('Pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // Form data for new order
  const [orderFormData, setOrderFormData] = useState({
    table: '',
    customer: '',
    dishName: '', // New field for dish selection
    price: 0,     // Hidden field to store unit price
    items: 1,
    amount: '',
    waiter: 'Sarah',
    // priority: 'Normal', // Removed
    status: 'Pending'
  });

  const [menuItems, setMenuItems] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  const [stats, setStats] = useState([
    { label: 'Pending', count: 0, status: 'Pending' },
    { label: 'Preparing', count: 0, status: 'Preparing' },
    { label: 'Ready', count: 0, status: 'Ready' },
    { label: 'Completed', count: 0, status: 'Completed' },
    { label: 'Cancelled', count: 0, status: 'Cancelled' },
    { label: 'Total Today', count: 0, status: 'Total' },
  ]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
      try {
          const { default: api } = await import('../api/axiosConfig');
          const [menuRes, ordersRes] = await Promise.all([
              api.get('/menu'),
              api.get('/orders')
          ]);

          if (menuRes.data.success) {
              setMenuItems(menuRes.data.data);
          }

          if (ordersRes.data.success) {
              // Convert backend status (UPPERCASE) to Frontend (Title Case)
              const toTitleCase = (str) => {
                  if (!str) return 'Pending';
                  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
              };

              const mappedOrders = ordersRes.data.data.map(order => ({
                  id: `ORD-${String(order.id).padStart(3, '0')}`,
                  table: order.tableNumber || 0,
                  customer: order.customerName,
                  items: order.totalItemsCount || 0,
                  amount: order.totalAmount || 0,
                  waiter: order.waiterName || 'Staff',
                  time: order.orderTime ? new Date(order.orderTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Now',
                  status: toTitleCase(order.status),
                  priority: order.priority || 'Normal'
              }));
              
              setOrdersData(mappedOrders);
              calculateStats(mappedOrders);
          }
      } catch (error) {
          console.error("Error fetching data:", error);
      }
  };

  const calculateStats = (orders) => {
      const newStats = [
        { label: 'Pending', count: 0, status: 'Pending' },
        { label: 'Preparing', count: 0, status: 'Preparing' },
        { label: 'Ready', count: 0, status: 'Ready' },
        { label: 'Completed', count: 0, status: 'Completed' },
        { label: 'Cancelled', count: 0, status: 'Cancelled' },
        { label: 'Total Today', count: 0, status: 'Total' },
      ];

      orders.forEach(order => {
          const stat = newStats.find(s => s.status === order.status);
          if (stat) stat.count++;
          newStats.find(s => s.status === 'Total').count++;
      });
      
      setStats(newStats);
  };

  const filteredOrders = ordersData.filter(order => {
    const matchesTab = activeTab === 'All' || order.status === activeTab;
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.table.toString().includes(searchTerm);
    return matchesTab && matchesSearch;
  });

  const getStatusClass = (status) => {
    switch(status) {
      case 'Pending': return 'status-pending';
      case 'Preparing': return 'status-preparing';
      case 'Ready': return 'status-ready';
      case 'Completed': return 'status-completed';
      case 'Cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  const getPriorityClass = (priority) => {
    switch(priority) {
      case 'High': return 'priority-high';
      case 'Normal': return 'priority-normal';
      case 'Low': return 'priority-low';
      default: return '';
    }
  };

  const handleCreateOrder = () => {
    setShowNewOrderModal(true);
  };

  const handleCloseModal = () => {
    setShowNewOrderModal(false);
    // Reset form
    setOrderFormData({
      table: '',
      customer: '',
      dishName: '',
      price: 0,
      items: 1,
      amount: '',
      waiter: 'Sarah',
      status: 'Pending'
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'dishName') {
        const selectedDish = menuItems.find(item => item.name === value);
        const price = selectedDish ? selectedDish.price : 0;
        setOrderFormData(prev => ({
            ...prev,
            dishName: value,
            price: price,
            amount: (price * prev.items).toFixed(2),
            menuItemId: selectedDish ? selectedDish.id : null // Store ID for backend
        }));
    } else if (name === 'items') {
        const qty = parseInt(value) || 0;
        setOrderFormData(prev => ({
            ...prev,
            items: qty,
            amount: (prev.price * qty).toFixed(2)
        }));
    } else {
        setOrderFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    
    // Construct payload for backend
    const orderPayload = {
      tableNumber: parseInt(orderFormData.table),
      customerName: orderFormData.customer,
      waiterName: orderFormData.waiter,
      items: [
          {
              menuItemId: orderFormData.menuItemId,
              quantity: parseInt(orderFormData.items)
          }
      ]
    };

    try {
        const { default: api } = await import('../api/axiosConfig');
        const response = await api.post('/orders', orderPayload);
        
        if (response.data.success) {
            alert('Order created successfully!');
            fetchData(); // Refresh list
            handleCloseModal();
        }
    } catch (error) {
        console.error('Error creating order:', error);
        alert('Failed to create order');
    }
  };

  const handleViewOrder = (id) => {
    const order = ordersData.find(o => o.id === id);
    setSelectedOrder(order);
    setShowViewModal(true);
  };

  const handleEditOrder = (id) => {
    const order = ordersData.find(o => o.id === id);
    setSelectedOrder(order);
    setOrderFormData({
      table: order.table.toString(),
      customer: order.customer,
      items: order.items.toString(),
      amount: order.amount.toString(),
      waiter: order.waiter,
      priority: order.priority,
      status: order.status
    });
    setShowEditModal(true);
  };

  const handleUpdateOrder = (e) => {
    e.preventDefault();
    
    // Update the order
    const updatedOrder = {
      ...selectedOrder,
      table: parseInt(orderFormData.table),
      customer: orderFormData.customer,
      items: parseInt(orderFormData.items),
      amount: parseFloat(orderFormData.amount),
      waiter: orderFormData.waiter,
      priority: orderFormData.priority,
      status: orderFormData.status
    };

    // Update in orders list
    setOrdersData(prev => prev.map(order => 
      order.id === selectedOrder.id ? updatedOrder : order
    ));
    
    // Close modal
    setShowEditModal(false);
    setSelectedOrder(null);
    handleCloseModal();
  };

  const handleDeleteOrder = (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      setOrdersData(prev => prev.filter(order => order.id !== id));
    }
  };

  return (
    <div className="order-management-page animate-fadeIn">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <div>
            <h1>Order Management</h1>
            <p className="page-date">Monday, January 5, 2026</p>
          </div>
          <div className="header-actions">
            <button className="btn-create-order" onClick={handleCreateOrder}>
              <Plus size={20} />
              <span>Create New Order</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="order-stats-grid">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className={`stat-card ${stat.status === 'Total' ? 'stat-total' : ''}`}
          >
            <div className="stat-count">{stat.count}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        {stats.filter(s => s.status !== 'Total').map(stat => (
            <button 
              key={stat.status}
              className={`tab-btn ${activeTab === stat.status ? 'active' : ''}`}
              onClick={() => setActiveTab(stat.status)}
            >
              {stat.status} ({stat.count})
            </button>
        ))}
      </div>

      {/* Orders Section */}
      <div className="orders-section">
        <div className="orders-header">
          <h2>Orders - {activeTab}</h2>
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Table</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Waiter</th>
                <th>Time</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <span className="order-id">{order.id}</span>
                  </td>
                  <td>
                    <span className="table-badge">Table {order.table}</span>
                  </td>
                  <td className="customer-name">{order.customer}</td>
                  <td className="items-count">{order.items} items</td>
                  <td className="order-amount">${order.amount.toFixed(2)}</td>
                  <td>{order.waiter}</td>
                  <td className="order-time">
                    <Clock size={14} />
                    {order.time}
                  </td>
                  <td>
                    <span className={`priority-badge ${getPriorityClass(order.priority)}`}>
                      {order.priority}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusClass(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="action-btn view-btn" 
                        onClick={() => handleViewOrder(order.id)}
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        className="action-btn edit-btn" 
                        onClick={() => handleEditOrder(order.id)}
                        title="Edit Order"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className="action-btn delete-btn" 
                        onClick={() => handleDeleteOrder(order.id)}
                        title="Delete Order"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      {filteredOrders.length === 0 && (
          <div className="no-results">
            <ClipboardList size={48} />
            <p>No orders found</p>
          </div>
      )}
      </div>

      {/* View Order Modal */}
      {showViewModal && selectedOrder && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }} onClick={() => setShowViewModal(false)}>
          <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-primary text-white border-0">
                <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                  <Eye size={24} />
                  Order Details - {selectedOrder.id}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowViewModal(false)}></button>
              </div>
              <div className="modal-body p-4">
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="p-3 bg-light rounded-3">
                      <div className="small text-muted text-uppercase fw-bold mb-1">Order ID</div>
                      <div className="fw-bold">{selectedOrder.id}</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="p-3 bg-light rounded-3">
                      <div className="small text-muted text-uppercase fw-bold mb-1">Table Number</div>
                      <div className="fw-bold">Table {selectedOrder.table}</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="p-3 bg-light rounded-3">
                      <div className="small text-muted text-uppercase fw-bold mb-1">Customer Name</div>
                      <div className="fw-bold">{selectedOrder.customer}</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="p-3 bg-light rounded-3">
                      <div className="small text-muted text-uppercase fw-bold mb-1">Assigned Waiter</div>
                      <div className="fw-bold">{selectedOrder.waiter}</div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="p-3 bg-light rounded-3">
                      <div className="small text-muted text-uppercase fw-bold mb-1">Number of Items</div>
                      <div className="fw-bold">{selectedOrder.items} items</div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="p-3 bg-light rounded-3">
                      <div className="small text-muted text-uppercase fw-bold mb-1">Total Amount</div>
                      <div className="fw-bold">${selectedOrder.amount.toFixed(2)}</div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="p-3 bg-light rounded-3">
                      <div className="small text-muted text-uppercase fw-bold mb-1">Order Time</div>
                      <div className="fw-bold">{selectedOrder.time}</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="p-3 bg-light rounded-3">
                      <div className="small text-muted text-uppercase fw-bold mb-1">Priority</div>
                      <span className={`badge ${selectedOrder.priority === 'High' ? 'bg-danger' : selectedOrder.priority === 'Low' ? 'bg-secondary' : 'bg-primary'}`}>
                        {selectedOrder.priority}
                      </span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="p-3 bg-light rounded-3">
                      <div className="small text-muted text-uppercase fw-bold mb-1">Status</div>
                      <span className={`badge ${selectedOrder.status === 'Completed' ? 'bg-success' : selectedOrder.status === 'Cancelled' ? 'bg-dark' : selectedOrder.status === 'Ready' ? 'bg-info' : 'bg-warning'}`}>
                        {selectedOrder.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0 p-4 pt-0">
                <button type="button" className="btn btn-light rounded-pill px-4 fw-bold" onClick={() => setShowViewModal(false)}>
                  Close
                </button>
                <button type="button" className="btn btn-primary rounded-pill px-4 fw-bold d-flex align-items-center gap-2" onClick={() => { setShowViewModal(false); handleEditOrder(selectedOrder.id); }}>
                  <Edit size={18} />
                  Edit Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {showEditModal && selectedOrder && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }} onClick={() => { setShowEditModal(false); setSelectedOrder(null); }}>
          <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-warning text-dark border-0">
                <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                  <Edit size={24} />
                  Edit Order - {selectedOrder.id}
                </h5>
                <button type="button" className="btn-close" onClick={() => { setShowEditModal(false); setSelectedOrder(null); }}></button>
              </div>
              <form onSubmit={handleUpdateOrder}>
                <div className="modal-body p-4">
                  <div className="row g-4">
                    {/* Order Information */}
                    <div className="col-12">
                      <h6 className="fw-bold text-muted mb-3 d-flex align-items-center gap-2">
                        <ClipboardList size={18} />
                        Order Information
                      </h6>
                    </div>
                    
                    <div className="col-md-6">
                      <label className="form-label fw-bold small text-muted text-uppercase">Table Number *</label>
                      <input
                        type="number"
                        className="form-control rounded-pill px-3"
                        name="table"
                        value={orderFormData.table}
                        onChange={handleInputChange}
                        placeholder="e.g., 5"
                        min="1"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold small text-muted text-uppercase">Customer Name *</label>
                      <input
                        type="text"
                        className="form-control rounded-pill px-3"
                        name="customer"
                        value={orderFormData.customer}
                        onChange={handleInputChange}
                        placeholder="e.g., John Doe"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold small text-muted text-uppercase">Number of Items *</label>
                      <input
                        type="number"
                        className="form-control rounded-pill px-3"
                        name="items"
                        value={orderFormData.items}
                        onChange={handleInputChange}
                        placeholder="1"
                        min="1"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold small text-muted text-uppercase">Total Amount ($) *</label>
                      <input
                        type="number"
                        className="form-control rounded-pill px-3"
                        name="amount"
                        value={orderFormData.amount}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>

                    {/* Assignment Details */}
                    <div className="col-12 mt-4">
                      <h6 className="fw-bold text-muted mb-3">Assignment & Settings</h6>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold small text-muted text-uppercase">Assigned Waiter *</label>
                      <select
                        className="form-select rounded-pill px-3"
                        name="waiter"
                        value={orderFormData.waiter}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="Sarah">Sarah</option>
                        <option value="Mike">Mike</option>
                        <option value="Emma">Emma</option>
                        <option value="John">John</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold small text-muted text-uppercase">Priority *</label>
                      <select
                        className="form-select rounded-pill px-3"
                        name="priority"
                        value={orderFormData.priority}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="High">High</option>
                        <option value="Normal">Normal</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold small text-muted text-uppercase">Status *</label>
                      <select
                        className="form-select rounded-pill px-3"
                        name="status"
                        value={orderFormData.status}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="Pending">Pending</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Ready">Ready</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light rounded-pill px-4 fw-bold" onClick={() => { setShowEditModal(false); setSelectedOrder(null); }}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-warning rounded-pill px-4 fw-bold d-flex align-items-center gap-2">
                    <Edit size={18} />
                    Update Order
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* New Order Modal */}
      {showNewOrderModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }} onClick={handleCloseModal}>
          <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-danger text-white border-0">
                <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                  <Plus size={24} />
                  Create New Order
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={handleCloseModal}></button>
              </div>
              <form onSubmit={handleSubmitOrder}>
                <div className="modal-body p-4">
                  <div className="row g-4">
                    {/* Order Information */}
                    <div className="col-12">
                      <h6 className="fw-bold text-muted mb-3 d-flex align-items-center gap-2">
                        <ClipboardList size={18} />
                        Order Information
                      </h6>
                    </div>
                    
                    <div className="col-md-6">
                      <label className="form-label fw-bold small text-muted text-uppercase">Table Number *</label>
                      <input
                        type="number"
                        className="form-control rounded-pill px-3"
                        name="table"
                        value={orderFormData.table}
                        onChange={handleInputChange}
                        placeholder="e.g., 5"
                        min="1"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold small text-muted text-uppercase">Customer Name *</label>
                      <input
                        type="text"
                        className="form-control rounded-pill px-3"
                        name="customer"
                        value={orderFormData.customer}
                        onChange={handleInputChange}
                        placeholder="e.g., John Doe"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold small text-muted text-uppercase">Dish Name *</label>
                      <select
                        className="form-select rounded-pill px-3"
                        name="dishName"
                        value={orderFormData.dishName}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Dish...</option>
                        {menuItems.map(item => (
                            <option key={item.id} value={item.name}>{item.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-3">
                      <label className="form-label fw-bold small text-muted text-uppercase">Quantity *</label>
                      <input
                        type="number"
                        className="form-control rounded-pill px-3"
                        name="items"
                        value={orderFormData.items}
                        onChange={handleInputChange}
                        placeholder="1"
                        min="1"
                        required
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label fw-bold small text-muted text-uppercase">Amount ($)</label>
                      <input
                        type="number"
                        className="form-control rounded-pill px-3 bg-light"
                        name="amount"
                        value={orderFormData.amount}
                        readOnly
                        placeholder="0.00"
                      />
                    </div>

                    {/* Assignment Details */}
                    <div className="col-12 mt-4">
                      <h6 className="fw-bold text-muted mb-3">Assignment & Settings</h6>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold small text-muted text-uppercase">Assigned Waiter *</label>
                      <select
                        className="form-select rounded-pill px-3"
                        name="waiter"
                        value={orderFormData.waiter}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="Sarah">Sarah</option>
                        <option value="Mike">Mike</option>
                        <option value="Emma">Emma</option>
                        <option value="John">John</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold small text-muted text-uppercase">Initial Status *</label>
                      <select
                        className="form-select rounded-pill px-3"
                        name="status"
                        value={orderFormData.status}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="Pending">Pending</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Ready">Ready</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>

                    {/* Info */}
                    <div className="col-12 mt-3">
                      <div className="alert alert-info mb-0 d-flex align-items-start gap-2">
                        <Clock size={16} className="mt-1" />
                        <div className="small">
                          Order time and priority will be automatically recorded.
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
                    Create Order
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

export default OrderManagement;
