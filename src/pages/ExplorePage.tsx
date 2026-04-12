import MarketplacePage from "@/components/MarketplacePage";
import { useNavigate } from "react-router-dom";

const ExplorePage = () => {
  const navigate = useNavigate();
  return <MarketplacePage category="studios" onBack={() => navigate("/")} />;
};

export default ExplorePage;
