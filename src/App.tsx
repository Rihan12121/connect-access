import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { CartProvider } from "@/context/CartContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import ScrollToTop from "@/components/ScrollToTop";
import BackToTopButton from "@/components/BackToTopButton";
import CookieConsentBanner from "@/components/CookieConsentBanner";
import { PageSkeleton } from "@/components/LoadingSkeleton";
import AdminGuard from "@/components/AdminGuard";

// Core pages - loaded immediately for fast initial navigation
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Category from "./pages/Category";
import Categories from "./pages/Categories";
import Cart from "./pages/Cart";
import Favorites from "./pages/Favorites";
import Auth from "./pages/Auth";

// Secondary pages - lazy loaded (less frequently accessed)
const Account = lazy(() => import("./pages/Account"));
const Checkout = lazy(() => import("./pages/Checkout"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Shipping = lazy(() => import("./pages/Shipping"));
const Returns = lazy(() => import("./pages/Returns"));
const Contact = lazy(() => import("./pages/Contact"));
const Imprint = lazy(() => import("./pages/Imprint"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const About = lazy(() => import("./pages/About"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation"));
const OrderHistory = lazy(() => import("./pages/OrderHistory"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Admin pages - lazy loaded (admin only)
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminOrders = lazy(() => import("./pages/admin/Orders"));
const AdminReviews = lazy(() => import("./pages/admin/Reviews"));
const AdminProducts = lazy(() => import("./pages/admin/Products"));
const AdminCustomers = lazy(() => import("./pages/admin/Customers"));

// Single QueryClient instance with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <LanguageProvider>
            <AuthProvider>
              <CartProvider>
                <FavoritesProvider>
                  <Toaster />
                  <Sonner position="top-center" />
                  <BrowserRouter>
                    <ScrollToTop />
                    <BackToTopButton />
                    <CookieConsentBanner />
                    <Routes>
                      {/* Core routes - no lazy loading */}
                      <Route path="/" element={<Index />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/product/:id" element={<ProductDetail />} />
                      <Route path="/category/:slug" element={<Category />} />
                      <Route path="/categories" element={<Categories />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/favorites" element={<Favorites />} />
                      <Route path="/auth" element={<Auth />} />
                      
                      {/* Secondary routes - lazy loaded */}
                      <Route path="/account" element={<Suspense fallback={<PageSkeleton />}><Account /></Suspense>} />
                      <Route path="/checkout" element={<Suspense fallback={<PageSkeleton />}><Checkout /></Suspense>} />
                      <Route path="/order-confirmation" element={<Suspense fallback={<PageSkeleton />}><OrderConfirmation /></Suspense>} />
                      <Route path="/faq" element={<Suspense fallback={<PageSkeleton />}><FAQ /></Suspense>} />
                      <Route path="/shipping" element={<Suspense fallback={<PageSkeleton />}><Shipping /></Suspense>} />
                      <Route path="/returns" element={<Suspense fallback={<PageSkeleton />}><Returns /></Suspense>} />
                      <Route path="/contact" element={<Suspense fallback={<PageSkeleton />}><Contact /></Suspense>} />
                      <Route path="/imprint" element={<Suspense fallback={<PageSkeleton />}><Imprint /></Suspense>} />
                      <Route path="/privacy" element={<Suspense fallback={<PageSkeleton />}><Privacy /></Suspense>} />
                      <Route path="/terms" element={<Suspense fallback={<PageSkeleton />}><Terms /></Suspense>} />
                      <Route path="/about" element={<Suspense fallback={<PageSkeleton />}><About /></Suspense>} />
                      <Route path="/orders" element={<Suspense fallback={<PageSkeleton />}><OrderHistory /></Suspense>} />
                      
                      {/* Admin routes - lazy loaded & protected */}
                      <Route path="/admin" element={<AdminGuard><Suspense fallback={<PageSkeleton />}><AdminDashboard /></Suspense></AdminGuard>} />
                      <Route path="/admin/orders" element={<AdminGuard><Suspense fallback={<PageSkeleton />}><AdminOrders /></Suspense></AdminGuard>} />
                      <Route path="/admin/reviews" element={<AdminGuard><Suspense fallback={<PageSkeleton />}><AdminReviews /></Suspense></AdminGuard>} />
                      <Route path="/admin/products" element={<AdminGuard><Suspense fallback={<PageSkeleton />}><AdminProducts /></Suspense></AdminGuard>} />
                      <Route path="/admin/customers" element={<AdminGuard><Suspense fallback={<PageSkeleton />}><AdminCustomers /></Suspense></AdminGuard>} />
                      
                      {/* 404 */}
                      <Route path="*" element={<Suspense fallback={<PageSkeleton />}><NotFound /></Suspense>} />
                    </Routes>
                  </BrowserRouter>
                </FavoritesProvider>
              </CartProvider>
            </AuthProvider>
          </LanguageProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </ErrorBoundary>
);

export default App;
