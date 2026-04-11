import { Sparkles, Play, Star, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import modernLoft from "@/assets/modern-loft.jpg";
import podcastStudio from "@/assets/podcast-studio.jpg";
import videoStudio from "@/assets/video-studio.jpg";

interface HeroSectionProps {
  onExplore: () => void;
}

const HeroSection = ({ onExplore }: HeroSectionProps) => {
  return (
    <section className="relative overflow-hidden min-h-[600px]">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#e8eaf6] via-[#fce4c8] to-[#c5d8f6]" />
      {/* Soft light orbs */}
      <div className="absolute top-[20%] left-[30%] h-[300px] w-[300px] rounded-full bg-white/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[10%] right-[20%] h-[250px] w-[250px] rounded-full bg-[#F97316]/10 blur-3xl pointer-events-none" />
      <div className="absolute top-[10%] right-[40%] h-[200px] w-[200px] rounded-full bg-[#3B82F6]/10 blur-3xl pointer-events-none" />
      {/* Sparkle dots */}
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

          {/* Right side — structured layered card composition */}
          <div className="relative hidden min-h-[480px] lg:flex items-center justify-center">
            {/* Main featured card — largest, center */}
            <div className="relative z-20 w-[300px] rounded-2xl border border-white/60 bg-white/90 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.1)] overflow-hidden">
              <div className="h-[200px] overflow-hidden">
                <img
                  src={modernLoft}
                  alt="Modern Creative Loft"
                  className="h-full w-full object-cover"
                  loading="lazy"
                  width={600}
                  height={400}
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-foreground">Modern Creative Loft</h4>
                  <div className="flex items-center gap-0.5">
                    <Star className="h-3 w-3 fill-[#F59E0B] text-[#F59E0B]" />
                    <span className="text-xs font-medium text-foreground">4.9</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Los Angeles, CA</span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm font-bold text-foreground">$120<span className="text-xs font-normal text-muted-foreground">/night</span></span>
                  <span className="text-[10px] bg-[#3B82F6]/10 text-[#3B82F6] px-2 py-0.5 rounded-full font-medium">Featured</span>
                </div>
              </div>
            </div>

            {/* Top-left supporting card — smaller, overlapping */}
            <div className="absolute z-30 top-4 left-0 w-[200px] rounded-xl border border-white/60 bg-white/90 backdrop-blur-md shadow-[0_6px_24px_rgba(0,0,0,0.08)] overflow-hidden -rotate-3">
              <div className="h-[110px] overflow-hidden">
                <img
                  src={podcastStudio}
                  alt="Podcast Studio"
                  className="h-full w-full object-cover"
                  loading="lazy"
                  width={400}
                  height={220}
                />
              </div>
              <div className="p-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs">🎙️</span>
                  <span className="text-xs font-semibold text-foreground">Podcast Studio</span>
                </div>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-xs font-bold text-foreground">$80<span className="text-[10px] font-normal text-muted-foreground">/hr</span></span>
                  <div className="flex items-center gap-0.5">
                    <Star className="h-2.5 w-2.5 fill-[#F59E0B] text-[#F59E0B]" />
                    <span className="text-[10px] font-medium text-foreground">4.8</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom-right supporting card — smaller, overlapping */}
            <div className="absolute z-30 bottom-4 right-0 w-[210px] rounded-xl border border-white/60 bg-white/90 backdrop-blur-md shadow-[0_6px_24px_rgba(0,0,0,0.08)] overflow-hidden rotate-2">
              <div className="h-[120px] overflow-hidden">
                <img
                  src={videoStudio}
                  alt="Video Production Studio"
                  className="h-full w-full object-cover"
                  loading="lazy"
                  width={420}
                  height={240}
                />
              </div>
              <div className="p-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs">🎬</span>
                  <span className="text-xs font-semibold text-foreground">Video Studio</span>
                </div>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-xs font-bold text-foreground">$150<span className="text-[10px] font-normal text-muted-foreground">/hr</span></span>
                  <div className="flex items-center gap-0.5">
                    <Star className="h-2.5 w-2.5 fill-[#F59E0B] text-[#F59E0B]" />
                    <span className="text-[10px] font-medium text-foreground">4.7</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Subtle depth layer behind main card */}
            <div className="absolute z-10 w-[280px] h-[320px] rounded-2xl bg-white/40 backdrop-blur-sm border border-white/30 shadow-[0_4px_16px_rgba(0,0,0,0.04)] translate-x-4 translate-y-3" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
