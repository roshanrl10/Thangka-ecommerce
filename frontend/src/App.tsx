import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ArtistsPage from "./pages/ArtistsPage";
import ArtistProfilePage from "./pages/ArtistProfilePage";
import WishlistPage from "./pages/WishlistPage";
import AuthPage from "./pages/AuthPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ApplyArtistPage from "./pages/ApplyArtistPage";
import AboutPage from "./pages/AboutPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";
import { Outlet } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UsersPage from "./pages/admin/UsersPage";
import ProductsPage from "./pages/admin/ProductsPage";
import OrdersPage from "./pages/admin/OrdersPage";
import SettingsPage from "./pages/admin/SettingsPage";
import ArtistDashboard from "./pages/artist/ArtistDashboard";
import ArtistProductsPage from "./pages/artist/ArtistProductsPage";
import AddProductPage from "./pages/artist/AddProductPage";
import ArtistSettingsPage from "./pages/artist/ArtistSettingsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes with Navbar & Footer */}
          <Route element={
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <CartDrawer />
              <main className="flex-1">
                <Outlet />
              </main>
              <Footer />
            </div>
          }>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/artists" element={<ArtistsPage />} />
            <Route path="/artist/:id" element={<ArtistProfilePage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/apply-artist" element={<ApplyArtistPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/orders" element={<OrderHistoryPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Admin Dashboard Routes */}
          <Route element={<DashboardLayout role="admin" />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UsersPage />} />
            <Route path="/admin/products" element={<ProductsPage />} />
            <Route path="/admin/orders" element={<OrdersPage />} />
            <Route path="/admin/settings" element={<SettingsPage />} />
          </Route>

          {/* Artist Dashboard Routes */}
          <Route element={<DashboardLayout role="artist" />}>
             <Route path="/artist" element={<ArtistDashboard />} />
             <Route path="/artist/products" element={<ArtistProductsPage />} />
             <Route path="/artist/products/new" element={<AddProductPage />} />
             <Route path="/artist/profile" element={<ArtistSettingsPage />} />
             {/* <Route path="/artist/orders" element={<ArtistOrdersPage />} /> */}
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
