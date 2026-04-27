import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Marketplace Pages
import StudioMarketplace from "./pages/StudioMarketplace";
import StudioDetail from "./pages/StudioDetail";
import Professionals from "./pages/Professionals";
import Equipment from "./pages/Equipment";

// Registration Pages (existing)
import ExplorePage from "./pages/ExplorePage";
import CategoryPage from "./pages/CategoryPage";
import RegisterPage from "./pages/RegisterPage";
import RegisterProfessional from "./pages/RegisterProfessional";

// Auth Pages
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import AuthCallback from "./pages/AuthCallback";

// Dashboard Pages
import CreatorDashboard from "./pages/CreatorDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";

const queryClient = new QueryClient();

// Dashboard redirect based on role
const DashboardRedirect = () => {
  const { profile } = useAuth();
  if (profile?.role === "studio_owner") return <Navigate to="/dashboard/owner" replace />;
  return <Navigate to="/dashboard/creator" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />

            {/* Marketplace Routes */}
            <Route path="/studios" element={<StudioMarketplace />} />
            <Route path="/studio/:id" element={<StudioDetail />} />
            <Route path="/professionals" element={<Professionals />} />
            <Route path="/equipment" element={<Equipment />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/category/:categoryId" element={<CategoryPage />} />

            {/* Registration Routes */}
            <Route path="/register/:mode" element={<RegisterPage />} />
            <Route path="/professionals/register" element={<RegisterProfessional />} />

            {/* Auth Routes */}
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* Dashboard Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardRedirect />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/creator"
              element={
                <ProtectedRoute requiredRole="creator">
                  <CreatorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/owner"
              element={
                <ProtectedRoute requiredRole="studio_owner">
                  <OwnerDashboard />
                </ProtectedRoute>
              }
            />

            {/* Catch All */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
