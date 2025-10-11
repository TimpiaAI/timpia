
// src/app/snpad/[secret_key]/page.tsx
import { notFound } from 'next/navigation';
import SnpadChatbot from '@/components/snpad-chatbot';
import "@/styles/snpad-chatbot.css"; // Import the NEW dedicated CSS file

// This is a Server Component, so we can access environment variables securely.
export default function SnpadSecurePage({ params }: { params: { secret_key: string } }) {
  const serverKey = process.env.SNPAD_SECRET_KEY;

  // 1. Validate the secret key.
  // If no key is set on the server or if the key from the URL doesn't match, show a 404 error.
  if (!serverKey || params.secret_key !== serverKey) {
    notFound();
  }

  // 2. If the key is valid, render the new advanced React chatbot component.
  return (
    // The fullscreen experience is handled by the component and its dedicated CSS.
    <SnpadChatbot />
  );
}
