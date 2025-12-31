import { Link } from 'react-router-dom';
import { CheckCircle, Package, Truck, Mail, ArrowRight, Home, ShoppingBag } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { useEffect, useState } from 'react';

const OrderConfirmation = () => {
  const [orderNumber] = useState(() => 
    `NR-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
  );
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    const timer = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const steps = [
    { icon: CheckCircle, title: 'Bestellung bestätigt', description: 'Ihre Bestellung wurde erfolgreich aufgenommen', completed: true },
    { icon: Package, title: 'In Bearbeitung', description: 'Wir bereiten Ihre Bestellung vor', completed: false },
    { icon: Truck, title: 'Versand', description: 'Ihre Bestellung ist unterwegs', completed: false },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Bestellung bestätigt — Noor" 
        description="Vielen Dank für Ihre Bestellung bei Noor" 
      />
      <Header />

      <div className="container max-w-4xl mx-auto px-6 py-16 md:py-24">
        {/* Success Animation */}
        <div className={`text-center transition-all duration-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="relative inline-flex items-center justify-center mb-8">
            <div className="absolute inset-0 bg-success/20 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
            <div className="relative w-24 h-24 bg-success rounded-full flex items-center justify-center shadow-lg">
              <CheckCircle className="w-12 h-12 text-success-foreground" />
            </div>
          </div>

          <p className="section-subheading text-success mb-3">Bestellung erfolgreich</p>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-4">
            Vielen Dank!
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
            Ihre Bestellung wurde erfolgreich aufgenommen und wird nun bearbeitet.
          </p>
        </div>

        {/* Order Number */}
        <div className={`mt-12 transition-all duration-700 delay-200 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-3">
              Bestellnummer
            </p>
            <p className="font-display text-2xl md:text-3xl font-semibold text-foreground tracking-wider">
              {orderNumber}
            </p>
          </div>
        </div>

        {/* Order Timeline */}
        <div className={`mt-12 transition-all duration-700 delay-300 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="font-display text-xl font-semibold text-foreground mb-8 text-center">
              Bestellstatus
            </h2>
            
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute left-6 top-6 bottom-6 w-[2px] bg-border" />
              <div className="absolute left-6 top-6 w-[2px] h-[calc(33%-12px)] bg-success" />
              
              <div className="space-y-8">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={index} className="flex items-start gap-6 relative">
                      <div className={`
                        w-12 h-12 rounded-full flex items-center justify-center shrink-0 z-10
                        ${step.completed 
                          ? 'bg-success text-success-foreground' 
                          : 'bg-secondary text-muted-foreground'
                        }
                      `}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="pt-2">
                        <h3 className={`font-medium ${step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {step.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Email Notification */}
        <div className={`mt-8 transition-all duration-700 delay-400 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-accent/30 border border-accent rounded-lg p-6 flex items-center gap-4">
            <div className="p-3 bg-accent rounded-full">
              <Mail className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <p className="text-foreground font-medium">Bestätigungs-E-Mail gesendet</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                Eine Bestellbestätigung wurde an Ihre E-Mail-Adresse gesendet.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={`mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-500 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Link 
            to="/products" 
            className="btn-primary inline-flex items-center gap-3 w-full sm:w-auto justify-center"
          >
            <ShoppingBag className="w-4 h-4" />
            Weiter einkaufen
          </Link>
          <Link 
            to="/" 
            className="inline-flex items-center gap-3 px-8 py-4 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors w-full sm:w-auto justify-center"
          >
            <Home className="w-4 h-4" />
            Zur Startseite
          </Link>
        </div>

        {/* Help Section */}
        <div className={`mt-16 text-center transition-all duration-700 delay-600 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="divider mx-auto mb-8" />
          <p className="text-muted-foreground text-sm">
            Haben Sie Fragen zu Ihrer Bestellung?{' '}
            <Link to="/contact" className="text-primary hover:underline">
              Kontaktieren Sie uns
            </Link>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderConfirmation;
