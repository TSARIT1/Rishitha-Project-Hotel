import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UtensilsCrossed, Mail, Lock, Eye, EyeOff, ArrowLeft, KeyRound } from 'lucide-react';
import './Login.css'; // Reusing Login styles for consistency

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Request OTP, 2: Reset Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { default: api } = await import('../services/api');
      // POST /auth/forgot-password { email }
      await api.post('/auth/forgot-password', { email });
      setStep(2);
      alert('OTP sent to your email!');
    } catch (error) {
      console.error('Failed to send OTP:', error);
      const errorMessage = error.response?.data?.message || 'Failed to send OTP. Please check your email.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { default: api } = await import('../services/api');
      // POST /auth/reset-password { email, otp, newPassword }
      await api.post('/auth/reset-password', { email, otp, newPassword });
      alert('Password reset successfully! Please login with your new password.');
      navigate('/login');
    } catch (error) {
      console.error('Failed to reset password:', error);
      const errorMessage = error.response?.data?.message || 'Failed to reset password. Invalid OTP or Error.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Link to="/login" className="back-home">
        <ArrowLeft size={20} /> Back to Login
      </Link>
      
      <div className="login-card glass">
        <div className="login-header">
          <div className="login-logo">
            <UtensilsCrossed size={32} />
          </div>
          <h1>{step === 1 ? 'Forgot Password' : 'Reset Password'}</h1>
          <p>
            {step === 1 
              ? 'Enter your email to receive an OTP' 
              : 'Enter the OTP sent to your email and your new password'}
          </p>
        </div>

        {step === 1 ? (
          <form className="login-form" onSubmit={handleRequestOtp}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={18} />
                <input 
                  type="email" 
                  id="email" 
                  name="email"
                  placeholder="admin@rishitha.com"
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? <div className="spinner"></div> : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form className="login-form" onSubmit={handleResetPassword}>
             <div className="form-group">
              <label htmlFor="otp">Enter OTP</label>
              <div className="input-wrapper">
                <KeyRound className="input-icon" size={18} />
                <input 
                  type="text" 
                  id="otp" 
                  name="otp"
                  placeholder="Enter 6-digit OTP"
                  required 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="newPassword" 
                  name="newPassword"
                  placeholder="Enter new password"
                  required 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button 
                  type="button" 
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? <div className="spinner"></div> : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
