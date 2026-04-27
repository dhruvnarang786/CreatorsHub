import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Loader2, SlidersHorizontal } from "lucide-react";
import { getStudios } from "@/services/supabase-service";
import { supabase } from "@/lib/supabase";

/* eslint-disable @typescript-eslint/no-explicit-any */
const PLACEHOLDER_STUDIOS = [
  { id: "p1", name: "Noir Podcast Studio", city: "Mumbai", type: "Podcast Studio", price_per_hour: 1800, description: "A clean black-and-wood podcast studio for interviews and branded content.", created_at: new Date().toISOString(), is_available: true },
  { id: "p2", name: "Daylight Creator Loft", city: "Delhi", type: "Photo + Video", price_per_hour: 3200, description: "Ideal for fashion shoots, content days, and lifestyle campaigns.", created_at: new Date().toISOString(), is_available: true },
  { id: "p3", name: "Reel Factory Set", city: "Bengaluru", type: "Short-form Studio", price_per_hour: 2500, description: "Made for reels, ad shoots, and performance content.", created_at: new Date().toISOString(), is_available: true },
];

const defaultFilters = {
  sortBy: "relevant",
  city: "all",
  types: [] as string[],
  minPrice: "",
  maxPrice: "",
  availableNow: false,
};

const sortOptions = [
  { value: 'relevant', label: 'Most Relevant' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'trending', label: 'Trending First' },
  { value: 'newest', label: 'Newest First' },
  { value: 'az', label: 'A–Z Alphabetically' },
  { value: 'za', label: 'Z–A Alphabetically' },
  { value: 'rating', label: 'Highest Rated' },
];

const typeOptions = [
  "Podcast Studio",
  "Photography Studio",
  "Greenscreen Studio",
  "Film Set",
  "Content Studio",
  "Short-form Studio",
];

const StudioMarketplace = () => {
  const navigate = useNavigate();
  const [studios, setStudios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [cities, setCities] = useState<string[]>([]);

  const [draftFilters, setDraftFilters] = useState(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getStudios().then(({ data }) => {
      setStudios(data && data.length > 0 ? data : PLACEHOLDER_STUDIOS);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      const { data } = await supabase
        .from('studios')
        .select('city')
        .eq('is_approved', true)
        .eq('is_active', true);
      if (data) {
        const uniqueCities = [...new Set(data.map(s => s.city))].filter(Boolean).sort();
        setCities(uniqueCities as string[]);
      }
    };
    fetchCities();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isFilterOpen) {
      setDraftFilters(appliedFilters);
    }
  }, [isFilterOpen, appliedFilters]);

  const applyFiltersLogic = (studiosList: any[]) => {
    let result = [...studiosList];

    // Filter by search text
    if (search) {
      result = result.filter(s => {
        const hay = [s.name, s.city, s.type, s.description].join(" ").toLowerCase();
        return hay.includes(search.toLowerCase());
      });
    }

    // Filter by city
    if (appliedFilters.city !== 'all') {
      result = result.filter(s => s.city === appliedFilters.city);
    }

    // Filter by type (if any selected)
    if (appliedFilters.types.length > 0) {
      result = result.filter(s => appliedFilters.types.includes(s.type));
    }

    // Filter by price range
    if (appliedFilters.minPrice) result = result.filter(s => (s.price_per_hour || 0) >= parseFloat(appliedFilters.minPrice));
    if (appliedFilters.maxPrice) result = result.filter(s => (s.price_per_hour || 0) <= parseFloat(appliedFilters.maxPrice));

    // Filter available now
    if (appliedFilters.availableNow) result = result.filter(s => s.is_available === true);

    // Sort
    switch(appliedFilters.sortBy) {
      case 'price_low': 
        result.sort((a,b) => (a.price_per_hour || 0) - (b.price_per_hour || 0)); break;
      case 'price_high': 
        result.sort((a,b) => (b.price_per_hour || 0) - (a.price_per_hour || 0)); break;
      case 'newest': 
        result.sort((a,b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()); break;
      case 'az': 
        result.sort((a,b) => (a.name || "").localeCompare(b.name || "")); break;
      case 'za': 
        result.sort((a,b) => (b.name || "").localeCompare(a.name || "")); break;
      default: break;
    }

    return result;
  };

  const filtered = applyFiltersLogic(studios);

  let activeCount = 0;
  if (appliedFilters.sortBy !== "relevant") activeCount++;
  if (appliedFilters.city !== "all") activeCount++;
  activeCount += appliedFilters.types.length;
  if (appliedFilters.minPrice) activeCount++;
  if (appliedFilters.maxPrice) activeCount++;
  if (appliedFilters.availableNow) activeCount++;

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
        <button onClick={() => navigate("/")} className="mb-6 flex items-center gap-2 text-sm text-[#9CA3AF] hover:text-[#0A0A1A] transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </button>

        <div className="mb-8">
          <p className="text-[11px] font-black uppercase tracking-[2px] text-[#7C3AED] mb-2">Marketplace</p>
          <h1 className="text-4xl md:text-5xl font-bold text-[#0A0A1A]" style={{ fontFamily: '"Newsreader", serif' }}>Studio <span className="italic">Marketplace</span></h1>
          <p className="text-[#6B7280] mt-2">Browse available studio spaces, compare setups, and request a booking.</p>
        </div>

        {/* Search & Filter Button */}
        <div className="flex gap-4 mb-6 relative z-40">
          <input 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            placeholder="Search by keyword..." 
            className="flex-1 rounded-[10px] bg-white border-[1.5px] border-[#E5E7EB] px-4 py-3 text-sm text-[#0A0A1A] outline-none placeholder:text-[#9CA3AF] focus:border-[#7C3AED] focus:shadow-[0_0_0_3px_rgba(124,58,237,0.10)] transition-all"
          />
          <div className="relative" ref={filterRef}>
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-5 py-3 rounded-[10px] border-[1.5px] transition-all text-sm font-bold ${
                activeCount > 0 
                  ? 'bg-[#7C3AED] border-[#7C3AED] text-white' 
                  : 'bg-white border-[#E5E7EB] text-[#374151] hover:border-[#7C3AED] hover:text-[#7C3AED]'
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              {activeCount > 0 ? `Filters (${activeCount})` : "Filter & Sort"}
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 top-full mt-2 w-[320px] bg-white border border-[rgba(124,58,237,0.12)] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] p-6 z-50 space-y-6">
                
                {/* Section 1 - Sort By */}
                <div>
                  <h4 className="text-[11px] font-bold tracking-wide uppercase text-[#374151] mb-3">Sort By</h4>
                  <div className="space-y-2.5">
                    {sortOptions.map(opt => (
                      <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="radio" 
                          name="sortBy" 
                          checked={draftFilters.sortBy === opt.value}
                          onChange={() => setDraftFilters(p => ({ ...p, sortBy: opt.value }))}
                          className="w-4 h-4 text-[#7C3AED] border-[#E5E7EB] focus:ring-[#7C3AED] accent-[#7C3AED] cursor-pointer"
                        />
                        <span className="text-sm text-[#0A0A1A] group-hover:text-[#7C3AED] transition-colors">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-[#F3F4F6] w-full" />

                {/* Section 2 - City */}
                <div>
                  <h4 className="text-[11px] font-bold tracking-wide uppercase text-[#374151] mb-3">Filter by City</h4>
                  <select 
                    value={draftFilters.city}
                    onChange={e => setDraftFilters(p => ({ ...p, city: e.target.value }))}
                    className="w-full rounded-[8px] bg-white border-[1.5px] border-[#E5E7EB] px-3 py-2.5 text-sm text-[#0A0A1A] outline-none focus:border-[#7C3AED] transition-colors cursor-pointer"
                  >
                    <option value="all">All Cities</option>
                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="h-px bg-[#F3F4F6] w-full" />

                {/* Section 3 - Type */}
                <div>
                  <h4 className="text-[11px] font-bold tracking-wide uppercase text-[#374151] mb-3">Filter by Type</h4>
                  <div className="space-y-2.5">
                    {typeOptions.map(type => (
                      <label key={type} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="checkbox"
                          checked={draftFilters.types.includes(type)}
                          onChange={e => {
                            const types = e.target.checked 
                              ? [...draftFilters.types, type] 
                              : draftFilters.types.filter(t => t !== type);
                            setDraftFilters(p => ({ ...p, types }));
                          }}
                          className="w-4 h-4 rounded-[4px] border-[#E5E7EB] text-[#7C3AED] focus:ring-[#7C3AED] accent-[#7C3AED] cursor-pointer"
                        />
                        <span className="text-sm text-[#0A0A1A] group-hover:text-[#7C3AED] transition-colors">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-[#F3F4F6] w-full" />

                {/* Section 4 - Price */}
                <div>
                  <h4 className="text-[11px] font-bold tracking-wide uppercase text-[#374151] mb-3">Price Range</h4>
                  <div className="flex gap-3">
                    <input 
                      type="number" 
                      placeholder="Min ₹" 
                      value={draftFilters.minPrice}
                      onChange={e => setDraftFilters(p => ({ ...p, minPrice: e.target.value }))}
                      className="w-full rounded-[8px] bg-white border-[1.5px] border-[#E5E7EB] px-3 py-2 text-sm text-[#0A0A1A] outline-none focus:border-[#7C3AED] transition-colors"
                    />
                    <input 
                      type="number" 
                      placeholder="Max ₹" 
                      value={draftFilters.maxPrice}
                      onChange={e => setDraftFilters(p => ({ ...p, maxPrice: e.target.value }))}
                      className="w-full rounded-[8px] bg-white border-[1.5px] border-[#E5E7EB] px-3 py-2 text-sm text-[#0A0A1A] outline-none focus:border-[#7C3AED] transition-colors"
                    />
                  </div>
                </div>

                <div className="h-px bg-[#F3F4F6] w-full" />

                {/* Section 5 - Availability */}
                <div>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox"
                      checked={draftFilters.availableNow}
                      onChange={e => setDraftFilters(p => ({ ...p, availableNow: e.target.checked }))}
                      className="w-4 h-4 rounded-[4px] border-[#E5E7EB] text-[#7C3AED] focus:ring-[#7C3AED] accent-[#7C3AED] cursor-pointer"
                    />
                    <span className="text-sm font-semibold text-[#0A0A1A] group-hover:text-[#7C3AED] transition-colors">Available Now only</span>
                  </label>
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center justify-between pt-2">
                  <button 
                    onClick={() => {
                      setDraftFilters(defaultFilters);
                      setAppliedFilters(defaultFilters);
                      setIsFilterOpen(false);
                    }}
                    className="text-sm font-bold text-[#7C3AED] hover:text-[#0A0A1A] transition-colors bg-transparent border-none outline-none"
                  >
                    Clear All
                  </button>
                  <button 
                    onClick={() => {
                      setAppliedFilters(draftFilters);
                      setIsFilterOpen(false);
                    }}
                    className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white text-sm font-bold shadow-md hover:scale-[1.02] transition-transform"
                  >
                    Apply Filters
                  </button>
                </div>

              </div>
            )}
          </div>
        </div>

        {loading && <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#7C3AED]" /></div>}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-[rgba(124,58,237,0.10)] shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
            <span className="text-5xl block mb-4">🔍</span>
            <h3 className="text-xl font-bold text-[#0A0A1A] mb-2">No studios match your filters</h3>
            <p className="text-[#6B7280] mb-6">Try adjusting your filters</p>
            <button 
              onClick={() => {
                setSearch("");
                setDraftFilters(defaultFilters);
                setAppliedFilters(defaultFilters);
              }}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white font-bold text-sm"
            >
              Clear Filters
            </button>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <>
            <div className="mb-4 text-[13px] text-[#6B7280]">
              Showing {filtered.length} studio{filtered.length !== 1 ? 's' : ''}
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((s) => (
                <div key={s.id} onClick={() => s.id.startsWith("p") ? null : navigate(`/studio/${s.id}`)} className="rounded-2xl bg-white border border-[rgba(0,0,0,0.06)] shadow-[0_4px_20px_rgba(0,0,0,0.06)] overflow-hidden hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(124,58,237,0.12)] transition-all cursor-pointer group">
                  <div className="h-48 relative overflow-hidden">
                    {s.photos?.[0] ? (
                      <img src={s.photos[0]} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#7C3AED]/10 to-[#06B6D4]/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-5xl text-[#7C3AED]/20">camera_indoor</span>
                      </div>
                    )}
                    <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-[rgba(124,58,237,0.08)] text-[#7C3AED] text-[10px] font-bold backdrop-blur-sm">{s.type || "Studio"}</span>
                  </div>
                  <div className="p-5 space-y-3">
                    <h3 className="font-bold text-lg text-[#0A0A1A]" style={{ fontFamily: '"Newsreader", serif' }}>{s.name}</h3>
                    <p className="text-[#6B7280] text-sm flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{s.area ? `${s.area}, ` : ""}{s.city}</p>
                    <p className="text-[#9CA3AF] text-sm line-clamp-2">{s.description}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-[#E5E7EB]">
                      <span className="text-xl font-bold text-[#7C3AED]">₹{(s.price_per_hour || 0).toLocaleString()}<span className="text-xs text-[#9CA3AF] font-normal">/hr</span></span>
                      <button className="px-4 py-2 rounded-full border-[1.5px] border-[#7C3AED] text-[#7C3AED] text-xs font-bold hover:bg-[#7C3AED] hover:text-white transition-colors">View Studio</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StudioMarketplace;
