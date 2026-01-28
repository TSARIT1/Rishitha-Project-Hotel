import { useState } from 'react';
import { 
  Building, Plus, CheckCircle, Users, Calendar, 
  LogOut, PieChart, Bell, Eye, Search, Hotel as HotelIcon,
  Clock, CreditCard, AlertCircle, ChevronRight
} from 'lucide-react';
import './Hotel.css';

const Hotel = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Sample data for current guests
  const currentGuests = [
    {
      roomNo: '101',
      guestName: 'John Doe',
      checkInDate: '2026-01-03',
      checkOutDate: '2026-01-08',
      roomType: 'Deluxe',
      noOfGuests: 2,
      totalBill: '₹15,000',
      paymentStatus: 'Paid',
      specialRequests: 'Extra towels',
      actions: 'View'
    },
    {
      roomNo: '205',
      guestName: 'Sarah Smith',
      checkInDate: '2026-01-04',
      checkOutDate: '2026-01-10',
      roomType: 'Suite',
      noOfGuests: 3,
      totalBill: '₹28,500',
      paymentStatus: 'Pending',
      specialRequests: 'Late checkout',
      actions: 'View'
    },
    {
      roomNo: '312',
      guestName: 'Michael Johnson',
      checkInDate: '2026-01-05',
      checkOutDate: '2026-01-07',
      roomType: 'Standard',
      noOfGuests: 1,
      totalBill: '₹8,000',
      paymentStatus: 'Paid',
      specialRequests: 'None',
      actions: 'View'
    },
    {
      roomNo: '408',
      guestName: 'Emily Davis',
      checkInDate: '2026-01-06',
      checkOutDate: '2026-01-12',
      roomType: 'Deluxe',
      noOfGuests: 2,
      totalBill: '₹22,000',
      paymentStatus: 'Partial',
      specialRequests: 'Airport pickup',
      actions: 'View'
    }
  ];

  const roomServiceRequests = [
    { room: '101', request: 'Extra pillows', time: '10:30 AM', status: 'Pending' },
    { room: '205', request: 'Room cleaning', time: '11:00 AM', status: 'In Progress' },
    { room: '312', request: 'Towel replacement', time: '09:45 AM', status: 'Completed' }
  ];

  const upcomingReservations = [
    { guestName: 'Robert Brown', checkIn: '2026-01-08', roomType: 'Suite', guests: 4 },
    { guestName: 'Lisa Anderson', checkIn: '2026-01-09', roomType: 'Deluxe', guests: 2 },
    { guestName: 'David Wilson', checkIn: '2026-01-10', roomType: 'Standard', guests: 1 }
  ];

  const stats = [
    { icon: HotelIcon, label: 'Rooms Occupied', value: '18/24', color: 'primary', trend: '75%' },
    { icon: Users, label: 'Current Guests', value: '42', color: 'info', trend: '+4 today' },
    { icon: Calendar, label: 'Check-ins Today', value: '8', color: 'success', trend: 'On track' },
    { icon: LogOut, label: 'Check-outs Today', value: '5', color: 'warning', trend: '3 pending' },
  ];

  const filteredGuests = currentGuests.filter(guest =>
    guest.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.roomNo.includes(searchTerm)
  );

  return (
    <div className="container-fluid py-3 hotel-bootstrap-page d-flex flex-column" style={{ height: 'calc(100vh - 85px)', overflow: 'hidden' }}>
      
      {/* Page Header Area */}
      <div className="row align-items-center mb-3 flex-shrink-0 px-2 text-nowrap">
        <div className="col">
          <h1 className="h3 fw-bold mb-0 d-flex align-items-center gap-2">
            <Building size={28} className="text-primary" />
            Hotel Management
          </h1>
          <p className="text-muted small mb-0 fw-medium">Tuesday, January 6, 2026 • Live Dashboard</p>
        </div>
        <div className="col-auto d-flex gap-2">
          <button className="btn btn-primary d-flex align-items-center gap-2 px-3 py-2 fw-semibold shadow-sm rounded-pill">
            <CheckCircle size={18} /> Check-In
          </button>
          <button className="btn btn-outline-primary d-flex align-items-center gap-2 px-3 py-2 fw-semibold shadow-sm rounded-pill bg-white">
            <Plus size={18} /> New Reservation
          </button>
        </div>
      </div>

      {/* Main Content Area - Scrollable */}
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
                  <div>
                    <h4 className="fw-bold mb-0">{stat.value}</h4>
                    <span className="tiny-text fw-bold text-muted text-uppercase ls-1">{stat.label}</span>
                    <div className="tiny-text text-primary-emphasis mt-1 fw-bold">{stat.trend}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Overview Row */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-lg-6">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-header bg-white border-bottom-0 pt-4 px-4 d-flex align-items-center gap-2">
                <PieChart size={20} className="text-primary" />
                <h5 className="fw-bold mb-0">Room Status Overview</h5>
              </div>
              <div className="card-body p-4 pt-1">
                <div className="row g-3">
                  {[
                    { label: 'Occupied', count: 18, color: 'danger' },
                    { label: 'Available', count: 6, color: 'success' },
                    { label: 'Maintenance', count: 2, color: 'warning' },
                    { label: 'Reserved', count: 4, color: 'info' }
                  ].map((status, i) => (
                    <div key={i} className="col-6">
                      <div className="p-3 rounded-4 bg-light border-0 d-flex align-items-center justify-content-between hover-lift transition-all">
                        <div className="d-flex align-items-center gap-2">
                          <div className={`bg-${status.color} rounded-circle`} style={{ width: '10px', height: '10px' }}></div>
                          <span className="small fw-bold text-muted">{status.label}</span>
                        </div>
                        <span className="h6 mb-0 fw-bold">{status.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-header bg-white border-bottom-0 pt-4 px-4 d-flex align-items-center gap-2">
                <Clock size={20} className="text-primary" />
                <h5 className="fw-bold mb-0">Today's Arrivals & Departures</h5>
              </div>
              <div className="card-body p-4 pt-1">
                <div className="vstack gap-3">
                  <div className="d-flex align-items-center justify-content-between p-3 rounded-4 bg-primary-soft border-0">
                    <span className="fw-bold">Expected Arrivals</span>
                    <span className="badge bg-primary rounded-pill px-3">8 Guests</span>
                  </div>
                  <div className="d-flex align-items-center justify-content-between p-3 rounded-4 bg-warning-soft border-0">
                    <span className="fw-bold">Scheduled Departures</span>
                    <span className="badge bg-warning text-dark rounded-pill px-3">5 Guests</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Guests Table Card */}
        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-header bg-white border-bottom-0 py-4 px-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
              <Users size={20} className="text-primary" />
              Current Hotel Guests
            </h5>
            <div className="input-group border-0 bg-light rounded-pill px-3 py-1" style={{ maxWidth: '350px' }}>
              <span className="input-group-text bg-transparent border-0 text-muted">
                <Search size={18} />
              </span>
              <input
                type="text"
                className="form-control bg-transparent border-0 shadow-none"
                placeholder="Search by name or room..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="table-responsive px-4 pb-4 custom-thin-scrollbar" style={{ minHeight: '350px' }}>
            <table className="table table-hover align-middle mb-0 hotel-table-modern">
              <thead className="table-light sticky-top z-1">
                <tr>
                  <th className="ps-0 py-3">Room No</th>
                  <th className="py-3">Guest Name</th>
                  <th className="py-3">Check-in</th>
                  <th className="py-3">Check-out</th>
                  <th className="py-3">Room Type</th>
                  <th className="py-3 text-center">Guests</th>
                  <th className="py-3 text-end">Total Bill</th>
                  <th className="py-3 text-center">Status</th>
                  <th className="py-3">Special Requests</th>
                  <th className="pe-0 py-3 text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredGuests.map((guest, index) => (
                  <tr key={index}>
                    <td className="ps-0">
                      <span className="badge bg-primary-soft text-primary fw-bold p-2 px-3 border border-primary-subtle rounded-pill">
                        #{guest.roomNo}
                      </span>
                    </td>
                    <td className="fw-bold text-dark">{guest.guestName}</td>
                    <td className="small text-muted">{guest.checkInDate}</td>
                    <td className="small text-muted">{guest.checkOutDate}</td>
                    <td><span className="badge bg-light text-dark fw-medium border">{guest.roomType}</span></td>
                    <td className="text-center fw-bold">{guest.noOfGuests}</td>
                    <td className="text-end fw-bold text-success">{guest.totalBill}</td>
                    <td className="text-center">
                      <span className={`status-pill ${guest.paymentStatus.toLowerCase()} x-small-text fw-bold`}>
                        {guest.paymentStatus}
                      </span>
                    </td>
                    <td className="small text-muted text-truncate" style={{ maxWidth: '150px' }}>{guest.specialRequests}</td>
                    <td className="pe-0 text-end">
                      <button className="btn btn-action-square text-primary" title="View Detail">
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Dual Cards */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-xl-6">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-header bg-white border-bottom-0 py-4 px-4 d-flex align-items-center justify-content-between">
                <h5 className="fw-bold mb-0 d-flex align-items-center gap-2 text-primary">
                  <Bell size={20} /> Room Service Requests
                </h5>
                <span className="badge bg-danger rounded-pill px-3">2 Active</span>
              </div>
              <div className="card-body p-4 pt-0">
                <div className="vstack gap-3">
                  {roomServiceRequests.map((request, index) => (
                    <div key={index} className="d-flex align-items-center p-3 rounded-4 bg-light bg-opacity-50 border border-transparent hover-border-primary transition-all">
                      <div className="flex-grow-1">
                        <div className="fw-bold text-dark">Room {request.room}</div>
                        <div className="small text-muted">{request.request}</div>
                        <div className="tiny-text text-muted fw-bold mt-1"><Clock size={12} className="me-1" />{request.time}</div>
                      </div>
                      <span className={`status-pill ${request.status.toLowerCase().replace(' ', '-')} x-small-text fw-bold`}>
                        {request.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-xl-6">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-header bg-white border-bottom-0 py-4 px-4 d-flex align-items-center justify-content-between">
                <h5 className="fw-bold mb-0 d-flex align-items-center gap-2 text-info">
                  <Calendar size={20} /> Upcoming Reservations
                </h5>
                <button className="btn btn-link btn-sm text-decoration-none fw-bold p-0">View All</button>
              </div>
              <div className="card-body p-4 pt-0">
                <div className="vstack gap-3">
                  {upcomingReservations.map((reservation, index) => (
                    <div key={index} className="d-flex align-items-center p-3 rounded-4 bg-light bg-opacity-50 border border-transparent hover-border-info transition-all">
                      <div className="flex-grow-1">
                        <div className="fw-bold text-dark">{reservation.guestName}</div>
                        <div className="small text-muted">{reservation.checkIn} • {reservation.roomType}</div>
                      </div>
                      <div className="text-end">
                        <div className="badge bg-info-subtle text-info rounded-pill px-3">{reservation.guests} Guests</div>
                        <ChevronRight size={18} className="text-muted ms-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Hotel;
