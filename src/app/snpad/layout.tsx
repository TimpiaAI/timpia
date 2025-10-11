
// src/app/snpad/layout.tsx
import React from 'react';

// This layout is specifically for the snpad chatbot page to prevent
// the main site header and footer from being rendered.
export default function SnpadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
