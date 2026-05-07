import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Loader2, SlidersHorizontal, Search } from "lucide-react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { Calendar } from "@/components/ui/calendar";
import { getStudios } from "@/services/supabase-service";
import { supabase } from "@/lib/supabase";

/* eslint-disable @typescript-eslint/no-explicit-any */
const PLACEHOLDER_STUDIOS = [
  { id: "p1", name: "Noir Podcast Studio", city: "Mumbai", type: "Podcast Studio", price_per_hour: 1800, description: "A clean black-and-wood podcast studio for interviews and branded content.", created_at: new Date().toISOString(), is_available: true },
  { id: "p2", name: "Daylight Creator Loft", city: "Delhi", type: "Photo + Video", price_per_hour: 3200, description: "Ideal for fashion shoots, content days, and lifestyle campaigns.", created_at: new Date().toISOString(), is_available: true },
  { id: "p3", name: "Reel Factory Set", city: "Bengaluru", type: "Short-form Studio", price_per_hour: 2500, description: "Made for reels, ad shoots, and performance content.", created_at: new Date().toISOString(), is_available: true },
];

const sortOptions = [
  { value: 'relevant', label: 'Most Relevant' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
  { value: 'az', label: 'A–Z Alphabetically' },
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
  const [cities, setCities] = useState<string[]>([]);

  // Draft states (form UI)
  const [whereInput, setWhereInput] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [whenMode, setWhenMode] = useState<"dates" | "flexible">("dates");
  const [flexibleDay, setFlexibleDay] = useState("Any");
  
  const [draftPrice, setDraftPrice] = useState([0, 10000]);
  const [draftTypes, setDraftTypes] = useState<string[]>([]);
  const [draftSort, setDraftSort] = useState("relevant");
  const [draftAvailable, setDraftAvailable] = useState(false);

  // Applied states (controls the grid)
  const [appliedCity, setAppliedCity] = useState("");
  const [appliedDate, setAppliedDate] = useState<Date | undefined>();
  const [appliedPrice, setAppliedPrice] = useState([0, 10000]);
  const [appliedTypes, setAppliedTypes] = useState<string[]>([]);
  const [appliedSort, setAppliedSort] = useState("relevant");
  const [appliedAvailable, setAppliedAvailable] = useState(false);

  // Dropdown states
  const [isWhereOpen, setIsWhereOpen] = useState(false);
  const [isWhenOpen, setIsWhenOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const whereRef = useRef<HTMLDivElement>(null);
  const whenRef = useRef<HTMLDivElement>(null);
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
      const target = event.target as Node;
      if (whereRef.current && !whereRef.current.contains(target)) setIsWhereOpen(false);
      if (whenRef.current && !whenRef.current.contains(target)) setIsWhenOpen(false);
      if (filterRef.current && !filterRef.current.contains(target)) setIsFilterOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleApply = () => {
    setAppliedCity(whereInput);
    setAppliedDate(selectedDate);
    setAppliedPrice(draftPrice);
    setAppliedTypes(draftTypes);
    setAppliedSort(draftSort);
    setAppliedAvailable(draftAvailable);
    setIsWhereOpen(false);
    setIsWhenOpen(false);
    setIsFilterOpen(false);
  };

  const handleClearAll = () => {
    setWhereInput("");
    setSelectedDate(undefined);
    setWhenMode("dates");
    setFlexibleDay("Any");
    setDraftPrice([0, 10000]);
    setDraftTypes([]);
    setDraftSort("relevant");
    setDraftAvailable(false);
    
    setAppliedCity("");
    setAppliedDate(undefined);
    setAppliedPrice([0, 10000]);
    setAppliedTypes([]);
    setAppliedSort("relevant");
    setAppliedAvailable(false);
  };

  const filterAndSortStudios = (studiosList: any[]) => {
    let result = [...studiosList];

    if (appliedCity) {
      result = result.filter(s => (s.city || "").toLowerCase().includes(appliedCity.toLowerCase()));
    }
    if (appliedDate) {
      result = result.filter(s => s.is_available === true);
    }
    result = result.filter(s => {
      const p = s.price_per_hour || 0;
      return p >= appliedPrice[0] && p <= appliedPrice[1];
    });
    if (appliedTypes.length > 0) {
      result = result.filter(s => appliedTypes.includes(s.type));
    }
    if (appliedAvailable) {
      result = result.filter(s => s.is_available === true);
    }

    switch(appliedSort) {
      case 'price_low': result.sort((a,b) => (a.price_per_hour || 0) - (b.price_per_hour || 0)); break;
      case 'price_high': result.sort((a,b) => (b.price_per_hour || 0) - (a.price_per_hour || 0)); break;
      case 'newest': result.sort((a,b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()); break;
      case 'az': result.sort((a,b) => (a.name || "").localeCompare(b.name || "")); break;
      default: break;
    }

    return result;
  };

  const filtered = filterAndSortStudios(studios);
  const filteredCities = cities.filter(c => c.toLowerCase().includes(whereInput.toLowerCase()));

  const activeFilterCount = (appliedPrice[0] > 0 || appliedPrice[1] < 10000 ? 1 : 0) + appliedTypes.length + (appliedAvailable ? 1 : 0) + (appliedSort !== 'relevant' ? 1 : 0);

  return (
    <div className="min-h-screen silver-shimmer-bg relative overflow-hidden" style={{ fontFamily: '"Manrope", sans-serif' }}>
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-[#7C3AED]/10 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-[#06B6D4]/8 blur-[120px] pointer-events-none" />

      <nav className="sticky top-0 z-50 bg-[rgba(226,226,228,0.92)] backdrop-blur-xl border-b border-[rgba(0,0,0,0.06)] px-6 md:px-12 h-[72px] flex items-center justify-between">
        <a href="/" className="font-newsreader italic text-2xl font-bold text-[#0A0A1A]">CreatorsBNB</a>
        <div className="flex gap-4">
          <button onClick={() => navigate("/signin")} className="text-sm font-bold text-[#0A0A1A] hover:text-[#7C3AED] transition-colors">Sign In</button>
          <button onClick={() => navigate("/signup")} className="px-5 py-2 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white text-sm font-bold hover:shadow-[0_8px_20px_rgba(124,58,237,0.3)] transition-all">Sign Up</button>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        
        {/* Airbnb-style Search Bar & Filter */}
        <div className="flex items-center justify-center mb-16 relative z-40">
          <div className="flex items-center gap-4 w-full max-w-4xl">
            
            {/* Search Pill */}
            <div className="flex-1 flex bg-white rounded-full border border-[#E5E7EB] shadow-[0_4px_20px_rgba(0,0,0,0.10)] relative">
              
              {/* WHERE Section */}
              <div className="flex-1 relative" ref={whereRef}>
                <button 
                  className="w-full text-left px-6 py-4 hover:bg-gray-50 rounded-l-full transition-colors flex flex-col items-start"
                  onClick={() => { setIsWhereOpen(true); setIsWhenOpen(false); setIsFilterOpen(false); }}
                >
                  <span className="text-[12px] font-bold text-[#0A0A1A]">Where</span>
                  <input 
                    value={whereInput}
                    onChange={(e) => { setWhereInput(e.target.value); setIsWhereOpen(true); }}
                    placeholder="Search cities..."
                    className="bg-transparent text-sm text-[#0A0A1A] placeholder:text-[#9CA3AF] outline-none w-full mt-0.5"
                  />
                </button>
                {isWhereOpen && (
                  <div className="absolute top-full left-0 mt-4 w-[360px] bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-[rgba(124,58,237,0.12)] py-4 z-50">
                    <p className="text-xs text-[#9CA3AF] font-bold mb-3 px-6">Suggested Cities</p>
                    <div className="max-h-60 overflow-y-auto px-4">
                      {filteredCities.length > 0 ? filteredCities.map(c => (
                        <div 
                          key={c}
                          onClick={() => { 
                            setWhereInput(c); 
                            setAppliedCity(c); // User spec: "filters studios by that city"
                            setIsWhereOpen(false); 
                            setIsWhenOpen(true); 
                          }}
                          className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <div className="w-12 h-12 rounded-[12px] bg-[rgba(124,58,237,0.08)] flex items-center justify-center text-[#7C3AED]">
                            <MapPin className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="text-[#0A0A1A] font-medium text-[15px]">{c}</div>
                            <div className="text-[#6B7280] text-xs">Studios available</div>
                          </div>
                        </div>
                      )) : (
                        <div className="text-sm text-[#6B7280] p-3 text-center">No cities found</div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="w-px bg-[#E5E7EB] my-3" />

              {/* WHEN Section */}
              <div className="flex-1 relative" ref={whenRef}>
                <button 
                  className="w-full text-left px-6 py-4 hover:bg-gray-50 transition-colors flex flex-col items-start"
                  onClick={() => { setIsWhenOpen(true); setIsWhereOpen(false); setIsFilterOpen(false); }}
                >
                  <span className="text-[12px] font-bold text-[#0A0A1A]">When</span>
                  <span className={`text-sm mt-0.5 ${selectedDate ? 'text-[#0A0A1A]' : 'text-[#9CA3AF]'}`}>
                    {selectedDate ? selectedDate.toLocaleDateString() : 'Add dates'}
                  </span>
                </button>
                {isWhenOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-[rgba(124,58,237,0.12)] p-6 z-50">
                    <div className="flex justify-center mb-6">
                      <div className="flex bg-gray-100 p-1 rounded-full">
                        <button className={`px-5 py-1.5 rounded-full text-sm font-bold transition-all ${whenMode === 'dates' ? 'bg-white shadow text-[#0A0A1A]' : 'text-[#6B7280]'}`} onClick={() => setWhenMode('dates')}>Dates</button>
                        <button className={`px-5 py-1.5 rounded-full text-sm font-bold transition-all ${whenMode === 'flexible' ? 'bg-white shadow text-[#0A0A1A]' : 'text-[#6B7280]'}`} onClick={() => setWhenMode('flexible')}>Flexible</button>
                      </div>
                    </div>
                    {whenMode === 'dates' ? (
                      <div className="w-[600px] flex justify-center">
                        <Calendar 
                          mode="single" 
                          selected={selectedDate} 
                          onSelect={(d) => { setSelectedDate(d); setIsWhenOpen(false); handleApply(); }}
                          numberOfMonths={2}
                          disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                          classNames={{
                            day_selected: "bg-[#7C3AED] text-white hover:bg-[#7C3AED] hover:text-white focus:bg-[#7C3AED] focus:text-white",
                            day_today: "font-bold underline text-[#7C3AED]"
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-[400px]">
                        <p className="text-sm font-bold text-[#0A0A1A] mb-4 text-center">How long?</p>
                        <div className="grid grid-cols-4 gap-3">
                          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Any"].map(day => (
                            <button 
                              key={day}
                              onClick={() => { setFlexibleDay(day); setIsWhenOpen(false); handleApply(); }}
                              className={`py-3 rounded-xl border text-sm font-bold transition-all ${flexibleDay === day ? 'border-[#7C3AED] bg-[rgba(124,58,237,0.05)] text-[#7C3AED]' : 'border-[#E5E7EB] text-[#374151] hover:border-[#7C3AED]'}`}
                            >
                              {day}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* SEARCH Button */}
              <div className="pr-2 py-2 flex items-center">
                <button 
                  onClick={handleApply}
                  className="h-12 px-6 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white flex items-center justify-center font-bold gap-2 hover:shadow-[0_0_20px_rgba(124,58,237,0.30)] transition-all"
                >
                  <Search className="h-4 w-4 text-white font-bold" />
                  Search
                </button>
              </div>
            </div>

            {/* SEPARATE FILTER BUTTON */}
            <div className="relative" ref={filterRef}>
              <button 
                onClick={() => { setIsFilterOpen(!isFilterOpen); setIsWhereOpen(false); setIsWhenOpen(false); }}
                className={`h-[60px] flex items-center gap-2 px-6 rounded-full border-[1.5px] transition-all text-[15px] font-bold ${
                  activeFilterCount > 0 
                    ? 'bg-[#7C3AED] border-[#7C3AED] text-white' 
                    : 'bg-white border-[#E5E7EB] text-[#0A0A1A] hover:border-[#7C3AED] hover:text-[#7C3AED]'
                }`}
              >
                <SlidersHorizontal className="h-5 w-5" />
                {activeFilterCount > 0 ? `Filters (${activeFilterCount})` : "Filters"}
              </button>

              {isFilterOpen && (
                <div className="absolute top-full right-0 mt-4 w-[380px] bg-white rounded-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-[rgba(124,58,237,0.12)] p-7 z-50 space-y-7">
                  
                  {/* Price Range */}
                  <div>
                    <h4 className="text-sm font-bold text-[#0A0A1A]">Price Range</h4>
                    <p className="text-[#6B7280] text-sm mb-5">₹500 — ₹10,000 per hour</p>
                    <SliderPrimitive.Root
                      className="relative flex w-full touch-none select-none items-center"
                      value={draftPrice}
                      min={0}
                      max={10000}
                      step={100}
                      onValueChange={setDraftPrice}
                    >
                      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-[#E5E7EB]">
                        <SliderPrimitive.Range className="absolute h-full bg-[#7C3AED]" />
                      </SliderPrimitive.Track>
                      <SliderPrimitive.Thumb className="block h-6 w-6 rounded-full border-2 border-white shadow bg-[#7C3AED] transition-transform hover:scale-110 focus-visible:outline-none" />
                      <SliderPrimitive.Thumb className="block h-6 w-6 rounded-full border-2 border-white shadow bg-[#7C3AED] transition-transform hover:scale-110 focus-visible:outline-none" />
                    </SliderPrimitive.Root>
                    <div className="mt-4 text-center font-bold text-[#7C3AED]">
                      ₹{draftPrice[0]} — ₹{draftPrice[1]}
                    </div>
                  </div>

                  <div className="h-px bg-[#F3F4F6] w-full" />

                  {/* Studio Type — Dropdown */}
                  <div>
                    <h4 className="text-sm font-bold text-[#0A0A1A] mb-4">Studio Type</h4>
                    <select
                      value={draftTypes[0] || ""}
                      onChange={(e) => setDraftTypes(e.target.value ? [e.target.value] : [])}
                      className="w-full px-4 py-3 border border-[#E5E7EB] rounded-[6px] bg-white text-[15px] text-[#0A0A1A] outline-none focus:border-[#7C3AED] transition-colors cursor-pointer"
                    >
                      <option value="">All Types</option>
                      {typeOptions.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div className="h-px bg-[#F3F4F6] w-full" />

                  {/* Sort By — Dropdown */}
                  <div>
                    <h4 className="text-sm font-bold text-[#0A0A1A] mb-4">Sort By</h4>
                    <select
                      value={draftSort}
                      onChange={(e) => setDraftSort(e.target.value)}
                      className="w-full px-4 py-3 border border-[#E5E7EB] rounded-[6px] bg-white text-[15px] text-[#0A0A1A] outline-none focus:border-[#7C3AED] transition-colors cursor-pointer"
                    >
                      {sortOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="h-px bg-[#F3F4F6] w-full" />

                  {/* Availability */}
                  <div>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox"
                        checked={draftAvailable}
                        onChange={e => setDraftAvailable(e.target.checked)}
                        className="w-5 h-5 rounded-[4px] border-[#E5E7EB] text-[#7C3AED] focus:ring-[#7C3AED] accent-[#7C3AED] cursor-pointer"
                      />
                      <span className="text-[15px] font-bold text-[#0A0A1A] group-hover:text-[#7C3AED] transition-colors">Available Now only</span>
                    </label>
                  </div>

                  {/* Bottom Actions */}
                  <div className="flex items-center justify-between pt-4">
                    <button 
                      onClick={handleClearAll}
                      className="text-[15px] font-bold text-[#7C3AED] hover:text-[#0A0A1A] transition-colors bg-transparent border-none outline-none"
                    >
                      Clear All
                    </button>
                    <button 
                      onClick={handleApply}
                      className="px-6 py-3 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white text-[15px] font-bold shadow-md hover:scale-[1.02] transition-transform"
                    >
                      Show Results
                    </button>
                  </div>

                </div>
              )}
            </div>

          </div>
        </div>

        {/* Header (after Search Bar) */}
        <div className="mb-8">
          <p className="text-[11px] font-black uppercase tracking-[2px] text-[#7C3AED] mb-2">Marketplace</p>
          <h1 className="text-4xl md:text-5xl font-bold text-[#0A0A1A]" style={{ fontFamily: '"Newsreader", serif' }}>Studio <span className="italic">Marketplace</span></h1>
          <p className="text-[#6B7280] mt-2">Browse available studio spaces, compare setups, and request a booking.</p>
        </div>

        {loading && <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#7C3AED]" /></div>}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-[rgba(124,58,237,0.10)] shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
            <span className="text-5xl block mb-4">🔍</span>
            <h3 className="text-xl font-bold text-[#0A0A1A] mb-2">No studios match your search</h3>
            <p className="text-[#6B7280] mb-6">Try a different city or adjust your filters</p>
            <button 
              onClick={handleClearAll}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] text-white font-bold text-sm hover:shadow-[0_4px_15px_rgba(124,58,237,0.3)] transition-all"
            >
              Clear Search
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
