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
import BottomNavigation from "@/components/BottomNavigation";
// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Category = lazy(() => import("./pages/Category"));
const Categories = lazy(() => import("./pages/Categories"));
const Products = lazy(() => import("./pages/Products"));
const Cart = lazy(() => import("./pages/Cart"));
const Favorites = lazy(() => import("./pages/Favorites"));
const Auth = lazy(() => import("./pages/Auth"));
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

// Admin pages
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminOrders = lazy(() => import("./pages/admin/Orders"));
const AdminReviews = lazy(() => import("./pages/admin/Reviews"));
const AdminProducts = lazy(() => import("./pages/admin/Products"));
const AdminCustomers = lazy(() => import("./pages/admin/Customers"));

const queryClient = new QueryClient();

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
                    <BottomNavigation />
                    <Suspense fallback={<PageSkeleton />}>
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/product/:id" element={<ProductDetail />} />
                        <Route path="/category/:slug" element={<Category />} />
                        <Route path="/categories" element={<Categories />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/favorites" element={<Favorites />} />
                        <Route path="/auth" element={<Auth />} />
                        <Route path="/account" element={<Account />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/order-confirmation" element={<OrderConfirmation />} />
                        <Route path="/faq" element={<FAQ />} />
                        <Route path="/shipping" element={<Shipping />} />
                        <Route path="/returns" element={<Returns />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/imprint" element={<Imprint />} />
                        <Route path="/privacy" element={<Privacy />} />
                        <Route path="/terms" element={<Terms />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/orders" element={<OrderHistory />} />
                        {/* Admin Routes - Protected */}
                        <Route path="/admin" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
                        <Route path="/admin/orders" element={<AdminGuard><AdminOrders /></AdminGuard>} />
                        <Route path="/admin/reviews" element={<AdminGuard><AdminReviews /></AdminGuard>} />
                        <Route path="/admin/products" element={<AdminGuard><AdminProducts /></AdminGuard>} />
                        <Route path="/admin/customers" element={<AdminGuard><AdminCustomers /></AdminGuard>} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </Suspense>
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
