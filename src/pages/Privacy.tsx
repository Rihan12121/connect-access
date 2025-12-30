import { useLanguage } from '@/context/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Shield } from 'lucide-react';

const Privacy = () => {
  const { language } = useLanguage();

  const content = {
    de: {
      title: 'Datenschutzerklärung',
      lastUpdated: 'Zuletzt aktualisiert: Januar 2024',
      sections: [
        {
          title: '1. Datenschutz auf einen Blick',
          content: `Diese Datenschutzerklärung klärt Sie über die Art, den Umfang und Zweck der Verarbeitung von personenbezogenen Daten innerhalb unseres Onlineangebotes auf.

Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:
Noor GmbH, Musterstraße 123, 12345 Berlin`
        },
        {
          title: '2. Erfassung von Daten',
          content: `Wir erfassen Daten, die Sie uns mitteilen:
• Bei der Registrierung für ein Kundenkonto
• Beim Abschluss einer Bestellung
• Bei der Anmeldung zu unserem Newsletter
• Bei der Kontaktaufnahme per E-Mail oder Kontaktformular

Automatisch erfasste Daten:
• IP-Adresse
• Datum und Uhrzeit der Anfrage
• Browsertyp und -version
• Betriebssystem`
        },
        {
          title: '3. Verwendung von Cookies',
          content: `Wir verwenden Cookies, um unsere Website benutzerfreundlicher zu gestalten. Einige Cookies bleiben auf Ihrem Endgerät gespeichert, bis Sie diese löschen.

Notwendige Cookies: Diese sind für den Betrieb der Website erforderlich.
Analyse-Cookies: Helfen uns, die Nutzung der Website zu verstehen.
Marketing-Cookies: Werden für personalisierte Werbung verwendet.

Sie können Ihren Browser so einstellen, dass Sie über das Setzen von Cookies informiert werden.`
        },
        {
          title: '4. Ihre Rechte',
          content: `Sie haben folgende Rechte:
• Recht auf Auskunft über Ihre gespeicherten Daten
• Recht auf Berichtigung unrichtiger Daten
• Recht auf Löschung Ihrer Daten
• Recht auf Einschränkung der Verarbeitung
• Recht auf Datenübertragbarkeit
• Widerspruchsrecht gegen die Verarbeitung

Zur Ausübung Ihrer Rechte wenden Sie sich bitte an: datenschutz@noor-shop.de`
        },
        {
          title: '5. Datensicherheit',
          content: `Wir verwenden SSL-Verschlüsselung für eine sichere Datenübertragung. Ihre Zahlungsdaten werden nicht auf unseren Servern gespeichert, sondern direkt an unsere Zahlungsdienstleister übermittelt.`
        },
        {
          title: '6. Zahlungsdienstleister',
          content: `Wir arbeiten mit folgenden Zahlungsdienstleistern zusammen:
• Stripe (Kreditkartenzahlung)
• PayPal
• Klarna

Diese Dienstleister verarbeiten Ihre Zahlungsdaten gemäß deren eigenen Datenschutzbestimmungen.`
        }
      ]
    },
    en: {
      title: 'Privacy Policy',
      lastUpdated: 'Last updated: January 2024',
      sections: [
        {
          title: '1. Privacy at a Glance',
          content: `This privacy policy explains the nature, scope and purpose of the processing of personal data within our online offering.

The responsible party for data processing on this website is:
Noor GmbH, Musterstraße 123, 12345 Berlin, Germany`
        },
        {
          title: '2. Data Collection',
          content: `We collect data that you provide to us:
• When registering for a customer account
• When completing an order
• When signing up for our newsletter
• When contacting us by email or contact form

Automatically collected data:
• IP address
• Date and time of the request
• Browser type and version
• Operating system`
        },
        {
          title: '3. Use of Cookies',
          content: `We use cookies to make our website more user-friendly. Some cookies remain stored on your device until you delete them.

Necessary cookies: These are required for the operation of the website.
Analytics cookies: Help us understand how the website is used.
Marketing cookies: Used for personalized advertising.

You can set your browser to inform you about the setting of cookies.`
        },
        {
          title: '4. Your Rights',
          content: `You have the following rights:
• Right to information about your stored data
• Right to correction of inaccurate data
• Right to deletion of your data
• Right to restriction of processing
• Right to data portability
• Right to object to processing

To exercise your rights, please contact: datenschutz@noor-shop.de`
        },
        {
          title: '5. Data Security',
          content: `We use SSL encryption for secure data transmission. Your payment data is not stored on our servers but is transmitted directly to our payment service providers.`
        },
        {
          title: '6. Payment Service Providers',
          content: `We work with the following payment service providers:
• Stripe (credit card payments)
• PayPal
• Klarna

These service providers process your payment data in accordance with their own privacy policies.`
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
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">{data.title}</h1>
          <p className="text-muted-foreground mt-2">{data.lastUpdated}</p>
        </div>

        <div className="space-y-6">
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

export default Privacy;
