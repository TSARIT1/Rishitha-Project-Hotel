import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import './StatCard.css';

const StatCard = ({ title, value, change, trend, icon: Icon, color, subtitle }) => {
  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp size={16} />;
    if (trend === 'down') return <TrendingDown size={16} />;
    if (trend === 'warning') return <AlertCircle size={16} />;
    return null;
  };

  const getTrendClass = () => {
    if (trend === 'up') return 'trend-up';
    if (trend === 'down') return 'trend-down';
    if (trend === 'warning') return 'trend-warning';
    return 'trend-neutral';
  };

  return (
    <div className={`stat-card hover-lift stat-${color}`}>
      <div className="stat-header">
        <div className={`stat-icon icon-${color}`}>
          <Icon size={24} />
        </div>
        <div className="stat-info">
          <h3 className="stat-title">{title}</h3>
          <p className="stat-value">{value}</p>
        </div>
      </div>
      <div className="stat-footer">
        <div className={`stat-change ${getTrendClass()}`}>
          {getTrendIcon()}
          <span>{change}</span>
        </div>
        <span className="stat-subtitle">{subtitle}</span>
      </div>
    </div>
  );
};

export default StatCard;
