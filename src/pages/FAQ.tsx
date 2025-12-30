import { useLanguage } from '@/context/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const faqData = {
  de: [
    {
      question: 'Wie kann ich eine Bestellung aufgeben?',
      answer: 'Sie können eine Bestellung aufgeben, indem Sie die gewünschten Produkte in Ihren Warenkorb legen und dann zur Kasse gehen. Folgen Sie den Anweisungen, um Ihre Lieferadresse und Zahlungsmethode anzugeben.'
    },
    {
      question: 'Welche Zahlungsmethoden akzeptieren Sie?',
      answer: 'Wir akzeptieren Kreditkarten (Visa, Mastercard, American Express), PayPal, Klarna, und SEPA-Lastschrift.'
    },
    {
      question: 'Wie lange dauert die Lieferung?',
      answer: 'Die Standardlieferung dauert in der Regel 2-5 Werktage innerhalb Deutschlands. Express-Lieferung ist gegen Aufpreis verfügbar und dauert 1-2 Werktage.'
    },
    {
      question: 'Kann ich meine Bestellung stornieren?',
      answer: 'Ja, Sie können Ihre Bestellung innerhalb von 24 Stunden nach Bestellaufgabe kostenlos stornieren. Kontaktieren Sie dazu unseren Kundenservice.'
    },
    {
      question: 'Wie funktioniert die Rückgabe?',
      answer: 'Sie haben 30 Tage Zeit, Produkte zurückzugeben. Kontaktieren Sie unseren Kundenservice für ein Rücksendeetikett. Die Rückerstattung erfolgt innerhalb von 5-7 Werktagen nach Erhalt der Ware.'
    },
    {
      question: 'Bieten Sie internationalen Versand an?',
      answer: 'Ja, wir versenden in die meisten europäischen Länder. Die Versandkosten und Lieferzeiten variieren je nach Zielland.'
    }
  ],
  en: [
    {
      question: 'How can I place an order?',
      answer: 'You can place an order by adding the desired products to your cart and then proceeding to checkout. Follow the instructions to enter your delivery address and payment method.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept credit cards (Visa, Mastercard, American Express), PayPal, Klarna, and SEPA direct debit.'
    },
    {
      question: 'How long does delivery take?',
      answer: 'Standard delivery usually takes 2-5 business days within Germany. Express delivery is available for an additional fee and takes 1-2 business days.'
    },
    {
      question: 'Can I cancel my order?',
      answer: 'Yes, you can cancel your order free of charge within 24 hours of placing it. Contact our customer service to do so.'
    },
    {
      question: 'How does the return process work?',
      answer: 'You have 30 days to return products. Contact our customer service for a return label. The refund will be processed within 5-7 business days after receiving the goods.'
    },
    {
      question: 'Do you offer international shipping?',
      answer: 'Yes, we ship to most European countries. Shipping costs and delivery times vary depending on the destination country.'
    }
  ]
};

const FAQ = () => {
  const { t, language } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const faqs = faqData[language];

  return (
    <div className="min-h-screen bg-background">
      <Header showSearch={false} />

      <div className="container max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <HelpCircle className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">{t('footer.faq')}</h1>
          <p className="text-muted-foreground mt-2">{t('faq.subtitle')}</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="bg-card border border-border rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary/50 transition-colors"
              >
                <span className="font-medium text-foreground pr-4">{faq.question}</span>
                <ChevronDown 
                  className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`} 
                />
              </button>
              {openIndex === index && (
                <div className="px-5 pb-5 text-muted-foreground">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">{t('faq.moreQuestions')}</p>
          <a 
            href="mailto:support@noor-shop.de" 
            className="btn-primary inline-block px-8 py-3"
          >
            {t('footer.contact')}
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FAQ;
