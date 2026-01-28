
import React from 'react';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import './ScrollReveal.css';

const ScrollReveal = ({ children, className = '', animation = 'fade-up', delay = 0 }) => {
  const [ref, isVisible] = useIntersectionObserver({ triggerOnce: true });
  
  const style = {
    transitionDelay: `${delay}ms`
  };

  return (
    <div 
      ref={ref} 
      className={`scroll-reveal ${animation} ${isVisible ? 'active' : ''} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
