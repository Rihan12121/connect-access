import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Minimize2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  is_read: boolean;
}

const LiveChatWidget = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Support team user ID (in production, this would be a real support user)
  const SUPPORT_USER_ID = '00000000-0000-0000-0000-000000000001';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!user || !isOpen) return;
    findOrCreateConversation();
  }, [user, isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const findOrCreateConversation = async () => {
    if (!user) return;

    // Check for existing support conversation
    const { data: existing } = await supabase
      .from('conversations')
      .select('id')
      .or(`and(participant_1.eq.${user.id},participant_2.eq.${SUPPORT_USER_ID}),and(participant_1.eq.${SUPPORT_USER_ID},participant_2.eq.${user.id})`)
      .single();

    if (existing) {
      setConversationId(existing.id);
      fetchMessages(existing.id);
      subscribeToMessages(existing.id);
    } else {
      // Create new support conversation
      const { data: newConv, error } = await supabase
        .from('conversations')
        .insert({
          participant_1: user.id,
          participant_2: SUPPORT_USER_ID,
        })
        .select('id')
        .single();

      if (!error && newConv) {
        setConversationId(newConv.id);
        subscribeToMessages(newConv.id);
        // Send welcome message
        await sendWelcomeMessage(newConv.id);
      }
    }
  };

  const fetchMessages = async (convId: string) => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', convId)
      .order('created_at', { ascending: true });

    if (data) {
      setMessages(data);
      // Count unread from support
      const unread = data.filter(m => !m.is_read && m.sender_id === SUPPORT_USER_ID).length;
      setUnreadCount(unread);
    }
  };

  const subscribeToMessages = (convId: string) => {
    const channel = supabase
      .channel(`chat:${convId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${convId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
          if (payload.new.sender_id === SUPPORT_USER_ID) {
            setUnreadCount((prev) => prev + 1);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendWelcomeMessage = async (convId: string) => {
    // This would normally come from the support system
    // For now, we'll just add a welcome message locally
    const welcomeMsg = {
      id: crypto.randomUUID(),
      conversation_id: convId,
      sender_id: SUPPORT_USER_ID,
      content: language === 'de' 
        ? 'Willkommen beim Noor Support! Wie können wir Ihnen helfen?'
        : 'Welcome to Noor Support! How can we help you?',
      is_read: false,
      created_at: new Date().toISOString(),
    };
    setMessages([welcomeMsg]);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !conversationId || !user) return;

    setSending(true);
    const { error } = await supabase.from('messages').insert({
      conversation_id: conversationId,
      sender_id: user.id,
      content: newMessage.trim(),
    });

    if (!error) {
      setNewMessage('');
    }
    setSending(false);
  };

  const markAsRead = async () => {
    if (!conversationId || !user) return;
    
    await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('conversation_id', conversationId)
      .neq('sender_id', user.id);
    
    setUnreadCount(0);
  };

  if (!user) return null;

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            markAsRead();
          }}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:opacity-90 transition-opacity"
        >
          <MessageCircle className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={cn(
            'fixed bottom-6 right-6 z-50 w-80 sm:w-96 bg-background border rounded-2xl shadow-2xl flex flex-col transition-all',
            isMinimized ? 'h-14' : 'h-[500px]'
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground rounded-t-2xl">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="font-semibold">
                {language === 'de' ? 'Live Support' : 'Live Support'}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((msg) => {
                    const isOwn = msg.sender_id === user.id;
                    return (
                      <div
                        key={msg.id}
                        className={cn('flex gap-2', isOwn ? 'justify-end' : 'justify-start')}
                      >
                        {!isOwn && (
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                              S
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={cn(
                            'max-w-[70%] px-3 py-2 rounded-2xl text-sm',
                            isOwn
                              ? 'bg-primary text-primary-foreground rounded-br-sm'
                              : 'bg-muted rounded-bl-sm'
                          )}
                        >
                          {msg.content}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="p-4 border-t">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex gap-2"
                >
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={
                      language === 'de' ? 'Nachricht schreiben...' : 'Type a message...'
                    }
                    disabled={sending}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon" disabled={sending || !newMessage.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default LiveChatWidget;
