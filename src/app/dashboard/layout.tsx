
import React from 'react';

// This layout is specifically for the dashboard pages to prevent
// the main site header and footer from being rendered.
// It will be wrapped by the RootLayout, but the RootLayoutClient component
// will conditionally hide the header and footer based on the path.
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
