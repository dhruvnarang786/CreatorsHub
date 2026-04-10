import { Search, Sparkles, Play } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Discover",
    description: "Browse creative spaces by type, location, and budget in one clean feed.",
  },
  {
    icon: Sparkles,
    title: "Shortlist",
    description: "Compare vibe, amenities, and rates quickly to find your perfect match.",
  },
  {
    icon: Play,
    title: "Book",
    description: "Send your booking request and lock your creator space with confidence.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-16 md:py-24">
      <div className="container mx-auto">
        <h3 className="mb-10 text-3xl font-bold tracking-tight text-foreground md:text-4xl">How It Works</h3>
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.title} className="rounded-2xl border border-border bg-accent/50 p-8 transition-all duration-200 hover:-translate-y-1 hover:shadow-sm">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
                <step.icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <h4 className="mb-3 text-xl font-bold text-foreground">{step.title}</h4>
              <p className="leading-relaxed text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
