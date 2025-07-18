
import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8', 
    lg: 'h-12',
    xl: 'h-16'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} flex items-center`}>
      <span className="text-red-600 font-bold text-lg">Z Delivery</span>
    </div>
  );
};

export default Logo;
