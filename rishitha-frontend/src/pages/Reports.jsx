import { useState } from 'react';
import { 
  BarChart3, TrendingUp, TrendingDown, DollarSign, 
  ShoppingCart, Users, Package, Calendar, 
  Download, Filter, ChevronRight, PieChart, 
  ArrowUpRight, ArrowDownRight, Clock, MapPin,
  CheckCircle, AlertCircle
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
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import './Reports.css';

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

const Reports = () => {
  const [timeRange, setTimeRange] = useState('This Month');

  // Chart Data: Revenue Trend
  const revenueData = {
    labels: ['Jan 1', 'Jan 5', 'Jan 10', 'Jan 15', 'Jan 20', 'Jan 25', 'Jan 30'],
    datasets: [
      {
        label: 'Revenue (₹)',
        data: [42000, 48000, 39000, 55000, 62000, 58000, 65000],
        fill: true,
        borderColor: 'rgba(13, 110, 253, 1)',
        backgroundColor: 'rgba(13, 110, 253, 0.1)',
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#fff',
        pointBorderColor: 'rgba(13, 110, 253, 1)',
        pointBorderWidth: 2,
      },
    ],
  };

  // Chart Data: Sales by Category
  const categoryData = {
    labels: ['Food', 'Beverages', 'Desserts', 'Service'],
    datasets: [
      {
        data: [45, 25, 15, 15],
        backgroundColor: [
          'rgba(13, 110, 253, 0.8)',
          'rgba(13, 202, 240, 0.8)',
          'rgba(255, 193, 7, 0.8)',
          'rgba(25, 135, 84, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  };

  // Chart Data: Peak Hours
  const peakHoursData = {
    labels: ['11 AM', '1 PM', '3 PM', '5 PM', '7 PM', '9 PM', '11 PM'],
    datasets: [
      {
        label: 'Orders',
        data: [12, 45, 18, 22, 58, 64, 28],
        backgroundColor: 'rgba(13, 110, 253, 0.7)',
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#000',
        bodyColor: '#666',
        borderColor: '#eee',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
      }
    },
    scales: {
      y: { grid: { borderDash: [5, 5], color: '#f0f0f0' }, ticks: { font: { size: 10 } } },
      x: { grid: { display: false }, ticks: { font: { size: 10 } } }
    }
  };

  const stats = [
    { title: 'Total Revenue', value: '₹4,82,450', icon: DollarSign, color: 'primary', trend: '+12.5%', trendUp: true },
    { title: 'Avg. Order', value: '₹1,240', icon: ShoppingCart, color: 'info', trend: '+4.2%', trendUp: true },
    { title: 'Customer Growth', value: '1,420', icon: Users, color: 'success', trend: '+8.1%', trendUp: true },
    { title: 'Inventory Turn', value: '14.2', icon: Package, color: 'warning', trend: '-2.4%', trendUp: false },
  ];

  return (
    <div className="container-fluid py-3 reports-bootstrap-page d-flex flex-column" style={{ height: 'calc(100vh - 85px)', overflow: 'hidden' }}>
      
      {/* Page Header */}
      <div className="row align-items-center mb-3 flex-shrink-0 px-2">
        <div className="col">
          <h1 className="h3 fw-bold mb-0 d-flex align-items-center gap-2">
            <BarChart3 size={28} className="text-primary" />
            Reports & Analytics
          </h1>
          <p className="text-muted small mb-0 fw-medium">Real-time business intelligence and sales insights</p>
        </div>
        <div className="col-auto d-flex gap-2">
          <div className="dropdown">
            <button className="btn btn-light shadow-sm dropdown-toggle rounded-pill px-3 border-0 bg-white small fw-bold" type="button" data-bs-toggle="dropdown">
              <Calendar size={16} className="me-2 text-primary" /> {timeRange}
            </button>
            <ul className="dropdown-menu border-0 shadow-sm rounded-3">
              <li><button className="dropdown-item small" onClick={() => setTimeRange('Today')}>Today</button></li>
              <li><button className="dropdown-item small" onClick={() => setTimeRange('This Week')}>This Week</button></li>
              <li><button className="dropdown-item small" onClick={() => setTimeRange('This Month')}>This Month</button></li>
              <li><button className="dropdown-item small" onClick={() => setTimeRange('Custom Range')}>Custom Range</button></li>
            </ul>
          </div>
          <button className="btn btn-primary shadow-sm d-flex align-items-center gap-2 px-3 py-2 fw-semibold rounded-pill">
            <Download size={18} /> Download Full Report
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
                      {stat.trendUp ? 
                        <span className="tiny-text text-success fw-bold d-flex align-items-center"><ArrowUpRight size={12}/>{stat.trend}</span> :
                        <span className="tiny-text text-danger fw-bold d-flex align-items-center"><ArrowDownRight size={12}/>{stat.trend}</span>
                      }
                    </div>
                    <h4 className="fw-bold mb-0">{stat.value}</h4>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Major Analytics Row */}
        <div className="row g-4 mb-4">
          
          {/* Revenue Trend Chart */}
          <div className="col-12 col-xl-8">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-header bg-white border-bottom-0 py-4 px-4 d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                    <TrendingUp size={20} className="text-primary" />
                    Revenue Trend
                  </h5>
                  <p className="tiny-text text-muted mb-0 fw-bold text-uppercase mt-1">Net Sales over time</p>
                </div>
                <div className="btn-group btn-group-sm rounded-pill p-1 bg-light border-0">
                  <button className="btn btn-white shadow-sm border-0 rounded-pill px-3 py-1 small fw-bold">Sales</button>
                  <button className="btn btn-transparent border-0 rounded-pill px-3 py-1 small fw-bold text-muted">Orders</button>
                </div>
              </div>
              <div className="card-body px-4 pt-1 pb-4" style={{ minHeight: '300px' }}>
                <Line data={revenueData} options={chartOptions} />
              </div>
            </div>
          </div>

          {/* Category Distribution Chart */}
          <div className="col-12 col-xl-4">
            <div className="card border-0 shadow-sm rounded-4 h-100 analytics-card-bg">
              <div className="card-header bg-transparent border-bottom-0 py-4 px-4">
                <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                  <PieChart size={20} className="text-info" />
                  Sales by Category
                </h5>
              </div>
              <div className="card-body p-4 pt-1 d-flex flex-column align-items-center justify-content-center">
                <div style={{ height: '220px', width: '220px' }}>
                  <Doughnut data={categoryData} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, legend: { display: false } } }} />
                </div>
                <div className="mt-4 w-100 vstack gap-2">
                  {[
                    { label: 'Food & Dining', percent: '45%', color: 'primary' },
                    { label: 'Beverages', percent: '25%', color: 'info' },
                    { label: 'Desserts', percent: '15%', color: 'warning' },
                    { label: 'Service Fees', percent: '15%', color: 'success' },
                  ].map((item, i) => (
                    <div key={i} className="d-flex justify-content-between align-items-center small">
                      <div className="d-flex align-items-center gap-2">
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: `var(--bs-${item.color})` }}></div>
                        <span className="text-muted fw-medium">{item.label}</span>
                      </div>
                      <span className="fw-bold">{item.percent}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Operational Efficiency Row */}
        <div className="row g-4 mb-4">
          
          {/* Peak Hours Chart */}
          <div className="col-12 col-lg-7">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-header bg-white border-bottom-0 py-4 px-4 d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                  <Clock size={20} className="text-primary" />
                  Peak Dining Hours
                </h5>
                <span className="tiny-text fw-bold text-muted text-uppercase">Kitchen Load Index</span>
              </div>
              <div className="card-body px-4 pt-1 pb-4" style={{ minHeight: '250px' }}>
                <Bar data={peakHoursData} options={chartOptions} />
              </div>
            </div>
          </div>

          {/* Quick Reports / Actions Card */}
          <div className="col-12 col-lg-5">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-header bg-white border-bottom-0 py-4 px-4">
                <h5 className="fw-bold mb-0">System Summary Reports</h5>
              </div>
              <div className="card-body p-4 pt-0">
                <div className="vstack gap-2">
                  {[
                    { title: 'Tax & Compliance Summary', date: 'Dec 2024', icon: CheckCircle, color: 'success' },
                    { title: 'Inventory Wastage Tracking', date: 'Q4 2024', icon: AlertCircle, color: 'warning' },
                    { title: 'Staff Performance Index', date: 'Monthly', icon: TrendingUp, color: 'primary' },
                    { title: 'Customer Feedback Analysis', date: 'Weekly', icon: Users, color: 'info' }
                  ].map((report, i) => (
                    <div key={i} className="d-flex align-items-center p-3 rounded-4 bg-light bg-opacity-50 border border-transparent hover-border-primary transition-all">
                      <div className={`p-2 rounded-3 bg-${report.color}-soft text-${report.color} me-3`}>
                        <report.icon size={18} />
                      </div>
                      <div className="flex-grow-1">
                        <div className="fw-bold small text-dark">{report.title}</div>
                        <span className="tiny-text text-muted">{report.date} Auto-Generated</span>
                      </div>
                      <button className="btn btn-sm btn-light rounded-pill border-0 bg-white shadow-sm p-1">
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-primary-soft rounded-4 border border-primary-subtle d-flex align-items-center gap-3">
                  <div className="p-2 bg-primary rounded-circle text-white shadow-sm">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <span className="fw-bold text-primary small d-block">Growth Forecast</span>
                    <p className="tiny-text text-muted mb-0">Projected 15% revenue increase for next month.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Reports;
