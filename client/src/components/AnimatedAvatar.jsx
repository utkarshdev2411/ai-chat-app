import React, { useRef } from 'react';
import Lottie from 'lottie-react';

const AnimatedAvatar = ({ src, alt, className, size = 40 }) => {
  const lottieRef = useRef();
  
  // Handle hover animation
  const handleMouseEnter = () => {
    if (lottieRef.current) {
      lottieRef.current.play();
    }
  };
  
  const handleMouseLeave = () => {
    if (lottieRef.current) {
      lottieRef.current.stop();
    }
  };
  
  // Check if it's a Lottie animation or a regular image
  const isLottie = src && (src.endsWith('.json') || src.includes('lottiefiles'));
  
  // Added error handling for avatar images
  const handleImageError = (e) => {
    // Fallback to a default avatar if the image fails to load
    e.target.onerror = null;
    e.target.src = 'https://api.dicebear.com/6.x/initials/svg?seed=' + (alt || 'User');
  };
  
  if (isLottie) {
    return (
      <div 
        className={`overflow-hidden flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Lottie
          lottieRef={lottieRef}
          animationData={src.includes('http') ? undefined : src}
          path={src.includes('http') ? src : undefined}
          loop={true}
          autoplay={false}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    );
  }
  
  // Fallback to regular image with error handling
  return (
    <img 
      src={src} 
      alt={alt} 
      className={className} 
      onError={handleImageError}
      style={size ? { width: size, height: size, objectFit: 'cover' } : {}}
    />
  );
};

export default AnimatedAvatar;