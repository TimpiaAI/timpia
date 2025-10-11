// src/components/logo.tsx
import React from 'react';
import Image, { type ImageProps } from 'next/image';

// This component uses next/image to render the site's favicon.
// It accepts standard ImageProps, but defaults width and height.
interface LogoProps extends Omit<ImageProps, 'src' | 'alt'> {
  // src and alt are handled internally.
}

const Logo: React.FC<LogoProps> = ({ className, width = 28, height = 28, ...props }) => {
  return (
    <Image
      src="/logo.svg"
      alt="Timpia AI Logo"
      width={width}
      height={height}
      className={className}
      priority // The logo is usually part of the Largest Contentful Paint (LCP)
      {...props}
    />
  );
};

export default Logo;
