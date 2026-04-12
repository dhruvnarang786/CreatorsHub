import { useState } from "react";
import { ArrowRight, Star } from "lucide-react";
import modernLoft from "@/assets/modern-loft.jpg";
import podcastStudio from "@/assets/podcast-studio.jpg";
import artWorkshop from "@/assets/art-workshop.jpg";
import videoStudio from "@/assets/video-studio.jpg";
import type { CategoryKey } from "@/lib/data";

interface FeaturedSpacesProps {
  onExplore: () => void;
}

const tabs: { label: string; key: CategoryKey }[] = [
  { label: "Studios", key: "studios" },
  { label: "Videographers", key: "videographers" },
  { label: "Editors", key: "editors" },
  { label: "Equipment", key: "equipment" },
];

const spaces = [
  { title: "Modern Loft", price: "$120/night", image: modernLoft, rating: 4.8, location: "Los Angeles, CA", badge: "Top Rated" },
  { title: "Podcast Studio", price: "$80/hour", image: podcastStudio, rating: 4.7, location: "New York, NY", badge: "Top Rated" },
  { title: "Art Workshop", price: "$95/session", image: artWorkshop, rating: 4.6, location: "Austin, TX", badge: "Popular" },
  { title: "Video Studio", price: "$180/hour", image: videoStudio, rating: 4.7, location: "Miami, FL", badge: "Popular" },
];

const FeaturedSpaces = ({ onExplore }: FeaturedSpacesProps) => {
  const [activeTab, setActiveTab] = useState<CategoryKey>("studios");

  return (
    <section className="bg-gradient-to-b from-transparent to-[#f5f0ea]/40 py-12 md:py-16">
      <div className="container mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl italic">
            Trending Spaces Near You
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-1 border-b border-border">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  activeTab === tab.key
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <button onClick={onExplore} className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {spaces.map((space) => (
            <div key={space.title} className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
              <div className="relative h-44 overflow-hidden">
                <img src={space.image} alt={space.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" width={640} height={512} />
                <span className={`absolute top-3 left-3 text-[10px] font-semibold px-2.5 py-1 rounded-full ${
                  space.badge === "Top Rated"
                    ? "bg-green-500 text-white"
                    : "bg-[#F97316] text-white"
                }`}>
                  {space.badge}
                </span>
              </div>
              <div className="p-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">{space.title}</span>
                  <div className="flex items-center gap-0.5">
                    <Star className="h-3 w-3 fill-[#F59E0B] text-[#F59E0B]" />
                    <span className="text-xs font-medium text-foreground">{space.rating}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{space.location}</p>
                <p className="text-sm font-bold text-foreground mt-1.5">{space.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSpaces;
