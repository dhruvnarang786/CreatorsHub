import { Mic, Video, Scissors, Camera, Plus, ChevronRight } from "lucide-react";
import type { CategoryKey } from "@/lib/data";

interface CategoryCardsProps {
  onCategory: (cat: CategoryKey) => void;
  onRegister: (mode: string) => void;
}

const findItems = [
  { icon: Mic, title: "Studio Space", cat: "studios" as CategoryKey },
  { icon: Video, title: "Videographer", cat: "videographers" as CategoryKey },
  { icon: Scissors, title: "Editor", cat: "editors" as CategoryKey },
  { icon: Camera, title: "Equipment", cat: "equipment" as CategoryKey },
];

const offerItems = [
  { icon: Plus, title: "List Studio", mode: "list-studio" },
  { icon: Video, title: "Offer Videography", mode: "register-videographer" },
  { icon: Scissors, title: "Offer Editing", mode: "register-editor" },
  { icon: Camera, title: "Rent Equipment", mode: "list-equipment" },
];

const CategoryCards = ({ onCategory, onRegister }: CategoryCardsProps) => {
  return (
    <section className="py-12 md:py-16">
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
          {/* I want to find */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h3 className="text-base font-bold text-foreground mb-3">I want to find</h3>
            <div className="space-y-1">
              {findItems.map((item) => (
                <button
                  key={item.title}
                  onClick={() => onCategory(item.cat)}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 transition-colors hover:bg-accent"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <item.icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{item.title}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>

          {/* I want to offer */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h3 className="text-base font-bold text-foreground mb-3">I want to offer</h3>
            <div className="space-y-1">
              {offerItems.map((item) => (
                <button
                  key={item.title}
                  onClick={() => onRegister(item.mode)}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 transition-colors hover:bg-accent"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F97316]/10">
                      <item.icon className="h-4 w-4 text-[#F97316]" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{item.title}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryCards;
