import React, { useState } from 'react';

interface NinjaAvatarProps {
  src?: string;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  silhouette?: boolean;
}

const sizeClasses = {
  xs: 'w-7 h-7 text-[10px]',
  sm: 'w-10 h-10 text-xs',
  md: 'w-14 h-14 text-sm',
  lg: 'w-20 h-20 text-lg',
  xl: 'w-28 h-28 text-2xl'
};

export const NinjaAvatar: React.FC<NinjaAvatarProps> = ({
  src,
  name,
  size = 'md',
  className = '',
  silhouette = false
}) => {
  const [error, setError] = useState(false);

  const getInitials = (n: string) => {
    const parts = (n || 'Shinobi').split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return parts[0].slice(0, 2).toUpperCase();
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-lg overflow-hidden border border-neutral-800 bg-neutral-900 shadow-sm ${sizeClasses[size]} ${className}`}
    >
      {!error && src ? (
        <img
          src={src}
          alt={name}
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={() => setError(true)}
          className={`w-full h-full object-cover object-top transition-all duration-300 ${
            silhouette ? 'brightness-0 contrast-200' : 'hover:scale-105'
          }`}
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-950 text-neutral-300 font-mono font-bold select-none p-1 text-center">
          <span className="leading-none text-orange-400">{getInitials(name)}</span>
          <span className="text-[8px] font-normal text-neutral-500 uppercase tracking-widest mt-0.5 truncate max-w-full">
            NINJA
          </span>
        </div>
      )}
    </div>
  );
};
