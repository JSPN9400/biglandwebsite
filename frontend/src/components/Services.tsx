import { motion } from 'framer-motion';

const SERVICES = [
  { title: 'Residential Construction', img: 'https://i.pinimg.com/1200x/b2/64/91/b2649169d21b6a0d807114d325fc73f6.jpg' },
  { title: 'Commercial Construction', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop&auto=format' },
  { title: 'Interior Design', img: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=600&h=400&fit=crop&auto=format' },
  { title: 'Renovation', img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop&auto=format' },
  { title: 'Architectural Services', img: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&h=400&fit=crop&auto=format' },
  { title: 'Contractor Services', img: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&h=400&fit=crop&auto=format' },
];

export default function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="py-20 bg-surface border-y border-border">
      <div className="max-w-container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 id="services-title" className="text-3xl md:text-4xl font-semibold">
            Services <span className="text-accent">We Offer</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((s, i) => (
            <motion.article
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="rounded-[10px] overflow-hidden border border-border bg-bg shadow-card hover:shadow-hover transition-shadow"
            >
              <img src={s.img} alt={s.title} loading="lazy" className="w-full h-48 object-cover" width={600} height={400} />
              <div className="p-5">
                <h3 className="font-semibold mb-2">{s.title}</h3>
                <button
                  className="text-sm text-accent font-medium hover:underline"
                  onClick={() => {
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Know more →
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
