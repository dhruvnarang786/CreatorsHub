import { Search, Clock, Upload } from "lucide-react";

const features = [
  { icon: Search, title: "Discover quickly", desc: "Users can browse by city, service type, budget, and availability without clutter." },
  { icon: Clock, title: "Simple booking flow", desc: "Every listing is designed to move visitors from search to shortlist to booking request." },
  { icon: Upload, title: "Easy provider onboarding", desc: "Studios, videographers, editors, and equipment owners can register from one clear interface." },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="bg-hero py-16 md:py-24">
      <div className="container mx-auto">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Why this works</p>
            <h3 className="mt-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">Built to feel premium but stay simple.</h3>
          </div>
          <p className="max-w-md text-muted-foreground">
            The interface guides users quickly: discover what they need, compare listings, and move toward a booking.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-border bg-card p-8 shadow-sm">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-orange-100">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h4 className="mb-3 text-xl font-bold text-foreground">{f.title}</h4>
              <p className="leading-relaxed text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
