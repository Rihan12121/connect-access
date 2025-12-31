import { useLanguage } from '@/context/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VatNotice from '@/components/VatNotice';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const Contact = () => {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const content = {
    de: {
      title: 'Kontakt',
      subtitle: 'Wir sind für Sie da',
      info: {
        email: { label: 'E-Mail', value: 'support@noor-shop.de' },
        phone: { label: 'Telefon', value: '+49 123 456 789' },
        address: { label: 'Adresse', value: 'Musterstraße 123, 12345 Berlin' },
        hours: { label: 'Öffnungszeiten', value: 'Mo-Fr: 9:00-18:00 Uhr' }
      },
      form: {
        name: 'Name',
        email: 'E-Mail',
        subject: 'Betreff',
        message: 'Nachricht',
        submit: 'Nachricht senden',
        success: 'Nachricht erfolgreich gesendet!'
      }
    },
    en: {
      title: 'Contact',
      subtitle: 'We are here for you',
      info: {
        email: { label: 'Email', value: 'support@noor-shop.de' },
        phone: { label: 'Phone', value: '+49 123 456 789' },
        address: { label: 'Address', value: 'Musterstraße 123, 12345 Berlin' },
        hours: { label: 'Business Hours', value: 'Mon-Fri: 9:00 AM - 6:00 PM' }
      },
      form: {
        name: 'Name',
        email: 'Email',
        subject: 'Subject',
        message: 'Message',
        submit: 'Send Message',
        success: 'Message sent successfully!'
      }
    }
  };

  const data = content[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(data.form.success);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">{data.title}</h1>
          <p className="text-muted-foreground mt-2">{data.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-xl p-5 flex items-start gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">{data.info.email.label}</h3>
                <p className="text-muted-foreground">{data.info.email.value}</p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-5 flex items-start gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">{data.info.phone.label}</h3>
                <p className="text-muted-foreground">{data.info.phone.value}</p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-5 flex items-start gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">{data.info.address.label}</h3>
                <p className="text-muted-foreground">{data.info.address.value}</p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-5 flex items-start gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">{data.info.hours.label}</h3>
                <p className="text-muted-foreground">{data.info.hours.value}</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">{data.form.name}</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="w-full px-4 py-3 bg-secondary text-foreground rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">{data.form.email}</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  className="w-full px-4 py-3 bg-secondary text-foreground rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">{data.form.subject}</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  required
                  className="w-full px-4 py-3 bg-secondary text-foreground rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">{data.form.message}</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-secondary text-foreground rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                />
              </div>
              <button type="submit" className="w-full btn-primary py-3">
                {data.form.submit}
              </button>
            </div>
          </form>
        </div>
        <VatNotice />
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
