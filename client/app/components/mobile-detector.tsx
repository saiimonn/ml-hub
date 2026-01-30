'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MobileDetector() {
  const router = useRouter();

  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const isTablet = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(userAgent);
      const isSmallScreen = window.innerWidth < 1024; // Less than 1024px width

      if ((isMobile || isTablet || isSmallScreen) && !window.location.pathname.includes('/not-supported')) {
        router.push('/not-supported');
      }
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);

    return () => window.removeEventListener('resize', checkDevice);
  }, [router]);

  return null;
}
