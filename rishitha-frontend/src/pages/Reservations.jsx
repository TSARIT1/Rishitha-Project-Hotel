import { useState } from 'react';
import { 
  Calendar, Users, MapPin, Clock, Star, 
  Coffee, Search, Filter, Plus, Download, 
  CheckCircle, XCircle, AlertCircle, ChevronRight,
  MoreVertical, Mail, Phone, ExternalLink,
  MessageSquare, Music, GlassWater, Landmark, X
} from 'lucide-react';
import './Reservations.css';

const Reservations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Bookings');

  const [reservations, setReservations] = useState([
    { id: 'RES-8801', name: 'Arjun Mehra', guests: 4, area: 'Standard Table', time: '19:30', date: 'Today', status: 'Confirmed', phone: '+91 98765-43001' },
    { id: 'RES-8805', name: 'Priya Sharma', guests: 2, area: 'Window Seat', time: '20:15', date: 'Today', status: 'Arrived', phone: '+91 98234-56002' },
    { id: 'RES-8810', name: 'Zoya Khan', guests: 25, area: 'Party Area', time: '18:00', date: 'Tomorrow', status: 'Pending', phone: '+91 91234-56003' },
    { id: 'RES-8812', name: 'Vikram Malhotra', guests: 8, area: 'VIP Lounge', time: '21:00', date: 'Today', status: 'Confirmed', phone: '+91 99887-76004' },
    { id: 'RES-8815', name: 'Aditya Roy', guests: 2, area: 'Candle Light', time: '20:30', date: '12 Jan', status: 'Confirmed', phone: '+91 94455-66005' },
    { id: 'RES-8820', name: 'Sanya Gupta', guests: 12, area: 'Private Room', time: '19:00', date: '15 Jan', status: 'Cancelled', phone: '+91 93322-11006' },
    { id: 'RES-8825', name: 'Mehul Desh.', guests: 50, area: 'Grand Banquet', time: '12:00', date: '20 Jan', status: 'Pending', phone: '+91 92211-00111' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReservation, setNewReservation] = useState({
    name: '',
    guests: '',
    area: 'Standard Table',
    time: '',
    date: new Date().toISOString().split('T')[0],
    phone: '',
    status: 'Confirmed'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReservation(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddReservation = (e) => {
    e.preventDefault();
    const id = `RES-${Math.floor(8830 + Math.random() * 100)}`;
    const reservation = {
      id,
      ...newReservation,
      guests: parseInt(newReservation.guests) || 2
    };
    setReservations([reservation, ...reservations]);
    setIsModalOpen(false);
    setNewReservation({
      name: '',
      guests: '',
      area: 'Standard Table',
      time: '',
      date: new Date().toISOString().split('T')[0],
      phone: '',
      status: 'Confirmed'
    });
  };

  const stats = [
    { title: 'Total Bookings', value: '42', icon: Calendar, color: 'primary', trend: '7 new today' },
    { title: 'Today\'s Guests', value: '128', icon: Users, color: 'success', trend: 'Peak at 8PM' },
    { title: 'Pending Requests', value: '5', icon: AlertCircle, color: 'warning', trend: 'Need attention' },
    { title: 'Venue Occupancy', value: '82%', icon: Landmark, color: 'info', trend: 'High demand' },
  ];

  const filteredReservations = reservations.filter(res => {
    const matchesSearch = res.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         res.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Bookings' || res.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getAreaIcon = (area) => {
    if (area.includes('Table')) return <Coffee size={14} />;
    if (area.includes('Party') || area.includes('Banquet')) return <Music size={14} />;
    if (area.includes('VIP') || area.includes('Private')) return <GlassWater size={14} />;
    return <MapPin size={14} />;
  };

  return (
    <div className="container-fluid py-3 reservations-bootstrap-page d-flex flex-column" style={{ height: 'calc(100vh - 85px)', overflow: 'hidden' }}>
      
      {/* Page Header */}
      <div className="row align-items-center mb-3 flex-shrink-0 px-2">
        <div className="col">
          <h1 className="h3 fw-bold mb-0 d-flex align-items-center gap-2">
            <Calendar size={28} className="text-primary" />
            Reservations
          </h1>
          <p className="text-muted small mb-0 fw-medium">Manage table bookings, group events, and venue capacity</p>
        </div>
        <div className="col-auto d-flex gap-2">
          <button className="btn btn-outline-primary shadow-sm d-flex align-items-center gap-2 px-3 py-2 fw-semibold bg-white rounded-pill border-0">
            <Download size={18} /> Export List
          </button>
          <button 
            className="btn btn-primary shadow-sm d-flex align-items-center gap-2 px-4 py-2 fw-bold rounded-pill"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={18} /> New Booking
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
              <Users size={20} className="text-primary" />
              Reservation Ledger
            </h5>
            <div className="d-flex gap-2 flex-grow-1 flex-md-grow-0" style={{ maxWidth: '600px' }}>
              <div className="input-group border-0 bg-light rounded-pill px-3 py-1 flex-grow-1">
                <span className="input-group-text bg-transparent border-0 text-muted">
                  <Search size={18} />
                </span>
                <input
                  type="text"
                  className="form-control bg-transparent border-0 shadow-none px-0"
                  placeholder="Search guest or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select 
                className="form-select border-0 bg-light rounded-pill px-3 shadow-none fw-semibold small" 
                style={{ width: 'auto' }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option>All Bookings</option>
                <option>Confirmed</option>
                <option>Pending</option>
                <option>Arrived</option>
                <option>Cancelled</option>
              </select>
            </div>
          </div>
          
          <div className="table-responsive px-4 pb-4 custom-thin-scrollbar" style={{ minHeight: '350px' }}>
            <table className="table table-hover align-middle mb-0 reservation-table-modern">
              <thead className="table-light sticky-top z-1">
                <tr>
                  <th className="ps-0 py-3">GUEST DETAILS</th>
                  <th className="py-3">GUESTS</th>
                  <th className="py-3">AREA / VENUE</th>
                  <th className="py-3">DATE & TIME</th>
                  <th className="py-3 text-center">STATUS</th>
                  <th className="py-3">COMMUNICATION</th>
                  <th className="pe-0 py-3 text-end">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredReservations.map((res) => (
                  <tr key={res.id}>
                    <td className="ps-0">
                      <div className="fw-bold text-dark">{res.name}</div>
                      <div className="tiny-text text-muted">ID: {res.id}</div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                         <div className="bg-light rounded-circle p-1 d-flex align-items-center justify-content-center" style={{ width: '28px', height: '28px' }}>
                           <Users size={14}/>
                         </div>
                         <span className="fw-bold small">{res.guests} Pax</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge border fw-medium d-inline-flex align-items-center gap-2 py-2 px-3 rounded-pill ${res.area.includes('Party') ? 'bg-purple-soft text-purple border-purple' : 'bg-light text-dark'}`}>
                        {getAreaIcon(res.area)}
                        {res.area}
                      </span>
                    </td>
                    <td>
                      <div className="fw-bold small text-dark">{res.date}</div>
                      <div className="tiny-text text-muted d-flex align-items-center gap-1"><Clock size={12}/> {res.time}</div>
                    </td>
                    <td className="text-center">
                      <span className={`status-pill ${
                        res.status === 'Confirmed' ? 'type-new' : 
                        res.status === 'Arrived' ? 'bg-success text-white' :
                        res.status === 'Pending' ? 'type-vip' : 
                        'bg-secondary-subtle text-muted'
                      } x-small-text fw-bold text-uppercase`}>
                        {res.status}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button className="btn btn-action-square text-primary" title="Call"><Phone size={14}/></button>
                        <button className="btn btn-action-square text-info" title="WhatsApp"><MessageSquare size={14}/></button>
                        <button className="btn btn-action-square text-muted" title="Email"><Mail size={14}/></button>
                      </div>
                    </td>
                    <td className="pe-0 text-end">
                       <button className="btn btn-action-square" title="More Options"><MoreVertical size={14}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Lower Grid: Venue Insights & New Requests */}
        <div className="row g-4 mb-4">
          <div className="col-12 col-xl-7">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-header bg-white border-bottom-0 py-4 px-4 d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                  <Star size={20} className="text-warning" />
                  Upcoming Special Events
                </h5>
                <button className="btn btn-link btn-sm text-decoration-none fw-bold p-0">View Event Calendar</button>
              </div>
              <div className="card-body p-4 pt-0">
                <div className="vstack gap-3">
                  {[
                    { event: 'Birthday Celebration (Zoya Khan)', area: 'Party Area', time: 'Tomorrow, 18:00', guests: '25 Guests', urgency: 'High' },
                    { event: 'Corporate Dinner', area: 'Grand Banquet', time: '20 Jan, 12:00', guests: '50 Guests', urgency: 'Medium' },
                    { event: 'Anniversary Special', area: 'Candle Light', time: '12 Jan, 20:30', guests: '2 Guests', urgency: 'Low' }
                  ].map((event, i) => (
                    <div key={i} className="d-flex align-items-center p-3 rounded-4 bg-light bg-opacity-50 border border-transparent hover-border-primary transition-all">
                      <div className={`p-3 rounded-4 bg-white shadow-sm me-3 text-center`} style={{ minWidth: '60px' }}>
                        <div className="fw-bold text-primary">{event.time.split(',')[0]}</div>
                        <div className="tiny-text text-muted">{event.time.split(',')[1]}</div>
                      </div>
                      <div className="flex-grow-1">
                        <div className="fw-bold text-dark">{event.event}</div>
                        <div className="small text-muted d-flex align-items-center gap-2">
                          <MapPin size={12}/> {event.area} • <Users size={12}/> {event.guests}
                        </div>
                      </div>
                      <div className="text-end">
                        <span className={`badge rounded-pill ${event.urgency === 'High' ? 'bg-danger-soft text-danger' : 'bg-primary-soft text-primary'} small px-3`}>
                          {event.urgency} Prep
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-xl-5">
            <div className="card border-0 shadow-sm rounded-4 h-100 analytics-card-bg">
              <div className="card-header bg-transparent border-bottom-0 py-4 px-4">
                <h5 className="fw-bold mb-0">Venue Availability</h5>
              </div>
              <div className="card-body p-4 pt-1">
                <div className="vstack gap-4">
                  {[
                    { area: 'Main Dining Hall', capacity: 120, booked: 98, color: 'primary' },
                    { area: 'Kitchen Terrace', capacity: 40, booked: 12, color: 'success' },
                    { area: 'Party Area', capacity: 50, booked: 45, color: 'purple' },
                    { area: 'VIP Lounge', capacity: 15, booked: 15, color: 'warning' }
                  ].map((area, i) => (
                    <div key={i}>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="fw-bold small text-dark">{area.area}</span>
                        <span className="tiny-text fw-bold text-muted">{area.booked} / {area.capacity} seats</span>
                      </div>
                      <div className="progress rounded-pill shadow-none" style={{ height: '8px' }}>
                        <div className={`progress-bar bg-${area.color}`} style={{ width: `${(area.booked / area.capacity) * 100}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 p-4 bg-white bg-opacity-50 rounded-4 border border-white text-center shadow-sm">
                   <div className="d-flex justify-content-center gap-4 mb-3">
                      <div className="text-center">
                        <div className="h4 fw-bold mb-0 text-primary">12</div>
                        <div className="tiny-text text-muted fw-bold">Free Tables</div>
                      </div>
                      <div className="vr"></div>
                      <div className="text-center">
                        <div className="h4 fw-bold mb-0 text-success">08</div>
                        <div className="tiny-text text-muted fw-bold">Reservations Arriving</div>
                      </div>
                   </div>
                   <button className="btn btn-primary btn-sm w-100 rounded-pill fw-bold py-2">Quick Allocation</button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* New Booking Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass-card border-0 shadow-lg p-4" style={{ maxWidth: '500px', width: '100%' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                <Calendar className="text-primary" size={24} />
                New Reservation
              </h5>
              <button onClick={() => setIsModalOpen(false)} className="btn btn-link text-muted p-0">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAddReservation}>
              <div className="mb-3">
                <label className="form-label small fw-bold text-muted text-uppercase ls-1">Guest Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control bg-light border-0 shadow-none fw-semibold"
                  value={newReservation.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-bold text-muted text-uppercase ls-1">Number of Guests</label>
                  <input
                    type="number"
                    name="guests"
                    className="form-control bg-light border-0 shadow-none fw-semibold"
                    value={newReservation.guests}
                    onChange={handleInputChange}
                    min="1"
                    required
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-bold text-muted text-uppercase ls-1">Area / Venue</label>
                  <select
                    name="area"
                    className="form-select bg-light border-0 shadow-none fw-semibold"
                    value={newReservation.area}
                    onChange={handleInputChange}
                  >
                    <option>Standard Table</option>
                    <option>Window Seat</option>
                    <option>Party Area</option>
                    <option>VIP Lounge</option>
                    <option>Private Room</option>
                    <option>Grand Banquet</option>
                    <option>Candle Light</option>
                  </select>
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-bold text-muted text-uppercase ls-1">Date</label>
                  <input
                    type="date"
                    name="date"
                    className="form-control bg-light border-0 shadow-none fw-semibold"
                    value={newReservation.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-bold text-muted text-uppercase ls-1">Time</label>
                  <input
                    type="time"
                    name="time"
                    className="form-control bg-light border-0 shadow-none fw-semibold"
                    value={newReservation.time}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold text-muted text-uppercase ls-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-control bg-light border-0 shadow-none fw-semibold"
                  value={newReservation.phone}
                  onChange={handleInputChange}
                  required
                />
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
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reservations;
