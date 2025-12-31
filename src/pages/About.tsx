import { useEffect } from 'react';
import { Package, Truck, HeadphonesIcon } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VatNotice from '@/components/VatNotice';
import SEO from '@/components/SEO';

const About = () => {
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Über uns"
        description="Erfahre mehr über Noor Shop - Dein zuverlässiger Partner für hochwertige Produkte zu fairen Preisen."
      />
      <Header />

      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/20 py-16 md:py-24">
        <div className="container max-w-6xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-4">
            {t('about.title')}
          </h1>
          <p className="text-lg text-primary font-medium text-center mb-4">
            {t('hero.tagline')}
          </p>
          <p className="text-muted-foreground text-center max-w-3xl mx-auto">
            {t('hero.description')}
          </p>
        </div>
      </section>

      <section className="container max-w-6xl mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card rounded-2xl p-6 text-center shadow-sm border border-border">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">{t('about.quality')}</h3>
            <p className="text-sm text-muted-foreground">{t('about.qualityDesc')}</p>
          </div>
          
          <div className="bg-card rounded-2xl p-6 text-center shadow-sm border border-border">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">{t('about.shipping')}</h3>
            <p className="text-sm text-muted-foreground">{t('about.shippingDesc')}</p>
          </div>
          
          <div className="bg-card rounded-2xl p-6 text-center shadow-sm border border-border">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <HeadphonesIcon className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">{t('about.support')}</h3>
            <p className="text-sm text-muted-foreground">{t('about.supportDesc')}</p>
          </div>
        </div>
      </section>

      <VatNotice />
      <Footer />
    </div>
  );
};

export default About;
