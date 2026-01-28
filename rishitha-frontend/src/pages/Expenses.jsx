import { useState } from 'react';
import { 
  DollarSign, PieChart, TrendingDown, AlertCircle, Plus, 
  Download, Search, Filter, Eye, Edit, Trash2, 
  ArrowUpRight, ArrowDownRight, Printer, Wallet, CreditCard,
  Building, ShoppingCart, Users, Zap, X
} from 'lucide-react';
import './Expenses.css';

const Expenses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState('All Status');

  // Sample expense data
  const [expenses, setExpenses] = useState([
    { id: 'EXP-101', date: '2026-01-08', description: 'Fresh Produce (Vegetables)', category: 'Food & Beverage', supplier: 'Metro Wholesale', amount: 1250.00, tax: 62.50, status: 'Paid', method: 'UPI' },
    { id: 'EXP-102', date: '2026-01-07', description: 'Monthly Electricity Bill', category: 'Utilities', supplier: 'State Power Board', amount: 3420.00, tax: 171.00, status: 'Pending', method: 'Bank Transfer' },
    { id: 'EXP-103', date: '2026-01-07', description: 'Kitchen Staff Salary (Partial)', category: 'Staff Salary', supplier: 'Direct Deposit', amount: 15000.00, tax: 0.00, status: 'Paid', method: 'Bank Transfer' },
    { id: 'EXP-104', date: '2026-01-06', description: 'Restaurant Rent - January', category: 'Rent', supplier: 'City Properties Ltd', amount: 45000.00, tax: 0.00, status: 'Paid', method: 'Cheque' },
    { id: 'EXP-105', date: '2026-01-05', description: 'Social Media Ads', category: 'Marketing', supplier: 'Meta Ads', amount: 5400.00, tax: 972.00, status: 'Paid', method: 'Card' },
    { id: 'EXP-106', date: '2026-01-05', description: 'New Blender for Bar', category: 'Maintenance', supplier: 'Kitchen Equip Co.', amount: 8900.00, tax: 1602.00, status: 'Pending', method: 'Bank Transfer' },
    { id: 'EXP-107', date: '2026-01-04', description: 'Cleaning Supplies', category: 'General', supplier: 'Standard Cleaners', amount: 1200.00, tax: 216.00, status: 'Paid', method: 'Cash' },
  ]);

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

  const handleAddExpense = (e) => {
    e.preventDefault();
    const id = `EXP-${Math.floor(108 + Math.random() * 100)}`;
    const expense = {
      id,
      ...newExpense,
      amount: parseFloat(newExpense.amount) || 0,
      tax: parseFloat(newExpense.tax) || 0
    };
    setExpenses([expense, ...expenses]);
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
  };

  const stats = [
    { title: 'Total Expenses', value: '₹79,170', icon: Wallet, color: 'danger', trend: '+12%', trendUp: true },
    { title: 'MTD Spend', value: '₹34,250', icon: TrendingDown, color: 'warning', trend: '-5%', trendUp: false },
    { title: 'Pending Bills', value: '12', icon: AlertCircle, color: 'info', trend: '₹12.4k', trendUp: true },
    { title: 'Top Category', value: 'Food', icon: PieChart, color: 'primary', trend: '42%', trendUp: true },
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
          <button className="btn btn-outline-info shadow-sm d-flex align-items-center gap-2 px-3 py-2 fw-semibold bg-white rounded-pill">
            <Download size={18} /> Export
          </button>
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
              <div className="col-12 col-md-3 col-lg-2 ms-md-auto">
                <button className="btn btn-primary w-100 rounded-pill py-2 d-flex align-items-center justify-content-center gap-2 fw-bold shadow-sm">
                   <Filter size={18} /> Apply Filter
                </button>
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
                       {[
                         { category: 'Food & Beverage', amount: '₹1,25,400', percent: 42, color: 'primary' },
                         { category: 'Staff Salary', amount: '₹85,000', percent: 28, color: 'success' },
                         { category: 'Utilities', amount: '₹42,300', percent: 14, color: 'info' },
                         { category: 'Rent', amount: '₹45,000', percent: 16, color: 'warning' },
                       ].map((item, i) => (
                         <div key={i}>
                            <div className="d-flex justify-content-between align-items-end mb-1">
                               <span className="small fw-bold">{item.category}</span>
                               <span className="tiny-text fw-bold text-muted">{item.amount} ({item.percent}%)</span>
                            </div>
                            <div className="progress rounded-pill shadow-none" style={{ height: '8px' }}>
                               <div className={`progress-bar bg-${item.color} rounded-pill`} style={{ width: `${item.percent}%` }}></div>
                            </div>
                         </div>
                       ))}
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
                        <h3 className="fw-bold text-dark mb-1">₹7.42 Lakh</h3>
                        <p className="text-muted small fw-medium text-uppercase ls-1">Financial Year Total Spend</p>
                        <hr className="my-4 opacity-10" />
                        <div className="d-flex justify-content-around">
                           <div>
                              <div className="h5 fw-bold text-primary mb-0">₹12k</div>
                              <span className="tiny-text text-muted fw-bold">AVG DAILY</span>
                           </div>
                           <div className="vr opacity-10"></div>
                           <div>
                              <div className="h5 fw-bold text-success mb-0">84%</div>
                              <span className="tiny-text text-muted fw-bold">EFFICENCY</span>
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
