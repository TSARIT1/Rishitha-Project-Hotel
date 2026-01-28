import { useState } from 'react';
import { 
  Briefcase, Search, Plus, MapPin, Clock, Users, 
  CheckCircle, XCircle, Edit, Trash2, Eye, Filter,
  Building, DollarSign, Calendar, X
} from 'lucide-react';
import './Careers.css';

const Careers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [jobs, setJobs] = useState([
    { id: 'JOB-001', title: 'Head Chef', department: 'Kitchen', type: 'Full Time', location: 'Main Branch', salary: '₹45,000 - ₹60,000', status: 'Active', applicants: 12, posted: '2026-01-15' },
    { id: 'JOB-002', title: 'Waitstaff', department: 'Service', type: 'Part Time', location: 'Main Branch', salary: '₹12,000 - ₹15,000', status: 'Active', applicants: 8, posted: '2026-01-18' },
    { id: 'JOB-003', title: 'Restaurant Manager', department: 'Management', type: 'Full Time', location: 'Downtown', salary: '₹50,000 - ₹70,000', status: 'Closed', applicants: 45, posted: '2025-12-20' },
  ]);

  const [newJob, setNewJob] = useState({
    title: '',
    department: 'Kitchen',
    type: 'Full Time',
    location: '',
    salary: '',
    description: '',
    status: 'Active'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewJob(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddJob = (e) => {
    e.preventDefault();
    const id = `JOB-${Math.floor(100 + Math.random() * 900)}`;
    const job = {
      id,
      ...newJob,
      applicants: 0,
      posted: new Date().toISOString().split('T')[0]
    };
    setJobs([job, ...jobs]);
    setIsModalOpen(false);
    setNewJob({
      title: '',
      department: 'Kitchen',
      type: 'Full Time',
      location: '',
      salary: '',
      description: '',
      status: 'Active'
    });
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         job.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container-fluid py-3 careers-page d-flex flex-column" style={{ height: 'calc(100vh - 85px)', overflow: 'hidden' }}>
      
      {/* Header */}
      <div className="row align-items-center mb-4 flex-shrink-0 px-2">
        <div className="col">
          <h1 className="h3 fw-bold mb-0 d-flex align-items-center gap-2">
            <Briefcase size={28} className="text-primary" />
            Careers & Vacancies
          </h1>
          <p className="text-muted small mb-0 fw-medium">Manage job openings and applications</p>
        </div>
        <div className="col-auto">
          <button 
            className="btn btn-primary shadow-sm d-flex align-items-center gap-2 px-4 py-2 fw-semibold rounded-pill"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={18} /> Post New Job
          </button>
        </div>
      </div>

      {/* Filters & Content */}
      <div className="flex-grow-1 overflow-auto custom-thin-scrollbar px-2">
        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-body p-3">
            <div className="row g-3">
              <div className="col-12 col-md-4">
                <div className="input-group border-0 bg-light rounded-pill px-2">
                  <span className="input-group-text bg-transparent border-0 text-muted">
                    <Search size={18} />
                  </span>
                  <input
                    type="text"
                    className="form-control bg-transparent border-0 shadow-none px-0"
                    placeholder="Search jobs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-6 col-md-3">
                <select 
                  className="form-select border-0 bg-light rounded-pill shadow-none fw-semibold ps-4"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Closed</option>
                  <option>Draft</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4">
          {filteredJobs.map((job) => (
            <div key={job.id} className="col-12 col-md-6 col-xl-4">
              <div className="card h-100 border-0 shadow-sm rounded-4 job-card">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <span className={`badge ${job.status === 'Active' ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'} mb-2 rounded-pill px-3`}>
                        {job.status}
                      </span>
                      <h5 className="fw-bold mb-1">{job.title}</h5>
                      <span className="text-muted small d-flex align-items-center gap-1">
                        <Building size={14} /> {job.department}
                      </span>
                    </div>
                    <div className="dropdown">
                      <button className="btn btn-light btn-sm rounded-circle" type="button">
                        <Edit size={16} className="text-muted" />
                      </button>
                    </div>
                  </div>

                  <div className="job-details mb-4">
                    <div className="d-flex align-items-center gap-2 text-muted small mb-2">
                      <MapPin size={16} className="text-primary" /> {job.location}
                    </div>
                    <div className="d-flex align-items-center gap-2 text-muted small mb-2">
                      <Clock size={16} className="text-warning" /> {job.type}
                    </div>
                    <div className="d-flex align-items-center gap-2 text-muted small">
                      <DollarSign size={16} className="text-success" /> {job.salary}
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                    <div className="d-flex align-items-center gap-2">
                      <Users size={18} className="text-info" />
                      <span className="fw-bold text-dark">{job.applicants}</span>
                      <span className="text-muted small">Applicants</span>
                    </div>
                    <small className="text-muted">Posted: {job.posted}</small>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Job Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass-card border-0 shadow-lg p-4" style={{ maxWidth: '600px', width: '100%' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                <Briefcase className="text-primary" size={24} />
                Post New Vacancy
              </h5>
              <button onClick={() => setIsModalOpen(false)} className="btn btn-link text-muted p-0">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAddJob}>
              <div className="mb-3">
                <label className="form-label small fw-bold text-muted text-uppercase ls-1">Job Title</label>
                <input
                  type="text"
                  name="title"
                  className="form-control bg-light border-0 shadow-none fw-semibold"
                  value={newJob.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-bold text-muted text-uppercase ls-1">Department</label>
                  <select
                    name="department"
                    className="form-select bg-light border-0 shadow-none fw-semibold"
                    value={newJob.department}
                    onChange={handleInputChange}
                  >
                    <option>Kitchen</option>
                    <option>Service</option>
                    <option>Management</option>
                    <option>Maintenance</option>
                    <option>Housekeeping</option>
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label small fw-bold text-muted text-uppercase ls-1">Job Type</label>
                  <select
                    name="type"
                    className="form-select bg-light border-0 shadow-none fw-semibold"
                    value={newJob.type}
                    onChange={handleInputChange}
                  >
                    <option>Full Time</option>
                    <option>Part Time</option>
                    <option>Contract</option>
                    <option>Internship</option>
                  </select>
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-bold text-muted text-uppercase ls-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    className="form-control bg-light border-0 shadow-none fw-semibold"
                    value={newJob.location}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-bold text-muted text-uppercase ls-1">Salary Range</label>
                  <input
                    type="text"
                    name="salary"
                    className="form-control bg-light border-0 shadow-none fw-semibold"
                    placeholder="e.g. ₹20k - ₹30k"
                    value={newJob.salary}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold text-muted text-uppercase ls-1">Description</label>
                <textarea
                  name="description"
                  className="form-control bg-light border-0 shadow-none fw-semibold"
                  rows="3"
                  value={newJob.description}
                  onChange={handleInputChange}
                ></textarea>
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
                  className="btn btn-primary fw-semibold px-4 shadow-sm"
                >
                  Post Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Careers;
