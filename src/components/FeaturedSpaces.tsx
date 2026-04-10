import { ArrowRight } from "lucide-react";
import modernLoft from "@/assets/modern-loft.jpg";
import podcastStudio from "@/assets/podcast-studio.jpg";
import artWorkshop from "@/assets/art-workshop.jpg";
import videoStudio from "@/assets/video-studio.jpg";

interface FeaturedSpacesProps {
  onExplore: () => void;
}

const spaces = [
  { title: "Modern Loft", price: "From $120/night", image: modernLoft },
  { title: "Podcast Studio", price: "From $80/hour", image: podcastStudio },
  { title: "Art Workshop", price: "From $95/session", image: artWorkshop },
  { title: "Video Studio", price: "From $150/hour", image: videoStudio },
];

const FeaturedSpaces = ({ onExplore }: FeaturedSpacesProps) => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto">
        <div className="mb-8 flex items-end justify-between">
          <h3 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">Featured Spaces</h3>
          <button onClick={onExplore} className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            View all <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {spaces.map((space) => (
            <div key={space.title} className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
              <div className="h-48 overflow-hidden">
                <img src={space.image} alt={space.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" width={640} height={512} />
              </div>
              <div className="flex items-center justify-between p-4">
                <span className="font-semibold text-foreground">{space.title}</span>
                <span className="text-sm text-muted-foreground">{space.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSpaces;
