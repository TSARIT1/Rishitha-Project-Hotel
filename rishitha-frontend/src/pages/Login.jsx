import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UtensilsCrossed, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { default: api } = await import('../services/api');
      
      const response = await api.post('/auth/login', {
        usernameOrEmail: formData.username, 
        password: formData.password
      });

      if (response.status === 200) {
        // According to AuthController: JwtResponse(jwt, id, username, email, roles)
        // Adjust based on actual response structure. 
        // If response.data is the JwtResponse object directly:
        const { accessToken, ...userData } = response.data;
        
        login(userData, accessToken);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
      const errorMessage = error.response?.data?.message || 'Login failed! Please check your credentials.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Link to="/" className="back-home">
        <ArrowLeft size={20} /> Back to Site
      </Link>
      
      <div className="login-card glass">
        <div className="login-header">
          <div className="login-logo">
            <UtensilsCrossed size={32} />
          </div>
          <h1>Welcome Back</h1>
          <p>Please enter your details to access the dashboard</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username or Email</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={18} />
              <input 
                type="text" 
                id="username" 
                name="username"
                placeholder="dighesaurabh46@gmail.com"
                required 
                value={formData.username}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input 
                type={showPassword ? "text" : "password"} 
                id="password" 
                name="password"
                placeholder="••••••••"
                required 
                value={formData.password}
                onChange={handleChange}
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

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" /> Remember me
            </label>
            <Link to="/forgot-password" className="forgot-password">Forgot password?</Link>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? <div className="spinner"></div> : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <p>Don't have an account? <span>Contact Administrator</span></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
