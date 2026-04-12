import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategoryCards from "@/components/CategoryCards";
import FeaturedSpaces from "@/components/FeaturedSpaces";
import MarketplacePage from "@/components/MarketplacePage";
import RegistrationPage from "@/components/RegistrationPage";
import type { CategoryKey } from "@/lib/data";

type Page = "home" | "marketplace" | "registration";

const Index = () => {
  const [page, setPage] = useState<Page>("home");
  const [category, setCategory] = useState<CategoryKey>("studios");
  const [regMode, setRegMode] = useState("list-studio");

  const openMarketplace = (cat: CategoryKey = "studios") => {
    setCategory(cat);
    setPage("marketplace");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openRegistration = (mode: string) => {
    setRegMode(mode);
    setPage("registration");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goHome = () => {
    setPage("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (page === "marketplace") {
    return <MarketplacePage category={category} onBack={goHome} />;
  }

  if (page === "registration") {
    return <RegistrationPage mode={regMode} onBack={goHome} />;
  }

  return (
    <div className="min-h-screen">
      <Navbar onExplore={() => openMarketplace("studios")} onList={() => openRegistration("list-studio")} />
      <HeroSection onExplore={() => openMarketplace("studios")} />
      <CategoryCards onCategory={openMarketplace} onRegister={openRegistration} />
      <FeaturedSpaces onExplore={() => openMarketplace("studios")} />
    </div>
  );
};

export default Index;
