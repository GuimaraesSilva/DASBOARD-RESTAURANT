'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/homepage/bg-home.jpg"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay escuro para melhor contraste */}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col gap-32 items-center justify-center px-4 sm:px-6 lg:px-8 text-center">
        {/* Logo */}
        <div className="w-full">
          <Image
            src="/logo.png"
            alt="Logo"
            width={isMobile ? 300 : 600}
            height={isMobile ? 300 : 600}
            className="object-contain"
            priority
          />
        </div>

        {/* Link */}
        <Link 
          href="/overview"
          className="group uppercase bg-[#412A22]/90 border border-white/20 text-white text-lg md:text-xl font-semibold px-12 py-4 rounded-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-4"
        >
          Enter
          <ArrowRight className="w-4 h-4 md:w-6 md:h-6 group-hover:translate-x-4 transition-transform duration-300" />
        </Link>
      </div>
    </div>
  );
}