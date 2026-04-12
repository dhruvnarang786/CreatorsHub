import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/70 backdrop-blur-xl">
      <div className="container mx-auto flex items-center justify-between py-3">
        <Link to="/">
          <Logo size="sm" />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            to="/explore"
            className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Explore <ChevronDown className="h-3.5 w-3.5" />
          </Link>
          <a
            href="#how-it-works"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            How it Works
          </a>
          <button className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Help <ChevronDown className="h-3.5 w-3.5" />
          </button>
          <Button variant="hero" size="sm" onClick={() => navigate("/register/list-studio")}>
            Sign Up
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
