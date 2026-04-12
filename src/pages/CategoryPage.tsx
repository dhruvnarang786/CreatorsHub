import { useParams, useNavigate } from "react-router-dom";
import MarketplacePage from "@/components/MarketplacePage";
import type { CategoryKey } from "@/lib/data";

const validCategories: CategoryKey[] = ["studios", "videographers", "editors", "equipment"];

const CategoryPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const category = validCategories.includes(categoryId as CategoryKey)
    ? (categoryId as CategoryKey)
    : "studios";

  return <MarketplacePage category={category} onBack={() => navigate("/")} />;
};

export default CategoryPage;
