import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  QrCode, Utensils, Calendar, Users, Star, 
  MapPin, Phone, Instagram, Facebook, Twitter,
  ChevronRight, ArrowRight, Camera, Check, Play,
  Briefcase, Clock
} from 'lucide-react';
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
    type: 'Table'
  });

  const [scanActive, setScanActive] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showRatingSuccess, setShowRatingSuccess] = useState(false);
  const [showNamePopup, setShowNamePopup] = useState(false);
  const [raterName, setRaterName] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
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
              <div className={`qr-mockup ${scanActive ? 'scanning' : ''}`}>
                <div className="qr-box">
                  <QrCode size={180} />
                  <div className="scan-line"></div>
                </div>
                {!scanActive ? (
                  <button className="btn-scan" onClick={() => setScanActive(true)}>
                    <Camera size={18} /> Tap to Scan Simulation
                  </button>
                ) : (
                  <div className="scan-feedback">
                    <p className="pulse">Linking to Table #12...</p>
                    <button className="btn-link" onClick={() => setScanActive(false)}>Reset</button>
                  </div>
                )}
              </div>
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
            {[
              { title: 'Head Chef', department: 'Kitchen', type: 'Full Time', location: 'Main Branch', salary: '₹45k - ₹60k' },
              { title: 'Waitstaff', department: 'Service', type: 'Part Time', location: 'Main Branch', salary: '₹12k - ₹15k' },
              { title: 'Restaurant Manager', department: 'Management', type: 'Full Time', location: 'Downtown', salary: '₹50k - ₹70k' }
            ].map((job, index) => (
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
                  <button className="btn-apply">Apply Now <ArrowRight size={16} /></button>
                </div>
              </ScrollReveal>
            ))}
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
                      <select name="guests" value={bookingFormData.guests} onChange={handleInputChange}>
                        {[1, 2, 3, 4, 5, 6, 8, 10, 15].map(n => (
                          <option key={n} value={n}>{n} Persons</option>
                        ))}
                        <option value="20+">20+ Persons</option>
                      </select>
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
                      <select name="time" value={bookingFormData.time} onChange={handleInputChange} required>
                        <option value="">Select Time</option>
                        <option>12:00 PM</option>
                        <option>01:30 PM</option>
                        <option>06:00 PM</option>
                        <option>07:30 PM</option>
                        <option>09:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Booking Type</label>
                    <div className="radio-group">
                      <label className={`radio-label ${bookingFormData.type === 'Table' ? 'active' : ''}`}>
                        <input 
                          type="radio" 
                          name="type" 
                          value="Table" 
                          checked={bookingFormData.type === 'Table'}
                          onChange={handleInputChange}
                        /> Table
                      </label>
                      <label className={`radio-label ${bookingFormData.type === 'Party' ? 'active' : ''}`}>
                        <input 
                          type="radio" 
                          name="type" 
                          value="Party"
                          checked={bookingFormData.type === 'Party'}
                          onChange={handleInputChange}
                        /> Party / Event
                      </label>
                      <label className={`radio-label ${bookingFormData.type === 'Other' ? 'active' : ''}`}>
                        <input 
                          type="radio" 
                          name="type" 
                          value="Other"
                          checked={bookingFormData.type === 'Other'}
                          onChange={handleInputChange}
                        /> Other
                      </label>
                    </div>
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
    </div>
  );
};

export default LandingPage;
