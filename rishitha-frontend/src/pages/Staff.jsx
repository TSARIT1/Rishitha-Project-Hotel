import { useState, useEffect } from 'react';
import { 
  Users, UserCheck, UserMinus, DollarSign, Clock, 
  ShieldCheck, Search, Filter, Plus, Download, 
  Eye, Edit, Trash2, Calendar, Phone, Mail,
  CheckCircle, AlertCircle, TrendingUp, Briefcase
} from 'lucide-react';
import './Staff.css';

const Staff = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  
  // Form data for new employee
  const [employeeFormData, setEmployeeFormData] = useState({
    name: '',
    role: 'Server',
    salary: '',
    shifts: '',
    status: 'Active'
  });

  // Staff Data
  const [staffList, setStaffList] = useState([]);
  
  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
        const { default: api } = await import('../api/axiosConfig');
        const response = await api.get('/staff');
        if (response.data.success) {
            setStaffList(response.data.data);
        }
    } catch (error) {
        console.error("Error fetching staff:", error);
    }
  };

  // Dynamic Stats
  const calculateTotalPayroll = () => {
      return staffList.reduce((acc, staff) => {
          // Remove non-numeric characters (₹, ,) to sum
          const salary = parseFloat(staff.salary.replace(/[^0-9.-]+/g,"")) || 0;
          return acc + salary;
      }, 0);
  };

  // Helper to format currency simply
  const formatCurrencySimple = (value) => {
      if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
      return `₹${(value / 1000).toFixed(1)}k`;
  };

  const stats = [
    { title: 'Total Staff', value: staffList.length, icon: Users, color: 'primary', trend: '+2 new' },
    { title: 'Active Staff', value: staffList.filter(s => s.status === 'Active').length, icon: UserCheck, color: 'success', trend: 'Live' }, // Renamed from "Clocked In" as we don't have realtime clock-in yet
    { title: 'On Leave', value: staffList.filter(s => s.status === 'On Leave').length, icon: UserMinus, color: 'warning', trend: '2 paid' },
    { title: 'Monthly Payroll', value: formatCurrencySimple(calculateTotalPayroll()), icon: DollarSign, color: 'info', trend: 'Processing' },
  ];

  const filteredStaff = staffList.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (staff.staffId && staff.staffId.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = roleFilter === 'All Roles' || staff.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getPerformanceBadge = (perf) => {
    switch(perf) {
      case 'excellent': return <span className="badge bg-success-soft text-success border border-success-subtle px-2">Excellent</span>;
      case 'good': return <span className="badge bg-primary-soft text-primary border border-primary-subtle px-2">Good</span>;
      case 'average': return <span className="badge bg-warning-soft text-warning border border-warning-subtle px-2">Average</span>;
      default: return <span className="badge bg-light text-dark px-2">N/A</span>;
    }
  };

  const getStatusPill = (status) => {
    return (
      <span className={`status-pill ${status === 'Active' ? 'type-new' : 'type-vip'} x-small-text fw-bold`}>
        {status}
      </span>
    );
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setIsEditing(false);
    setSelectedStaff(null);
    setShowViewModal(false);
    // Reset form
    setEmployeeFormData({
      name: '',
      role: 'Server',
      salary: '',
      shifts: '',
      status: 'Active'
    });
  };

  const handleEdit = (staff) => {
    setSelectedStaff(staff);
    setEmployeeFormData({
      name: staff.name,
      role: staff.role,
      salary: staff.salary,
      shifts: staff.shifts,
      status: staff.status
    });
    setIsEditing(true);
    setShowAddModal(true);
  };

  const handleView = (staff) => {
    setSelectedStaff(staff);
    setShowViewModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const { default: api } = await import('../api/axiosConfig');
        const response = await api.delete(`/staff/${id}`);
        if (response.data.success) {
           setStaffList(prev => prev.filter(s => s.id !== id));
           alert('Employee deleted successfully');
        }
      } catch (error) {
        console.error("Error deleting staff:", error);
        alert('Failed to delete employee: ' + (error.response?.data?.message || ''));
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployeeFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitEmployee = async (e) => {
    e.preventDefault();
    
    // Create new employee payload
    const newEmployee = {
      name: employeeFormData.name,
      role: employeeFormData.role,
      status: employeeFormData.status,
      shifts: employeeFormData.shifts,
      salary: employeeFormData.salary,
      attendance: isEditing ? selectedStaff.attendance : '0%',
      performance: isEditing ? selectedStaff.performance : 'average'
    };

    try {
        const { default: api } = await import('../api/axiosConfig');
        let response;
        if (isEditing && selectedStaff) {
            response = await api.put(`/staff/${selectedStaff.id}`, newEmployee);
        } else {
            response = await api.post('/staff', newEmployee);
        }
        
        if (response.data.success) {
            if (isEditing) {
                setStaffList(prev => prev.map(s => s.id === selectedStaff.id ? response.data.data : s));
                alert('Employee updated successfully!');
            } else {
                setStaffList(prev => [...prev, response.data.data]);
                alert('Employee added successfully!');
            }
            handleCloseModal();
        }
    } catch (error) {
        console.error("Error saving employee:", error);
        alert('Failed to save employee. ' + (error.response?.data?.message || ''));
    }
  };

  return (
    <div className="container-fluid py-3 staff-bootstrap-page d-flex flex-column" style={{ height: 'calc(100vh - 85px)', overflow: 'hidden' }}>
      
      {/* Page Header */}
      <div className="row align-items-center mb-3 flex-shrink-0 px-2">
        <div className="col">
          <h1 className="h3 fw-bold mb-0 d-flex align-items-center gap-2">
            <ShieldCheck size={28} className="text-primary" />
            Staff Management
          </h1>
          <p className="text-muted small mb-0 fw-medium">Manage records, payroll, and performance</p>
        </div>
        <div className="col-auto d-flex gap-2">
          <button className="btn btn-outline-primary shadow-sm d-flex align-items-center gap-2 px-3 py-2 fw-semibold bg-white rounded-pill border-0">
            <Download size={18} /> Export
          </button>
          <button 
            className="btn btn-primary shadow-sm d-flex align-items-center gap-2 px-3 py-2 fw-semibold rounded-pill"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={18} /> Add Employee
          </button>
        </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }} onClick={handleCloseModal}>
          <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-primary text-white border-0">
                <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                  <Plus size={24} />
                  {isEditing ? 'Edit Employee' : 'Add New Employee'}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={handleCloseModal}></button>
              </div>
              <form onSubmit={handleSubmitEmployee}>
                <div className="modal-body p-4">
                  <div className="row g-4">
                    {/* Employee Information */}
                    <div className="col-12">
                      <h6 className="fw-bold text-muted mb-3 d-flex align-items-center gap-2">
                        <Users size={18} />
                        Employee Information
                      </h6>
                    </div>
                    
                    <div className="col-md-6">
                      <label className="form-label fw-bold small text-muted text-uppercase">Full Name *</label>
                      <input
                        type="text"
                        className="form-control rounded-pill px-3"
                        name="name"
                        value={employeeFormData.name}
                        onChange={handleInputChange}
                        placeholder="e.g., Arjun Mehra"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold small text-muted text-uppercase">Role/Position *</label>
                      <select
                        className="form-select rounded-pill px-3"
                        name="role"
                        value={employeeFormData.role}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="Server">Server</option>
                        <option value="Head Chef">Head Chef</option>
                        <option value="Manager">Manager</option>
                        <option value="Receptionist">Receptionist</option>
                        <option value="Sous Chef">Sous Chef</option>
                        <option value="Shift Lead">Shift Lead</option>
                      </select>
                    </div>

                    {/* Employment Details */}
                    <div className="col-12 mt-4">
                      <h6 className="fw-bold text-muted mb-3">Employment Details</h6>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold small text-muted text-uppercase">Monthly Salary *</label>
                      <input
                        type="text"
                        className="form-control rounded-pill px-3"
                        name="salary"
                        value={employeeFormData.salary}
                        onChange={handleInputChange}
                        placeholder="e.g., ₹25,000"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold small text-muted text-uppercase">Work Shift *</label>
                      <input
                        type="text"
                        className="form-control rounded-pill px-3"
                        name="shifts"
                        value={employeeFormData.shifts}
                        onChange={handleInputChange}
                        placeholder="e.g., 9 AM - 5 PM"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold small text-muted text-uppercase">Employment Status *</label>
                      <select
                        className="form-select rounded-pill px-3"
                        name="status"
                        value={employeeFormData.status}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="Active">Active</option>
                        <option value="On Leave">On Leave</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>

                    {/* Info Alert */}
                    <div className="col-12 mt-3">
                      <div className="alert alert-info mb-0 d-flex align-items-start gap-2">
                        <ShieldCheck size={16} className="mt-1" />
                        <div className="small">
                          New employees will start with 0% attendance and average performance rating.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light rounded-pill px-4 fw-bold" onClick={handleCloseModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary rounded-pill px-4 fw-bold d-flex align-items-center gap-2">
                    <Plus size={18} />
                    {isEditing ? 'Update Employee' : 'Add Employee'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Staff Modal */}
      {showViewModal && selectedStaff && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }} onClick={handleCloseModal}>
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-info text-white border-0">
                <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                  <Eye size={24} />
                  Staff Details
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body p-4">
                 <div className="d-flex align-items-center mb-4">
                    <div className="bg-primary-soft text-primary rounded-circle p-3 me-3">
                       <Users size={32} />
                    </div>
                    <div>
                       <h5 className="fw-bold mb-1">{selectedStaff.name}</h5>
                       <div className="text-muted small">{selectedStaff.role} • {selectedStaff.staffId || selectedStaff.id}</div>
                    </div>
                    <div className="ms-auto">
                       {getStatusPill(selectedStaff.status)}
                    </div>
                 </div>
                 
                 <div className="row g-3">
                    <div className="col-6">
                       <div className="p-3 bg-light rounded-3 border">
                          <small className="text-muted fw-bold d-block text-uppercase mb-1">Salary</small>
                          <span className="fw-bold text-dark">{selectedStaff.salary}</span>
                       </div>
                    </div>
                    <div className="col-6">
                       <div className="p-3 bg-light rounded-3 border">
                          <small className="text-muted fw-bold d-block text-uppercase mb-1">Shift</small>
                          <span className="fw-bold text-dark">{selectedStaff.shifts}</span>
                       </div>
                    </div>
                    <div className="col-6">
                       <div className="p-3 bg-light rounded-3 border">
                          <small className="text-muted fw-bold d-block text-uppercase mb-1">Attendance</small>
                          <span className="fw-bold text-success">{selectedStaff.attendance}</span>
                       </div>
                    </div>
                    <div className="col-6">
                       <div className="p-3 bg-light rounded-3 border">
                          <small className="text-muted fw-bold d-block text-uppercase mb-1">Performance</small>
                          <span className="fw-bold text-primary">{selectedStaff.performance}</span>
                       </div>
                    </div>
                 </div>
              </div>
              <div className="modal-footer border-0 p-4 pt-0">
                <button type="button" className="btn btn-light rounded-pill px-4 fw-bold" onClick={handleCloseModal}>
                  Close
                </button>
                <button type="button" className="btn btn-primary rounded-pill px-4 fw-bold d-flex align-items-center gap-2" onClick={() => { setShowViewModal(false); handleEdit(selectedStaff); }}>
                  <Edit size={18} /> Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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
                      <span className={`tiny-text fw-bold text-${stat.color}`}>{stat.trend}</span>
                    </div>
                    <h4 className="fw-bold mb-0">{stat.value}</h4>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Directory Card */}
        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-header bg-white border-bottom-0 py-4 px-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
              <Briefcase size={20} className="text-primary" />
              Staff Directory
            </h5>
            <div className="d-flex gap-2 flex-grow-1 flex-md-grow-0" style={{ maxWidth: '600px' }}>
              <div className="input-group border-0 bg-light rounded-pill px-3 py-1 flex-grow-1">
                <span className="input-group-text bg-transparent border-0 text-muted">
                  <Search size={18} />
                </span>
                <input
                  type="text"
                  className="form-control bg-transparent border-0 shadow-none px-0"
                  placeholder="Search by name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select 
                className="form-select border-0 bg-light rounded-pill px-3 shadow-none fw-semibold small" 
                style={{ width: 'auto' }}
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option>All Roles</option>
                <option>Head Chef</option>
                <option>Manager</option>
                <option>Server</option>
                <option>Receptionist</option>
                <option>Sous Chef</option>
              </select>
            </div>
          </div>
          
          <div className="table-responsive px-4 pb-4 custom-thin-scrollbar" style={{ minHeight: '350px' }}>
            <table className="table table-hover align-middle mb-0 staff-table-modern">
              <thead className="table-light sticky-top z-1">
                <tr>
                  <th className="ps-0 py-3">STAFF ID</th>
                  <th className="py-3">MEMBER NAME</th>
                  <th className="py-3">ROLE</th>
                  <th className="py-3 text-center">STATUS</th>
                  <th className="py-3">WORK SHIFT</th>
                  <th className="py-3">SALARY</th>
                  <th className="py-3">ATTENDANCE</th>
                  <th className="py-3 text-center">RATING</th>
                  <th className="pe-0 py-3 text-end">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.map((staff) => (
                  <tr key={staff.id}>
                    <td className="ps-0">
                      <span className="badge bg-primary-soft text-primary fw-bold p-2 px-3 border border-primary-subtle rounded-pill">
                        #{staff.staffId || staff.id}
                      </span>
                    </td>
                    <td>
                      <div className="fw-bold text-dark">{staff.name}</div>
                      <div className="tiny-text text-muted">Joined 12 Mar 2024</div>
                    </td>
                    <td className="fw-semibold text-muted small">{staff.role}</td>
                    <td className="text-center">
                      {getStatusPill(staff.status)}
                    </td>
                    <td className="small text-muted">{staff.shifts}</td>
                    <td className="fw-bold text-dark">{staff.salary}</td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="progress flex-grow-1 rounded-pill" style={{ height: '6px', maxWidth: '60px' }}>
                          <div className="progress-bar bg-success rounded-pill" style={{ width: staff.attendance }}></div>
                        </div>
                        <span className="tiny-text fw-bold">{staff.attendance}</span>
                      </div>
                    </td>
                    <td className="text-center">
                      {getPerformanceBadge(staff.performance)}
                    </td>
                    <td className="pe-0 text-end">
                      <div className="btn-group btn-group-sm">
                        <button className="btn btn-action-square text-info" title="View" onClick={() => handleView(staff)}><Eye size={14}/></button>
                        <button className="btn btn-action-square text-primary" title="Edit" onClick={() => handleEdit(staff)}><Edit size={14}/></button>
                        <button className="btn btn-action-square text-danger" title="Delete" onClick={() => handleDelete(staff.id)}><Trash2 size={14}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Attendance & Payroll Row */}
        <div className="row g-4 mb-4">
          <div className="col-12 col-xl-7">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-header bg-white border-bottom-0 py-4 px-4 d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                  <Clock size={20} className="text-primary" />
                  Today's Attendance Tracking
                </h5>
                <span className="tiny-text fw-bold text-muted text-uppercase">Jan 10, 2026</span>
              </div>
              <div className="card-body p-4 pt-0">
                <div className="row g-3">
                  {[
                    { label: 'Clocked In', count: staffList.filter(s => s.status === 'Active').length, icon: UserCheck, color: 'success' },
                    { label: 'Late Arrival', count: 0, icon: Clock, color: 'warning' }, // Placeholder
                    { label: 'Absent/Leave', count: staffList.filter(s => s.status === 'On Leave').length, icon: UserMinus, color: 'danger' },
                    { label: 'Upcoming Shift', count: staffList.filter(s => s.shifts && s.shifts.includes('PM')).length, icon: Calendar, color: 'info' } // Rough estimate
                  ].map((item, i) => (
                    <div key={i} className="col-6 col-sm-3">
                      <div className="text-center p-3 rounded-4 bg-light hover-lift transition-all">
                        <item.icon className={`text-${item.color} mb-2`} size={20} />
                        <h5 className="fw-bold mb-0">{item.count}</h5>
                        <p className="tiny-text text-muted fw-bold mb-0">{item.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-primary-soft rounded-4 border border-primary-subtle d-flex align-items-center justify-content-between">
                  <div>
                    <span className="fw-bold text-primary small d-block">Shift Distribution</span>
                    <span className="tiny-text text-muted">Next major shift starts in 2 hours</span>
                  </div>
                  <button className="btn btn-primary btn-sm rounded-pill px-3 fw-bold">Manage Schedule</button>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-xl-5">
            <div className="card border-0 shadow-sm rounded-4 h-100 analytics-card-bg">
              <div className="card-header bg-transparent border-bottom-0 py-4 px-4 d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                  <TrendingUp size={20} className="text-success" />
                  Payroll Insights
                </h5>
              </div>
              <div className="card-body p-4 pt-1">
                <div className="p-3 bg-white bg-opacity-75 rounded-4 border border-white mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="small fw-bold text-muted">Current Month Payroll</span>
                    <span className="badge bg-success-soft text-success rounded-pill px-3">On Time</span>
                  </div>
                  <h3 className="fw-bold mb-1">₹4,25,000</h3>
                  <div className="progress rounded-pill shadow-none mb-2" style={{ height: '6px' }}>
                    <div className="progress-bar bg-success" style={{ width: '85%' }}></div>
                  </div>
                  <div className="d-flex justify-content-between tiny-text fw-bold text-muted">
                    <span>Processed: ₹3.6L</span>
                    <span>Remaining: ₹65k</span>
                  </div>
                </div>
                <div className="vstack gap-2">
                  <div className="d-flex justify-content-between align-items-center p-2 small">
                    <span className="text-muted fw-medium">Fixed Salaries</span>
                    <span className="fw-bold">₹3.80L</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center p-2 small">
                    <span className="text-muted fw-medium">Incentives & Bonus</span>
                    <span className="fw-bold text-success">+₹45k</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center p-2 small border-top pt-2 mt-1">
                    <span className="fw-bold">Total Payout</span>
                    <span className="fw-bold h6 mb-0 text-primary">₹4.25L</span>
                  </div>
                </div>
                <button className="btn btn-outline-info w-100 rounded-pill mt-3 fw-bold btn-sm border-0 bg-white shadow-sm py-2">
                   View Full Payroll Report
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Staff;
