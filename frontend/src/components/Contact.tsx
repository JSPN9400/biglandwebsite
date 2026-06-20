import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Phone, MessageCircle, Loader2, CheckCircle2 } from 'lucide-react';
import Button from '@/components/Button';

const schema = z.object({
  name: z.string().min(2, 'Enter your full name'),
  phone: z
    .string()
    .min(10, 'Enter a valid phone number')
    .regex(/^[0-9+\s-]+$/, 'Digits only'),
  email: z.string().email('Enter a valid email').optional().or(z.literal('')),
  message: z.string().max(500).optional(),
});

type FormValues = z.infer<typeof schema>;

const WHATSAPP_NUMBER = '917505205205';

// Static demo: this form has no backend to POST to (GitHub Pages can't run
// a server), so submitting hands the details to WhatsApp instead, where a
// real person can pick it up. Once a backend is deployed, swap this for a
// `submitLead(...)` call from '@/lib/api' to store leads in Postgres instead.
export default function Contact() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setStatus('submitting');
    const text =
      `New enquiry from the website:\n` +
      `Name: ${values.name}\n` +
      `Phone: ${values.phone}\n` +
      (values.email ? `Email: ${values.email}\n` : '') +
      (values.message ? `Message: ${values.message}` : '');
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
    setStatus('success');
    reset();
  }

  return (
    <section id="contact" aria-labelledby="contact-title" className="py-20">
      <div className="max-w-container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-10 bg-surface border border-border rounded-[10px] shadow-card p-8 md:p-12">
          <div>
            <span className="text-xs font-semibold text-accent uppercase tracking-wide">Start Your Journey</span>
            <h2 id="contact-title" className="text-3xl font-semibold mt-2 mb-3">
              Let's Build Your <span className="text-accent">Dream Home</span>
            </h2>
            <p className="text-text-muted mb-6">
              Get a free consultation and estimate. Our team will respond within 20 minutes.
            </p>

            <div className="flex flex-col gap-3">
              <a
                href="tel:+917505205205"
                className="inline-flex items-center gap-2 text-accent font-semibold text-lg"
              >
                <Phone size={18} /> +91 7505 205 205
              </a>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi, I would like a free construction estimate.')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-text-muted hover:text-text text-sm"
              >
                <MessageCircle size={18} /> Chat on WhatsApp
              </a>
            </div>
          </div>

          <div>
            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center text-center h-full gap-3 py-8">
                <CheckCircle2 className="text-accent" size={40} />
                <p className="font-semibold">Opened on WhatsApp.</p>
                <p className="text-sm text-text-muted">Send the message and our team will reply within 20 minutes.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
                <div>
                  <label htmlFor="name" className="text-sm font-medium block mb-1">Full name</label>
                  <input
                    id="name"
                    {...register('name')}
                    className="w-full rounded-[10px] border border-border px-4 py-2.5 bg-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                  />
                  {errors.name && <p id="name-error" className="text-xs text-red-600 mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label htmlFor="phone" className="text-sm font-medium block mb-1">Phone number</label>
                  <input
                    id="phone"
                    type="tel"
                    {...register('phone')}
                    className="w-full rounded-[10px] border border-border px-4 py-2.5 bg-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? 'phone-error' : undefined}
                  />
                  {errors.phone && <p id="phone-error" className="text-xs text-red-600 mt-1">{errors.phone.message}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="text-sm font-medium block mb-1">Email (optional)</label>
                  <input
                    id="email"
                    type="email"
                    {...register('email')}
                    className="w-full rounded-[10px] border border-border px-4 py-2.5 bg-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                  />
                  {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <label htmlFor="message" className="text-sm font-medium block mb-1">Tell us about your project (optional)</label>
                  <textarea
                    id="message"
                    rows={3}
                    {...register('message')}
                    className="w-full rounded-[10px] border border-border px-4 py-2.5 bg-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                  />
                </div>

                <Button type="submit" variant="primary" disabled={status === 'submitting'} className="w-full">
                  {status === 'submitting' ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Opening WhatsApp…
                    </>
                  ) : (
                    'Get Free Estimate'
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
