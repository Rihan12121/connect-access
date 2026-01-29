import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, LogOut, Heart, ShoppingBag, Package, Camera, Loader2, Check, MapPin, Save, Settings, Star, Clock, ShieldCheck, ChevronRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VatNotice from '@/components/VatNotice';
import SEO from '@/components/SEO';
import LoyaltyBadge from '@/components/LoyaltyBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

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
  const { isAdmin, loading: adminLoading } = useIsAdmin();
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

  // Orders
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchOrders();
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

  const fetchOrders = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (!error && data) {
      setOrders(data);
    }
    setLoadingOrders(false);
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

  const getRoleBadge = () => {
    if (adminLoading) return null;
    if (isAdmin) {
      return (
        <Badge variant="default" className="bg-primary text-primary-foreground">
          <ShieldCheck className="w-3 h-3 mr-1" />
          Administrator
        </Badge>
      );
    }
    return (
      <Badge variant="secondary">
        <User className="w-3 h-3 mr-1" />
        {language === 'de' ? 'Kunde' : 'Customer'}
      </Badge>
    );
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
        title={`${language === 'de' ? 'Mein Konto' : 'My Account'} — Noor`}
        description="Verwalten Sie Ihr Profil und Ihre Bestellungen"
      />
      <Header />

      <div className="container max-w-5xl mx-auto px-4 py-8 md:py-12">
        {/* Account Header */}
        <div className="bg-card border border-border rounded-2xl p-6 md:p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div 
                className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden cursor-pointer group ring-4 ring-background"
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

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-xl md:text-2xl font-semibold text-foreground">
                  {profile?.display_name || user.email?.split('@')[0] || 'Benutzer'}
                </h1>
                {getRoleBadge()}
              </div>
              <p className="text-muted-foreground text-sm">{user.email}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {language === 'de' ? 'Mitglied seit' : 'Member since'} {new Date(user.created_at).toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 w-full sm:w-auto">
              {isAdmin && (
                <Link to="/admin" className="flex-1 sm:flex-initial">
                  <Button variant="outline" className="w-full gap-2">
                    <Settings className="w-4 h-4" />
                    <span className="hidden sm:inline">Admin</span>
                  </Button>
                </Link>
              )}
              <Button variant="outline" onClick={handleSignOut} className="flex-1 sm:flex-initial gap-2 text-destructive hover:text-destructive">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">{t('auth.logout')}</span>
              </Button>
            </div>
          </div>
          </div>

          {/* Loyalty Status */}
          <div className="mb-8">
            <LoyaltyBadge />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
          <Link to="/favorites" className="bg-card border border-border rounded-xl p-4 hover:border-primary hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-2">
              <Heart className="w-5 h-5 text-favorite" />
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-2xl font-semibold text-foreground">{favorites.length}</p>
            <p className="text-xs text-muted-foreground">{language === 'de' ? 'Favoriten' : 'Favorites'}</p>
          </Link>

          <Link to="/cart" className="bg-card border border-border rounded-xl p-4 hover:border-primary hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-2">
              <ShoppingBag className="w-5 h-5 text-primary" />
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-2xl font-semibold text-foreground">{getItemCount()}</p>
            <p className="text-xs text-muted-foreground">{language === 'de' ? 'Im Warenkorb' : 'In Cart'}</p>
          </Link>

          <Link to="/orders" className="bg-card border border-border rounded-xl p-4 hover:border-primary hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-2">
              <Package className="w-5 h-5 text-success" />
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-2xl font-semibold text-foreground">{orders.length}</p>
            <p className="text-xs text-muted-foreground">{language === 'de' ? 'Bestellungen' : 'Orders'}</p>
          </Link>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full justify-start mb-6 bg-transparent border-b border-border rounded-none p-0 h-auto">
            <TabsTrigger 
              value="overview" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
            >
              {language === 'de' ? 'Übersicht' : 'Overview'}
            </TabsTrigger>
            <TabsTrigger 
              value="profile"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
            >
              {language === 'de' ? 'Profil' : 'Profile'}
            </TabsTrigger>
            <TabsTrigger 
              value="address"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
            >
              {language === 'de' ? 'Adresse' : 'Address'}
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="space-y-6">
              {/* Recent Orders */}
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    {language === 'de' ? 'Letzte Bestellungen' : 'Recent Orders'}
                  </h3>
                  <Link to="/orders" className="text-sm text-primary hover:underline">
                    {language === 'de' ? 'Alle anzeigen' : 'View all'}
                  </Link>
                </div>
                
                {loadingOrders ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">
                      {language === 'de' ? 'Noch keine Bestellungen' : 'No orders yet'}
                    </p>
                    <Link to="/products" className="text-sm text-primary hover:underline mt-2 inline-block">
                      {language === 'de' ? 'Jetzt einkaufen' : 'Start shopping'}
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.slice(0, 3).map((order) => (
                      <Link 
                        key={order.id} 
                        to={`/order-tracking?orderId=${order.id}`}
                        className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors"
                      >
                        <div>
                          <p className="font-medium text-foreground text-sm">
                            {language === 'de' ? 'Bestellung' : 'Order'} #{order.id.slice(0, 8)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString('de-DE')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-foreground">{order.total.toFixed(2)} €</p>
                          <Badge variant={order.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                            {order.status}
                          </Badge>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link to="/favorites" className="flex items-center gap-4 bg-card border border-border rounded-xl p-4 hover:border-primary hover:shadow-md transition-all">
                  <div className="w-12 h-12 rounded-full bg-favorite/20 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-favorite" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{language === 'de' ? 'Meine Favoriten' : 'My Favorites'}</h4>
                    <p className="text-sm text-muted-foreground">{favorites.length} {language === 'de' ? 'Artikel gespeichert' : 'items saved'}</p>
                  </div>
                </Link>
                <Link to="/order-tracking" className="flex items-center gap-4 bg-card border border-border rounded-xl p-4 hover:border-primary hover:shadow-md transition-all">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Package className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{language === 'de' ? 'Bestellung verfolgen' : 'Track Order'}</h4>
                    <p className="text-sm text-muted-foreground">{language === 'de' ? 'Status prüfen' : 'Check status'}</p>
                  </div>
                </Link>
              </div>
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                {language === 'de' ? 'Profilinformationen' : 'Profile Information'}
              </h3>
              
              <div className="grid gap-4 max-w-md">
                <div className="grid gap-2">
                  <Label htmlFor="displayName" className="text-xs uppercase tracking-wider text-muted-foreground">
                    {language === 'de' ? 'Anzeigename' : 'Display Name'}
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="displayName"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder={language === 'de' ? 'Ihr Name' : 'Your name'}
                    />
                    <Button 
                      onClick={handleSaveProfile} 
                      disabled={saving || displayName === (profile?.display_name || '')}
                      size="icon"
                    >
                      {saving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                    E-Mail
                  </Label>
                  <Input value={user.email || ''} disabled className="bg-muted" />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Address Tab */}
          <TabsContent value="address">
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                {language === 'de' ? 'Standard-Lieferadresse' : 'Default Shipping Address'}
              </h3>
              
              <div className="grid gap-4 max-w-lg">
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

                <div className="grid grid-cols-2 gap-4">
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
          </TabsContent>
        </Tabs>

        <VatNotice />
      </div>

      <Footer />
    </div>
  );
};

export default Account;
