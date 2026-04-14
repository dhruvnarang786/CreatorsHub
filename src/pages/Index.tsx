import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategoryCards from "@/components/CategoryCards";
import FeaturedSpaces from "@/components/FeaturedSpaces";

const Index = () => {
  return (
    <div className="min-h-screen relative">
      {/* Global background */}
      <div className="fixed inset-0 -z-10">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#f8fafc] via-[#fef3e2] to-[#e0f2fe]" />

        {/* Organic soft blobs */}
        <div className="absolute top-[8%] left-[10%] h-[500px] w-[500px] rounded-full bg-[#F97316]/[0.06] blur-[140px]" />
        <div className="absolute top-[5%] right-[20%] h-[400px] w-[350px] rounded-[60%_40%_50%_70%] bg-[#3B82F6]/[0.07] blur-[130px]" />
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 h-[450px] w-[450px] rounded-[40%_60%_55%_45%] bg-[#22D3EE]/[0.05] blur-[120px]" />
        <div className="absolute bottom-[10%] left-[5%] h-[350px] w-[400px] rounded-[55%_45%_60%_40%] bg-[#A78BFA]/[0.05] blur-[130px]" />
        <div className="absolute bottom-[15%] right-[10%] h-[380px] w-[380px] rounded-full bg-[#F97316]/[0.04] blur-[150px]" />
        <div className="absolute top-[65%] right-[35%] h-[300px] w-[350px] rounded-[45%_55%_50%_50%] bg-[#34D399]/[0.04] blur-[120px]" />

        {/* Subtle grain texture overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }} />
      </div>

      <Navbar />
      <HeroSection />
      <CategoryCards />
      <FeaturedSpaces />
    </div>
  );
};

export default Index;
