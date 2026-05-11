
import React from 'react';

function JobilleeLogo({
  className = "h-20 md:h-24 w-auto",
  style
}) {
  return (
    <img 
      src="https://horizons-cdn.hostinger.com/cc77e2b7-31d8-4f71-b490-d96eab13f289/chatgpt-image-12_03_03-10-thg-5-2026-VAA1P.png" 
      alt="Jobillee Bee Logo" 
      className={className} 
      style={{
        objectFit: 'contain',
        ...style
      }} 
    />
  );
}

export default JobilleeLogo;
