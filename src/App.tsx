import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import MainLayout from "@/components/layout/MainLayout";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Stores from "./pages/Stores";
import Cart from "./pages/Cart";
import Account from "./pages/Account";
import Auth from "./pages/Auth";
import SellerDashboard from "./pages/SellerDashboard";
import CreateStore from "./pages/CreateStore";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import SupabaseDebug from "./pages/SupabaseDebug";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:slug" element={<ProductDetail />} />
                <Route path="/stores" element={<Stores />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/account" element={<Account />} />
              </Route>
              <Route path="/auth" element={<Auth />} />
              <Route path="/seller" element={<SellerDashboard />} />
              <Route path="/seller/create-store" element={<CreateStore />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/supabase-debug" element={<SupabaseDebug />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
