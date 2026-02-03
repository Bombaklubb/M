import React from 'react';

interface BookLogoProps {
  size?: number;
}

export const BookLogo: React.FC<BookLogoProps> = ({ size = 48 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Green book (back) */}
      <rect
        x="12"
        y="8"
        width="28"
        height="48"
        rx="2"
        fill="#22c55e"
        transform="rotate(-8 12 8)"
      />
      {/* Red book (middle) */}
      <rect
        x="20"
        y="6"
        width="28"
        height="48"
        rx="2"
        fill="#ef4444"
        transform="rotate(-2 20 6)"
      />
      {/* Blue book (front) */}
      <rect
        x="24"
        y="8"
        width="28"
        height="48"
        rx="2"
        fill="#3b82f6"
        transform="rotate(4 24 8)"
      />
      {/* Book spine lines */}
      <rect
        x="26"
        y="12"
        width="2"
        height="40"
        fill="#2563eb"
        transform="rotate(4 26 12)"
      />
    </svg>
  );
};
