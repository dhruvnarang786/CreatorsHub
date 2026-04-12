import { useRef, useCallback } from "react";
import { Mic, Video, Scissors, Camera, Plus, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const findItems = [
  { icon: Mic, title: "Studio Space", path: "/category/studios" },
  { icon: Video, title: "Videographer", path: "/category/videographers" },
  { icon: Scissors, title: "Editor", path: "/category/editors" },
  { icon: Camera, title: "Equipment", path: "/category/equipment" },
];

const offerItems = [
  { icon: Plus, title: "List Studio", path: "/register/list-studio" },
  { icon: Video, title: "Offer Videography", path: "/register/register-videographer" },
  { icon: Scissors, title: "Offer Editing", path: "/register/register-editor" },
  { icon: Camera, title: "Rent Equipment", path: "/register/list-equipment" },
];

const GlowCard = ({
  title,
  items,
  accentColor,
}: {
  title: string;
  items: typeof findItems;
  accentColor: "primary" | "orange";
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--glow-x", `${x}px`);
    card.style.setProperty("--glow-y", `${y}px`);
  }, []);

  const iconBg = accentColor === "primary" ? "bg-[hsl(217,91%,60%)]/10" : "bg-[hsl(24,95%,53%)]/10";
  const iconColor = accentColor === "primary" ? "text-[hsl(217,91%,60%)]" : "text-[hsl(24,95%,53%)]";

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="group relative rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 overflow-hidden"
    >
      {/* Cursor glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background:
            "radial-gradient(300px circle at var(--glow-x, 50%) var(--glow-y, 50%), hsl(24 95% 53% / 0.06), transparent 60%)",
        }}
      />
      {/* Gradient border glow on hover */}
      <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-[hsl(217,91%,60%)]/20 via-transparent to-[hsl(24,95%,53%)]/20 -z-10" />

      <h3 className="text-base font-bold text-foreground mb-3 relative z-10">{title}</h3>
      <div className="space-y-1 relative z-10">
        {items.map((item) => (
          <button
            key={item.title}
            onClick={() => navigate(item.path)}
            className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 transition-all duration-200 hover:bg-accent hover:scale-[1.01] hover:shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconBg}`}>
                <item.icon className={`h-4 w-4 ${iconColor}`} />
              </div>
              <span className="text-sm font-medium text-foreground">{item.title}</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-hover/item:translate-x-0.5" />
          </button>
        ))}
      </div>
    </div>
  );
};

const CategoryCards = () => {
  return (
    <section className="py-14 md:py-18">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            What are you looking for?
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Studios, videographers, editors — all in one place
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
          <GlowCard title="I want to find" items={findItems} accentColor="primary" />
          <GlowCard title="I want to offer" items={offerItems} accentColor="orange" />
        </div>
      </div>
    </section>
  );
};

export default CategoryCards;
