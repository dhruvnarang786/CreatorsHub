import { useState } from "react";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { registrationConfig } from "@/lib/data";

interface RegistrationPageProps {
  mode: string;
  onBack: () => void;
}

const RegistrationPage = ({ mode, onBack }: RegistrationPageProps) => {
  const [submitted, setSubmitted] = useState(false);
  const config = registrationConfig[mode];

  if (!config) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6">
        <button onClick={onBack} className="mb-4 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </button>

        <div className="grid gap-10 lg:grid-cols-2">
          <div className="py-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Registration</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">{config.heading}</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">{config.description}</p>
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-foreground">
                <CheckCircle className="h-5 w-5 text-primary" /> Simple onboarding for service providers
              </div>
              <div className="flex items-center gap-3 text-foreground">
                <CheckCircle className="h-5 w-5 text-primary" /> Add pricing, location, and portfolio details
              </div>
              <div className="flex items-center gap-3 text-foreground">
                <CheckCircle className="h-5 w-5 text-primary" /> Built to convert visitors into enquiries
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
            {!submitted ? (
              <form onSubmit={handleSubmit}>
                {config.fields.map((pair, i) => (
                  <div key={i} className="mt-4 grid gap-4 sm:grid-cols-2">
                    {pair.map((label) => (
                      <div key={label}>
                        <label className="mb-1.5 block text-sm font-medium text-foreground">{label}</label>
                        <input placeholder={`Enter ${label.toLowerCase()}`} className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring" />
                      </div>
                    ))}
                  </div>
                ))}
                <div className="mt-4">
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Description</label>
                  <textarea placeholder={config.textarea} className="min-h-[120px] w-full resize-y rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring" />
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Portfolio / Website Link</label>
                    <input placeholder="Paste link" className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Upload Images / Work Samples</label>
                    <input placeholder="Add drive or folder link" className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring" />
                  </div>
                </div>
                <Button variant="hero" size="lg" className="mt-6 w-full" type="submit">Submit Registration</Button>
              </form>
            ) : (
              <div className="py-12 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Registration Submitted</h3>
                <p className="mx-auto mt-3 max-w-sm text-muted-foreground">
                  Your details have been captured. We'll review and get back to you soon.
                </p>
                <Button variant="outline" className="mt-6" onClick={onBack}>Return Home</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
