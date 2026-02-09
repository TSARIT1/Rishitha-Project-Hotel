import { useState, useEffect } from 'react';
import { 
  ChefHat, Clock, CheckCircle, ClipboardList, RefreshCw, 
  Printer, AlertCircle, Timer, BarChart3, TrendingUp,
  MoreVertical, CheckCheck
} from 'lucide-react';
import './Kitchen.css';

import api from '../services/api'; // Static import

const Kitchen = () => {
  const [filter, setFilter] = useState('all');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchOrders = async (showSpinner = true) => {
    try {
        if (showSpinner) setLoading(true);
        const startTime = Date.now();
        
        const response = await api.get('/orders'); 
        if (response.data.success) {
            const activeOrders = response.data.data.filter(o => 
                ['PENDING', 'PREPARING', 'READY'].includes(o.status)
            ).sort((a, b) => b.id - a.id); // Sort descending by ID so new orders are top
            
            const mappedOrders = activeOrders.map(o => ({
                id: `#${o.id}`,
                rawId: o.id,
                table: o.tableNumber ? String(o.tableNumber) : 'Takeaway',
                items: o.items ? o.items.map(i => i.menuItem.name) : [],
                time: getTimeDifference(o.orderTime),
                priority: 'medium',
                status: o.status === 'PENDING' ? 'arrived' : o.status.toLowerCase(),
                rawStatus: o.status,
                instructions: o.instructions // Map instructions
            }));
            setOrders(mappedOrders);
            setLastUpdated(new Date());
        }
        
        // Ensure spinner shows for at least 500ms for UX (only if spinner is shown)
        if (showSpinner) {
            const elapsedTime = Date.now() - startTime;
            if (elapsedTime < 500) {
                await new Promise(resolve => setTimeout(resolve, 500 - elapsedTime));
            }
        }
    } catch (err) {
        console.error("Error fetching kitchen orders", err);
        if (showSpinner) {
             // Only show alert on manual refresh failure, silent fail on background poll
             alert("Failed to refresh orders. Check connection.");
        }
    } finally {
        if (showSpinner) setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(true); // Initial load with spinner
    const interval = setInterval(() => fetchOrders(false), 3000); // Poll every 3s silently
    return () => clearInterval(interval);
  }, []);

  const getTimeDifference = (orderTime) => {
      if (!orderTime) return '0 min';
      const diffStr = new Date() - new Date(orderTime);
      const diffMins = Math.floor(diffStr / 60000);
      return `${diffMins} min`;
  };

  const handleStatusUpdate = async (id, newStatus) => {
      try {
          const { default: api } = await import('../services/api');
          const response = await api.put(`/orders/${id}/status?status=${newStatus}`);
          if (response.data.success) {
              fetchOrders(); 
          }
      } catch (err) {
          console.error("Error updating status", err);
          alert("Failed to update status");
      }
  };



  const arrivedCount = orders.filter(o => o.status === 'arrived').length;
  const preparingCount = orders.filter(o => o.status === 'preparing').length;
  const readyCount = orders.filter(o => o.status === 'ready').length;

  const stats = [
    { label: 'Arrived', value: arrivedCount, color: 'danger', icon: AlertCircle },
    { label: 'Preparing', value: preparingCount, color: 'warning', icon: Timer },
    { label: 'Ready', value: readyCount, color: 'success', icon: CheckCircle },
    { label: 'Avg Time', value: '15m', color: 'primary', icon: Clock }
  ];

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  const getPriorityClass = (priority) => {
    switch(priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  };

  return (
    <div className="container-fluid py-3 kitchen-bootstrap-page d-flex flex-column" style={{ height: 'calc(100vh - 85px)', overflow: 'hidden' }}>
      
      {/* Dynamic Header / Subheader Area */}
      <div className="row align-items-center mb-3 flex-shrink-0 px-2">
        <div className="col">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-primary-soft p-2 rounded-3 text-primary">
              <ChefHat size={32} />
            </div>
            <div>
              <h1 className="h3 fw-bold mb-0 text-dark">Kitchen Display System</h1>
              <p className="text-muted small mb-0 fw-medium">Real-time Order Monitoring • {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
        <div className="col-auto d-flex gap-2 align-items-center">
          <span className="text-muted small fw-bold me-2">
            Details updated: {lastUpdated.toLocaleTimeString()}
          </span>
          <button className="btn btn-outline-primary shadow-sm d-flex align-items-center gap-2 px-3 py-2 fw-semibold border-0 bg-white" onClick={() => fetchOrders(true)} disabled={loading}>
            <RefreshCw size={18} className={loading ? "spin-slow" : ""} /> {loading ? "Refreshing..." : "Refresh"}
          </button>
          <button className="btn btn-primary d-flex align-items-center gap-2 px-3 py-2 fw-semibold shadow-sm">
            <Printer size={18} /> Print KOT
          </button>
        </div>
      </div>

      {/* Main Content Area - Scrollable */}
      <div className="flex-grow-1 overflow-auto custom-thin-scrollbar px-2">
        
        {/* Stats Grid */}
        <div className="row g-3 mb-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="col-6 col-md-3">
              <div className={`card border-0 shadow-sm glass-card stat-card-modern hover-lift bg-${stat.color}-soft`}>
                <div className="card-body p-3 d-flex align-items-center">
                  <div className={`stat-icon bg-${stat.color} text-white me-3`}>
                    <stat.icon size={20} />
                  </div>
                  <div>
                    <h4 className="fw-bold mb-0">{stat.value}</h4>
                    <span className="tiny-text fw-bold text-muted text-uppercase ls-1">{stat.label}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters and Active Orders Area */}
        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-header bg-white border-0 pt-4 px-4 d-flex justify-content-between align-items-center">
            <h4 className="fw-bold mb-0 text-dark">Active Orders</h4>
            <div className="btn-group p-1 bg-light rounded-3">
              {['all', 'arrived', 'preparing', 'ready'].map((f) => (
                <button 
                  key={f}
                  className={`btn btn-sm px-4 py-2 rounded-2 border-0 shadow-none text-capitalize fw-bold ${filter === f ? 'bg-white text-primary shadow-sm' : 'text-muted'}`}
                  onClick={() => setFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="card-body p-4 pt-2">
            <div className="row g-3">
              {filteredOrders.length === 0 ? (
                  <div className="col-12 py-5 text-center text-muted">
                      <h5>No active orders</h5>
                      <p>Wait for new orders to arrive</p>
                  </div>
              ) : (
                  filteredOrders.map((order) => (
                    <div key={order.id} className="col-12 col-md-6 col-xl-4">
                      <div className={`card h-100 shadow-sm order-card-modern ${getPriorityClass(order.priority)} rounded-4 border-0`}>
                        <div className="card-body p-3 d-flex flex-column">
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <div className="d-flex align-items-center gap-2">
                              <span className="badge bg-light text-dark fw-bold p-2 border">Table {order.table}</span>
                              <span className="fw-bold text-dark">{order.id}</span>
                            </div>
                            <button className="btn btn-link p-0 text-muted"><MoreVertical size={18} /></button>
                          </div>

                          <div className="flex-grow-1 mb-3">
                            <ul className="list-unstyled mb-0">
                              {order.items.map((item, i) => (
                                <li key={i} className="d-flex align-items-center gap-2 mb-2">
                                  <div className="p-1 bg-primary text-white rounded-circle" style={{ width: '6px', height: '6px' }}></div>
                                  <span className="fw-semibold small">{item}</span>
                                </li>
                              ))}
                              {order.instructions && (
                                <li className="mt-3 p-2 bg-warning-soft rounded-3 border border-warning-subtle">
                                  <div className="d-flex gap-2">
                                    <AlertCircle size={14} className="text-warning mt-1 flex-shrink-0" />
                                    <span className="tiny-text fw-bold text-dark fst-italic">"{order.instructions}"</span>
                                  </div>
                                </li>
                              )}
                            </ul>
                          </div>

                          <div className="d-flex justify-content-between align-items-center mt-auto">
                            <div className="d-flex align-items-center gap-1 text-muted fw-bold small">
                               <Clock size={16} />
                               {order.time}
                            </div>
                            {order.status === 'arrived' ? (
                               <button 
                                onClick={() => handleStatusUpdate(order.rawId, 'PREPARING')}
                                className="btn btn-danger-soft text-danger fw-bold btn-sm px-3 rounded-pill hover-lift d-flex align-items-center gap-2">
                                <ClipboardList size={14} /> Start Making
                               </button>
                            ) : order.status === 'preparing' ? (
                              <button 
                                onClick={() => handleStatusUpdate(order.rawId, 'READY')}
                                className="btn btn-warning-soft text-warning fw-bold btn-sm px-3 rounded-pill hover-lift d-flex align-items-center gap-2">
                                <RefreshCw size={14} className="spin-slow" /> Mark Ready
                              </button>
                            ) : (
                              <button 
                                onClick={() => handleStatusUpdate(order.rawId, 'COMPLETED')}
                                className="btn btn-success-soft text-success fw-bold btn-sm px-3 rounded-pill hover-lift d-flex align-items-center gap-2">
                                <CheckCheck size={14} /> Complete
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>

        {/* Bottom Section: Performance & Timing */}
        <div className="row g-4 mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-header bg-white border-0 py-4 px-4 d-flex align-items-center gap-2">
                <Clock className="text-primary" size={24} />
                <h4 className="fw-bold mb-0">Recent Order Activity</h4>
              </div>
              <div className="card-body px-4 pt-0">
                <div className="vstack gap-3">
                  {orders.length === 0 ? (
                      <p className="text-muted text-center my-3">No recent actvity</p>
                  ) : (
                      orders.slice(0, 5).map((order) => (
                        <div key={order.rawId} className="d-flex align-items-center p-3 rounded-4 bg-light bg-opacity-50 border border-transparent hover-border-primary transition-all">
                          <div className="flex-grow-1">
                            <div className="h6 fw-bold mb-1 text-dark">Order {order.id}</div>
                            <div className="tiny-text text-muted fw-semibold">Time: {order.time}</div>
                          </div>
                          <div className="text-end">
                            <span className={`status-pill ${order.status === 'ready' ? 'type-new' : order.status === 'delayed' ? 'type-vip' : 'type-regular'} x-small-text fw-bold`}>
                              {order.status}
                            </span>
                            <div className="tiny-text text-muted fw-bold mt-1">Table {order.table}</div>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Kitchen;
