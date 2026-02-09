import { useState, useEffect } from 'react';
import { 
  Briefcase, Search, Plus, MapPin, Clock, Users, 
  CheckCircle, XCircle, Edit, Trash2, Eye, Filter,
  Building, DollarSign, Calendar, X, Upload, FileText
} from 'lucide-react';
import './Careers.css';

const Careers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [activeTab, setActiveTab] = useState('jobs'); // 'jobs' or 'applications'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [applicationData, setApplicationData] = useState({
    fullName: '',
    email: '',
    phone: '',
    education: '',
    address: '',
    resume: null
  });

  // Fetch Jobs
  const fetchJobs = async () => {
    try {
      const { default: api } = await import('../services/api');
      const response = await api.get('/jobs');
      if (response.data.success) {
        setJobs(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  useEffect(() => {
    fetchJobs();
    if(activeTab === 'applications') {
        fetchApplications();
    }
  }, [activeTab]);

  const fetchApplications = async () => {
      try {
          const { default: api } = await import('../services/api');
          const response = await api.get('/candidates');
          if(response.data.success) {
              setApplications(response.data.data);
          }
      } catch (error) {
          console.error("Error fetching applications", error);
      }
  };

  const [jobs, setJobs] = useState([]);

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

  const handleAddJob = async (e) => {
    e.preventDefault();
    try {
      const { default: api } = await import('../services/api');
      const response = await api.post('/jobs', newJob);
      if (response.data.success) {
        alert('Job posted successfully!');
        setJobs([response.data.data, ...jobs]);
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
      }
    } catch (error) {
      console.error('Error positing job:', error);
      alert('Failed to post job');
    }
  };

  const handleDeleteJob = async (id) => {
      if(!window.confirm("Are you sure you want to delete this job?")) return;
      try {
          const { default: api } = await import('../services/api');
          await api.delete(`/jobs/${id}`);
          setJobs(jobs.filter(job => job.id !== id));
      } catch (error) {
          console.error("Error deleting job", error);
      }
  };

  const handleApplyClick = (job) => {
    console.log("Apply Now Clicked for:", job);
    setSelectedJob(job);
    setIsApplyModalOpen(true);
  };

  const handleAppChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'resume') {
        setApplicationData(prev => ({ ...prev, resume: files[0] }));
    } else {
        setApplicationData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAppSubmit = async (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append('fullName', applicationData.fullName);
      formData.append('email', applicationData.email);
      formData.append('phone', applicationData.phone);
      formData.append('education', applicationData.education);
      formData.append('address', applicationData.address);
      formData.append('jobTitle', selectedJob.title);
      formData.append('resume', applicationData.resume);

      try {
          const { default: api } = await import('../services/api');
          const response = await api.post('/candidates/apply', formData);
          if(response.data.success) {
              alert('Application submitted successfully!');
              setIsApplyModalOpen(false);
              setApplicationData({ fullName: '', email: '', phone: '', education: '', address: '', resume: null });
              if(activeTab === 'applications') fetchApplications();
          }
      } catch (error) {
          console.error("Application failed", error);
          alert("Failed to submit application");
      }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         job.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
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


          
          {/* Tabs */}
          <div className="d-flex gap-3 mb-4">
              <button 
                  className={`btn rounded-pill px-4 fw-semibold ${activeTab === 'jobs' ? 'btn-primary' : 'btn-light text-muted'}`}
                  onClick={() => setActiveTab('jobs')}
              >
                  Job Openings
              </button>
              <button 
                  className={`btn rounded-pill px-4 fw-semibold ${activeTab === 'applications' ? 'btn-primary' : 'btn-light text-muted'}`}
                  onClick={() => setActiveTab('applications')}
              >
                  Applications
              </button>
          </div>

          {activeTab === 'jobs' ? (
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
                            <button 
                              className="btn btn-light btn-sm rounded-circle" 
                              type="button"
                              onClick={() => handleDeleteJob(job.id)}
                            >
                              <Trash2 size={16} className="text-danger" />
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
                            <button 
                              className="btn btn-danger w-100 rounded-pill px-3 shadow-sm"
                              onClick={() => handleApplyClick(job)}
                            >
                              Apply Now
                            </button>
                          </div>
                          <small className="text-muted">Posted: {job.posted}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
          ) : (
              <div className="card border-0 shadow-sm rounded-4">
                  <div className="card-body p-0">
                      <div className="table-responsive">
                          <table className="table table-hover align-middle mb-0">
                              <thead className="bg-light">
                                  <tr>
                                      <th className="border-0 px-4 py-3 text-secondary small text-uppercase">Candidate</th>
                                      <th className="border-0 px-4 py-3 text-secondary small text-uppercase">Role</th>
                                      <th className="border-0 px-4 py-3 text-secondary small text-uppercase">Contact</th>
                                      <th className="border-0 px-4 py-3 text-secondary small text-uppercase">Education</th>
                                      <th className="border-0 px-4 py-3 text-secondary small text-uppercase">Resume</th>
                                      <th className="border-0 px-4 py-3 text-secondary small text-uppercase">Status</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  {applications.length > 0 ? applications.map(app => (
                                      <tr key={app.id}>
                                          <td className="px-4 py-3">
                                              <div className="fw-bold text-dark">{app.fullName}</div>
                                              <small className="text-muted">{app.address}</small>
                                          </td>
                                          <td className="px-4 py-3">
                                              <span className="badge bg-primary-subtle text-primary rounded-pill px-3">
                                                  {app.jobTitle}
                                              </span>
                                          </td>
                                          <td className="px-4 py-3">
                                              <div className="d-flex flex-column">
                                                  <small className="text-muted mb-1"><span className="fw-medium text-dark">Email:</span> {app.email}</small>
                                                  <small className="text-muted"><span className="fw-medium text-dark">Phone:</span> {app.phone}</small>
                                              </div>
                                          </td>
                                          <td className="px-4 py-3 text-muted small" style={{maxWidth: '200px'}}>
                                              {app.education}
                                          </td>
                                          <td className="px-4 py-3">
                                              <div className="d-flex align-items-center gap-2">
                                                  <FileText size={16} className="text-primary" />
                                                  {app.resumePath ? (
                                                      <a 
                                                          href={`http://localhost:8080/api/candidates/download/${app.resumePath}`} 
                                                          className="small text-decoration-underline text-primary"
                                                          download // HTML5 download attribute as a hint
                                                      >
                                                          {app.resumePath.split('_').length > 2 ? app.resumePath.split('_').slice(2).join('_') : app.resumePath.split('_').pop()}
                                                      </a>
                                                  ) : (
                                                      <span className="small text-muted">No Resume</span>
                                                  )}
                                              </div>
                                          </td>
                                          <td className="px-4 py-3">
                                              <span className="badge bg-warning-subtle text-warning rounded-pill px-3">
                                                  {app.status}
                                              </span>
                                          </td>
                                      </tr>
                                  )) : (
                                      <tr>
                                          <td colSpan="6" className="text-center py-5 text-muted">
                                              No applications found
                                          </td>
                                      </tr>
                                  )}
                              </tbody>
                          </table>
                      </div>
                  </div>
              </div>
          )}
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

      {/* Apply Job Modal */}
      {isApplyModalOpen && selectedJob && (
        <div className="modal-overlay">
          <div className="modal-content glass-card border-0 shadow-lg p-4" style={{ maxWidth: '600px', width: '100%' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                <FileText className="text-primary" size={24} />
                Apply for {selectedJob.title}
              </h5>
              <button onClick={() => setIsApplyModalOpen(false)} className="btn btn-link text-muted p-0">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAppSubmit}>
              <div className="row g-3 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-bold text-muted text-uppercase ls-1">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    className="form-control bg-light border-0 shadow-none fw-semibold"
                    value={applicationData.fullName}
                    onChange={handleAppChange}
                    required
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-bold text-muted text-uppercase ls-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control bg-light border-0 shadow-none fw-semibold"
                    value={applicationData.email}
                    onChange={handleAppChange}
                    required
                  />
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-bold text-muted text-uppercase ls-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-control bg-light border-0 shadow-none fw-semibold"
                    value={applicationData.phone}
                    onChange={handleAppChange}
                    required
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-bold text-muted text-uppercase ls-1">Resume (PDF/Doc)</label>
                  <input
                    type="file"
                    name="resume"
                    className="form-control bg-light border-0 shadow-none fw-semibold"
                    onChange={handleAppChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold text-muted text-uppercase ls-1">Education</label>
                <textarea
                  name="education"
                  className="form-control bg-light border-0 shadow-none fw-semibold"
                  rows="2"
                  value={applicationData.education}
                  onChange={handleAppChange}
                  required
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold text-muted text-uppercase ls-1">Address</label>
                <textarea
                  name="address"
                  className="form-control bg-light border-0 shadow-none fw-semibold"
                  rows="2"
                  value={applicationData.address}
                  onChange={handleAppChange}
                  required
                ></textarea>
              </div>

              <div className="d-flex gap-2 justify-content-end">
                <button 
                  type="button" 
                  className="btn btn-light border-0 fw-semibold px-4"
                  onClick={() => setIsApplyModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary fw-semibold px-4 shadow-sm"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Careers;
