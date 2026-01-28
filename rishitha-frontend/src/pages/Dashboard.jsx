import { useState, useEffect } from 'react';
import { 
  TrendingUp, Package, DollarSign, Users, 
  ShoppingCart, AlertCircle, QrCode,
  UserCog, BarChart3, CalendarCheck, Truck,
  ChefHat, Settings
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import StatCard from '../components/UI/StatCard';
import './Dashboard.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { default: api } = await import('../api/axiosConfig');
      
      const [statsRes, ordersRes, inventoryRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/orders'),
        api.get('/inventory')
      ]);

      if (statsRes.data.success) {
        setDashboardStats(statsRes.data.data);
      }

      if (ordersRes.data.success) {
        // Sort by id descending (assuming newer IDs are higher) and take top 5
        // Ideally backend should provide a /recent endpoint, but client-side sort works for now
        const sortedOrders = ordersRes.data.data.sort((a, b) => b.id - a.id).slice(0, 5);
        setRecentOrders(sortedOrders);
      }

      if (inventoryRes.data.success) {
         // Filter low stock items: quantity <= minQuantity (assuming minQuantity exists, or default < 10)
         const lowStock = inventoryRes.data.data.filter(item => item.quantity <= (item.minQuantity || 10));
         setLowStockItems(lowStock);
      }

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const getStatsData = () => {
      if (!dashboardStats) return [];

      return [
        {
          title: 'Active Orders',
          value: dashboardStats.activeOrders || 0,
          change: 'Active',
          trend: 'neutral',
          icon: ShoppingCart,
          color: 'primary',
          subtitle: 'orders processing'
        },
        {
          title: 'Inventory Items',
          value: dashboardStats.totalInventoryItems || 0,
          change: `${dashboardStats.lowStockItems} low`,
          trend: dashboardStats.lowStockItems > 0 ? 'warning' : 'success',
          icon: Package,
          color: 'success',
          subtitle: 'total items'
        },
        {
          title: "Today's Revenue",
          value: `$${dashboardStats.todayRevenue || 0}`,
          change: 'Daily',
          trend: 'up',
          icon: DollarSign,
          color: 'warning',
          subtitle: `Total: $${dashboardStats.totalRevenue || 0}`
        },
        {
          title: 'Tables Occupied',
          value: `${dashboardStats.occupiedTables || 0}/${dashboardStats.totalTables || 0}`,
          change: dashboardStats.totalTables ? `${Math.round((dashboardStats.occupiedTables / dashboardStats.totalTables) * 100)}%` : '0%',
          trend: 'neutral',
          icon: Users,
          color: 'info',
          subtitle: 'occupancy rate'
        },
        {
            title: 'Current Guests',
            value: 'N/A', // We don't have this data yet
            change: '-',
            trend: 'neutral',
            icon: Users,
            color: 'secondary',
            subtitle: 'today'
        }
      ];
  };

  const stats = getStatsData();

  // Revenue Analytics Chart Data
  const revenueData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Revenue',
        data: [6500, 7200, 6800, 8400, 7800, 9200, 8420],
        borderColor: '#e63946',
        backgroundColor: 'rgba(230, 57, 70, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: '#e63946',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
    ],
  };

  const revenueOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1a1a2e',
        padding: 12,
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#e63946',
        borderWidth: 1,
        displayColors: false,
        callbacks: {
          label: function(context) {
            return '$' + context.parsed.y.toLocaleString();
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        }
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  // Sales by Category Chart Data
  const categoryData = {
    labels: ['Starters', 'Main Course', 'Desserts', 'Beverages', 'Specials'],
    datasets: [
      {
        data: [25, 35, 15, 15, 10],
        backgroundColor: [
          '#e63946',
          '#f4a261',
          '#06d6a0',
          '#118ab2',
          '#9b59b6',
        ],
        borderWidth: 0,
        hoverOffset: 10,
      },
    ],
  };

  const categoryOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: '#1a1a2e',
        padding: 12,
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#e63946',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            return context.label + ': ' + context.parsed + '%';
          }
        }
      },
    },
  };

  return (
    <div className="dashboard animate-fadeIn">
      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Revenue Analytics Section */}
      <div className="analytics-section">
        <div className="analytics-card revenue-chart">
          <div className="chart-header">
            <h3>Revenue Analytics (Last 7 Days)</h3>
            <select className="chart-select">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>This Month</option>
              <option>Last Month</option>
            </select>
          </div>
          <div className="chart-wrapper">
            <Line data={revenueData} options={revenueOptions} />
          </div>
        </div>

        <div className="analytics-card category-chart">
          <div className="chart-header">
            <h3>Sales by Category</h3>
          </div>
          <div className="chart-wrapper">
            <Doughnut data={categoryData} options={categoryOptions} />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Recent Orders */}
        <div className="dashboard-card recent-orders">
          <div className="card-header">
            <h3>Recent Orders</h3>
            <button className="btn-primary-sm">View All</button>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer/Table</th>
                  <th>Time</th>
                  <th>Items</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length > 0 ? (
                    recentOrders.map((order) => (
                    <tr key={order.id}>
                        <td><span className="order-id">#{order.id}</span></td>
                        <td>{order.diningTable ? `Table ${order.diningTable.tableNo}` : 'Takeaway'}</td>
                        <td>{new Date().toLocaleTimeString()}</td> {/* Ideally backend provides timestamp */}
                        <td>{order.items ? order.items.length : 0} items</td>
                        <td className="amount">${order.totalAmount}</td>
                        <td>
                        <span className={`status-badge status-${order.status.toLowerCase()}`}>
                            {order.status}
                        </span>
                        </td>
                    </tr>
                    ))
                ) : (
                    <tr><td colSpan="6" className="text-center p-3">No recent orders</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="dashboard-card low-stock">
          <div className="card-header">
            <h3>Low Stock Alerts</h3>
            <span className="alert-badge">{lowStockItems.length} Items</span>
          </div>
          <div className="alert-list">
            {lowStockItems.length > 0 ? (
                lowStockItems.map((item, index) => (
                <div key={index} className="alert-item">
                    <div className="alert-icon">
                    <AlertCircle size={20} />
                    </div>
                    <div className="alert-content">
                    <h4>{item.name}</h4>
                    <p>{item.quantity} / {item.minQuantity || 10} required</p>
                    </div>
                    <span className={`alert-status status-low`}>
                    Low
                    </span>
                </div>
                ))
            ) : (
                <div className="p-4 text-center text-muted">Stock levels are healthy!</div>
            )}
          </div>
          <button className="btn-warning-full" onClick={() => window.location.href='/inventory'}>View Inventory</button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-card">
        <h3>Quick Actions</h3>
        <div className="quick-actions-grid">
          <button className="quick-action-btn btn-blue" onClick={() => alert('New Order')}>
            <ShoppingCart size={20} />
            <span>New Order</span>
          </button>
          <button className="quick-action-btn btn-green" onClick={() => alert('Generate Bill')}>
            <DollarSign size={20} />
            <span>Generate Bill</span>
          </button>
          <button className="quick-action-btn btn-yellow" onClick={() => alert('Add Stock')}>
            <Package size={20} />
            <span>Add Stock</span>
          </button>
          <button className="quick-action-btn btn-cyan" onClick={() => alert('Print QR Codes')}>
            <QrCode size={20} />
            <span>Print QR Codes</span>
          </button>
          <button className="quick-action-btn btn-gray" onClick={() => alert('Add Staff')}>
            <UserCog size={20} />
            <span>Add Staff</span>
          </button>
          <button className="quick-action-btn btn-red" onClick={() => alert('View Reports')}>
            <BarChart3 size={20} />
            <span>View Reports</span>
          </button>
          <button className="quick-action-btn btn-dark" onClick={() => alert('New Reservation')}>
            <CalendarCheck size={20} />
            <span>New Reservation</span>
          </button>
        </div>
      </div>

      {/* Quick Access to Other Management Sections */}
      <div className="quick-access-card">
        <h3>Quick Access to Other Management Sections</h3>
        <div className="quick-access-grid">
          <div className="access-card" onClick={() => window.location.href = '/suppliers'}>
            <div className="access-icon icon-yellow">
              <Truck size={32} />
            </div>
            <h4>Suppliers</h4>
            <button className="access-btn">Access</button>
          </div>
          <div className="access-card" onClick={() => window.location.href = '/reservations'}>
            <div className="access-icon icon-cyan">
              <CalendarCheck size={32} />
            </div>
            <h4>Reservations</h4>
            <button className="access-btn">Access</button>
          </div>
          <div className="access-card" onClick={() => window.location.href = '/expenses'}>
            <div className="access-icon icon-red">
              <DollarSign size={32} />
            </div>
            <h4>Expenses</h4>
            <button className="access-btn">Access</button>
          </div>
          <div className="access-card" onClick={() => window.location.href = '/kitchen'}>
            <div className="access-icon icon-green">
              <ChefHat size={32} />
            </div>
            <h4>Kitchen Display</h4>
            <button className="access-btn">Access</button>
          </div>
          <div className="access-card" onClick={() => window.location.href = '/settings'}>
            <div className="access-icon icon-gray">
              <Settings size={32} />
            </div>
            <h4>Settings</h4>
            <button className="access-btn">Access</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
