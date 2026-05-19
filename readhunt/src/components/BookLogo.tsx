import React from 'react';

interface BookLogoProps {
  size?: number;
}

export const BookLogo: React.FC<BookLogoProps> = ({ size = 48 }) => {
  return (
    <img
      src="/lasjakten-logo.png"
      alt="Läsjakten"
      width={size}
      height={size}
      style={{ objectFit: 'contain' }}
    />
  );
};
