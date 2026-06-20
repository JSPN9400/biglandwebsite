import { useEffect, useRef, useState } from 'react';
import { Crown, Calculator, ChevronDown } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import Button from '@/components/Button';
import { scrollToId } from '@/lib/scroll';

const STATS = [
  { value: 20, suffix: 'L+', label: 'Sq. Ft. Constructed' },
  { value: 470, suffix: '+', label: 'Quality Checks' },
  { value: 11, suffix: '+', label: 'Years Experience' },
];

function Counter({ target }: { target: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1200;
    const start = performance.now();
    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      setValue(Math.round(progress * target));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [inView, target]);

  return <span ref={ref}>{value}</span>;
}

export default function Hero() {
  return (
    <section className="relative" aria-labelledby="hero-title">
      <img
        src="https://res.cloudinary.com/dpvpnwhm4/image/upload/v1781864169/Construct_Your_Dream_Home_10_q0l87a.png"
        alt="Luxury home entrance with warm golden hour lighting"
        className="absolute inset-0 w-full h-full object-cover"
        fetchPriority="high"
        decoding="async"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />

      <div className="relative max-w-container mx-auto px-6 pt-40 pb-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-xl text-white"
        >
          <div className="inline-flex items-center gap-2 text-sm font-medium text-accent-light mb-4">
            <Crown size={16} aria-hidden /> Premium Home Construction
          </div>
          <h1 id="hero-title" className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            Construct Your <strong className="text-accent-light">Dream Home</strong> With BigLand Construction
          </h1>
          <p className="text-white/85 mb-8">
            Experience world-class luxury construction with premium materials, transparent processes,
            and a 10-year warranty. Your vision, built with precision.
          </p>
          <div className="flex flex-wrap gap-3 mb-12">
            <button onClick={() => scrollToId('contact')}>
              <Button variant="primary">
                <Calculator size={16} aria-hidden /> Get Free Estimate
              </Button>
            </button>
            <button onClick={() => scrollToId('packages')}>
              <Button variant="outline" className="!text-white !border-white/40 hover:!bg-white/10">
                Explore Packages
              </Button>
            </button>
          </div>

          <dl className="flex flex-wrap gap-8">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd className="text-2xl font-bold">
                  <Counter target={stat.value} />
                  {stat.suffix}
                </dd>
                <div className="text-xs text-white/70 mt-1">{stat.label}</div>
              </div>
            ))}
          </dl>
        </motion.div>
      </div>

      <button
        onClick={() => scrollToId('packages')}
        aria-label="Scroll to packages"
        className="hidden md:flex absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-1 text-white/70 text-xs"
      >
        Scroll
        <ChevronDown size={16} aria-hidden />
      </button>
    </section>
  );
}
