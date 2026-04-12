import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategoryCards from "@/components/CategoryCards";
import FeaturedSpaces from "@/components/FeaturedSpaces";

const Index = () => {
  return (
    <div className="min-h-screen relative">
      {/* Global background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#f8fafc] via-[#fef3e2] to-[#e0f2fe]" />
        <div className="absolute top-[15%] left-[20%] h-[400px] w-[400px] rounded-full bg-[#F97316]/8 blur-[120px]" />
        <div className="absolute bottom-[20%] right-[15%] h-[350px] w-[350px] rounded-full bg-[#3B82F6]/8 blur-[120px]" />
        <div className="absolute top-[60%] left-[50%] h-[300px] w-[300px] rounded-full bg-[#22D3EE]/6 blur-[100px]" />
      </div>

      <Navbar />
      <HeroSection />
      <CategoryCards />
      <FeaturedSpaces />
    </div>
  );
};

export default Index;
