import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '@/components/Button';

const PACKAGES = [
  {
    name: 'Essential',
    price: '₹1,650',
    unit: '/ sq.ft.',
    features: ['Standard fittings', 'RCC structure', '5-year structural warranty', 'Basic electrical & plumbing'],
  },
  {
    name: 'Premium',
    price: '₹1,950',
    unit: '/ sq.ft.',
    features: ['Branded fittings', 'Vitrified tiles', '7-year structural warranty', 'Modular kitchen shell'],
    featured: true,
  },
  {
    name: 'Luxury',
    price: '₹2,450',
    unit: '/ sq.ft.',
    features: ['Designer fittings', 'Italian marble options', '10-year structural warranty', 'False ceiling included'],
  },
  {
    name: 'Signature',
    price: 'Custom',
    unit: 'quote',
    features: ['Bespoke architecture', 'Imported materials', '10-year warranty', 'Dedicated project architect'],
  },
];

export default function Packages() {
  return (
    <section id="packages" aria-labelledby="packages-title" className="py-20">
      <div className="max-w-container mx-auto px-6">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold text-accent uppercase tracking-wide">Our Packages</span>
          <h2 id="packages-title" className="text-3xl md:text-4xl font-semibold mt-2">
            Choose Your <span className="text-accent">Construction</span> Plan
          </h2>
          <p className="text-text-muted max-w-md mx-auto mt-3">
            Premium packages designed to match your vision, budget, and lifestyle.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PACKAGES.map((pkg, i) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className={`rounded-[10px] border p-6 bg-surface shadow-card hover:shadow-hover transition-shadow ${
                pkg.featured ? 'border-accent ring-1 ring-accent' : 'border-border'
              }`}
            >
              {pkg.featured && (
                <span className="text-[0.65rem] font-semibold text-accent uppercase tracking-wide">
                  Most Popular
                </span>
              )}
              <h3 className="text-xl font-semibold mt-1">{pkg.name}</h3>
              <div className="mt-2 mb-5">
                <span className="text-2xl font-bold">{pkg.price}</span>{' '}
                <span className="text-text-muted text-sm">{pkg.unit}</span>
              </div>
              <ul className="space-y-2 mb-6">
                {pkg.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-text-muted">
                    <Check size={16} className="text-accent shrink-0 mt-0.5" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/estimate" className="block">
                <Button variant={pkg.featured ? 'primary' : 'outline'} className="w-full">
                  Get Estimate
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
