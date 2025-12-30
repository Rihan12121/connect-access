import { useLanguage } from '@/context/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Building } from 'lucide-react';

const Imprint = () => {
  const { language } = useLanguage();

  const content = {
    de: {
      title: 'Impressum',
      sections: [
        {
          title: 'Angaben gemäß § 5 TMG',
          content: `Noor GmbH
Musterstraße 123
12345 Berlin
Deutschland`
        },
        {
          title: 'Vertreten durch',
          content: `Geschäftsführer: Max Mustermann`
        },
        {
          title: 'Kontakt',
          content: `Telefon: +49 123 456 789
E-Mail: info@noor-shop.de`
        },
        {
          title: 'Registereintrag',
          content: `Eintragung im Handelsregister
Registergericht: Amtsgericht Berlin
Registernummer: HRB 123456`
        },
        {
          title: 'Umsatzsteuer-ID',
          content: `Umsatzsteuer-Identifikationsnummer gemäß §27 a Umsatzsteuergesetz:
DE123456789`
        },
        {
          title: 'Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV',
          content: `Max Mustermann
Musterstraße 123
12345 Berlin`
        },
        {
          title: 'EU-Streitschlichtung',
          content: `Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: https://ec.europa.eu/consumers/odr

Unsere E-Mail-Adresse finden Sie oben im Impressum.`
        },
        {
          title: 'Verbraucherstreitbeilegung/Universalschlichtungsstelle',
          content: `Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.`
        }
      ]
    },
    en: {
      title: 'Legal Notice',
      sections: [
        {
          title: 'Information according to § 5 TMG',
          content: `Noor GmbH
Musterstraße 123
12345 Berlin
Germany`
        },
        {
          title: 'Represented by',
          content: `Managing Director: Max Mustermann`
        },
        {
          title: 'Contact',
          content: `Phone: +49 123 456 789
Email: info@noor-shop.de`
        },
        {
          title: 'Register Entry',
          content: `Entry in the Commercial Register
Registry Court: Amtsgericht Berlin
Registration Number: HRB 123456`
        },
        {
          title: 'VAT ID',
          content: `VAT identification number according to §27 a of the German VAT Act:
DE123456789`
        },
        {
          title: 'Responsible for content according to § 55 Abs. 2 RStV',
          content: `Max Mustermann
Musterstraße 123
12345 Berlin`
        },
        {
          title: 'EU Dispute Resolution',
          content: `The European Commission provides a platform for online dispute resolution (OS): https://ec.europa.eu/consumers/odr

You can find our email address in the legal notice above.`
        },
        {
          title: 'Consumer Dispute Resolution',
          content: `We are not willing or obliged to participate in dispute resolution proceedings before a consumer arbitration board.`
        }
      ]
    }
  };

  const data = content[language];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Building className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">{data.title}</h1>
        </div>

        <div className="space-y-8">
          {data.sections.map((section, index) => (
            <div key={index} className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-lg font-bold text-foreground mb-3">{section.title}</h2>
              <p className="text-muted-foreground whitespace-pre-line">{section.content}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Imprint;
