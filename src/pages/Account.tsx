import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, LogOut, Heart, ShoppingBag, Package, Camera, Loader2, Check, MapPin, Save } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VatNotice from '@/components/VatNotice';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  street_address: string | null;
  city: string | null;
  postal_code: string | null;
  country: string | null;
}

const Account = () => {
  const { user, loading, signOut } = useAuth();
  const { favorites } = useFavorites();
  const { getItemCount } = useCart();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [displayName, setDisplayName] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  
  // Address fields
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('Deutschland');
  const [savingAddress, setSavingAddress] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error);
    } else if (data) {
      setProfile(data as Profile);
      setDisplayName(data.display_name || '');
      setStreetAddress(data.street_address || '');
      setCity(data.city || '');
      setPostalCode(data.postal_code || '');
      setCountry(data.country || 'Deutschland');
    } else {
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({ user_id: user.id })
        .select()
        .single();

      if (!createError && newProfile) {
        setProfile(newProfile as Profile);
      }
    }
    setLoadingProfile(false);
  };

  const handleSaveProfile = async () => {
    if (!user || !profile) return;

    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({ display_name: displayName })
      .eq('user_id', user.id);

    if (error) {
      console.error('Error updating profile:', error);
      toast.error(language === 'de' ? 'Fehler beim Speichern' : 'Error saving profile');
    } else {
      setProfile({ ...profile, display_name: displayName });
      toast.success(language === 'de' ? 'Profil gespeichert' : 'Profile saved');
    }
    setSaving(false);
  };

  const handleSaveAddress = async () => {
    if (!user || !profile) return;

    setSavingAddress(true);
    const { error } = await supabase
      .from('profiles')
      .update({ 
        street_address: streetAddress,
        city: city,
        postal_code: postalCode,
        country: country
      })
      .eq('user_id', user.id);

    if (error) {
      console.error('Error updating address:', error);
      toast.error(language === 'de' ? 'Fehler beim Speichern' : 'Error saving address');
    } else {
      setProfile({ ...profile, street_address: streetAddress, city, postal_code: postalCode, country });
      toast.success(language === 'de' ? 'Adresse gespeichert' : 'Address saved');
    }
    setSavingAddress(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploadingAvatar(true);

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      toast.error(language === 'de' ? 'Fehler beim Hochladen' : 'Upload failed');
      setUploadingAvatar(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Update error:', updateError);
      toast.error(language === 'de' ? 'Fehler beim Speichern' : 'Error saving');
    } else {
      setProfile(prev => prev ? { ...prev, avatar_url: publicUrl } : null);
      toast.success(language === 'de' ? 'Avatar aktualisiert' : 'Avatar updated');
    }

    setUploadingAvatar(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success(t('auth.logoutSuccess'));
    navigate('/');
  };

  if (loading || loadingProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title={`${t('account.title')} — Noor`}
        description="Verwalten Sie Ihr Profil und Ihre Bestellungen"
      />
      <Header />

      <div className="container max-w-4xl mx-auto px-4 py-8 md:py-12">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6 md:mb-8">{t('account.title')}</h1>

        {/* Profile Card */}
        <div className="bg-card border border-border rounded-2xl p-5 md:p-6 mb-5 md:mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            {language === 'de' ? 'Profil' : 'Profile'}
          </h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 md:gap-6">
            {/* Avatar */}
            <div className="relative">
              <div 
                className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
              >
                {uploadingAvatar ? (
                  <Loader2 className="w-6 h-6 md:w-8 md:h-8 animate-spin text-primary" />
                ) : profile?.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt="Avatar" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 md:w-10 md:h-10 text-primary" />
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                  <Camera className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>

            {/* Profile Info */}
            <div className="flex-1 w-full">
              <div className="grid gap-3 md:gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="displayName" className="text-xs uppercase tracking-wider text-muted-foreground">
                    {language === 'de' ? 'Anzeigename' : 'Display Name'}
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="displayName"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder={language === 'de' ? 'Dein Name' : 'Your name'}
                      className="max-w-xs"
                    />
                    <Button 
                      onClick={handleSaveProfile} 
                      disabled={saving || displayName === (profile?.display_name || '')}
                      size="sm"
                      className="shrink-0"
                    >
                      {saving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">{user.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Address Card */}
        <div className="bg-card border border-border rounded-2xl p-5 md:p-6 mb-5 md:mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            {language === 'de' ? 'Standard-Lieferadresse' : 'Default Shipping Address'}
          </h2>
          
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="streetAddress" className="text-xs uppercase tracking-wider text-muted-foreground">
                {language === 'de' ? 'Straße und Hausnummer' : 'Street Address'}
              </Label>
              <Input
                id="streetAddress"
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
                placeholder={language === 'de' ? 'Musterstraße 123' : '123 Main St'}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="grid gap-2">
                <Label htmlFor="postalCode" className="text-xs uppercase tracking-wider text-muted-foreground">
                  {language === 'de' ? 'PLZ' : 'Postal Code'}
                </Label>
                <Input
                  id="postalCode"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="12345"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="city" className="text-xs uppercase tracking-wider text-muted-foreground">
                  {language === 'de' ? 'Stadt' : 'City'}
                </Label>
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder={language === 'de' ? 'Berlin' : 'City'}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="country" className="text-xs uppercase tracking-wider text-muted-foreground">
                {language === 'de' ? 'Land' : 'Country'}
              </Label>
              <Input
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Deutschland"
              />
            </div>

            <Button 
              onClick={handleSaveAddress} 
              disabled={savingAddress}
              className="w-full sm:w-auto mt-2"
            >
              {savingAddress ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {language === 'de' ? 'Adresse speichern' : 'Save Address'}
            </Button>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
          <Link 
            to="/favorites"
            className="flex items-center gap-4 bg-card border border-border rounded-xl p-4 hover:border-primary hover:shadow-md transition-all"
          >
            <div className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-favorite/20 flex items-center justify-center shrink-0">
              <Heart className="w-5 h-5 md:w-6 md:h-6 text-favorite" />
            </div>
            <div>
              <h3 className="font-medium text-foreground text-sm md:text-base">{t('favorites.title')}</h3>
              <p className="text-muted-foreground text-xs md:text-sm">
                {favorites.length} {t('account.items')}
              </p>
            </div>
          </Link>

          <Link 
            to="/cart"
            className="flex items-center gap-4 bg-card border border-border rounded-xl p-4 hover:border-primary hover:shadow-md transition-all"
          >
            <div className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-foreground text-sm md:text-base">{t('cart.title')}</h3>
              <p className="text-muted-foreground text-xs md:text-sm">
                {getItemCount()} {t('account.items')}
              </p>
            </div>
          </Link>

          <Link 
            to="/orders"
            className="flex items-center gap-4 bg-card border border-border rounded-xl p-4 hover:border-primary hover:shadow-md transition-all"
          >
            <div className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-success/20 flex items-center justify-center shrink-0">
              <Package className="w-5 h-5 md:w-6 md:h-6 text-success" />
            </div>
            <div>
              <h3 className="font-medium text-foreground text-sm md:text-base">
                {language === 'de' ? 'Bestellungen' : 'Orders'}
              </h3>
              <p className="text-muted-foreground text-xs md:text-sm">
                {language === 'de' ? 'Bestellungen anzeigen' : 'View orders'}
              </p>
            </div>
          </Link>
        </div>

        {/* Actions */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-4 p-4 hover:bg-secondary transition-colors text-left"
          >
            <LogOut className="w-5 h-5 text-destructive" />
            <span className="text-foreground">{t('auth.logout')}</span>
          </button>
        </div>
        <VatNotice />
      </div>

      <Footer />
    </div>
  );
};

export default Account;
