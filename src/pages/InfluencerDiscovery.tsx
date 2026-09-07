import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Mail } from "lucide-react";
import Logo from "@/components/Logo";
import { INFLUENCERS } from "@/data/influencer-data";

const PLATFORMS = ["All Platforms", "Instagram"];
const CATEGORIES = ["All Categories", "Mega", "Macro", "Micro"];
const SORT_OPTIONS = ["Name", "Followers (High to Low)", "Followers (Low to High)", "Engagement (High to Low)"];
const ITEMS_PER_PAGE = 12;

// Helper to format large numbers beautifully
const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num.toString();
};

// Sleek Avatar Component with unavatar.io loading and beautiful gradient initials fallback
const InfluencerAvatar = ({ name, username }: { name: string; username: string }) => {
  const [imgFailed, setImgFailed] = useState(false);
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  // Generate a consistent vibrant gradient class based on username
  const colors = [
    "from-purple-500 to-indigo-500",
    "from-pink-500 to-rose-500",
    "from-blue-500 to-teal-500",
    "from-amber-500 to-orange-500",
    "from-fuchsia-500 to-purple-600",
    "from-cyan-500 to-blue-600",
  ];
  const colorIndex = username.charCodeAt(0) % colors.length;
  const gradientClass = colors[colorIndex];

  return (
    <div className="relative w-full h-[280px] bg-gray-100 flex items-center justify-center overflow-hidden">
      {!imgFailed ? (
        <img
          src={`https://unavatar.io/instagram/${username}`}
          alt={name}
          onError={() => setImgFailed(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div className={`w-full h-full bg-gradient-to-br ${gradientClass} flex flex-col items-center justify-center text-white p-4`}>
          <span className="text-5xl font-black tracking-wider drop-shadow-md mb-2">{initials}</span>
          <span className="text-xs font-semibold opacity-80">@{username}</span>
        </div>
      )}
    </div>
  );
};

const InfluencerDiscovery = () => {
  const navigate = useNavigate();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("All Platforms");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  // Filter state
  const [followerRange, setFollowerRange] = useState<[number, number]>([0, 50000]);
  const [engagementRange, setEngagementRange] = useState<[number, number]>([0, 25]);
  const [sidebarCategory, setSidebarCategory] = useState("All Categories");

  // Sort & Pagination
  const [sortBy, setSortBy] = useState("Followers (High to Low)");
  const [currentPage, setCurrentPage] = useState(1);

  // Mobile sidebar toggle
  const [showFilters, setShowFilters] = useState(false);

  // Services dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Navbar search
  const [navSearchQuery, setNavSearchQuery] = useState("");
  const handleNavSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (navSearchQuery.trim()) {
      navigate(`/studios?search=${encodeURIComponent(navSearchQuery.trim())}`);
    }
  };

  // Reset pagination on search trigger
  const handleSearch = () => {
    setSidebarCategory(selectedCategory);
    setCurrentPage(1);
  };

  // Filtered & sorted data
  const filteredData = useMemo(() => {
    let data = [...INFLUENCERS];

    // Search query (name or username)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      data = data.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.username.toLowerCase().includes(q)
      );
    }

    // Platform filter (since all are Instagram, selecting another yields empty which is correct)
    if (selectedPlatform !== "All Platforms") {
      // Structurally keep it ready, though spreadsheet is currently all Instagram
    }

    // Category filter (sidebar takes priority if set)
    const activeCat = sidebarCategory !== "All Categories" ? sidebarCategory : selectedCategory;
    if (activeCat !== "All Categories") {
      data = data.filter((i) => i.category === activeCat);
    }

    // Range filters
    data = data.filter(
      (i) => i.followers >= followerRange[0] && i.followers <= followerRange[1]
    );
    data = data.filter(
      (i) => i.engagement >= engagementRange[0] && i.engagement <= engagementRange[1]
    );

    // Sort
    if (sortBy === "Followers (High to Low)") {
      data.sort((a, b) => b.followers - a.followers);
    } else if (sortBy === "Followers (Low to High)") {
      data.sort((a, b) => a.followers - b.followers);
    } else if (sortBy === "Engagement (High to Low)") {
      data.sort((a, b) => b.engagement - a.engagement);
    } else if (sortBy === "Name") {
      data.sort((a, b) => a.name.localeCompare(b.name));
    }

    return data;
  }, [searchQuery, selectedPlatform, selectedCategory, sidebarCategory, followerRange, engagementRange, sortBy]);

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

      {/* ═══ NAVBAR (matches homepage) ═══ */}
      <nav className="fixed top-0 w-full z-50 bg-[rgba(226,226,228,0.92)] backdrop-blur-2xl flex justify-between items-center px-[30px] py-[20px] h-[80px] max-w-full border-b border-[rgba(0,0,0,0.06)]">
        <Logo size="lg" />
        
        <div className="hidden md:flex gap-[20px] text-[18px] font-bold tracking-tight h-full items-center px-4">
          <a className="text-[#6B46C1] hover:text-[#000000] transition-colors whitespace-nowrap cursor-pointer" onClick={() => navigate("/")}>Home</a>
          <a className="text-[#6B46C1] hover:text-[#000000] transition-colors whitespace-nowrap cursor-pointer" onClick={() => navigate("/#find-best-studios")}>About Us</a>
          <div
            className="relative h-full flex items-center group"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <button className="text-[#6B46C1] group-hover:text-[#000000] transition-colors flex items-center gap-1 whitespace-nowrap">
              Services <span className="material-symbols-outlined text-[20px]">expand_more</span>
            </button>
            {isDropdownOpen && (
              <div className="absolute top-full -left-20 w-[420px] bg-white border border-gray-100 rounded-2xl shadow-2xl p-6 flex flex-row gap-8">
                <div className="flex-1">
                  <p className="text-[11px] font-black uppercase tracking-[2px] text-violet-600 mb-4">I Want to Find</p>
                  <div className="space-y-4">
                    <div className="block group/item cursor-pointer" onClick={() => { setIsDropdownOpen(false); navigate('/studios'); }}>
                      <p className="text-sm font-bold text-gray-900 group-hover/item:text-[#702ae1]">Studio Space</p>
                      <p className="text-[11px] text-gray-500 font-medium">Creative havens for rent</p>
                    </div>
                    <div className="block group/item cursor-pointer" onClick={() => { setIsDropdownOpen(false); navigate('/professionals?type=videographer'); }}>
                      <p className="text-sm font-bold text-gray-900 group-hover/item:text-[#702ae1]">Videographer</p>
                      <p className="text-[11px] text-gray-500 font-medium">Professional video creators</p>
                    </div>
                    <div className="block group/item cursor-pointer" onClick={() => { setIsDropdownOpen(false); navigate('/professionals?type=photographer'); }}>
                      <p className="text-sm font-bold text-gray-900 group-hover/item:text-[#702ae1]">Photographer</p>
                      <p className="text-[11px] text-gray-500 font-medium">Expert lens professionals</p>
                    </div>
                    <div className="block group/item cursor-pointer" onClick={() => { setIsDropdownOpen(false); navigate('/professionals?type=editor'); }}>
                      <p className="text-sm font-bold text-gray-900 group-hover/item:text-[#702ae1]">Editor</p>
                      <p className="text-[11px] text-gray-500 font-medium">Post-production experts</p>
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-[11px] font-black uppercase tracking-[2px] text-cyan-600 mb-4">I Want to List</p>
                  <div className="space-y-4">
                    <div className="block group/item cursor-pointer" onClick={() => { setIsDropdownOpen(false); navigate('/register/list-studio'); }}>
                      <p className="text-sm font-bold text-gray-900 group-hover/item:text-[#006576]">List Studio Space</p>
                      <p className="text-[11px] text-gray-500 font-medium">Monetize your creative studio</p>
                    </div>
                    <div className="block group/item cursor-pointer" onClick={() => { setIsDropdownOpen(false); navigate('/professionals/register?type=videographer'); }}>
                      <p className="text-sm font-bold text-gray-900 group-hover/item:text-[#006576]">As a Videographer</p>
                      <p className="text-[11px] text-gray-500 font-medium">Offer your video services</p>
                    </div>
                    <div className="block group/item cursor-pointer" onClick={() => { setIsDropdownOpen(false); navigate('/professionals/register?type=photographer'); }}>
                      <p className="text-sm font-bold text-gray-900 group-hover/item:text-[#006576]">As a Photographer</p>
                      <p className="text-[11px] text-gray-500 font-medium">Offer your photography</p>
                    </div>
                    <div className="block group/item cursor-pointer" onClick={() => { setIsDropdownOpen(false); navigate('/register/list-equipment'); }}>
                      <p className="text-sm font-bold text-gray-900 group-hover/item:text-[#006576]">List Equipment</p>
                      <p className="text-[11px] text-gray-500 font-medium">Rent out your gear</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <span className="text-[#000000] font-bold underline decoration-2 underline-offset-4 whitespace-nowrap">Influencer Discovery</span>
          <a className="text-[#6B46C1] hover:text-[#000000] transition-colors whitespace-nowrap cursor-pointer" onClick={() => navigate("/#footer")}>Contact Us</a>

          {/* ═══ NAVBAR SEARCH BAR ═══ */}
          <form onSubmit={handleNavSearchSubmit} className="ml-[10px] flex items-center bg-[#FFFFFF] rounded-[20px] border border-[#CCCCCC] pl-[12px] pr-[5px] h-[40px] w-[200px] shrink-0">
            <input 
              type="text" 
              value={navSearchQuery}
              onChange={(e) => setNavSearchQuery(e.target.value)}
              placeholder="Search your studio" 
              className="bg-transparent border-none outline-none text-[14px] w-full text-[#555555] placeholder:text-[#CCCCCC]"
            />
            <button type="submit" className="w-[30px] h-[30px] rounded-full bg-[#6B46C1] text-white flex items-center justify-center shrink-0 cursor-pointer">
              <Search className="w-[14px] h-[14px]" />
            </button>
          </form>
        </div>

        <div className="flex items-center gap-[15px] shrink-0">
          <button onClick={() => navigate('/signin')} className="text-[#0A0A1A] font-bold text-[18px] px-3 py-2 hover:opacity-70 transition-opacity whitespace-nowrap">Sign In</button>
          <button onClick={() => navigate('/signup')} className="bg-gradient-to-r from-[#702ae1] to-[#006576] text-white px-6 py-2.5 rounded-full font-bold text-[18px] hover:shadow-[0_8px_20px_rgba(112,42,225,0.3)] hover:-translate-y-0.5 transition-all whitespace-nowrap">
            Sign Up
          </button>
        </div>
      </nav>

      {/* ═══ SEARCH BAR (Sticky below navbar, CENTERED) ═══ */}
      <div className="sticky top-[80px] z-40 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-wrap items-center justify-center gap-4">
          
          {/* Search Input */}
          <div className="flex-1 min-w-[280px] relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search influencer by name or username..."
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl bg-white text-[14px] text-[#333] placeholder:text-gray-400 font-medium outline-none focus:border-[#702ae1] transition-colors"
            />
          </div>

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
              <option key={c} value={c}>{c === "All Categories" ? c : `${c} Tier`}</option>
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
          <div className="bg-white rounded-[12px] border border-[#E0E0E0] p-6 space-y-6 sticky top-[172px] shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
            <h3 className="text-[14px] font-bold uppercase tracking-[0.5px] text-[#000] mb-4" style={{ fontFamily: '"Manrope", sans-serif' }}>
              FILTERS
            </h3>

            {/* Follower Range */}
            <div className="space-y-2.5">
              <label className="text-[12px] font-bold uppercase tracking-[0.5px] text-[#888]">Followers</label>
              <div className="flex items-center justify-between text-[13px] font-bold text-[#000]">
                <span>{formatNumber(followerRange[0])}</span>
                <span className="text-[#888]">—</span>
                <span>{formatNumber(followerRange[1])}</span>
              </div>
              <input
                type="range"
                min={0}
                max={12000000}
                step={50000}
                value={followerRange[0]}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setFollowerRange([val, Math.max(val, followerRange[1])]);
                }}
                className="w-full accent-[#702ae1] h-1.5"
              />
              <input
                type="range"
                min={0}
                max={12000000}
                step={50000}
                value={followerRange[1]}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setFollowerRange([Math.min(val, followerRange[0]), val]);
                }}
                className="w-full accent-[#702ae1] h-1.5"
              />
            </div>

            {/* Engagement Range */}
            <div className="space-y-2.5">
              <label className="text-[12px] font-bold uppercase tracking-[0.5px] text-[#888]">Engagement Rate</label>
              <div className="flex items-center justify-between text-[13px] font-bold text-[#000]">
                <span>{engagementRange[0]}%</span>
                <span className="text-[#888]">—</span>
                <span>{engagementRange[1]}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={25}
                step={0.1}
                value={engagementRange[0]}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setEngagementRange([val, Math.max(val, engagementRange[1])]);
                }}
                className="w-full accent-[#702ae1] h-1.5"
              />
              <input
                type="range"
                min={0}
                max={25}
                step={0.1}
                value={engagementRange[1]}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setEngagementRange([Math.min(val, engagementRange[0]), val]);
                }}
                className="w-full accent-[#702ae1] h-1.5"
              />
            </div>

            {/* Category Selector */}
            <div className="space-y-2.5">
              <label className="text-[12px] font-bold uppercase tracking-[0.5px] text-[#888]">Tier Category</label>
              <select
                value={sidebarCategory}
                onChange={(e) => setSidebarCategory(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-white text-[13px] font-medium outline-none focus:border-[#702ae1] transition-colors cursor-pointer"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c === "All Categories" ? c : `${c} Tier`}</option>
                ))}
              </select>
            </div>

            {/* Clear Filters Button */}
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedPlatform("All Platforms");
                setSelectedCategory("All Categories");
                setFollowerRange([0, 50000]);
                setEngagementRange([0, 25]);
                setSidebarCategory("All Categories");
                setCurrentPage(1);
              }}
              className="w-full py-3 rounded-xl border border-gray-200 text-[#333] font-bold text-[14px] hover:bg-gray-50 transition-colors shadow-sm"
            >
              Reset Filters
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
            <div className="text-center py-20 bg-white/50 rounded-2xl border border-gray-100">
              <span className="material-symbols-outlined text-6xl text-gray-300 mb-4 block">search_off</span>
              <p className="text-[#555] text-lg font-bold">No influencers found matching your criteria.</p>
              <p className="text-[#888] text-sm mt-2">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginatedData.map((influencer) => (
                <div
                  key={influencer.id}
                  className="group bg-white/95 backdrop-blur-sm rounded-2xl border border-gray-100 overflow-hidden hover:-translate-y-2 hover:shadow-[0_16px_40px_rgba(0,0,0,0.1)] transition-all duration-400 flex flex-col justify-between"
                >
                  {/* Top section: image + platform badges */}
                  <div>
                    <div className="relative overflow-hidden">
                      <InfluencerAvatar name={influencer.name} username={influencer.username} />
                      
                      {/* Platform badge on image */}
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-md bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider">
                        Instagram
                      </div>
                      
                      {/* Tier Badge */}
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-violet-600/90 text-white text-[10px] font-bold uppercase tracking-wider">
                        {influencer.category}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 pb-0">
                      {/* Name */}
                      <div className="mb-3">
                        <h4 className="text-[16px] font-bold text-[#000] line-clamp-1">{influencer.name.split(' ')[0]}</h4>
                      </div>

                      {/* Metrics row */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="text-center p-2 rounded-lg bg-gray-50">
                          <p className="text-[15px] font-extrabold text-[#000]">{formatNumber(influencer.followers)}</p>
                          <p className="text-[9px] font-bold uppercase tracking-wider text-[#999] mt-0.5">Followers</p>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-gray-50">
                          <p className="text-[15px] font-extrabold text-[#702ae1]">{influencer.engagement}%</p>
                          <p className="text-[9px] font-bold uppercase tracking-wider text-[#999] mt-0.5">Engagement</p>
                        </div>
                      </div>

                      {/* Deliverables snippet */}
                      <div className="pt-3 border-t border-gray-100 flex items-start gap-2 text-[12px] text-gray-600">
                        <span className="material-symbols-outlined text-[16px] text-violet-600 shrink-0 mt-0.5">
                          campaign
                        </span>
                        <span className="line-clamp-2">{influencer.deliverables}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom section: Contact Us Box */}
                  <div className="p-5 pt-4">
                    <button
                      onClick={() => navigate("/#footer")}
                      className="group w-full py-2.5 rounded-xl border-2 border-violet-400 bg-white hover:bg-violet-50 hover:border-violet-600 text-[#000] font-bold text-[13px] flex items-center justify-center gap-2 transition-all duration-300 shadow-sm hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(124,58,237,0.15)] active:scale-[0.98]"
                    >
                      <Mail className="w-4 h-4 text-violet-500 transition-all duration-300 group-hover:text-violet-600 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:rotate-12" />
                      Contact Us
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12 flex-wrap">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border border-gray-200 text-[13px] font-bold text-[#555] hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ← Prev
              </button>
              
              {/* Pagination numbers range generation to avoid overflowing 97 pages */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 2)
                .map((page, idx, arr) => {
                  const prevPage = arr[idx - 1];
                  const showEllipsis = prevPage && page - prevPage > 1;

                  return (
                    <div key={page} className="flex items-center gap-2">
                      {showEllipsis && <span className="text-gray-400 font-bold px-1">...</span>}
                      <button
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-lg text-[13px] font-bold transition-all ${
                          page === currentPage
                            ? "bg-[#000] text-white shadow-md"
                            : "border border-gray-200 text-[#555] hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    </div>
                  );
                })}

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
