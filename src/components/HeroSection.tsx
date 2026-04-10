import { Sparkles, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import modernLoft from "@/assets/modern-loft.jpg";
import podcastStudio from "@/assets/podcast-studio.jpg";
import videoStudio from "@/assets/video-studio.jpg";

interface HeroSectionProps {
  onExplore: () => void;
}

const HeroSection = ({ onExplore }: HeroSectionProps) => {
  return (
    <section className="bg-hero overflow-hidden">
      <div className="container mx-auto py-16 md:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left side */}
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4" />
              Built to Your Dream Space
            </div>

            <h2 className="text-4xl font-bold leading-[1.05] tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Unlock Amazing Spaces for Creators
            </h2>

            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
              Discover unique studios, co-working spaces, and production venues tailored for creatives.
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

          {/* Right side - visual collage */}
          <div className="relative hidden min-h-[420px] lg:block">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-accent via-secondary to-accent" />

            {/* Main large image */}
            <div className="absolute right-8 top-8 h-56 w-72 overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
              <img src={modernLoft} alt="Modern Loft" className="h-full w-full object-cover" width={640} height={512} />
            </div>

            {/* Screenshot card */}
            <div className="absolute bottom-16 left-4 h-48 w-56 overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
              <div className="flex h-full flex-col items-center justify-center bg-accent p-4">
                <img src={podcastStudio} alt="Podcast Room" className="h-32 w-full rounded-lg object-cover" loading="lazy" width={640} height={512} />
                <div className="mt-2 flex items-center gap-2 text-sm font-medium text-foreground">
                  🎙️ Podcast Room
                </div>
              </div>
            </div>

            {/* Bottom right image */}
            <div className="absolute bottom-4 right-4 h-44 w-52 overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
              <img src={videoStudio} alt="Video Studio" className="h-32 w-full object-cover" loading="lazy" width={640} height={512} />
              <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground">
                🎬 Video Studio
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
