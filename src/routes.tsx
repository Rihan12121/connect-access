import { lazy, Suspense } from "react";
import type { RouteRecord } from "vite-react-ssg";
import { PageSkeleton } from "@/components/LoadingSkeleton";
import AdminGuard from "@/components/AdminGuard";
import { SellerGuard } from "@/components/SellerGuard";

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
const OrderTracking = lazy(() => import("./pages/OrderTracking"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Messages = lazy(() => import("./pages/Messages"));

// Admin pages - lazy loaded (admin only)
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminOrders = lazy(() => import("./pages/admin/Orders"));
const AdminReviews = lazy(() => import("./pages/admin/Reviews"));
const AdminProducts = lazy(() => import("./pages/admin/Products"));
const AdminCustomers = lazy(() => import("./pages/admin/Customers"));
const AdminCategories = lazy(() => import("./pages/admin/Categories"));
const AdminBanners = lazy(() => import("./pages/admin/Banners"));
const AdminSettings = lazy(() => import("./pages/admin/Settings"));

// Seller pages - lazy loaded (seller only)
const SellerDashboard = lazy(() => import("./pages/seller/Dashboard"));
const SellerProductForm = lazy(() => import("./pages/seller/ProductForm"));

// Wrap lazy components with Suspense
const withSuspense = (Component: React.LazyExoticComponent<() => JSX.Element>) => (
  <Suspense fallback={<PageSkeleton />}>
    <Component />
  </Suspense>
);

// Wrap admin components with guard and suspense
const withAdminGuard = (Component: React.LazyExoticComponent<() => JSX.Element>) => (
  <AdminGuard>
    <Suspense fallback={<PageSkeleton />}>
      <Component />
    </Suspense>
  </AdminGuard>
);

// Wrap seller components with guard and suspense
const withSellerGuard = (Component: React.LazyExoticComponent<() => JSX.Element>) => (
  <SellerGuard>
    <Suspense fallback={<PageSkeleton />}>
      <Component />
    </Suspense>
  </SellerGuard>
);

export const routes: RouteRecord[] = [
  // Core routes - pre-rendered for SEO
  { path: "/", element: <Index /> },
  { path: "/products", element: <Products /> },
  { path: "/product/:id", element: <ProductDetail /> },
  { path: "/category/:slug", element: <Category /> },
  { path: "/categories", element: <Categories /> },
  { path: "/cart", element: <Cart /> },
  { path: "/favorites", element: <Favorites /> },
  { path: "/auth", element: <Auth /> },
  
  // Secondary routes - lazy loaded
  { path: "/account", element: withSuspense(Account) },
  { path: "/checkout", element: withSuspense(Checkout) },
  { path: "/order-confirmation", element: withSuspense(OrderConfirmation) },
  { path: "/faq", element: withSuspense(FAQ) },
  { path: "/shipping", element: withSuspense(Shipping) },
  { path: "/returns", element: withSuspense(Returns) },
  { path: "/contact", element: withSuspense(Contact) },
  { path: "/imprint", element: withSuspense(Imprint) },
  { path: "/privacy", element: withSuspense(Privacy) },
  { path: "/terms", element: withSuspense(Terms) },
  { path: "/about", element: withSuspense(About) },
  { path: "/orders", element: withSuspense(OrderHistory) },
  { path: "/order-tracking", element: withSuspense(OrderTracking) },
  { path: "/messages", element: withSuspense(Messages) },
  
  // Admin routes - protected
  { path: "/admin", element: withAdminGuard(AdminDashboard) },
  { path: "/admin/orders", element: withAdminGuard(AdminOrders) },
  { path: "/admin/reviews", element: withAdminGuard(AdminReviews) },
  { path: "/admin/products", element: withAdminGuard(AdminProducts) },
  { path: "/admin/customers", element: withAdminGuard(AdminCustomers) },
  { path: "/admin/categories", element: withAdminGuard(AdminCategories) },
  { path: "/admin/banners", element: withAdminGuard(AdminBanners) },
  { path: "/admin/settings", element: withAdminGuard(AdminSettings) },
  
  // Seller routes - protected
  { path: "/seller", element: withSellerGuard(SellerDashboard) },
  { path: "/seller/products/new", element: withSellerGuard(SellerProductForm) },
  { path: "/seller/products/:id/edit", element: withSellerGuard(SellerProductForm) },
  
  // 404 - not pre-rendered
  { path: "*", element: withSuspense(NotFound) },
];

