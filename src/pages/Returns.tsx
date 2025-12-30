import { useLanguage } from '@/context/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { RotateCcw, Check, AlertCircle } from 'lucide-react';

const Returns = () => {
  const { t, language } = useLanguage();

  const content = {
    de: {
      title: 'Rückgabe & Erstattung',
      subtitle: '30 Tage Rückgaberecht für Ihre Zufriedenheit',
      intro: 'Wir möchten, dass Sie mit Ihrem Einkauf zufrieden sind. Falls nicht, können Sie Ihre Artikel innerhalb von 30 Tagen zurückgeben.',
      steps: [
        {
          step: '1',
          title: 'Rücksendung anmelden',
          description: 'Melden Sie sich in Ihrem Konto an oder kontaktieren Sie unseren Kundenservice, um eine Rücksendung anzumelden.'
        },
        {
          step: '2',
          title: 'Artikel verpacken',
          description: 'Verpacken Sie die Artikel sicher in der Originalverpackung, wenn möglich.'
        },
        {
          step: '3',
          title: 'Rücksendeetikett anbringen',
          description: 'Drucken Sie das Rücksendeetikett aus und bringen Sie es am Paket an.'
        },
        {
          step: '4',
          title: 'Paket abgeben',
          description: 'Geben Sie das Paket bei einer DHL-Filiale oder einem Paketshop ab.'
        }
      ],
      conditions: {
        title: 'Rückgabebedingungen',
        allowed: [
          'Artikel müssen unbenutzt und in Originalverpackung sein',
          'Etiketten müssen noch angebracht sein',
          'Rücksendung innerhalb von 30 Tagen nach Erhalt',
          'Kostenlose Rücksendung für DE-Kunden'
        ],
        notAllowed: [
          'Hygieneartikel nach Öffnung',
          'Personalisierte Artikel',
          'Verderbliche Waren',
          'Unterwäsche und Bademode (aus hygienischen Gründen)'
        ]
      },
      refund: 'Die Erstattung erfolgt innerhalb von 5-7 Werktagen nach Eingang der Rücksendung auf die ursprüngliche Zahlungsmethode.'
    },
    en: {
      title: 'Returns & Refunds',
      subtitle: '30-day return policy for your satisfaction',
      intro: 'We want you to be happy with your purchase. If not, you can return your items within 30 days.',
      steps: [
        {
          step: '1',
          title: 'Request a return',
          description: 'Log into your account or contact our customer service to request a return.'
        },
        {
          step: '2',
          title: 'Pack the items',
          description: 'Pack the items securely in the original packaging if possible.'
        },
        {
          step: '3',
          title: 'Attach return label',
          description: 'Print the return label and attach it to the package.'
        },
        {
          step: '4',
          title: 'Drop off package',
          description: 'Drop off the package at a DHL branch or parcel shop.'
        }
      ],
      conditions: {
        title: 'Return Conditions',
        allowed: [
          'Items must be unused and in original packaging',
          'Labels must still be attached',
          'Return within 30 days of receipt',
          'Free returns for DE customers'
        ],
        notAllowed: [
          'Hygiene items after opening',
          'Personalized items',
          'Perishable goods',
          'Underwear and swimwear (for hygienic reasons)'
        ]
      },
      refund: 'The refund will be processed within 5-7 business days after receiving the return, to the original payment method.'
    }
  };

  const data = content[language];

  return (
    <div className="min-h-screen bg-background">
      <Header showSearch={false} />

      <div className="container max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <RotateCcw className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">{data.title}</h1>
          <p className="text-muted-foreground mt-2">{data.subtitle}</p>
        </div>

        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">{data.intro}</p>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {data.steps.map((step, index) => (
            <div key={index} className="bg-card border border-border rounded-xl p-5 text-center">
              <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
                {step.step}
              </div>
              <h3 className="font-bold text-foreground mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Conditions */}
        <div className="bg-card border border-border rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-foreground mb-6">{data.conditions.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-foreground flex items-center gap-2 mb-3">
                <Check className="w-5 h-5 text-green-500" />
                {language === 'de' ? 'Rückgabe möglich' : 'Can be returned'}
              </h3>
              <ul className="space-y-2">
                {data.conditions.allowed.map((item, idx) => (
                  <li key={idx} className="text-muted-foreground text-sm flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-foreground flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-red-500" />
                {language === 'de' ? 'Keine Rückgabe' : 'Cannot be returned'}
              </h3>
              <ul className="space-y-2">
                {data.conditions.notAllowed.map((item, idx) => (
                  <li key={idx} className="text-muted-foreground text-sm flex items-start gap-2">
                    <span className="text-red-500 mt-1">✗</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-primary/10 rounded-xl p-6 text-center">
          <p className="text-foreground">{data.refund}</p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Returns;
