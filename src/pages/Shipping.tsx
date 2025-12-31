import { useLanguage } from '@/context/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VatNotice from '@/components/VatNotice';
import SEO from '@/components/SEO';
import { Truck, Clock, MapPin, Euro } from 'lucide-react';

const Shipping = () => {
  const { t, language } = useLanguage();

  const content = {
    de: {
      title: 'Versand & Lieferung',
      subtitle: 'Alle Informationen zu Versandoptionen und Lieferzeiten',
      sections: [
        {
          icon: Euro,
          title: 'Versandkosten',
          items: [
            'Kostenloser Versand ab 50€ Bestellwert',
            'Standardversand: 4,95€',
            'Express-Versand: 9,95€',
            'Internationale Lieferungen: ab 12,95€'
          ]
        },
        {
          icon: Clock,
          title: 'Lieferzeiten',
          items: [
            'Standardversand: 2-5 Werktage',
            'Express-Versand: 1-2 Werktage',
            'Internationale Lieferungen: 5-10 Werktage',
            'Bestellungen vor 14:00 Uhr werden am selben Tag versandt'
          ]
        },
        {
          icon: Truck,
          title: 'Versandpartner',
          items: [
            'DHL (Standard)',
            'DPD (Express)',
            'Hermes (Paketshop-Lieferung)',
            'Sendungsverfolgung für alle Pakete'
          ]
        },
        {
          icon: MapPin,
          title: 'Liefergebiete',
          items: [
            'Deutschland (alle Regionen)',
            'Österreich',
            'Schweiz',
            'EU-Länder'
          ]
        }
      ]
    },
    en: {
      title: 'Shipping & Delivery',
      subtitle: 'All information about shipping options and delivery times',
      sections: [
        {
          icon: Euro,
          title: 'Shipping Costs',
          items: [
            'Free shipping on orders over €50',
            'Standard shipping: €4.95',
            'Express shipping: €9.95',
            'International deliveries: from €12.95'
          ]
        },
        {
          icon: Clock,
          title: 'Delivery Times',
          items: [
            'Standard shipping: 2-5 business days',
            'Express shipping: 1-2 business days',
            'International deliveries: 5-10 business days',
            'Orders placed before 2:00 PM are shipped the same day'
          ]
        },
        {
          icon: Truck,
          title: 'Shipping Partners',
          items: [
            'DHL (Standard)',
            'DPD (Express)',
            'Hermes (Parcel shop delivery)',
            'Tracking for all packages'
          ]
        },
        {
          icon: MapPin,
          title: 'Delivery Areas',
          items: [
            'Germany (all regions)',
            'Austria',
            'Switzerland',
            'EU countries'
          ]
        }
      ]
    }
  };

  const data = content[language];

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Versand & Lieferung"
        description="Versandkosten und Lieferzeiten bei Noor Shop - Kostenloser Versand ab 50€."
      />
      <Header />

      <div className="container max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Truck className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">{data.title}</h1>
          <p className="text-muted-foreground mt-2">{data.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.sections.map((section, index) => (
            <div key={index} className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <section.icon className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-lg font-bold text-foreground">{section.title}</h2>
              </div>
              <ul className="space-y-2">
                {section.items.map((item, idx) => (
                  <li key={idx} className="text-muted-foreground text-sm flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <VatNotice />
      </div>

      <Footer />
    </div>
  );
};

export default Shipping;
