import { useState } from 'react';
import type { ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import jsPDF from 'jspdf';
import { Loader2, Download, MessageCircle, Mail, Printer } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Button from '@/components/Button';
import type { EstimateRequest, EstimateResponse } from '@/lib/api';
import { calculateEstimateLocally } from '@/lib/pricing';

const WHATSAPP_NUMBER = '917505205205';

// This demo runs fully client-side (calculateEstimateLocally), so it works
// on static hosting like GitHub Pages with no backend running. Once a
// backend is deployed, swap the mutationFn below for `getEstimate` from
// '@/lib/api' to use the server-side calculation instead.

const schema = z.object({
  plot_size_sqft: z.coerce.number().min(100, 'Minimum 100 sq.ft.').max(100000),
  construction_area_sqft: z.coerce.number().min(100, 'Minimum 100 sq.ft.').max(200000),
  floors: z.coerce.number().int().min(1).max(10),
  package_type: z.enum(['essential', 'premium', 'luxury', 'signature']),
  location_tier: z.enum(['metro', 'tier2', 'tier3']),
  material_quality: z.enum(['standard', 'premium', 'imported']),
  interior: z.coerce.boolean(),
  exterior: z.coerce.boolean(),
});

type FormValues = z.infer<typeof schema>;

const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

const LINE_LABELS: Record<keyof Omit<EstimateResponse, 'total_cost' | 'cost_per_sqft'>, string> = {
  material_cost: 'Material',
  labour_cost: 'Labour',
  finishing_cost: 'Finishing',
  electrical_cost: 'Electrical',
  plumbing_cost: 'Plumbing',
  tax: 'Tax (GST)',
};

export default function EstimatorPage() {
  const [result, setResult] = useState<EstimateResponse | null>(null);
  const [leadSaved, setLeadSaved] = useState(false);
  const { register, handleSubmit, getValues, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      plot_size_sqft: 1200,
      construction_area_sqft: 2000,
      floors: 2,
      package_type: 'premium',
      location_tier: 'metro',
      material_quality: 'premium',
      interior: true,
      exterior: true,
    },
  });

  const mutation = useMutation({
    mutationFn: async (payload: EstimateRequest) => {
      // Tiny artificial delay so the "Calculating…" state is visible —
      // the actual math is synchronous and instant.
      await new Promise((r) => setTimeout(r, 250));
      return calculateEstimateLocally(payload);
    },
    onSuccess: (data) => setResult(data),
  });

  function onSubmit(values: FormValues) {
    mutation.mutate(values as EstimateRequest);
  }

  function downloadPdf() {
    if (!result) return;
    const doc = new jsPDF();
    const values = getValues();
    doc.setFontSize(18);
    doc.text('BigLand Construction — Estimate', 14, 20);
    doc.setFontSize(11);
    doc.text(`Construction area: ${values.construction_area_sqft} sq.ft. · ${values.floors} floor(s)`, 14, 32);
    doc.text(`Package: ${values.package_type} · Material: ${values.material_quality}`, 14, 39);

    let y = 55;
    (Object.keys(LINE_LABELS) as Array<keyof typeof LINE_LABELS>).forEach((key) => {
      doc.text(LINE_LABELS[key], 14, y);
      doc.text(inr.format(result[key]), 160, y, { align: 'right' });
      y += 8;
    });
    doc.setFontSize(13);
    doc.text('Total', 14, y + 4);
    doc.text(inr.format(result.total_cost), 160, y + 4, { align: 'right' });
    doc.setFontSize(9);
    doc.text('This is an indicative estimate. Final pricing confirmed after a site visit.', 14, y + 20);

    doc.save('bigland-construction-estimate.pdf');
  }

  function shareWhatsApp() {
    if (!result) return;
    const text = `BigLand Construction Estimate\nTotal: ${inr.format(result.total_cost)}\nCost/sq.ft: ${inr.format(result.cost_per_sqft)}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  }

  function shareEmail() {
    if (!result) return;
    const subject = encodeURIComponent('My BigLand Construction Estimate');
    const body = encodeURIComponent(
      `Total estimate: ${inr.format(result.total_cost)}\nCost per sq.ft: ${inr.format(result.cost_per_sqft)}\n\nGenerated at biglandconstruction.com/estimate`,
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }

  function requestCallbackViaWhatsApp() {
    if (!result) return;
    const v = getValues();
    const text =
      `Hi, I'd like a callback about my estimate.\n` +
      `Area: ${v.construction_area_sqft} sq.ft. · ${v.floors} floor(s) · ${v.package_type} package\n` +
      `Estimated total: ${inr.format(result.total_cost)}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
    setLeadSaved(true);
  }

  return (
    <>
      <Navbar />
      <main className="pt-28 pb-20 max-w-container mx-auto px-6">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-semibold">
            Construction Cost <span className="text-accent">Estimator</span>
          </h1>
          <p className="text-text-muted mt-2 max-w-lg mx-auto">
            Get an instant, indicative breakdown. A consultant will confirm final pricing after a free site visit.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
            <Field label="Plot size (sq.ft.)" error={errors.plot_size_sqft?.message}>
              <input type="number" {...register('plot_size_sqft')} className="input" />
            </Field>
            <Field label="Construction area (sq.ft.)" error={errors.construction_area_sqft?.message}>
              <input type="number" {...register('construction_area_sqft')} className="input" />
            </Field>
            <Field label="Number of floors" error={errors.floors?.message}>
              <input type="number" {...register('floors')} className="input" />
            </Field>
            <Field label="Package type">
              <select {...register('package_type')} className="input">
                <option value="essential">Essential</option>
                <option value="premium">Premium</option>
                <option value="luxury">Luxury</option>
                <option value="signature">Signature</option>
              </select>
            </Field>
            <Field label="Location">
              <select {...register('location_tier')} className="input">
                <option value="metro">Metro city</option>
                <option value="tier2">Tier-2 city</option>
                <option value="tier3">Tier-3 / town</option>
              </select>
            </Field>
            <Field label="Material quality">
              <select {...register('material_quality')} className="input">
                <option value="standard">Standard</option>
                <option value="premium">Premium</option>
                <option value="imported">Imported</option>
              </select>
            </Field>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" {...register('interior')} /> Interior fit-out
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" {...register('exterior')} /> Exterior finishing
              </label>
            </div>

            <Button type="submit" variant="primary" disabled={mutation.isPending} className="mt-2">
              {mutation.isPending ? <><Loader2 size={16} className="animate-spin" /> Calculating…</> : 'Calculate Estimate'}
            </Button>
            {mutation.isError && (
              <p className="text-sm text-red-600">
                Something went wrong calculating your estimate. Please try again.
              </p>
            )}
          </form>

          <div>
            {result ? (
              <div className="rounded-[10px] border border-border bg-surface shadow-card p-6 sticky top-24">
                <h2 className="font-semibold mb-4">Estimate Breakdown</h2>
                <dl className="space-y-2 text-sm">
                  {(Object.keys(LINE_LABELS) as Array<keyof typeof LINE_LABELS>).map((key) => (
                    <div key={key} className="flex justify-between text-text-muted">
                      <dt>{LINE_LABELS[key]}</dt>
                      <dd>{inr.format(result[key])}</dd>
                    </div>
                  ))}
                </dl>
                <div className="border-t border-border mt-4 pt-4 flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-accent">{inr.format(result.total_cost)}</span>
                </div>
                <p className="text-xs text-text-muted mt-1">
                  ≈ {inr.format(result.cost_per_sqft)} / sq.ft.
                </p>

                <div className="grid grid-cols-2 gap-2 mt-6">
                  <Button variant="outline" type="button" onClick={downloadPdf}>
                    <Download size={15} /> PDF
                  </Button>
                  <Button variant="outline" type="button" onClick={() => window.print()}>
                    <Printer size={15} /> Print
                  </Button>
                  <Button variant="outline" type="button" onClick={shareWhatsApp}>
                    <MessageCircle size={15} /> WhatsApp
                  </Button>
                  <Button variant="outline" type="button" onClick={shareEmail}>
                    <Mail size={15} /> Email
                  </Button>
                </div>

                <Button
                  variant="primary"
                  type="button"
                  className="w-full mt-4"
                  onClick={requestCallbackViaWhatsApp}
                  disabled={leadSaved}
                >
                  {leadSaved ? 'Sent on WhatsApp ✓' : 'Request a Callback on WhatsApp'}
                </Button>
              </div>
            ) : (
              <div className="rounded-[10px] border border-dashed border-border p-10 text-center text-text-muted text-sm">
                Fill in the form and calculate to see your estimate here.
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-medium block mb-1">{label}</span>
      {children}
      {error && <span className="text-xs text-red-600 block mt-1">{error}</span>}
    </label>
  );
}
