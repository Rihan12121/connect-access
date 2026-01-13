import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

export const useIsSeller = () => {
  const { user, loading: authLoading } = useAuth();
  const [isSeller, setIsSeller] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!user) {
        if (!cancelled) {
          setIsSeller(false);
          setLoading(false);
        }
        return;
      }

      const { data } = await supabase.rpc("has_role", {
        _user_id: user.id,
        _role: "seller",
      });

      if (!cancelled) {
        setIsSeller(data === true);
        setLoading(false);
      }
    };

    if (authLoading) return;

    setLoading(true);
    run();

    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  return { isSeller, loading };
};
