
import React, { useState, useEffect } from 'react';
import { removeBackground, loadImage } from '@/utils/backgroundRemover';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-12',
    xl: 'h-16'
  };

  useEffect(() => {
    const processLogo = async () => {
      try {
        setIsProcessing(true);
        
        // Load the original image
        const response = await fetch('/lovable-uploads/361d0332-e721-4f32-ae4b-d511255bb732.png');
        const blob = await response.blob();
        const imageElement = await loadImage(blob);
        
        // Remove background
        const processedBlob = await removeBackground(imageElement);
        const processedUrl = URL.createObjectURL(processedBlob);
        
        setLogoUrl(processedUrl);
      } catch (error) {
        console.error('Error processing logo:', error);
        // Fallback to original image if processing fails
        setLogoUrl('/lovable-uploads/361d0332-e721-4f32-ae4b-d511255bb732.png');
      } finally {
        setIsProcessing(false);
      }
    };

    processLogo();
  }, []);

  if (isProcessing) {
    return (
      <div className={`${sizeClasses[size]} ${className} flex items-center`}>
        <div className="animate-pulse bg-white/20 rounded h-full w-20"></div>
      </div>
    );
  }

  return (
    <img 
      src={logoUrl || '/lovable-uploads/361d0332-e721-4f32-ae4b-d511255bb732.png'} 
      alt="Z Delivery" 
      className={`${sizeClasses[size]} ${className} object-contain`}
    />
  );
};

export default Logo;
