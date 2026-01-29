import { useState } from 'react';
import { Shield, Loader2, Check, X, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface TwoFactorAuthProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  action: string;
}

const TwoFactorAuth = ({ open, onClose, onSuccess, action }: TwoFactorAuthProps) => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [code, setCode] = useState('');
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');

  const sendCode = async () => {
    if (!user?.email) return;
    
    setSending(true);
    
    // Simulate sending code (in production, use email service)
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(newCode);
    
    // In production, this would send an email
    console.log('[2FA] Code for', user.email, ':', newCode);
    
    // For demo, show the code in a toast
    toast.info(`Demo: Your 2FA code is ${newCode}`);
    
    setCodeSent(true);
    setSending(false);
  };

  const verifyCode = async () => {
    setVerifying(true);
    
    // Verify the code
    if (code === generatedCode) {
      toast.success(language === 'de' ? 'Verifiziert!' : 'Verified!');
      onSuccess();
      onClose();
      setCode('');
      setCodeSent(false);
      setGeneratedCode('');
    } else {
      toast.error(language === 'de' ? 'Ungültiger Code' : 'Invalid code');
    }
    
    setVerifying(false);
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            {language === 'de' ? 'Zwei-Faktor-Authentifizierung' : 'Two-Factor Authentication'}
          </DialogTitle>
          <DialogDescription>
            {language === 'de'
              ? `Für die Aktion "${action}" ist eine zusätzliche Verifizierung erforderlich.`
              : `The action "${action}" requires additional verification.`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!codeSent ? (
            <div className="text-center space-y-4">
              <Mail className="w-12 h-12 mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {language === 'de'
                  ? `Wir senden einen Code an ${user?.email}`
                  : `We'll send a code to ${user?.email}`}
              </p>
              <Button onClick={sendCode} disabled={sending} className="w-full">
                {sending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {language === 'de' ? 'Code senden' : 'Send Code'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                {language === 'de'
                  ? 'Geben Sie den 6-stelligen Code ein:'
                  : 'Enter the 6-digit code:'}
              </p>
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                className="text-center text-2xl tracking-widest font-mono"
                maxLength={6}
              />
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setCodeSent(false)} className="flex-1">
                  <X className="w-4 h-4 mr-2" />
                  {language === 'de' ? 'Abbrechen' : 'Cancel'}
                </Button>
                <Button onClick={verifyCode} disabled={code.length !== 6 || verifying} className="flex-1">
                  {verifying ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4 mr-2" />
                  )}
                  {language === 'de' ? 'Bestätigen' : 'Verify'}
                </Button>
              </div>
              <button
                onClick={sendCode}
                disabled={sending}
                className="text-xs text-primary hover:underline w-full text-center"
              >
                {language === 'de' ? 'Code erneut senden' : 'Resend code'}
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TwoFactorAuth;
