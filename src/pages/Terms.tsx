import { useLanguage } from '@/context/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FileText } from 'lucide-react';

const Terms = () => {
  const { language } = useLanguage();

  const content = {
    de: {
      title: 'Allgemeine Geschäftsbedingungen',
      lastUpdated: 'Stand: Januar 2024',
      sections: [
        {
          title: '§ 1 Geltungsbereich',
          content: `Diese Allgemeinen Geschäftsbedingungen gelten für alle Bestellungen, die über unseren Online-Shop getätigt werden. Mit der Bestellung akzeptieren Sie diese AGB.

Vertragspartner ist die Noor GmbH, Musterstraße 123, 12345 Berlin.`
        },
        {
          title: '§ 2 Vertragsschluss',
          content: `Die Darstellung der Produkte im Online-Shop stellt kein rechtlich bindendes Angebot dar, sondern eine Aufforderung zur Abgabe einer Bestellung.

Durch das Absenden der Bestellung geben Sie ein verbindliches Kaufangebot ab. Sie erhalten eine automatische Bestellbestätigung per E-Mail. Der Kaufvertrag kommt zustande, wenn wir Ihre Bestellung durch Versand der Ware annehmen.`
        },
        {
          title: '§ 3 Preise und Zahlung',
          content: `Alle Preise verstehen sich in Euro inklusive der gesetzlichen Mehrwertsteuer, zuzüglich Versandkosten.

Wir akzeptieren folgende Zahlungsarten:
• Kreditkarte (Visa, Mastercard, American Express)
• PayPal
• Klarna (Rechnung, Ratenkauf)
• SEPA-Lastschrift

Die Zahlung ist mit Bestellabschluss fällig.`
        },
        {
          title: '§ 4 Lieferung und Versand',
          content: `Wir liefern innerhalb Deutschlands und in ausgewählte EU-Länder. Die Lieferzeit beträgt 2-5 Werktage nach Zahlungseingang.

Versandkosten:
• Standardversand Deutschland: 4,95 €
• Kostenloser Versand ab 50 € Bestellwert
• Express-Lieferung: 9,95 €

Sollte ein Artikel nicht lieferbar sein, informieren wir Sie umgehend.`
        },
        {
          title: '§ 5 Widerrufsrecht',
          content: `Sie haben das Recht, binnen 14 Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen. Die Widerrufsfrist beträgt 14 Tage ab dem Tag, an dem Sie oder ein von Ihnen benannter Dritter die Waren in Besitz genommen haben.

Um Ihr Widerrufsrecht auszuüben, müssen Sie uns mittels einer eindeutigen Erklärung über Ihren Entschluss informieren.

Wir gewähren ein erweitertes Rückgaberecht von 30 Tagen.`
        },
        {
          title: '§ 6 Gewährleistung',
          content: `Es gelten die gesetzlichen Gewährleistungsrechte. Bei Mängeln der gelieferten Ware haben Sie zunächst die Wahl zwischen Nachbesserung oder Ersatzlieferung.

Bitte prüfen Sie die gelieferte Ware bei Erhalt auf Vollständigkeit und Transportschäden.`
        },
        {
          title: '§ 7 Eigentumsvorbehalt',
          content: `Die gelieferte Ware bleibt bis zur vollständigen Bezahlung unser Eigentum.`
        },
        {
          title: '§ 8 Schlussbestimmungen',
          content: `Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts.

Sollten einzelne Bestimmungen dieser AGB unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.`
        }
      ]
    },
    en: {
      title: 'Terms and Conditions',
      lastUpdated: 'Last updated: January 2024',
      sections: [
        {
          title: '§ 1 Scope of Application',
          content: `These General Terms and Conditions apply to all orders placed through our online shop. By placing an order, you accept these terms.

The contracting party is Noor GmbH, Musterstraße 123, 12345 Berlin, Germany.`
        },
        {
          title: '§ 2 Conclusion of Contract',
          content: `The presentation of products in the online shop does not constitute a legally binding offer, but an invitation to place an order.

By submitting an order, you make a binding purchase offer. You will receive an automatic order confirmation by email. The purchase contract is concluded when we accept your order by shipping the goods.`
        },
        {
          title: '§ 3 Prices and Payment',
          content: `All prices are in euros including statutory VAT, plus shipping costs.

We accept the following payment methods:
• Credit card (Visa, Mastercard, American Express)
• PayPal
• Klarna (invoice, installment purchase)
• SEPA direct debit

Payment is due upon completion of the order.`
        },
        {
          title: '§ 4 Delivery and Shipping',
          content: `We deliver within Germany and to selected EU countries. Delivery time is 2-5 business days after receipt of payment.

Shipping costs:
• Standard shipping Germany: €4.95
• Free shipping on orders over €50
• Express delivery: €9.95

If an item is not available, we will inform you immediately.`
        },
        {
          title: '§ 5 Right of Withdrawal',
          content: `You have the right to withdraw from this contract within 14 days without giving any reason. The withdrawal period is 14 days from the day on which you or a third party named by you took possession of the goods.

To exercise your right of withdrawal, you must inform us of your decision by means of a clear statement.

We grant an extended return period of 30 days.`
        },
        {
          title: '§ 6 Warranty',
          content: `Statutory warranty rights apply. In the event of defects in the delivered goods, you first have the choice between repair or replacement delivery.

Please check the delivered goods upon receipt for completeness and transport damage.`
        },
        {
          title: '§ 7 Retention of Title',
          content: `The delivered goods remain our property until full payment has been made.`
        },
        {
          title: '§ 8 Final Provisions',
          content: `The law of the Federal Republic of Germany applies, excluding the UN Convention on Contracts for the International Sale of Goods.

Should individual provisions of these terms and conditions be invalid, the validity of the remaining provisions shall remain unaffected.`
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
            <FileText className="w-8 h-8 text-primary" />
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

export default Terms;
