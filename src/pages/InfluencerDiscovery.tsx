import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

/* ─── Sample Influencer Data ─── */
const SAMPLE_INFLUENCERS = [
  {
    id: 1,
    name: "natasha.luthra",
    platform: "Instagram",
    category: "Beauty",
    subscribers: 950,
    followers: 7000,
    engagement: 4.5,
    addedDate: "April 6, 2023",
    verified: true,
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop",
  },
  {
    id: 2,
    name: "arjun.fitness",
    platform: "YouTube",
    category: "Fitness",
    subscribers: 3200,
    followers: 15000,
    engagement: 6.2,
    addedDate: "March 12, 2023",
    verified: true,
    img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=500&fit=crop",
  },
  {
    id: 3,
    name: "priya.styles",
    platform: "Instagram",
    category: "Fashion",
    subscribers: 720,
    followers: 5400,
    engagement: 5.1,
    addedDate: "May 18, 2023",
    verified: false,
    img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=500&fit=crop",
  },
  {
    id: 4,
    name: "rohan.explores",
    platform: "YouTube",
    category: "Travel",
    subscribers: 4800,
    followers: 22000,
    engagement: 3.8,
    addedDate: "January 28, 2023",
    verified: true,
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop",
  },
  {
    id: 5,
    name: "meera.dances",
    platform: "TikTok",
    category: "Dance",
    subscribers: 1500,
    followers: 45000,
    engagement: 8.7,
    addedDate: "February 14, 2023",
    verified: true,
    img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=500&fit=crop",
  },
  {
    id: 6,
    name: "vikram.cooks",
    platform: "Instagram",
    category: "Food",
    subscribers: 620,
    followers: 3200,
    engagement: 7.3,
    addedDate: "June 2, 2023",
    verified: false,
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop",
  },
  {
    id: 7,
    name: "ananya.tech",
    platform: "YouTube",
    category: "Tech",
    subscribers: 8900,
    followers: 32000,
    engagement: 4.1,
    addedDate: "April 22, 2023",
    verified: true,
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop",
  },
  {
    id: 8,
    name: "karan.lifestyle",
    platform: "Instagram",
    category: "Lifestyle",
    subscribers: 410,
    followers: 2800,
    engagement: 5.9,
    addedDate: "July 10, 2023",
    verified: false,
    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop",
  },
  {
    id: 9,
    name: "divya.glam",
    platform: "TikTok",
    category: "Beauty",
    subscribers: 2100,
    followers: 18000,
    engagement: 9.2,
    addedDate: "August 5, 2023",
    verified: true,
    img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=500&fit=crop",
  },
  {
    id: 10,
    name: "rahul.games",
    platform: "YouTube",
    category: "Gaming",
    subscribers: 12000,
    followers: 55000,
    engagement: 3.4,
    addedDate: "September 1, 2023",
    verified: true,
    img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=500&fit=crop",
  },
];

const PLATFORMS = ["All Platforms", "Instagram", "YouTube", "TikTok", "Twitter", "LinkedIn"];
const CATEGORIES = ["All Categories", "Beauty", "Fashion", "Fitness", "Dance", "Travel", "Food", "Lifestyle", "Tech", "Gaming"];
const SORT_OPTIONS = ["Date", "Followers", "Engagement", "Subscribers"];
const ITEMS_PER_PAGE = 6;

const InfluencerDiscovery = () => {
  const navigate = useNavigate();

  // Search state
  const [selectedPlatform, setSelectedPlatform] = useState("All Platforms");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  // Filter state
  const [subRange, setSubRange] = useState<[number, number]>([0, 15000]);
  const [followerRange, setFollowerRange] = useState<[number, number]>([0, 60000]);
  const [sidebarCategory, setSidebarCategory] = useState("All Categories");

  // Sort & Pagination
  const [sortBy, setSortBy] = useState("Date");
  const [currentPage, setCurrentPage] = useState(1);

  // Mobile sidebar toggle
  const [showFilters, setShowFilters] = useState(false);

  // Apply search
  const handleSearch = () => {
    setSidebarCategory(selectedCategory);
    setCurrentPage(1);
  };

  // Filtered & sorted data
  const filteredData = useMemo(() => {
    let data = [...SAMPLE_INFLUENCERS];

    // Platform filter
    if (selectedPlatform !== "All Platforms") {
      data = data.filter((i) => i.platform === selectedPlatform);
    }

    // Category filter (sidebar takes priority if set)
    const activeCat = sidebarCategory !== "All Categories" ? sidebarCategory : selectedCategory;
    if (activeCat !== "All Categories") {
      data = data.filter((i) => i.category === activeCat);
    }

    // Range filters
    data = data.filter(
      (i) => i.subscribers >= subRange[0] && i.subscribers <= subRange[1]
    );
    data = data.filter(
      (i) => i.followers >= followerRange[0] && i.followers <= followerRange[1]
    );

    // Sort
    if (sortBy === "Followers") data.sort((a, b) => b.followers - a.followers);
    else if (sortBy === "Engagement") data.sort((a, b) => b.engagement - a.engagement);
    else if (sortBy === "Subscribers") data.sort((a, b) => b.subscribers - a.subscribers);

    return data;
  }, [selectedPlatform, selectedCategory, sidebarCategory, subRange, followerRange, sortBy]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE));
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const showingStart = filteredData.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const showingEnd = Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length);

  return (
    <div
      className="silver-shimmer-bg min-h-screen text-[#2d2f2f] overflow-x-hidden"
      style={{ fontFamily: '"Manrope", sans-serif' }}
      id="influencer-discovery"
    >
      {/* Silver Sparkle Noise Layer */}
      <div className="silver-sparkle-noise" />
      {/* Grain Overlay */}
      <div className="fixed inset-0 grain-overlay z-[60] pointer-events-none" />

      {/* ═══ NAVBAR ═══ */}
      <nav className="fixed top-0 w-full z-50 bg-[rgba(226,226,228,0.92)] backdrop-blur-2xl flex justify-between items-center px-6 md:px-12 h-[72px] max-w-full border-b border-[rgba(0,0,0,0.06)]">
        <a
          className="font-newsreader italic text-2xl font-bold text-[#0A0A1A] logo-shimmer transition-all cursor-pointer"
          onClick={() => navigate("/")}
        >
          CreatorsBNB
        </a>
        <div className="hidden md:flex gap-10 text-[15px] font-bold tracking-tight h-full items-center">
          <a className="text-[#0A0A1A] hover:text-[#702ae1] transition-colors cursor-pointer" onClick={() => navigate("/")}>Home</a>
          <span className="text-[#702ae1] font-bold">Influencer Discovery</span>
          <a className="text-[#0A0A1A] hover:text-[#702ae1] transition-colors cursor-pointer" onClick={() => navigate("/")}>Contact Us</a>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/signin")} className="text-[#0A0A1A] font-bold text-[14px] px-5 py-2 hover:opacity-70 transition-opacity">Sign In</button>
          <button onClick={() => navigate("/signup")} className="bg-gradient-to-r from-[#702ae1] to-[#006576] text-white px-7 py-2.5 rounded-full font-bold text-[14px] hover:shadow-[0_8px_20px_rgba(112,42,225,0.3)] hover:-translate-y-0.5 transition-all">
            Sign Up
          </button>
        </div>
      </nav>

      {/* ═══ SEARCH BAR (Sticky below navbar, CENTERED) ═══ */}
      <div className="sticky top-[72px] z-40 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-wrap items-center justify-center gap-4">
          {/* Platform Dropdown */}
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl bg-white text-[14px] text-[#333] font-medium outline-none focus:border-[#702ae1] transition-colors min-w-[170px] cursor-pointer"
          >
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl bg-white text-[14px] text-[#333] font-medium outline-none focus:border-[#702ae1] transition-colors min-w-[170px] cursor-pointer"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="px-8 py-3 rounded-xl bg-[#FFC107] text-[#1a1a1a] font-bold text-[14px] hover:brightness-110 hover:scale-[1.02] transition-all duration-200 shadow-sm"
          >
            Search
          </button>

          {/* Mobile filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden ml-auto px-4 py-3 rounded-xl border border-gray-200 text-[14px] font-medium flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
            Filters
          </button>
        </div>
      </div>

      {/* ═══ MAIN CONTENT ═══ */}
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-20 flex flex-col md:flex-row gap-8 relative z-10">

        {/* ═══ SIDEBAR ═══ */}
        <aside className={`w-full md:w-[280px] flex-shrink-0 ${showFilters ? 'block' : 'hidden md:block'}`}>
          <div className="bg-white rounded-[12px] border border-[#E0E0E0] p-6 space-y-5 sticky top-[152px] shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
            <h3 className="text-[14px] font-bold uppercase tracking-[0.5px] text-[#000] mb-6" style={{ fontFamily: '"Manrope", sans-serif' }}>
              FILTERS
            </h3>

            {/* Subscriber Range */}
            <div className="space-y-2.5">
              <label className="text-[12px] font-bold uppercase tracking-[0.5px] text-[#888]">Subscribers</label>
              <div className="flex items-center justify-between text-[13px] font-bold text-[#000]">
                <span>{subRange[0].toLocaleString()}</span>
                <span className="text-[#888]">—</span>
                <span>{subRange[1].toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={0}
                max={15000}
                step={100}
                value={subRange[0]}
                onChange={(e) => setSubRange([parseInt(e.target.value), subRange[1]])}
                className="w-full accent-[#702ae1] h-1.5"
              />
              <input
                type="range"
                min={0}
                max={15000}
                step={100}
                value={subRange[1]}
                onChange={(e) => setSubRange([subRange[0], parseInt(e.target.value)])}
                className="w-full accent-[#702ae1] h-1.5"
              />
            </div>

            {/* Follower Range */}
            <div className="space-y-2.5">
              <label className="text-[12px] font-bold uppercase tracking-[0.5px] text-[#888]">Followers</label>
              <div className="flex items-center justify-between text-[13px] font-bold text-[#000]">
                <span>{followerRange[0].toLocaleString()}</span>
                <span className="text-[#888]">—</span>
                <span>{followerRange[1].toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={0}
                max={60000}
                step={500}
                value={followerRange[0]}
                onChange={(e) => setFollowerRange([parseInt(e.target.value), followerRange[1]])}
                className="w-full accent-[#702ae1] h-1.5"
              />
              <input
                type="range"
                min={0}
                max={60000}
                step={500}
                value={followerRange[1]}
                onChange={(e) => setFollowerRange([followerRange[0], parseInt(e.target.value)])}
                className="w-full accent-[#702ae1] h-1.5"
              />
            </div>

            {/* Category */}
            <div className="space-y-2.5">
              <label className="text-[12px] font-bold uppercase tracking-[0.5px] text-[#888]">Category</label>
              <select
                value={sidebarCategory}
                onChange={(e) => setSidebarCategory(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-white text-[13px] font-medium outline-none focus:border-[#702ae1] transition-colors cursor-pointer"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setCurrentPage(1)}
              className="w-full py-3 rounded-xl bg-[#FFC107] text-[#1a1a1a] font-bold text-[14px] hover:brightness-110 hover:scale-[1.01] transition-all duration-200 shadow-sm"
            >
              Apply Filters
            </button>
          </div>
        </aside>

        {/* ═══ RESULTS AREA ═══ */}
        <div className="flex-1 min-w-0">
          {/* Results header */}
          <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
            <p className="text-[12px] font-bold uppercase tracking-[1.5px] text-[#888]">
              Showing {showingStart}-{showingEnd} of {filteredData.length} results
            </p>
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-bold uppercase tracking-[1.5px] text-[#888]">Sort by</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg bg-white text-[13px] font-medium outline-none focus:border-[#702ae1] transition-colors cursor-pointer"
              >
                {SORT_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Grid */}
          {paginatedData.length === 0 ? (
            <div className="text-center py-20">
              <span className="material-symbols-outlined text-6xl text-gray-300 mb-4 block">search_off</span>
              <p className="text-[#555] text-lg font-bold">No influencers found matching your criteria.</p>
              <p className="text-[#888] text-sm mt-2">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginatedData.map((influencer) => (
                <div
                  key={influencer.id}
                  className="group bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-100 overflow-hidden hover:-translate-y-2 hover:shadow-[0_16px_40px_rgba(0,0,0,0.12)] transition-all duration-400 cursor-pointer"
                >
                  {/* Image */}
                  <div className="relative overflow-hidden">
                    <img
                      src={influencer.img}
                      alt={influencer.name}
                      className="w-full h-[280px] object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Platform badge on image */}
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-md bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider">
                      {influencer.platform}
                    </div>
                    {influencer.verified && (
                      <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-[#702ae1] flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-[14px]">verified</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    {/* Name + Category */}
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-[16px] font-bold text-[#000]">{influencer.name}</h4>
                      <span className="px-2.5 py-1 rounded-md bg-gray-100 text-[10px] font-bold uppercase tracking-wider text-[#555]">
                        {influencer.category}
                      </span>
                    </div>

                    {/* Metrics row */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="text-center p-2 rounded-lg bg-gray-50">
                        <p className="text-[15px] font-extrabold text-[#000]">{influencer.subscribers.toLocaleString()}</p>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-[#999] mt-0.5">Subscribers</p>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-gray-50">
                        <p className="text-[15px] font-extrabold text-[#000]">{influencer.followers.toLocaleString()}</p>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-[#999] mt-0.5">Followers</p>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-gray-50">
                        <p className="text-[15px] font-extrabold text-[#702ae1]">{influencer.engagement}%</p>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-[#999] mt-0.5">Engage</p>
                      </div>
                    </div>

                    {/* Added date */}
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#bbb]">
                      Added on {influencer.addedDate}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border border-gray-200 text-[13px] font-bold text-[#555] hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ← Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-lg text-[13px] font-bold transition-all ${
                    page === currentPage
                      ? "bg-[#000] text-white shadow-md"
                      : "border border-gray-200 text-[#555] hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg border border-gray-200 text-[13px] font-bold text-[#555] hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfluencerDiscovery;
