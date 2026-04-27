import { useState, useMemo, useEffect } from "react";
import { ArrowLeft, Star, MapPin, Calendar, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { titleMap, subMap, type CategoryKey } from "@/lib/data";
import { getStudios, getProfessionals, getEquipment } from "@/services/supabase-service";

interface MarketplacePageProps {
  category: CategoryKey;
  onBack: () => void;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const MarketplacePage = ({ category, onBack }: MarketplacePageProps) => {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("all");
  const [sort, setSort] = useState("popular");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let result: { data: any; error: any };

      if (category === "studios") {
        result = await getStudios({ search: search || undefined, city: city !== "all" ? city : undefined });
      } else if (category === "videographers") {
        result = await getProfessionals("videographer");
      } else if (category === "editors") {
        result = await getProfessionals("editor");
      } else {
        result = await getEquipment();
      }

      setItems(result.data || []);
      setLoading(false);
    };
    fetchData();
  }, [category]);

  const cities = useMemo(() => {
    const cityField = category === "studios" ? "city" : (category === "equipment" ? "city" : "profiles.location");
    const citySet = new Set(
      items.map((i: any) => {
        if (category === "studios" || category === "equipment") return (i.city || "").toLowerCase();
        return (i.profiles?.location || "Remote").toLowerCase();
      }).filter(Boolean)
    );
    return ["all", ...citySet];
  }, [items, category]);

  const filtered = useMemo(() => {
    let result = items.filter((item: any) => {
      const name = category === "studios" ? item.name : (item.profiles?.full_name || item.name || "");
      const itemCity = category === "studios" || category === "equipment" ? (item.city || "") : (item.profiles?.location || "");
      const type = item.type || "";
      const desc = item.description || "";
      const features = (item.features || item.skills || []).join(" ");
      const hay = [name, itemCity, type, desc, features].join(" ").toLowerCase();

      const matchesSearch = !search || hay.includes(search.toLowerCase());
      const matchesCity = city === "all" || itemCity.toLowerCase() === city;
      return matchesSearch && matchesCity;
    });

    if (sort === "price-low") result = [...result].sort((a, b) => (a.price_per_hour || a.price_per_day || 0) - (b.price_per_hour || b.price_per_day || 0));
    if (sort === "price-high") result = [...result].sort((a, b) => (b.price_per_hour || b.price_per_day || 0) - (a.price_per_hour || a.price_per_day || 0));
    return result;
  }, [items, search, city, sort, category]);

  const getCardProps = (item: any) => {
    if (category === "studios") {
      return { id: item.id, title: item.name, city: item.city, type: item.type, description: item.description, features: item.features || [], price: item.price_per_hour, duration: "Per hour", photo: item.photos?.[0] };
    }
    if (category === "videographers" || category === "editors") {
      return { id: item.id, title: item.profiles?.full_name || "Professional", city: item.profiles?.location || "Remote", type: item.type, description: item.speciality || "", features: item.skills || [], price: item.price_per_hour, duration: "Per hour", photo: item.profiles?.avatar_url };
    }
    return { id: item.id, title: item.name, city: item.city || "N/A", type: item.category, description: item.description, features: [], price: item.price_per_day, duration: "Per day", photo: item.photos?.[0] };
  };

  const inputClass = "rounded-[10px] bg-white border-[1.5px] border-[#E5E7EB] px-4 py-3 text-sm text-[#0A0A1A] outline-none placeholder:text-[#9CA3AF] focus:border-[#7C3AED] focus:shadow-[0_0_0_3px_rgba(124,58,237,0.10)] transition-all";

  return (
    <div className="min-h-screen bg-[#F8F8FC] relative overflow-hidden" style={{ fontFamily: '"Manrope", sans-serif' }}>
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-[#7C3AED]/10 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-[#06B6D4]/8 blur-[120px] pointer-events-none" />

      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-[rgba(124,58,237,0.08)] px-6 md:px-12 h-[72px] flex items-center justify-between">
        <a href="/" className="font-newsreader italic text-2xl font-bold text-[#0A0A1A]">CreatorsBNB</a>
        <div className="flex gap-4">
          <button onClick={() => navigate("/signin")} className="text-sm font-bold text-[#0A0A1A] hover:text-[#7C3AED] transition-colors">Sign In</button>
          <button onClick={() => navigate("/signup")} className="px-5 py-2 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white text-sm font-bold hover:shadow-[0_8px_20px_rgba(124,58,237,0.3)] transition-all">Sign Up</button>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        <button onClick={onBack} className="mb-6 flex items-center gap-2 text-sm text-[#9CA3AF] hover:text-[#0A0A1A] transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </button>

        <div className="mb-8">
          <p className="text-[11px] font-black uppercase tracking-[2px] text-[#7C3AED] mb-2">Explore</p>
          <h2 className="text-4xl md:text-5xl font-bold text-[#0A0A1A]" style={{ fontFamily: '"Newsreader", serif' }}>{titleMap[category]}</h2>
          <p className="text-[#6B7280] mt-2">{subMap[category]}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4 mb-10 p-5 rounded-2xl bg-white border border-[rgba(124,58,237,0.10)] shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by type, city, or keyword" className={inputClass} />
          <select value={city} onChange={(e) => setCity(e.target.value)} className={inputClass}>
            {cities.map((c) => (<option key={c} value={c}>{c === "all" ? "All Cities" : c.charAt(0).toUpperCase() + c.slice(1)}</option>))}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className={inputClass}>
            <option value="popular">Most Relevant</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
          <button className="rounded-[10px] bg-white border-[1.5px] border-[#E5E7EB] px-4 py-3 text-sm font-bold text-[#0A0A1A] hover:border-[#7C3AED] hover:text-[#7C3AED] transition-colors">Filters</button>
        </div>

        {loading && <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#7C3AED]" /></div>}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-[rgba(124,58,237,0.10)] shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
            <span className="text-5xl block mb-4">🔍</span>
            <h3 className="text-xl font-bold text-[#0A0A1A] mb-2">No listings yet</h3>
            <p className="text-[#9CA3AF] mb-6">
              {category === "studios" ? "No studios available right now. Be the first to list yours!" : `No ${category} available yet. Check back soon!`}
            </p>
            {category === "studios" && (
              <button onClick={() => navigate("/register/list-studio")} className="px-6 py-3 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white font-bold text-sm">
                List Your Studio
              </button>
            )}
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item: any) => {
              const card = getCardProps(item);
              return (
                <div key={card.id} className="rounded-2xl bg-white border border-[rgba(0,0,0,0.06)] shadow-[0_4px_20px_rgba(0,0,0,0.06)] overflow-hidden hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(124,58,237,0.12)] transition-all cursor-pointer group">
                  <div className="h-48 relative overflow-hidden">
                    {card.photo ? (
                      <img src={card.photo} alt={card.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#7C3AED]/10 to-[#06B6D4]/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-5xl text-[#7C3AED]/20">image</span>
                      </div>
                    )}
                    <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-[rgba(124,58,237,0.08)] text-[#7C3AED] text-[10px] font-bold backdrop-blur-sm">{card.type || "Listing"}</span>
                  </div>
                  <div className="p-5 space-y-3">
                    <h3 className="font-bold text-lg text-[#0A0A1A]" style={{ fontFamily: '"Newsreader", serif' }}>{card.title}</h3>
                    <p className="text-[#6B7280] text-sm flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{card.city}</p>
                    <p className="text-[#9CA3AF] text-sm line-clamp-2">{card.description}</p>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-[#E5E7EB]">
                      <span className="text-xl font-bold text-[#7C3AED]">₹{(card.price || 0).toLocaleString()}<span className="text-xs text-[#9CA3AF] font-normal"> / {card.duration === "Per day" ? "day" : "hr"}</span></span>
                      {category === "studios" ? (
                        <button onClick={() => navigate(`/studio/${card.id}`)} className="px-4 py-2 rounded-full border-[1.5px] border-[#7C3AED] text-[#7C3AED] text-xs font-bold hover:bg-[#7C3AED] hover:text-white transition-colors">View Details</button>
                      ) : (
                        <button className="px-4 py-2 rounded-full border-[1.5px] border-[#7C3AED] text-[#7C3AED] text-xs font-bold hover:bg-[#7C3AED] hover:text-white transition-colors">Contact</button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketplacePage;
