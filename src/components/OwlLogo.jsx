import React from 'react';
import owlLogoSvg from '../assets/owl-logo.svg';

const OwlLogo = ({ 
  className = "h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12", 
  size = "default" 
}) => {
  // Size variants for different use cases
  const sizeClasses = {
    small: "h-6 w-6 sm:h-8 sm:w-8",
    default: "h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12",
    large: "h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20",
    xlarge: "h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 lg:h-28 lg:w-28"
  };

  const finalClassName = size !== "default" ? sizeClasses[size] : className;

  return (
    <img
      src={owlLogoSvg}
      alt="TOWSOTH Owl Logo"
      className={`${finalClassName} object-contain transition-all duration-300 hover:scale-105`}
      style={{ 
        maxWidth: '100%', 
        height: 'auto',
        imageRendering: 'crisp-edges'
      }}
    />
  );
};

export default OwlLogo;