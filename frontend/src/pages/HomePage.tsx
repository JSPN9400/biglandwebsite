import { useRef } from 'react';
import type { MouseEvent } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Packages from '@/components/Packages';
import Services from '@/components/Services';
import WhyUs from '@/components/WhyUs';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function HomePage() {
  const mainRef = useRef<HTMLElement>(null);

  function skipToContent(e: MouseEvent) {
    e.preventDefault();
    mainRef.current?.focus();
    mainRef.current?.scrollIntoView();
  }

  return (
    <>
      {/* href="#main" is kept for non-JS / middle-click users, but the
          click is intercepted so it doesn't get swallowed by HashRouter's
          own use of the # for page routing. */}
      <a href="#main" onClick={skipToContent} className="skip-link">Skip to content</a>
      <Navbar />
      <main id="main" ref={mainRef} tabIndex={-1}>
        <Hero />
        <Packages />
        <Services />
        <WhyUs />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
