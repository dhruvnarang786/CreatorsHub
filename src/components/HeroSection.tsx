import { Play, Star, MapPin, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import modernLoft from "@/assets/modern-loft.jpg";
import podcastStudio from "@/assets/podcast-studio.jpg";
import videoStudio from "@/assets/video-studio.jpg";

interface HeroSectionProps {
  onExplore: () => void;
}

const HeroSection = ({ onExplore }: HeroSectionProps) => {
  return (
    <section className="relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#e8eaf6] via-[#fce4c8] to-[#c5d8f6]" />
      {/* Soft light orbs */}
      <div className="absolute top-[20%] left-[30%] h-[300px] w-[300px] rounded-full bg-white/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[10%] right-[20%] h-[250px] w-[250px] rounded-full bg-[#F97316]/10 blur-3xl pointer-events-none" />

      <div className="container mx-auto py-12 md:py-16 relative z-10">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          {/* Left side */}
          <div>
            <h1 className="text-3xl font-bold leading-[1.1] tracking-tight text-foreground md:text-4xl lg:text-5xl">
              Find & Book<br />
              Creative Spaces<br />
              in Seconds
            </h1>

            <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
              Studios, videographers, editors —<br />
              all in one place.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button variant="hero" size="lg" onClick={onExplore}>
                Get Started
              </Button>
              <Button variant="heroOutline" size="lg">
                <Play className="h-4 w-4" />
                Watch Demo
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap gap-6">
              <div className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">5,000+</span> Spaces</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">10k+</span> Creators</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">1.8M</span> Bookings</span>
              </div>
            </div>
          </div>

          {/* Right side — layered card composition */}
          <div className="relative hidden min-h-[380px] lg:flex items-center justify-center">
            {/* Top-left supporting card — Podcast Studio */}
            <div className="absolute z-30 top-0 left-4 w-[220px] rounded-xl border border-white/60 bg-white/90 backdrop-blur-md shadow-[0_6px_24px_rgba(0,0,0,0.08)] overflow-hidden -rotate-2">
              <div className="h-[120px] overflow-hidden">
                <img src={podcastStudio} alt="Podcast Studio" className="h-full w-full object-cover" loading="lazy" width={400} height={220} />
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs">🎙️</span>
                    <span className="text-xs font-semibold text-foreground">Podcast Studio</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <Star className="h-2.5 w-2.5 fill-[#F59E0B] text-[#F59E0B]" />
                    <span className="text-[10px] font-medium text-foreground">4.8</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-foreground mt-1 block">$80<span className="text-[10px] font-normal text-muted-foreground">/hr</span></span>
              </div>
            </div>

            {/* Main featured card — Modern Creative Loft */}
            <div className="relative z-20 w-[260px] rounded-2xl border border-white/60 bg-white/90 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.1)] overflow-hidden ml-16 mt-8">
              <div className="h-[180px] overflow-hidden">
                <img src={modernLoft} alt="Modern Creative Loft" className="h-full w-full object-cover" loading="lazy" width={600} height={400} />
              </div>
              <div className="p-4">
                <h4 className="text-sm font-semibold text-foreground">Modern Creative Loft</h4>
                <div className="flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Los Angeles, CA</span>
                </div>
                <span className="text-sm font-bold text-foreground mt-2 block">$120<span className="text-xs font-normal text-muted-foreground">/night</span></span>
              </div>
            </div>

            {/* Bottom-right supporting card — Video Studio */}
            <div className="absolute z-30 bottom-0 right-0 w-[180px] rounded-xl border border-white/60 bg-white/90 backdrop-blur-md shadow-[0_6px_24px_rgba(0,0,0,0.08)] overflow-hidden rotate-1">
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs">🎬</span>
                  <span className="text-xs font-semibold text-foreground">Video Studio</span>
                </div>
              </div>
              <div className="px-3 pb-3 flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">$150<span className="text-[10px] font-normal text-muted-foreground">/hr</span></span>
                <div className="flex items-center gap-0.5">
                  <Star className="h-2.5 w-2.5 fill-[#F59E0B] text-[#F59E0B]" />
                  <span className="text-[10px] font-medium text-foreground">4.7</span>
                </div>
              </div>
            </div>

            {/* Depth layer */}
            <div className="absolute z-10 w-[240px] h-[280px] rounded-2xl bg-white/30 backdrop-blur-sm border border-white/20 translate-x-8 translate-y-4" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
