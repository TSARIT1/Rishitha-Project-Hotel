import { useState, useEffect } from 'react';
import { 
  ChefHat, Clock, CheckCircle, ClipboardList, RefreshCw, 
  Printer, AlertCircle, Timer, BarChart3, TrendingUp,
  MoreVertical, CheckCheck
} from 'lucide-react';
import './Kitchen.css';

const Kitchen = () => {
  const [filter, setFilter] = useState('all');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
        setLoading(true);
        const { default: api } = await import('../api/axiosConfig');
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
                rawStatus: o.status
            }));
            setOrders(mappedOrders);
        }
    } catch (err) {
        console.error("Error fetching kitchen orders", err);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000); // Poll every 30s
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
          const { default: api } = await import('../api/axiosConfig');
          const response = await api.put(`/orders/${id}/status?status=${newStatus}`);
          if (response.data.success) {
              fetchOrders(); 
          }
      } catch (err) {
          console.error("Error updating status", err);
          alert("Failed to update status");
      }
  };

  // Sample chef data
  const chefs = [
    { name: 'Chef Mario', activeOrders: 3, completedToday: 24, avgPrepTime: '12m', specialty: 'Italian', status: 'Active' },
    { name: 'Chef Sarah', activeOrders: 2, completedToday: 18, avgPrepTime: '15m', specialty: 'Seafood', status: 'Active' },
    { name: 'Chef David', activeOrders: 4, completedToday: 32, avgPrepTime: '10m', specialty: 'Grill', status: 'Active' },
    { name: 'Chef Elena', activeOrders: 1, completedToday: 15, avgPrepTime: '20m', specialty: 'Pastry', status: 'On Break' }
  ];

  // Sample timing data
  const orderTimings = [
    { order: '#1234', startTime: '11:25 AM', estimatedTime: '15m', status: 'On Time' },
    { order: '#1237', startTime: '11:15 AM', estimatedTime: '20m', status: 'Delayed' },
    { order: '#1235', startTime: '11:30 AM', estimatedTime: '18m', status: 'Ready' }
  ];

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
        <div className="col-auto d-flex gap-2">
          <button className="btn btn-outline-primary shadow-sm d-flex align-items-center gap-2 px-3 py-2 fw-semibold border-0 bg-white" onClick={fetchOrders}>
            <RefreshCw size={18} className={loading ? "spin-slow" : ""} /> Refresh
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
          <div className="col-12 col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-header bg-white border-0 py-4 px-4 d-flex align-items-center gap-2">
                <ChefHat className="text-primary" size={24} />
                <h4 className="fw-bold mb-0">Chef Performance</h4>
              </div>
              <div className="card-body px-4 pt-0 overflow-auto">
                <div className="table-responsive">
                  <table className="table table-hover align-middle kitchen-table-modern">
                    <thead className="table-light">
                      <tr>
                        <th className="ps-0 border-0">CHEF NAME</th>
                        <th className="border-0 text-center">ACTIVE</th>
                        <th className="border-0 text-center">DONE</th>
                        <th className="border-0">AVG TIME</th>
                        <th className="border-0">SPECIALTY</th>
                        <th className="border-0 pe-0">STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {chefs.map((chef, index) => (
                        <tr key={index}>
                          <td className="ps-0 py-3">
                            <div className="fw-bold text-dark">{chef.name}</div>
                          </td>
                          <td className="text-center fw-bold">{chef.activeOrders}</td>
                          <td className="text-center fw-bold text-success">{chef.completedToday}</td>
                          <td className="text-muted fw-medium">{chef.avgPrepTime}</td>
                          <td><span className="badge bg-light text-dark fw-medium border">{chef.specialty}</span></td>
                          <td className="pe-0">
                            <span className="status-pill type-new x-small-text fw-bold">{chef.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-header bg-white border-0 py-4 px-4 d-flex align-items-center gap-2">
                <Clock className="text-primary" size={24} />
                <h4 className="fw-bold mb-0">Order Tracking</h4>
              </div>
              <div className="card-body px-4 pt-0">
                <div className="vstack gap-3">
                  {orderTimings.map((timing, index) => (
                    <div key={index} className="d-flex align-items-center p-3 rounded-4 bg-light bg-opacity-50 border border-transparent hover-border-primary transition-all">
                      <div className="flex-grow-1">
                        <div className="h6 fw-bold mb-1 text-dark">Order {timing.order}</div>
                        <div className="tiny-text text-muted fw-semibold">Started {timing.startTime}</div>
                      </div>
                      <div className="text-end">
                        <span className={`status-pill ${timing.status === 'Ready' ? 'type-new' : timing.status === 'Delayed' ? 'type-vip' : 'type-regular'} x-small-text fw-bold`}>
                          {timing.status}
                        </span>
                        <div className="tiny-text text-muted fw-bold mt-1">Est {timing.estimatedTime}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card-footer bg-white border-0 text-center pb-4">
                <button className="btn btn-link btn-sm text-decoration-none fw-bold">View Full Activity Log</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Kitchen;
