import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useIsAdmin } from './useIsAdmin';
import { useIsSeller } from './useIsSeller';

interface LogParams {
  action: string;
  entityType: string;
  entityId?: string;
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
}

export const useAuditLog = () => {
  const { user } = useAuth();
  const { isAdmin } = useIsAdmin();
  const { isSeller } = useIsSeller();

  const log = useCallback(async ({
    action,
    entityType,
    entityId,
    oldValues,
    newValues,
  }: LogParams) => {
    if (!user) return;

    try {
      let userRole = 'user';
      if (isAdmin) userRole = 'admin';
      else if (isSeller) userRole = 'seller';

      await supabase.from('audit_logs').insert([{
        user_id: user.id,
        user_role: userRole,
        action,
        entity_type: entityType,
        entity_id: entityId || null,
        old_values: oldValues ? JSON.parse(JSON.stringify(oldValues)) : null,
        new_values: newValues ? JSON.parse(JSON.stringify(newValues)) : null,
      }]);
    } catch (error) {
      console.error('Error logging audit:', error);
    }
  }, [user, isAdmin, isSeller]);

  return { log };
};
