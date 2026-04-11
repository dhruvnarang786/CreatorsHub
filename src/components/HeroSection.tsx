import { Sparkles, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import modernLoft from "@/assets/modern-loft.jpg";
import podcastStudio from "@/assets/podcast-studio.jpg";
import videoStudio from "@/assets/video-studio.jpg";

interface HeroSectionProps {
  onExplore: () => void;
}

const HeroSection = ({ onExplore }: HeroSectionProps) => {
  return (
    <section className="relative overflow-hidden min-h-[600px]">
      {/* Gradient background matching reference image */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#e8eaf6] via-[#fce4c8] to-[#c5d8f6]" />
      {/* Sparkle / light effects */}
      <div className="absolute top-[20%] left-[30%] h-[300px] w-[300px] rounded-full bg-white/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[10%] right-[20%] h-[250px] w-[250px] rounded-full bg-[#F97316]/10 blur-3xl pointer-events-none" />
      <div className="absolute top-[10%] right-[40%] h-[200px] w-[200px] rounded-full bg-[#3B82F6]/10 blur-3xl pointer-events-none" />
      {/* Small sparkle dots */}
      <div className="absolute top-[30%] left-[50%] h-1 w-1 rounded-full bg-white shadow-[0_0_6px_2px_rgba(255,255,255,0.8)] pointer-events-none" />
      <div className="absolute top-[50%] left-[35%] h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_8px_3px_rgba(255,255,255,0.7)] pointer-events-none" />
      <div className="absolute top-[15%] right-[25%] h-1 w-1 rounded-full bg-white shadow-[0_0_6px_2px_rgba(255,255,255,0.8)] pointer-events-none" />

      <div className="container mx-auto py-16 md:py-24 relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left side */}
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-white/80 backdrop-blur-sm px-4 py-2 text-sm text-muted-foreground shadow-sm">
              <Sparkles className="h-4 w-4 text-[#F59E0B]" />
              Built to Your Dream Space
            </div>

            <h2 className="text-4xl font-bold leading-[1.08] tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Unlock Amazing{" "}
              <span className="bg-gradient-to-r from-[#F97316] via-[#F59E0B] to-[#3B82F6] bg-clip-text text-transparent">
                Spaces
              </span>
              <br />
              for Creators
            </h2>

            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
              Discover unique studios, co-working spaces, and production venues
              tailored for creatives.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button variant="hero" size="lg" onClick={onExplore}>
                Get Started
              </Button>
              <Button variant="heroOutline" size="lg">
                <Play className="h-4 w-4" />
                Watch Demo
              </Button>
            </div>

            <div className="mt-10 flex gap-8">
              <div>
                <div className="text-2xl font-bold text-foreground">5,000+</div>
                <div className="text-sm text-muted-foreground">Listings Available</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">12k</div>
                <div className="text-sm text-muted-foreground">Happy Creators</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">1.8M</div>
                <div className="text-sm text-muted-foreground">Bookings Made</div>
              </div>
            </div>
          </div>

          {/* Right side - floating card mockups like the reference */}
          <div className="relative hidden min-h-[460px] lg:block">
            {/* Main website mockup card */}
            <div className="absolute right-4 top-0 w-[320px] rounded-2xl border border-white/60 bg-white/80 backdrop-blur-md shadow-xl overflow-hidden">
              {/* Mini navbar */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-border/40">
                <Logo size="sm" />
                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-muted-foreground">Listings</span>
                  <span className="text-[9px] text-muted-foreground">How it Works</span>
                  <span className="text-[9px] text-muted-foreground">Contact</span>
                  <span className="text-[8px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-medium">Sign Up</span>
                </div>
              </div>
              {/* Mini hero content */}
              <div className="p-4">
                <p className="text-xs font-bold text-foreground leading-snug">
                  Unlock Amazing{" "}
                  <span className="text-[#F97316]">Spaces</span>
                  <br />for Creators
                </p>
                <p className="text-[8px] text-muted-foreground mt-1">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
                <div className="flex gap-1 mt-2">
                  <span className="text-[7px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-medium">Search</span>
                  <span className="text-[7px] bg-accent text-accent-foreground px-2 py-0.5 rounded-full">Search Rooms</span>
                </div>
              </div>
            </div>

            {/* Top right floating listing card */}
            <div className="absolute right-[-10px] top-[-10px] w-[180px] rounded-xl border border-white/60 bg-white/90 backdrop-blur-md shadow-lg overflow-hidden rotate-3">
              <img src={modernLoft} alt="Studio by the Beach" className="h-20 w-full object-cover" />
              <div className="p-2">
                <div className="text-[10px] font-semibold text-foreground">Studio by the Beach</div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[9px] text-[#F59E0B]">★★★★</span>
                  <span className="text-[8px] text-muted-foreground">$120/hr</span>
                </div>
              </div>
            </div>

            {/* Podcast room card - bottom left */}
            <div className="absolute bottom-20 left-0 w-[220px] rounded-xl border border-white/60 bg-white/90 backdrop-blur-md shadow-lg overflow-hidden -rotate-2">
              <div className="flex items-center gap-2 p-2 border-b border-border/30">
                <span className="text-[10px]">🎙️</span>
                <span className="text-[10px] font-medium text-foreground">Podcast Room</span>
              </div>
              <img src={podcastStudio} alt="Podcast Room" className="h-28 w-full object-cover" />
              <div className="p-2 flex items-center gap-1">
                <span className="inline-block h-4 w-4 rounded-full bg-accent" />
                <span className="text-[9px] font-medium text-foreground">Podcast Room</span>
              </div>
            </div>

            {/* Video Studio card - bottom right */}
            <div className="absolute bottom-0 right-0 w-[200px] rounded-xl border border-white/60 bg-white/90 backdrop-blur-md shadow-lg overflow-hidden rotate-1">
              <img src={videoStudio} alt="Video Studio" className="h-28 w-full object-cover" />
              <div className="flex items-center gap-2 px-3 py-2">
                <span className="text-[10px]">🎬</span>
                <span className="text-[10px] font-semibold text-foreground">Video Studio</span>
              </div>
            </div>

            {/* Sunny Mountain Loft mini card */}
            <div className="absolute top-16 right-[-20px] w-[130px] rounded-lg border border-white/60 bg-white/80 backdrop-blur-md shadow-md p-2 rotate-2">
              <div className="h-14 rounded bg-accent overflow-hidden">
                <img src={modernLoft} alt="Sunny Mountain Loft" className="h-full w-full object-cover" />
              </div>
              <div className="mt-1 text-[8px] font-medium text-foreground">Sunny Mountain Loft</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
