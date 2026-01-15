import { useState } from 'react';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from 'sonner';

const NewsletterSection = () => {
  const { language } = useLanguage();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      toast.error(language === 'de' ? 'Bitte geben Sie eine gültige E-Mail ein' : 'Please enter a valid email');
      return;
    }
    
    // Simulate subscription
    setIsSubscribed(true);
    toast.success(language === 'de' ? 'Erfolgreich angemeldet!' : 'Successfully subscribed!');
    setEmail('');
    
    // Reset after 5 seconds
    setTimeout(() => setIsSubscribed(false), 5000);
  };

  return (
    <section className="container max-w-6xl mx-auto px-4 md:px-6">
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-card to-accent/10 rounded-2xl border border-border">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,hsl(var(--primary)/0.1),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,hsl(var(--accent)/0.1),transparent_40%)]" />
        
        <div className="relative p-8 md:p-12">
          <div className="max-w-2xl mx-auto text-center">
            {/* Icon */}
            <div className="w-16 h-16 bg-primary/15 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-primary" />
            </div>

            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              {language === 'de' 
                ? 'Verpassen Sie keine Angebote!' 
                : "Don't Miss Any Deals!"}
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              {language === 'de'
                ? 'Melden Sie sich an und erhalten Sie exklusive Rabatte und die neuesten Trends direkt in Ihr Postfach.'
                : 'Sign up to receive exclusive discounts and the latest trends directly to your inbox.'}
            </p>

            {/* Form */}
            {isSubscribed ? (
              <div className="flex items-center justify-center gap-3 py-4 px-6 bg-success/10 rounded-xl text-success">
                <CheckCircle2 className="w-6 h-6" />
                <span className="font-semibold">
                  {language === 'de' ? 'Vielen Dank für Ihre Anmeldung!' : 'Thank you for subscribing!'}
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={language === 'de' ? 'Ihre E-Mail-Adresse' : 'Your email address'}
                  className="flex-1 px-5 py-3.5 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
                <button
                  type="submit"
                  className="px-6 py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                  {language === 'de' ? 'Anmelden' : 'Subscribe'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Privacy Note */}
            <p className="text-xs text-muted-foreground mt-4">
              {language === 'de'
                ? 'Wir respektieren Ihre Privatsphäre. Abmeldung jederzeit möglich.'
                : 'We respect your privacy. Unsubscribe anytime.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
