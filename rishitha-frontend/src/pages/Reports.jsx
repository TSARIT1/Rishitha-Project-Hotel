import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

import AIAssistant from '../components/AI/AIAssistant';

const Reports = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // 1-12
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trendView, setTrendView] = useState('sales'); // 'sales' or 'orders'
  const [analyzing, setAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);

  const [restaurantSettings, setRestaurantSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
        try {
            const { default: api } = await import('../services/api');
            const response = await api.get('/settings');
            if (response.data.success) {
                setRestaurantSettings(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching settings:", error);
        }
    };
    fetchSettings();
  }, []);

  const handleDownloadReport = () => {
    if (!reportData) return;

    const doc = new jsPDF();
    const monthName = months.find(m => m.value === selectedMonth)?.label;

    // Use fetched settings or defaults
    const rName = restaurantSettings?.restaurantName || 'RISHITHA RESTAURANT';
    const rAddress = restaurantSettings?.address || 'Delicious City, 560001';
    const rPhone = restaurantSettings?.phoneNumber || '+91 98765 43210';
    const rEmail = restaurantSettings?.websiteUrl || 'contact@rishitharestaurant.com'; 

    // Restaurant Header
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(13, 110, 253); // Primary color
    doc.text(rName.toUpperCase(), 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(100);
    doc.text(`${rAddress} | ${rPhone}`, 105, 26, { align: 'center' });
    doc.text(rEmail, 105, 31, { align: 'center' });
    
    doc.setDrawColor(200);
    doc.line(14, 35, 196, 35);

    // Title
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text(`Monthly Report - ${monthName} ${selectedYear}`, 14, 45);

    // Generated Date
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 52);

    // Key Metrics Section
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text('Key Performance Indicators', 14, 65);

    const kpiData = [
       ['Total Revenue', `Rs. ${reportData.totalRevenue?.toLocaleString() || 0}`],
       ['Total Customers', reportData.totalCustomers?.toLocaleString() || 0],
       ['Avg Order Value', `Rs. ${reportData.avgOrderValue?.toLocaleString() || 0}`],
       ['Inventory Turnover', reportData.inventoryTurnover?.toString() || 0]
    ];

    autoTable(doc, {
        startY: 70,
        head: [['Metric', 'Value']],
        body: kpiData,
        theme: 'striped',
        headStyles: { fillColor: [13, 110, 253] },
        styles: { fontSize: 12 }
    });

    // Sales by Category Section
    const finalY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.text('Sales by Category', 14, finalY);

    const categoryRows = Object.entries(reportData.salesByCategory || {}).map(([cat, val]) => [cat, `Rs. ${val.toLocaleString()}`]);

    autoTable(doc, {
        startY: finalY + 5,
        head: [['Category', 'Sales']],
        body: categoryRows,
        theme: 'grid',
        headStyles: { fillColor: [25, 135, 84] }, // Green for distinct section
    });
    
    // Revenue Trend Summary (Optional compact table)
    const trendY = doc.lastAutoTable.finalY + 15;
    if (trendY < 250) { // Only add if space permits on first page, roughly
        doc.setFontSize(14);
        doc.text('Revenue Trend (Daily)', 14, trendY);
        
        // Take first 10 or summary to avoid long page
        const trendData = Object.entries(reportData.revenueTrend || {}).slice(0, 15).map(([date, val]) => [date, `Rs. ${val.toLocaleString()}`]);
        
        autoTable(doc, {
            startY: trendY + 5,
            head: [['Date', 'Revenue']],
            body: trendData,
            theme: 'plain',
            styles: { fontSize: 8 }
        });
    }

    doc.save(`Report_${monthName}_${selectedYear}.pdf`);
  };

  const generateAIAnalysis = async () => {
      if (!reportData) return;
      
      setAnalyzing(true);
      setAiAnalysis(null);
      
      try {
          const { default: api } = await import('../services/api');
          // Prepare data payload - send relevant parts to save bandwidth/complexity
          const payload = {
              totalRevenue: reportData.totalRevenue,
              totalCustomers: reportData.totalCustomers,
              salesByCategory: reportData.salesByCategory,
              revenueTrend: reportData.revenueTrend,
              year: selectedYear,
              month: selectedMonth
          };
          
          const response = await api.post('/reports/analyze', payload);
          if (response.data.success) {
              setAiAnalysis(response.data.data);
          } else {
              setAiAnalysis("Failed to generate analysis. Please try again.");
          }
      } catch (error) {
          console.error("Error generating AI analysis:", error);
          setAiAnalysis("Error connecting to AI service. Please check your connection.");
      } finally {
          setAnalyzing(false);
      }
  };

  // Simple Markdown Renderer Component (internal for now)
  const MarkdownRenderer = ({ content }) => {
      if (!content) return null;
      
      // Basic replacement for bold key terms - a full MD library would be better but this is lightweight
      const htmlContent = content
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\n/g, '<br />');
          
      return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
  };

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const { default: api } = await import('../services/api');
        const response = await api.get(`/reports?year=${selectedYear}&month=${selectedMonth}`);
        if (response.data.success) {
          setReportData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [selectedYear, selectedMonth]);

  if (loading && !reportData) {
    return <div className="p-5 text-center text-muted">Loading reports...</div>;
  }

  // Use fetched data or defaults
  const data = reportData || {};

  // Helper for generating year/month options
  const years = [2024, 2025, 2026, 2027];
  const months = [
    { value: 1, label: 'January' }, { value: 2, label: 'February' }, { value: 3, label: 'March' },
    { value: 4, label: 'April' }, { value: 5, label: 'May' }, { value: 6, label: 'June' },
    { value: 7, label: 'July' }, { value: 8, label: 'August' }, { value: 9, label: 'September' },
    { value: 10, label: 'October' }, { value: 11, label: 'November' }, { value: 12, label: 'December' }
  ];

  // Chart Data: Revenue Trend
  const revenueTrendMap = data.revenueTrend || {};
  const revenueData = {
    labels: Object.keys(revenueTrendMap),
    datasets: [
      {
        label: 'Revenue (₹)',
        data: Object.values(revenueTrendMap),
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
  const categoryMap = data.salesByCategory || {};
  const categoryData = {
    labels: Object.keys(categoryMap),
    datasets: [
      {
        data: Object.values(categoryMap),
        backgroundColor: [
          'rgba(13, 110, 253, 0.8)',
          'rgba(13, 202, 240, 0.8)',
          'rgba(255, 193, 7, 0.8)',
          'rgba(25, 135, 84, 0.8)',
          'rgba(220, 53, 69, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  };

  // Chart Data: Peak Hours
  const peakHoursMap = data.peakDiningHours || {};
  const peakHoursData = {
    labels: Object.keys(peakHoursMap),
    datasets: [
      {
        label: 'Orders',
        data: Object.values(peakHoursMap),
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
    { title: 'Total Revenue', value: `₹${data.totalRevenue?.toLocaleString() || '0'}`, icon: DollarSign, color: 'primary', trend: `+${data.totalRevenueGrowth || 0}%`, trendUp: true },
    { title: 'Avg. Order', value: `₹${data.avgOrderValue?.toLocaleString() || '0'}`, icon: ShoppingCart, color: 'info', trend: `+${data.avgOrderGrowth || 0}%`, trendUp: true },
    { title: 'Total Customers', value: data.totalCustomers?.toLocaleString() || '0', icon: Users, color: 'success', trend: `+${data.customerGrowth || 0}%`, trendUp: true },
    { title: 'Inventory Turn', value: data.inventoryTurnover?.toString() || '0', icon: Package, color: 'warning' },
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
          
          {/* Year Selector */}
          <select 
            className="form-select border-0 shadow-sm rounded-pill px-3 py-2 fw-bold text-primary bg-white" 
            style={{ width: 'auto' }}
            value={selectedYear} 
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>

          {/* Month Selector */}
          <select 
            className="form-select border-0 shadow-sm rounded-pill px-3 py-2 fw-bold text-primary bg-white" 
            style={{ width: 'auto' }}
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
          >
            {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>

          <button 
            className="btn btn-primary shadow-sm d-flex align-items-center gap-2 px-3 py-2 fw-semibold rounded-pill"
            onClick={generateAIAnalysis}
            disabled={analyzing}
          >
            {analyzing ? (
                <>
                    <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                    <span role="status">Thinking...</span>
                </>
            ) : (
                <>
                    <div className="d-flex align-items-center justify-content-center bg-white rounded-circle" style={{width: '20px', height: '20px'}}>
                        <span style={{fontSize: '12px'}}>✨</span>
                    </div>
                    Analyze with AI
                </>
            )}
          </button>
          
          <button 
            className="btn btn-outline-primary shadow-sm d-flex align-items-center gap-2 px-3 py-2 fw-semibold rounded-pill bg-white"
            onClick={handleDownloadReport}
          >
            <Download size={18} /> Download
          </button>
        </div>
      </div>

      {/* AI Analysis Result Section */}
      {aiAnalysis && (
        <div className="px-2 mb-4 animate-fadeIn">
            <div className="card border-0 shadow-sm rounded-4 bg-primary-soft">
                <div className="card-body p-4">
                    <div className="d-flex align-items-center gap-2 mb-3">
                        <div className="p-2 bg-primary rounded-3 text-white">
                             <span style={{fontSize: '18px'}}>✨</span>
                        </div>
                        <h5 className="fw-bold mb-0 text-primary">AI Business Consultant</h5>
                    </div>
                    <div className="bg-white rounded-3 p-3 shadow-sm markdown-content">
                        <MarkdownRenderer content={aiAnalysis} />
                    </div>
                </div>
            </div>
        </div>
      )}

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
                      {stat.trend && (
                        stat.trendUp ? 
                          <span className="tiny-text text-success fw-bold d-flex align-items-center"><ArrowUpRight size={12}/>{stat.trend}</span> :
                          <span className="tiny-text text-danger fw-bold d-flex align-items-center"><ArrowDownRight size={12}/>{stat.trend}</span>
                      )}
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
                  <button 
                    className={`btn border-0 rounded-pill px-3 py-1 small fw-bold shadow-sm ${trendView === 'sales' ? 'btn-white text-dark' : 'btn-transparent text-muted'}`}
                    onClick={() => setTrendView('sales')}
                  >
                    Sales
                  </button>
                  <button 
                    className={`btn border-0 rounded-pill px-3 py-1 small fw-bold shadow-sm ${trendView === 'orders' ? 'btn-white text-dark' : 'btn-transparent text-muted'}`}
                    onClick={() => setTrendView('orders')}
                  >
                    Orders
                  </button>
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
                  {Object.entries(categoryMap).map(([label, value], i) => (
                    <div key={i} className="d-flex justify-content-between align-items-center small">
                      <div className="d-flex align-items-center gap-2">
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: categoryData.datasets[0].backgroundColor[i % 5] }}></div>
                        <span className="text-muted fw-medium">{label}</span>
                      </div>
                      <span className="fw-bold">₹{value.toLocaleString()}</span>
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
                    { 
                      title: 'Tax & Compliance', 
                      value: `₹${(data.totalTaxCollected || 0).toLocaleString()}`, 
                      subtext: 'Tax Collected',
                      icon: CheckCircle, 
                      color: 'success' 
                    },
                    { 
                      title: 'Inventory Wastage', 
                      value: `₹${(data.inventoryWastageValue || 0).toLocaleString()}`, 
                      subtext: 'Expired Value',
                      icon: AlertCircle, 
                      color: 'warning' 
                    },
                    { 
                      title: 'Top Staff', 
                      value: data.topStaffName || 'N/A', 
                      subtext: `₹${(data.topStaffSales || 0).toLocaleString()} Sales`,
                      icon: Users, 
                      color: 'primary' 
                    },
                    { 
                      title: 'Customer Satisfaction', 
                      value: `${data.customerSatisfactionScore || 0}/5.0`, 
                      subtext: 'Based on Feedback',
                      icon: Users, 
                      color: 'info' 
                    }
                  ].map((report, i) => (
                    <div key={i} className="d-flex align-items-center p-3 rounded-4 bg-light bg-opacity-50 border border-transparent hover-border-primary transition-all">
                      <div className={`p-2 rounded-3 bg-${report.color}-soft text-${report.color} me-3`}>
                        <report.icon size={18} />
                      </div>
                      <div className="flex-grow-1">
                        <div className="fw-bold small text-dark">{report.title}</div>
                        <div className="d-flex justify-content-between align-items-center pe-2">
                           <span className="tiny-text fw-bold text-dark">{report.value}</span>
                           <span className="tiny-text text-muted">{report.subtext}</span>
                        </div>
                      </div>
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

      <AIAssistant contextData={reportData || {}} contextName={`Reports (${months.find(m => m.value === selectedMonth)?.label} ${selectedYear})`} />
    </div>
  );
};

export default Reports;
