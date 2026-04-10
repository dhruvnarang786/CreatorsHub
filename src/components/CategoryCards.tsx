import { Mic, Video, Scissors, Camera } from "lucide-react";
import type { CategoryKey } from "@/lib/data";

interface CategoryCardsProps {
  onCategory: (cat: CategoryKey) => void;
  onRegister: (mode: string) => void;
}

const findCards = [
  { icon: Mic, title: "Studio Space", desc: "Book podcast, photography, or video studios", cat: "studios" as CategoryKey },
  { icon: Video, title: "Videographer", desc: "Hire creators for filming and production", cat: "videographers" as CategoryKey },
  { icon: Scissors, title: "Editor", desc: "Find editors for reels, podcasts, and YouTube", cat: "editors" as CategoryKey },
  { icon: Camera, title: "Equipment", desc: "Rent cameras, lighting, and production gear", cat: "equipment" as CategoryKey },
];

const listCards = [
  { icon: Mic, title: "List My Studio", desc: "Publish your studio listing", mode: "list-studio" },
  { icon: Video, title: "Register as Videographer", desc: "Get hired for shoots", mode: "register-videographer" },
  { icon: Scissors, title: "Register as Editor", desc: "Offer editing services", mode: "register-editor" },
  { icon: Camera, title: "List Equipment", desc: "Rent out production equipment", mode: "list-equipment" },
];

const CategoryCards = ({ onCategory, onRegister }: CategoryCardsProps) => {
  return (
    <section className="bg-hero py-16 md:py-24">
      <div className="container mx-auto">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">I want to find</p>
            <div className="grid gap-4">
              {findCards.map((c) => (
                <div key={c.title} onClick={() => onCategory(c.cat)} className="flex cursor-pointer items-start gap-4 rounded-2xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-orange-100">
                    <c.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">{c.title}</h4>
                    <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">I want to list</p>
            <div className="grid gap-4">
              {listCards.map((c) => (
                <div key={c.title} onClick={() => onRegister(c.mode)} className="flex cursor-pointer items-start gap-4 rounded-2xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-orange-100">
                    <c.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">{c.title}</h4>
                    <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryCards;
