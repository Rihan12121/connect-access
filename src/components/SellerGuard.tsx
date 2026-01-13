import { useIsSeller } from "@/hooks/useIsSeller";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

interface SellerGuardProps {
  children: React.ReactNode;
}

export const SellerGuard = ({ children }: SellerGuardProps) => {
  const { user, loading: authLoading } = useAuth();
  const { isSeller, loading: sellerLoading } = useIsSeller();
  const { isAdmin, loading: adminLoading } = useIsAdmin();

  if (authLoading || sellerLoading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Admins can also access seller dashboard
  if (!isSeller && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
