import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, MessageCircle, ArrowLeft } from "lucide-react";
import { Navigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface Conversation {
  id: string;
  participant_1: string;
  participant_2: string;
  updated_at: string;
  other_user?: {
    user_id: string;
    display_name: string | null;
  };
  last_message?: string;
  unread_count?: number;
}

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

const Messages = () => {
  const { user, loading: authLoading } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
      markMessagesAsRead(selectedConversation.id);

      // Subscribe to new messages
      const channel = supabase
        .channel(`messages-${selectedConversation.id}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `conversation_id=eq.${selectedConversation.id}`,
          },
          (payload) => {
            const newMsg = payload.new as Message;
            setMessages((prev) => [...prev, newMsg]);
            if (newMsg.sender_id !== user?.id) {
              markMessagesAsRead(selectedConversation.id);
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchConversations = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("conversations")
      .select("*")
      .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error fetching conversations:", error);
      setLoading(false);
      return;
    }

    // Get other participants' profiles using public view
    const otherUserIds = (data || []).map((c) =>
      c.participant_1 === user.id ? c.participant_2 : c.participant_1
    );

    const { data: profiles } = await supabase
      .from("profiles_public")
      .select("user_id, display_name")
      .in("user_id", otherUserIds);

    const conversationsWithProfiles = (data || []).map((conv) => {
      const otherUserId = conv.participant_1 === user.id ? conv.participant_2 : conv.participant_1;
      const profile = profiles?.find((p) => p.user_id === otherUserId);
      // Use display_name, fallback to truncated user_id
      const displayName = profile?.display_name || `Benutzer ${otherUserId.slice(0, 8)}`;
      return {
        ...conv,
        other_user: { user_id: otherUserId, display_name: displayName },
      };
    });

    setConversations(conversationsWithProfiles);
    setLoading(false);
  };

  const fetchMessages = async (conversationId: string) => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (!error && data) {
      setMessages(data);
    }
  };

  const markMessagesAsRead = async (conversationId: string) => {
    if (!user) return;

    await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("conversation_id", conversationId)
      .neq("sender_id", user.id);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !user) return;

    setSending(true);
    const { error } = await supabase.from("messages").insert({
      conversation_id: selectedConversation.id,
      sender_id: user.id,
      content: newMessage.trim(),
    });

    if (!error) {
      setNewMessage("");
      // Update conversation's updated_at
      await supabase
        .from("conversations")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", selectedConversation.id);
    }
    setSending(false);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Heute";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Gestern";
    }
    return date.toLocaleDateString("de-DE");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <>
      <SEO title="Nachrichten" description="Ihre Nachrichten" />
      <Header />
      <main className="min-h-screen bg-background pt-4 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <MessageCircle className="h-6 w-6" />
            Nachrichten
          </h1>

          <div className="grid md:grid-cols-3 gap-4 h-[calc(100vh-250px)] min-h-[500px]">
            {/* Conversations List */}
            <div
              className={cn(
                "border rounded-lg bg-card",
                selectedConversation ? "hidden md:block" : "block"
              )}
            >
              <div className="p-4 border-b">
                <h2 className="font-semibold">Unterhaltungen</h2>
              </div>
              <ScrollArea className="h-[calc(100%-60px)]">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : conversations.length === 0 ? (
                  <p className="text-center text-muted-foreground py-12">
                    Noch keine Nachrichten
                  </p>
                ) : (
                  conversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv)}
                      className={cn(
                        "w-full p-4 text-left border-b hover:bg-muted/50 transition-colors",
                        selectedConversation?.id === conv.id && "bg-muted"
                      )}
                    >
                      <p className="font-medium">
                        {conv.other_user?.display_name || "Unbekannt"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(conv.updated_at)}
                      </p>
                    </button>
                  ))
                )}
              </ScrollArea>
            </div>

            {/* Messages Area */}
            <div
              className={cn(
                "md:col-span-2 border rounded-lg bg-card flex flex-col",
                !selectedConversation ? "hidden md:flex" : "flex"
              )}
            >
              {selectedConversation ? (
                <>
                  <div className="p-4 border-b flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="md:hidden"
                      onClick={() => setSelectedConversation(null)}
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h2 className="font-semibold">
                      {selectedConversation.other_user?.display_name || "Unbekannt"}
                    </h2>
                  </div>
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={cn(
                            "max-w-[80%] p-3 rounded-lg",
                            msg.sender_id === user.id
                              ? "ml-auto bg-primary text-primary-foreground"
                              : "bg-muted"
                          )}
                        >
                          <p>{msg.content}</p>
                          <p
                            className={cn(
                              "text-xs mt-1",
                              msg.sender_id === user.id
                                ? "text-primary-foreground/70"
                                : "text-muted-foreground"
                            )}
                          >
                            {formatTime(msg.created_at)}
                          </p>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                  <div className="p-4 border-t flex gap-2">
                    <Input
                      placeholder="Nachricht schreiben..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                    />
                    <Button onClick={sendMessage} disabled={sending || !newMessage.trim()}>
                      {sending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  Wähle eine Unterhaltung aus
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Messages;
