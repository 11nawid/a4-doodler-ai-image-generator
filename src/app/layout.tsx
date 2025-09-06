
'use client';

import { useState, useEffect } from 'react';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import SplashScreen from '@/components/splash-screen';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // 2 seconds delay
    return () => clearTimeout(timer);
  }, []);


  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <title>A4 Doodler & AI Image Generator</title>
        <meta name="description" content="AI drawing and image generation tool." />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#A4C7B8" />
      </head>
      <body className="font-body antialiased select-none" suppressHydrationWarning>
        {loading ? <SplashScreen /> : children}
        <Toaster />
      </body>
    </html>
  );
}
