import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  QrCode, Utensils, Calendar, Users, Star, 
  MapPin, Phone, Instagram, Facebook, Twitter,
  ChevronRight, ArrowRight, Camera, Check, Play,
  Briefcase, Clock, X
} from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import ScrollReveal from '../components/UI/ScrollReveal';
import './LandingPage.css';

const LandingPage = () => {
  const [bookingFormData, setBookingFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '2',
    area: 'Standard Table'
  });

  const navigate = useNavigate();

  const [scanActive, setScanActive] = useState(false);

  React.useEffect(() => {
    if (scanActive) {
        const scanner = new Html5QrcodeScanner(
            "reader", 
            { fps: 10, qrbox: { width: 250, height: 250 } },
            /* verbose= */ false
        );
        
        scanner.render((decodedText, decodedResult) => {
            // Success callback
            console.log(`Scan result: ${decodedText}`, decodedResult);
            
            // Expected: https://rishitha.com/menu/12 or just 12
            try {
                const match = decodedText.match(/\/menu\/(\d+)/) || decodedText.match(/(\d+)$/);
                if (match && match[1]) {
                   scanner.clear();
                   setScanActive(false);
                   navigate(`/menu/${match[1]}`);
                }
            } catch (e) {
                console.error("Parsing error", e);
            }
        }, (error) => {
            // Error callback - ignore simple scan failures
            // console.warn(error);
        });

        // Cleanup
        return () => {
            scanner.clear().catch(error => console.error("Failed to clear scanner", error));
        };
    }
  }, [scanActive, navigate]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showRatingSuccess, setShowRatingSuccess] = useState(false);
  const [showNamePopup, setShowNamePopup] = useState(false);
  const [raterName, setRaterName] = useState('');
  const [activeJobs, setActiveJobs] = useState([]);

  useEffect(() => {
    const fetchActiveJobs = async () => {
        try {
            const { default: api } = await import('../services/api');
            const response = await api.get('/jobs/active');
            if (response.data.success) {
                setActiveJobs(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching active jobs", error);
        }
    };
    fetchActiveJobs();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Create reservation object matching backend model
    const reservationData = {
        guestName: bookingFormData.name,
        phone: bookingFormData.phone,
        guests: parseInt(bookingFormData.guests),
        area: bookingFormData.area,
        date: bookingFormData.date,
        time: bookingFormData.time,
        status: 'CONFIRMED'
    };

    try {
        const { default: api } = await import('../services/api');
        const response = await api.post('/reservations', reservationData);
        
        if (response.data.success) {
            setShowSuccess(true);
            setBookingFormData({
                name: '',
                phone: '',
                guests: '2',
                area: 'Standard Table',
                date: '',
                time: ''
            });
            setTimeout(() => setShowSuccess(false), 5000);
        }
    } catch (error) {
        console.error("Booking failed", error);
        alert("Failed to book reservation: " + (error.response?.data?.message || error.message));
    }
  };

  const handleRatingSubmit = (e) => {
    e.preventDefault();
    setShowNamePopup(true);
  };

  const handleFinalRatingSubmit = () => {
    setShowNamePopup(false);
    setShowRatingSuccess(true);
    setTimeout(() => {
      setShowRatingSuccess(false);
      setRating(0);
      setFeedback('');
      setRaterName('');
    }, 5000);
  };

  /* Applcation Logic ported from Careers.jsx */
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicationData, setApplicationData] = useState({
    fullName: '',
    email: '',
    phone: '',
    education: '',
    address: '',
    resume: null
  });

  const handleApplyClick = (job) => {
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
          }
      } catch (error) {
          console.error("Application failed", error);
          alert("Failed to submit application: " + (error.response?.data?.message || "Unknown error"));
      }
  };

  return (
    <div className="landing-container">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-logo">
          <div className="logo-icon">R</div>
          <span>Rishitha Restaurant</span>
        </div>
        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#menu-scan">Scan Menu</a>
          <a href="#booking">Reservations</a>
          <button className="nav-cta" onClick={() => document.getElementById('booking').scrollIntoView({ behavior: 'smooth' })}>
            Book Now
          </button>
          <Link to="/login" className="nav-admin-link">Login</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header id="home" className="hero-section">
        <ScrollReveal animation="fade-up" className="hero-content">
          <h1 className="hero-title">
            Exceptional <span className="highlight">Dining</span> Experience
          </h1>
          <p className="hero-subtitle">
            Authentic flavors meet modern convenience. Scan to explore our menu or book your perfect spot in seconds.
          </p>
          <div className="hero-btns">
            <button className="btn-primary" onClick={() => document.getElementById('booking').scrollIntoView({ behavior: 'smooth' })}>
              Make a Reservation <ArrowRight size={20} />
            </button>
            <button className="btn-secondary" onClick={() => document.getElementById('menu-scan').scrollIntoView({ behavior: 'smooth' })}>
              View Menu
            </button>
            <Link to="/login" className="btn-admin">
              Login
            </Link>
          </div>
        </ScrollReveal>
        <ScrollReveal animation="fade-in" delay={300} className="hero-visual">
          <div className="hero-image-container">
            <div className="floating-card glass">
              <Star className="text-warning" fill="currentColor" />
              <div>
                 <strong>4.9/5</strong>
                 <p>User Rating</p>
              </div>
            </div>
            <div className="main-hero-img">
               {/* In a real app, this would be a high-quality food image */}
               <div className="food-placeholder">
                  <Utensils size={100} strokeWidth={1} />
               </div>
            </div>
          </div>
        </ScrollReveal>
      </header>

      {/* QR Scan Section */}
      <section id="menu-scan" className="scan-section">
        <div className="container">
          <ScrollReveal animation="fade-up" className="scan-card glass">
            <div className="scan-info">
              <div className="section-tag">Digital Menu</div>
              <h2>Scan to View Menu</h2>
              <p>Skip the physical menu! Point your camera at the QR code on your table to browse our delicious offerings and place your order instantly.</p>
              
              <ul className="scan-features">
                <li><Check size={18} className="text-success" /> Live Menu Updates</li>
                <li><Check size={18} className="text-success" /> Dietary Filters</li>
                <li><Check size={18} className="text-success" /> Group Ordering</li>
              </ul>
            </div>
            
            <div className="scan-visual">
              {scanActive ? (
                 <div className="qr-scanner-wrapper position-relative rounded-4 overflow-hidden shadow-lg border-primary border-3" style={{ maxWidth: '350px', margin: '0 auto', background: '#fff' }}>
                    <div id="reader" style={{ width: '100%' }}></div>
                    <button 
                        className="btn btn-dark btn-sm position-absolute top-0 end-0 m-3 rounded-circle opacity-75" 
                        style={{ zIndex: 1000 }}
                        onClick={() => setScanActive(false)}
                    >
                       <X size={20} />
                    </button>
                 </div>
              ) : (
                <div className="qr-mockup">
                  <div className="qr-box">
                     <QrCode size={180} />
                     <div className="scan-line"></div>
                  </div>
                  <button className="btn-scan" onClick={() => setScanActive(true)}>
                     <Camera size={18} /> Tap to Scan Menu
                  </button>
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Video Content Section */}
      <section id="videos" className="video-section">
        <div className="container">
          <ScrollReveal animation="fade-up">
            <div className="section-header text-center">
              <div className="section-tag">Experience Rishitha</div>
              <h2>Behind the Scenes</h2>
              <p className="section-subtitle-main">Get a glimpse of our culinary magic, atmosphere, and the passion that goes into every plate.</p>
            </div>
          </ScrollReveal>

          <div className="video-grid">
            {[
              {
                title: "Our Kitchen Story",
                duration: "2:45",
                thumbnail: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80",
                link: "#"
              },
              {
                title: "Dining Atmosphere",
                duration: "1:30",
                thumbnail: "https://images.unsplash.com/photo-1517248135467-4c7ed9d42c7b?auto=format&fit=crop&w=800&q=80",
                link: "#"
              },
              {
                title: "Signature Dishes",
                duration: "3:15",
                thumbnail: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
                link: "#"
              }
            ].map((video, index) => (
              <ScrollReveal key={index} animation="fade-up" delay={index * 150} className="video-card glass">
                <div className="video-thumbnail">
                  <img src={video.thumbnail} alt={video.title} />
                  <div className="video-overlay">
                    <div className="play-btn">
                      <Play fill="white" size={24} />
                    </div>
                  </div>
                  <span className="video-duration">{video.duration}</span>
                </div>
                <div className="video-info">
                  <h3>{video.title}</h3>
                  <a href={video.link} className="video-link">Watch Now <ChevronRight size={16} /></a>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Careers Section */}
      <section id="careers" className="careers-section bg-alt-soft">
        <div className="container">
          <ScrollReveal animation="fade-up">
            <div className="section-header text-center">
              <div className="section-tag">Join Our Team</div>
              <h2>Careers at Rishitha</h2>
              <p className="section-subtitle-main">Passion for food? We are looking for talented individuals to join our growing family.</p>
            </div>
          </ScrollReveal>

          <div className="careers-grid">
            {activeJobs.length > 0 ? (
              activeJobs.map((job, index) => (
                <ScrollReveal key={index} animation="fade-up" delay={index * 100} className="career-card glass">
                  <div className="career-icon">
                    <Briefcase size={24} />
                  </div>
                  <div className="career-info">
                    <h3>{job.title}</h3>
                    <div className="career-meta">
                      <span><Users size={14} /> {job.department}</span>
                      <span><Clock size={14} /> {job.type}</span>
                      <span><MapPin size={14} /> {job.location}</span>
                    </div>
                    <button 
                      className="btn-apply"
                      onClick={() => handleApplyClick(job)}
                    >
                      Apply Now <ArrowRight size={16} />
                    </button>
                  </div>
                </ScrollReveal>
              ))
            ) : (
                <div className="text-center w-100 py-5">
                    <p className="text-muted">We currently have no open positions. Please check back soon!</p>
                </div>
            )}
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section id="booking" className="booking-section">
        <div className="container">
          <div className="booking-grid">
            <ScrollReveal animation="slide-right" className="booking-text">
              <div className="section-tag">Reservations</div>
              <h2>Book Your Experience</h2>
              <p>Planning a romantic dinner or a large corporate party? We've got you covered with our flexible booking options.</p>
              
              <div className="contact-info">
                <div className="contact-item">
                  <MapPin className="text-primary" />
                  <span>123 Culinary Lane, Foodie City</span>
                </div>
                <div className="contact-item">
                  <Phone className="text-primary" />
                  <span>+1 (234) 567-890</span>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="slide-left" className="booking-form-container glass">
              {showSuccess ? (
                <div className="success-message">
                  <div className="success-icon"><Check size={40} /></div>
                  <h3>Booking Confirmed!</h3>
                  <p>We've sent a confirmation message to your phone. We can't wait to serve you!</p>
                  <button className="btn-primary" onClick={() => setShowSuccess(false)}>Book Another</button>
                </div>
              ) : (
                <form className="booking-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      placeholder="Enter your name"
                      required
                      value={bookingFormData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input 
                        type="tel" 
                        name="phone" 
                        placeholder="+1 (555) 000-0000"
                        required
                        value={bookingFormData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Number of Guests</label>
                      <input 
                        type="number" 
                        name="guests" 
                        placeholder="Ex: 2"
                        className="form-control"
                        min="1"
                        required
                        value={bookingFormData.guests}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Select Date</label>
                      <input 
                        type="date" 
                        name="date" 
                        required
                        value={bookingFormData.date}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Time Slot</label>
                      <input 
                        type="time" 
                        name="time" 
                        className="form-control"
                        value={bookingFormData.time} 
                        onChange={handleInputChange} 
                        required 
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Area / Venue</label>
                    <select name="area" value={bookingFormData.area} onChange={handleInputChange} className="form-select">
                        <option>Standard Table</option>
                        <option>Window Seat</option>
                        <option>Party Area</option>
                        <option>VIP Lounge</option>
                        <option>Private Room</option>
                        <option>Grand Banquet</option>
                        <option>Candle Light</option>
                    </select>
                  </div>

                  <button type="submit" className="btn-primary w-100">
                    Confirm Reservation
                  </button>
                </form>
              )}
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Rating Section */}
      <section id="rating" className="rating-section bg-alt-soft">
        <div className="container">
          <ScrollReveal animation="fade-up" className="rating-card glass">
            <div className="rating-content">
              <div className="section-tag">Feedback</div>
              <h2>Rate Your Experience</h2>
              <p>Your opinion matters! Tell us about your visit and help us improve our service.</p>
              
              <div className="rating-stats">
                <div className="stat">
                   <span className="big-num">4.9</span>
                   <div className="stars-display">
                      {[1,2,3,4,5].map(s => <Star key={s} size={16} fill="#ff4757" className="text-primary" />)}
                   </div>
                   <p>Avg Rating</p>
                </div>
                <div className="stat">
                   <span className="big-num">2.4k+</span>
                   <p>Happy Guests</p>
                </div>
              </div>
            </div>

            <div className="rating-form-box">
              {showRatingSuccess ? (
                <div className="success-message">
                  <div className="success-icon"><Check size={40} /></div>
                  <h3>Thank You!</h3>
                  <p>Your feedback has been received. We appreciate your support!</p>
                </div>
              ) : (
                <form className="rating-form" onSubmit={handleRatingSubmit}>
                  <div className="star-selection">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`star-btn ${star <= (hover || rating) ? 'active' : ''}`}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                      >
                        <Star size={32} fill={star <= (hover || rating) ? "#ff4757" : "none"} />
                      </button>
                    ))}
                  </div>
                  
                  <div className="form-group mb-3">
                    <label>Share your thoughts (Optional)</label>
                    <textarea 
                      placeholder="Tell us what you loved about Rishitha..."
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      rows="3"
                    ></textarea>
                  </div>

                  <button type="submit" className="btn-primary w-100" disabled={!rating}>
                    Submit Rating
                  </button>
                </form>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="logo-icon">R</div>
              <h3>Rishitha</h3>
              <p>Exquisite dining experiences delivered with passion.</p>
              <div className="social-links">
                <Instagram size={20} />
                <Facebook size={20} />
                <Twitter size={20} />
              </div>
            </div>
            <div className="footer-links">
              <h4>Quick Links</h4>
              <a href="#home">Home</a>
              <a href="#menu-scan">Scan Menu</a>
              <a href="#booking">Reservations</a>
              <a href="#rating">Rate Us</a>
            </div>
            <div className="footer-hours">
              <h4>Opening Hours</h4>
              <p>Mon - Fri: 11:00 AM - 11:00 PM</p>
              <p>Sat - Sun: 09:00 AM - 12:00 AM</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 Rishitha Restaurant. All rights reserved.</p>
          </div>
        </div>
      </footer>
      {/* Name Popup Overlay */}
      {showNamePopup && (
        <div className="popup-overlay">
          <div className="popup-content glass">
            <h3>Almost There!</h3>
            <p>May we know who is sharing this feedback? (Optional)</p>
            <input
              type="text"
              placeholder="Your Name"
              value={raterName}
              onChange={(e) => setRaterName(e.target.value)}
              className="popup-input"
            />
            <div className="popup-actions">
              <button className="btn-secondary" onClick={() => setShowNamePopup(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleFinalRatingSubmit}>Submit</button>
            </div>
          </div>
        </div>
      )}
      {/* Apply Job Modal */}
      {isApplyModalOpen && selectedJob && (
        <div className="modal-overlay" style={{zIndex: 9999}}>
          <div className="modal-content glass-card border-0 shadow-lg p-4" style={{ maxWidth: '600px', width: '90%', margin: 'auto', background: 'white' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                <Briefcase className="text-primary" size={24} />
                Apply for {selectedJob.title}
              </h5>
              <button type="button" onClick={() => setIsApplyModalOpen(false)} className="btn btn-link text-muted p-0">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAppSubmit}>
              <div className="row g-3 mb-3">
                <div className="col-12 col-md-6">
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
                <div className="col-12 col-md-6">
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
                <div className="col-12 col-md-6">
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
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-bold text-muted text-uppercase ls-1">Resume (File)</label>
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
    </div>
  );
};

export default LandingPage;
