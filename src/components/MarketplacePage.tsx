import { useState, useMemo } from "react";
import { ArrowLeft, Star, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { marketplaceData, titleMap, subMap, type CategoryKey } from "@/lib/data";

interface MarketplacePageProps {
  category: CategoryKey;
  onBack: () => void;
}

const MarketplacePage = ({ category, onBack }: MarketplacePageProps) => {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("all");
  const [sort, setSort] = useState("popular");

  const items = marketplaceData[category];
  const cities = useMemo(() => ["all", ...new Set(items.map((i) => i.city.toLowerCase()))], [items]);

  const filtered = useMemo(() => {
    let result = items.filter((item) => {
      const hay = [item.title, item.city, item.type, item.description, ...item.features].join(" ").toLowerCase();
      return (!search || hay.includes(search.toLowerCase())) && (city === "all" || item.city.toLowerCase() === city);
    });
    if (sort === "rating") result = [...result].sort((a, b) => b.rating - a.rating);
    if (sort === "price-low") result = [...result].sort((a, b) => a.price - b.price);
    if (sort === "price-high") result = [...result].sort((a, b) => b.price - a.price);
    return result;
  }, [items, search, city, sort]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6">
        <button onClick={onBack} className="mb-4 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </button>

        <div className="mb-6 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Marketplace</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">{titleMap[category]}</h2>
            <p className="mt-2 text-muted-foreground">{subMap[category]}</p>
          </div>
          <Button variant="hero">Open Booking Flow</Button>
        </div>

        <div className="mb-8 grid gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm md:grid-cols-4">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by type, city, or keyword" className="rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring" />
          <select value={city} onChange={(e) => setCity(e.target.value)} className="rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none">
            {cities.map((c) => (
              <option key={c} value={c}>{c === "all" ? "All Cities" : c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none">
            <option value="popular">Most Relevant</option>
            <option value="rating">Highest Rated</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
          <Button variant="outline">Filters</Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <div key={item.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
              <div className="flex h-44 items-end bg-gradient-to-br from-accent via-secondary to-accent p-5">
                <span className="rounded-full bg-background/80 px-3 py-1.5 text-xs font-medium text-foreground backdrop-blur">{item.type}</span>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-lg font-bold text-foreground">{item.title}</h4>
                    <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" /> {item.city}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-semibold text-foreground">
                    <Star className="h-3.5 w-3.5 fill-primary text-primary" /> {item.rating}
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.features.map((f) => (
                    <span key={f} className="rounded-full bg-accent px-3 py-1 text-xs text-muted-foreground">{f}</span>
                  ))}
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-accent p-3">
                    <div className="font-semibold text-foreground">₹ {item.price.toLocaleString()}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{item.duration}</div>
                  </div>
                  <div className="rounded-xl bg-accent p-3">
                    <div className="flex items-center gap-1 font-semibold text-foreground"><Calendar className="h-3.5 w-3.5" /> Available</div>
                    <div className="mt-1 text-xs text-muted-foreground">This week</div>
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <Button variant="hero" size="sm">Book Now</Button>
                  <Button variant="outline" size="sm">View Details</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketplacePage;
