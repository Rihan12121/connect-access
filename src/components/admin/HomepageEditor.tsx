import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { Settings2, Image, Grid3X3, Sparkles, Zap, Layout, ChevronRight, Tag, Package, Users, FileText, RotateCcw, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface HomepageEditorProps {
  isOpen: boolean;
  onClose: () => void;
}

const HomepageEditor = ({ isOpen, onClose }: HomepageEditorProps) => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const sections = [
    {
      id: 'hero-banners',
      title: language === 'de' ? 'Hero Banner' : 'Hero Banners',
      description: language === 'de' 
        ? 'Hauptbanner auf der Startseite bearbeiten'
        : 'Edit main banners on homepage',
      icon: Image,
      action: () => navigate('/admin/banners'),
      color: 'text-blue-500 bg-blue-500/10',
    },
    {
      id: 'categories',
      title: language === 'de' ? 'Kategorien' : 'Categories',
      description: language === 'de'
        ? 'Kategorien hinzufügen, bearbeiten und sortieren'
        : 'Add, edit and sort categories',
      icon: Grid3X3,
      action: () => navigate('/admin/categories'),
      color: 'text-green-500 bg-green-500/10',
    },
    {
      id: 'flash-deals',
      title: language === 'de' ? 'Flash Deals' : 'Flash Deals',
      description: language === 'de'
        ? 'Zeitlich begrenzte Angebote verwalten'
        : 'Manage time-limited offers',
      icon: Zap,
      action: () => navigate('/admin/products'),
      color: 'text-amber-500 bg-amber-500/10',
    },
    {
      id: 'products',
      title: language === 'de' ? 'Produkte' : 'Products',
      description: language === 'de'
        ? 'Alle Produkte verwalten (erscheinen in Showcases)'
        : 'Manage all products (appear in showcases)',
      icon: Sparkles,
      action: () => navigate('/admin/products'),
      color: 'text-purple-500 bg-purple-500/10',
    },
    {
      id: 'discount-codes',
      title: language === 'de' ? 'Rabattcodes' : 'Discount Codes',
      description: language === 'de'
        ? 'Erstellen und verwalten Sie Rabattcodes'
        : 'Create and manage discount codes',
      icon: Tag,
      action: () => navigate('/admin/discount-codes'),
      color: 'text-pink-500 bg-pink-500/10',
    },
    {
      id: 'inventory',
      title: language === 'de' ? 'Lagerverwaltung' : 'Inventory',
      description: language === 'de'
        ? 'Lagerbestand und Verfügbarkeit verwalten'
        : 'Manage stock and availability',
      icon: Package,
      action: () => navigate('/admin/inventory'),
      color: 'text-orange-500 bg-orange-500/10',
    },
    {
      id: 'customer-segments',
      title: language === 'de' ? 'Kundensegmente' : 'Customer Segments',
      description: language === 'de'
        ? 'Personalisierte Rabatte nach Kaufhistorie'
        : 'Personalized discounts by purchase history',
      icon: Users,
      action: () => navigate('/admin/customer-segments'),
      color: 'text-cyan-500 bg-cyan-500/10',
    },
    {
      id: 'invoices',
      title: language === 'de' ? 'Rechnungen' : 'Invoices',
      description: language === 'de'
        ? 'PDF Rechnungen erstellen und versenden'
        : 'Create and send PDF invoices',
      icon: FileText,
      action: () => navigate('/admin/invoices'),
      color: 'text-emerald-500 bg-emerald-500/10',
    },
    {
      id: 'refunds',
      title: language === 'de' ? 'Rückerstattungen' : 'Refunds',
      description: language === 'de'
        ? 'Stornos und Rückzahlungen bearbeiten'
        : 'Process cancellations and refunds',
      icon: RotateCcw,
      action: () => navigate('/admin/refunds'),
      color: 'text-rose-500 bg-rose-500/10',
    },
    {
      id: 'audit-logs',
      title: language === 'de' ? 'Audit-Logs' : 'Audit Logs',
      description: language === 'de'
        ? 'Wer hat was geändert'
        : 'Who changed what',
      icon: History,
      action: () => navigate('/admin/audit-logs'),
      color: 'text-slate-500 bg-slate-500/10',
    },
    {
      id: 'settings',
      title: language === 'de' ? 'Seiteneinstellungen' : 'Page Settings',
      description: language === 'de'
        ? 'Globale Einstellungen und Texte'
        : 'Global settings and texts',
      icon: Layout,
      action: () => navigate('/admin/settings'),
      color: 'text-indigo-500 bg-indigo-500/10',
    },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-primary" />
            {language === 'de' ? 'Homepage bearbeiten' : 'Edit Homepage'}
          </SheetTitle>
          <SheetDescription>
            {language === 'de' 
              ? 'Alle Bereiche der Startseite anpassen'
              : 'Customize all sections of the homepage'}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-3 py-4">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => {
                section.action();
                onClose();
              }}
              className="w-full text-left group"
            >
              <Card className="transition-all hover:border-primary hover:shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${section.color}`}>
                      <section.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {section.title}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {section.description}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </CardContent>
              </Card>
            </button>
          ))}
        </div>

        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground text-center">
            {language === 'de'
              ? 'Tipp: Sie können Banner und Kategorien auch direkt auf der Startseite bearbeiten, indem Sie den "Bearbeiten"-Modus aktivieren.'
              : 'Tip: You can also edit banners and categories directly on the homepage by activating "Edit" mode.'}
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default HomepageEditor;
