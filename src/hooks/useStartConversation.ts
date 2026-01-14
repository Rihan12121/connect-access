import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useStartConversation = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const startConversation = async (otherUserId: string) => {
    if (!user) {
      toast.error("Bitte melde dich an, um Nachrichten zu senden");
      navigate("/auth");
      return;
    }

    if (user.id === otherUserId) {
      toast.error("Du kannst dir selbst keine Nachrichten senden");
      return;
    }

    // Check if conversation already exists
    const { data: existingConv } = await supabase
      .from("conversations")
      .select("id")
      .or(
        `and(participant_1.eq.${user.id},participant_2.eq.${otherUserId}),and(participant_1.eq.${otherUserId},participant_2.eq.${user.id})`
      )
      .single();

    if (existingConv) {
      navigate(`/messages?conv=${existingConv.id}`);
      return;
    }

    // Create new conversation
    const { data: newConv, error } = await supabase
      .from("conversations")
      .insert({
        participant_1: user.id,
        participant_2: otherUserId,
      })
      .select("id")
      .single();

    if (error) {
      toast.error("Fehler beim Erstellen der Unterhaltung");
      console.error(error);
      return;
    }

    navigate(`/messages?conv=${newConv.id}`);
  };

  return { startConversation };
};
