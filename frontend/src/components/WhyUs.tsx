import { motion } from 'framer-motion';
import { ShieldCheck, Clock, Wallet, Users } from 'lucide-react';

const REASONS = [
  { icon: ShieldCheck, title: '10-Year Warranty', desc: 'Structural warranty backed by 470+ quality checks at every stage.' },
  { icon: Clock, title: 'On-Time Delivery', desc: 'Fixed timelines with weekly progress updates, no surprises.' },
  { icon: Wallet, title: 'Transparent Pricing', desc: 'No hidden costs — every line item explained upfront.' },
  { icon: Users, title: 'Dedicated Project Manager', desc: 'One point of contact from foundation to handover.' },
];

export default function WhyUs() {
  return (
    <section id="why-us" aria-labelledby="why-title" className="py-20">
      <div className="max-w-container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 id="why-title" className="text-3xl md:text-4xl font-semibold">
            Why Work <span className="text-accent">With Us</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {REASONS.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="rounded-[10px] border border-border bg-surface p-6 shadow-card hover:shadow-hover transition-shadow text-center"
            >
              <r.icon className="mx-auto text-accent mb-3" size={28} aria-hidden />
              <h3 className="font-semibold mb-1">{r.title}</h3>
              <p className="text-sm text-text-muted">{r.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
