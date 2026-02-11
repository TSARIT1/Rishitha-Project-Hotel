import { useState, useEffect } from 'react';
import { 
  DollarSign, PieChart, TrendingDown, AlertCircle, Plus, 
  Search, Filter, Eye, Edit, Trash2, 
  ArrowUpRight, ArrowDownRight, Printer, Wallet, CreditCard,
  Building, ShoppingCart, Users, Zap, X
} from 'lucide-react';
import './Expenses.css';

const Expenses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState('All Status');

  // Sample expense data
  // Sample expense data
  // Sample expense data
  const [expenses, setExpenses] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    total: 0, 
    mtd: 0, 
    pendingCount: 0, 
    pendingValue: 0, 
    topCategory: 'N/A', 
    topCategoryPercent: 0,
    avgDaily: 0,
    efficiency: 100
  });
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const calculateStats = (data) => {
     const total = data.reduce((sum, item) => sum + (item.amount || 0), 0);
     
     // MTD calculation (simple current month check)
     const currentMonth = new Date().getMonth();
     const mtd = data.filter(item => new Date(item.date).getMonth() === currentMonth)
                     .reduce((sum, item) => sum + (item.amount || 0), 0);

     // Pending
     const pendingItems = data.filter(item => item.status === 'Pending');
     const pendingCount = pendingItems.length;
     const pendingValue = pendingItems.reduce((sum, item) => sum + (item.amount || 0), 0);

     // Categories
     const catMap = {};
     data.forEach(item => {
        catMap[item.category] = (catMap[item.category] || 0) + item.amount;
     });
     
     const sortedCats = Object.entries(catMap)
       .map(([cat, amount]) => ({ 
          category: cat, 
          amount, 
          percent: total ? Math.round((amount/total)*100) : 0,
          color: ['primary', 'success', 'info', 'warning', 'danger'][Math.floor(Math.random() * 5)] // Assign random color for now or map specific
       }))
       .sort((a, b) => b.amount - a.amount);

     const topCat = sortedCats.length > 0 ? sortedCats[0].category : 'N/A';
     const topCatPercent = sortedCats.length > 0 ? sortedCats[0].percent : 0;

     // Calculate Avg Daily (Total / Days since first expense or 1)
     const dates = data.map(item => new Date(item.date).getTime());
     const minDate = dates.length > 0 ? Math.min(...dates) : Date.now();
     const daysPassed = Math.max(1, Math.ceil((Date.now() - minDate) / (1000 * 60 * 60 * 24)));
     const avgDaily = total / daysPassed;

     // Calculate Efficiency (Settlement Rate: Paid / Total)
     const totalPaid = data.filter(item => item.status === 'Paid').reduce((sum, item) => sum + (item.amount || 0), 0);
     const efficiency = total > 0 ? Math.round((totalPaid / total) * 100) : 100;
     
     setDashboardStats({ 
        total, mtd, pendingCount, pendingValue, 
        topCategory: topCat, topCategoryPercent: topCatPercent,
        avgDaily, efficiency
     });
     setCategoryBreakdown(sortedCats);
  };

  const fetchExpenses = async () => {
    try {
      const { default: api } = await import('../services/api');
      const response = await api.get('/expenses');
      if (response.data.success) {
        // Map backend fields to frontend expected structure
        const mappedExpenses = response.data.data.map(exp => ({
          ...exp,
          id: `EXP-${exp.id}`, // Display ID format
        }));
        setExpenses(mappedExpenses);
        calculateStats(mappedExpenses);
      }
    } catch (error) {
       console.error("Failed to fetch expenses", error);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({
    description: '',
    category: 'Food & Beverage',
    supplier: '',
    amount: '',
    tax: '',
    status: 'Pending',
    method: 'Cash',
    date: new Date().toISOString().split('T')[0]
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExpense(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      const { default: api } = await import('../services/api');
      const payload = {
        ...newExpense,
        amount: parseFloat(newExpense.amount) || 0,
        tax: parseFloat(newExpense.tax) || 0
      };
      
      const response = await api.post('/expenses', payload);
      
      if (response.data.success) {
        setIsModalOpen(false);
        setNewExpense({
          description: '',
          category: 'Food & Beverage',
          supplier: '',
          amount: '',
          tax: '',
          status: 'Pending',
          method: 'Cash',
          date: new Date().toISOString().split('T')[0]
        });
        fetchExpenses(); // Refresh list and stats
      }
    } catch (error) {
       console.error("Error adding expense", error);
       alert("Failed to save expense");
    }
  };

  const stats = [
    { title: 'Total Expenses', value: `₹${dashboardStats.total.toLocaleString()}`, icon: Wallet, color: 'danger', trend: 'Yearly', trendUp: true },
    { title: 'MTD Spend', value: `₹${dashboardStats.mtd.toLocaleString()}`, icon: TrendingDown, color: 'warning', trend: 'Current Month', trendUp: false },
    { title: 'Pending Bills', value: dashboardStats.pendingCount, icon: AlertCircle, color: 'info', trend: `₹${(dashboardStats.pendingValue/1000).toFixed(1)}k`, trendUp: true },
    { title: 'Top Category', value: dashboardStats.topCategory, icon: PieChart, color: 'primary', trend: `${dashboardStats.topCategoryPercent}%`, trendUp: true },
  ];

  const categories = ['All Categories', 'Food & Beverage', 'Staff Salary', 'Utilities', 'Rent', 'Marketing', 'Maintenance', 'General'];
  const statuses = ['All Status', 'Paid', 'Pending', 'Partial'];

  const filteredExpenses = expenses.filter(exp => {
    const matchesSearch = exp.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         exp.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exp.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All Categories' || exp.category === categoryFilter;
    const matchesStatus = statusFilter === 'All Status' || exp.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="container-fluid py-3 expenses-bootstrap-page d-flex flex-column" style={{ height: 'calc(100vh - 85px)', overflow: 'hidden' }}>
      
      {/* Page Header */}
      <div className="row align-items-center mb-3 flex-shrink-0 px-2">
        <div className="col">
          <h1 className="h3 fw-bold mb-0 d-flex align-items-center gap-2">
            <DollarSign size={28} className="text-danger" />
            Expense Management
          </h1>
          <p className="text-muted small mb-0 fw-medium">Track and categorize your restaurant spending</p>
        </div>
        <div className="col-auto d-flex gap-2">

          <button 
            className="btn btn-danger-custom shadow-sm d-flex align-items-center gap-2 px-3 py-2 fw-semibold rounded-pill"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={18} /> Add Expense
          </button>
        </div>
      </div>

      {/* Main Scrollable Content */}
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
                        <span className="tiny-text text-danger fw-bold d-flex align-items-center"><ArrowUpRight size={12}/>{stat.trend}</span> :
                        <span className="tiny-text text-success fw-bold d-flex align-items-center"><ArrowDownRight size={12}/>{stat.trend}</span>
                      }
                    </div>
                    <h4 className="fw-bold mb-0">{stat.value}</h4>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filter Section Card */}
        <div className="card border-0 shadow-sm rounded-4 mb-3">
          <div className="card-body p-3">
            <div className="row g-2 align-items-end">
              <div className="col-12 col-lg-4">
                <label className="tiny-text fw-bold text-muted text-uppercase mb-1 ms-1">Search Records</label>
                <div className="input-group border-0 bg-light rounded-pill px-2">
                  <span className="input-group-text bg-transparent border-0 text-muted">
                    <Search size={18} />
                  </span>
                  <input
                    type="text"
                    className="form-control bg-transparent border-0 shadow-none px-0"
                    placeholder="Search by description or supplier..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-6 col-md-3 col-lg-2">
                <label className="tiny-text fw-bold text-muted text-uppercase mb-1 ms-1">Category</label>
                <select className="form-select border-0 bg-light rounded-3 shadow-none fw-semibold small" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                   {categories.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="col-6 col-md-3 col-lg-2">
                <label className="tiny-text fw-bold text-muted text-uppercase mb-1 ms-1">Status</label>
                <select className="form-select border-0 bg-light rounded-3 shadow-none fw-semibold small" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                   {statuses.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>

            </div>
          </div>
        </div>

        {/* Expense List Table Card */}
        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-header bg-white border-bottom-0 py-3 px-4 d-flex justify-content-between align-items-center">
            <h5 className="fw-bold mb-0">Expense Records</h5>
            <span className="badge bg-light text-dark border px-3 py-2 fw-medium">
               Matching: {filteredExpenses.length} entries
            </span>
          </div>
          
          <div className="table-responsive px-4 pb-4 custom-thin-scrollbar" style={{ minHeight: '350px' }}>
            <table className="table table-hover align-middle mb-0 expense-table-modern">
              <thead className="table-light sticky-top z-1">
                <tr>
                  <th className="ps-0 py-3">ID</th>
                  <th className="py-3">Date</th>
                  <th className="py-3">Description</th>
                  <th className="py-3">Category</th>
                  <th className="py-3">Supplier</th>
                  <th className="py-3 text-end">Amount</th>
                  <th className="py-3 text-center">Status</th>
                  <th className="py-3 text-center">Method</th>
                  <th className="pe-4 py-3 text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((exp) => (
                  <tr key={exp.id}>
                    <td className="ps-0">
                      <span className="badge bg-danger-soft text-danger fw-bold border border-danger-subtle px-3 py-2 rounded-pill">
                        #{exp.id}
                      </span>
                    </td>
                    <td className="small fw-bold text-muted">{new Date(exp.date).toLocaleDateString()}</td>
                    <td className="fw-bold text-dark">{exp.description}</td>
                    <td><span className="tiny-text fw-bold text-uppercase ls-1 px-2 py-1 rounded bg-info-soft text-info">{exp.category}</span></td>
                    <td className="small text-muted fw-medium">{exp.supplier}</td>
                    <td className="text-end fw-bold">₹{exp.amount.toLocaleString()}</td>
                    <td className="text-center">
                      <span className={`status-pill ${exp.status === 'Paid' ? 'type-new' : 'type-vip'} x-small-text fw-bold`}>
                        {exp.status}
                      </span>
                    </td>
                    <td className="text-center">
                      <span className="badge bg-light text-dark fw-semibold border px-3">{exp.method}</span>
                    </td>
                    <td className="pe-0 text-end">
                      <div className="btn-group btn-group-sm">
                        <button className="btn btn-action-square text-info" title="View"><Eye size={14}/></button>
                        <button className="btn btn-action-square text-primary" title="Edit"><Edit size={14}/></button>
                        <button className="btn btn-action-square text-danger" title="Delete"><Trash2 size={14}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Analytics Breakdown Row */}
        <div className="row g-4 mb-4">
           <div className="col-12 col-lg-7">
              <div className="card border-0 shadow-sm rounded-4 h-100">
                 <div className="card-header bg-white border-bottom-0 py-4 px-4">
                    <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                       <PieChart size={20} className="text-primary" />
                       Spending by Category
                    </h5>
                 </div>
                 <div className="card-body px-4 pt-1 pb-4">
                    <div className="vstack gap-3">
                       {categoryBreakdown.length > 0 ? categoryBreakdown.slice(0, 5).map((item, i) => (
                         <div key={i}>
                            <div className="d-flex justify-content-between align-items-end mb-1">
                               <span className="small fw-bold">{item.category}</span>
                               <span className="tiny-text fw-bold text-muted">₹{item.amount.toLocaleString()} ({item.percent}%)</span>
                            </div>
                            <div className="progress rounded-pill shadow-none" style={{ height: '8px' }}>
                               <div className={`progress-bar bg-${item.color || 'primary'} rounded-pill`} style={{ width: `${item.percent}%` }}></div>
                            </div>
                         </div>
                       )) : <p className="text-muted small text-center my-4">No expense data available</p>}
                    </div>
                 </div>
              </div>
           </div>

           <div className="col-12 col-lg-5">
              <div className="card border-0 shadow-sm rounded-4 h-100 analytics-card-bg">
                 <div className="card-header bg-transparent border-bottom-0 py-4 px-4">
                    <h5 className="fw-bold mb-0">System Summary</h5>
                 </div>
                 <div className="card-body p-4 text-center">
                    <div className="p-4 bg-white bg-opacity-75 rounded-4 shadow-sm border border-white">
                        <Wallet size={48} className="text-danger mb-3 opacity-75" />
                        <h3 className="fw-bold text-dark mb-1">₹{(dashboardStats.total / 100000).toFixed(2)} Lakh</h3>
                        <p className="text-muted small fw-medium text-uppercase ls-1">Financial Year Total Spend</p>
                        <hr className="my-4 opacity-10" />
                        <div className="d-flex justify-content-around">
                           <div>
                              <div className="h5 fw-bold text-primary mb-0">₹{Math.round(dashboardStats.avgDaily).toLocaleString()}</div>
                              <span className="tiny-text text-muted fw-bold">AVG DAILY</span>
                           </div>
                           <div className="vr opacity-10"></div>
                           <div>
                              <div className="h5 fw-bold text-success mb-0">{dashboardStats.efficiency}%</div>
                              <span className="tiny-text text-muted fw-bold">EFFICIENCY</span>
                           </div>
                        </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

      </div>

      {/* Add Expense Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass-card border-0 shadow-lg p-4" style={{ maxWidth: '600px', width: '100%' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                <DollarSign className="text-danger" size={24} />
                Add New Expense
              </h5>
              <button onClick={() => setIsModalOpen(false)} className="btn btn-link text-muted p-0">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAddExpense}>
              <div className="mb-3">
                <label className="form-label small fw-bold text-muted text-uppercase ls-1">Description</label>
                <input
                  type="text"
                  name="description"
                  className="form-control bg-light border-0 shadow-none fw-semibold"
                  value={newExpense.description}
                  onChange={handleInputChange}
                  placeholder="e.g. Weekly Supplies"
                  required
                />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-bold text-muted text-uppercase ls-1">Category</label>
                  <select
                    name="category"
                    className="form-select bg-light border-0 shadow-none fw-semibold"
                    value={newExpense.category}
                    onChange={handleInputChange}
                  >
                    {categories.filter(c => c !== 'All Categories').map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label small fw-bold text-muted text-uppercase ls-1">Supplier</label>
                  <input
                    type="text"
                    name="supplier"
                    className="form-control bg-light border-0 shadow-none fw-semibold"
                    value={newExpense.supplier}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-bold text-muted text-uppercase ls-1">Amount (₹)</label>
                  <input
                    type="number"
                    name="amount"
                    className="form-control bg-light border-0 shadow-none fw-semibold"
                    value={newExpense.amount}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-bold text-muted text-uppercase ls-1">Tax Amount (₹)</label>
                  <input
                    type="number"
                    name="tax"
                    className="form-control bg-light border-0 shadow-none fw-semibold"
                    value={newExpense.tax}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-4">
                  <label className="form-label small fw-bold text-muted text-uppercase ls-1">Status</label>
                  <select
                    name="status"
                    className="form-select bg-light border-0 shadow-none fw-semibold"
                    value={newExpense.status}
                    onChange={handleInputChange}
                  >
                    <option>Pending</option>
                    <option>Paid</option>
                    <option>Partial</option>
                  </select>
                </div>
                <div className="col-4">
                  <label className="form-label small fw-bold text-muted text-uppercase ls-1">Payment Method</label>
                  <select
                    name="method"
                    className="form-select bg-light border-0 shadow-none fw-semibold"
                    value={newExpense.method}
                    onChange={handleInputChange}
                  >
                    <option>Cash</option>
                    <option>Card</option>
                    <option>UPI</option>
                    <option>Bank Transfer</option>
                    <option>Cheque</option>
                  </select>
                </div>
                <div className="col-4">
                  <label className="form-label small fw-bold text-muted text-uppercase ls-1">Date</label>
                  <input
                    type="date"
                    name="date"
                    className="form-control bg-light border-0 shadow-none fw-semibold"
                    value={newExpense.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="d-flex gap-2 justify-content-end">
                <button 
                  type="button" 
                  className="btn btn-light border-0 fw-semibold px-4"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-danger-custom fw-semibold px-4 shadow-sm"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;
