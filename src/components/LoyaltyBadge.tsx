import { Award, Star, Crown, Gem } from 'lucide-react';
import { useLoyaltyPoints } from '@/hooks/useLoyaltyPoints';
import { useLanguage } from '@/context/LanguageContext';
import { Progress } from '@/components/ui/progress';

const tierIcons = {
  bronze: Award,
  silver: Star,
  gold: Crown,
  platinum: Gem,
};

const tierColors = {
  bronze: 'text-amber-700',
  silver: 'text-gray-400',
  gold: 'text-amber-400',
  platinum: 'text-purple-400',
};

const tierBgColors = {
  bronze: 'bg-amber-700/10',
  silver: 'bg-gray-400/10',
  gold: 'bg-amber-400/10',
  platinum: 'bg-purple-400/10',
};

interface LoyaltyBadgeProps {
  compact?: boolean;
}

const LoyaltyBadge = ({ compact = false }: LoyaltyBadgeProps) => {
  const { loyaltyInfo, loading } = useLoyaltyPoints();
  const { language } = useLanguage();

  if (loading || !loyaltyInfo) return null;

  const Icon = tierIcons[loyaltyInfo.tier];
  const colorClass = tierColors[loyaltyInfo.tier];
  const bgClass = tierBgColors[loyaltyInfo.tier];

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full ${bgClass}`}>
        <Icon className={`w-3.5 h-3.5 ${colorClass}`} />
        <span className={`text-xs font-medium ${colorClass}`}>{loyaltyInfo.tierName}</span>
      </div>
    );
  }

  const progressPercent = loyaltyInfo.nextTier
    ? ((loyaltyInfo.points / (loyaltyInfo.points + loyaltyInfo.pointsToNextTier)) * 100)
    : 100;

  return (
    <div className={`rounded-xl p-4 ${bgClass} border border-border`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className={`w-5 h-5 ${colorClass}`} />
          <span className={`font-semibold ${colorClass}`}>{loyaltyInfo.tierName}</span>
        </div>
        <span className="text-lg font-bold text-foreground">{loyaltyInfo.points} pts</span>
      </div>

      {loyaltyInfo.discount > 0 && (
        <p className="text-sm text-muted-foreground mb-2">
          {language === 'de' 
            ? `${loyaltyInfo.discount}% Rabatt auf alle Bestellungen` 
            : `${loyaltyInfo.discount}% discount on all orders`}
        </p>
      )}

      {loyaltyInfo.nextTier && (
        <div className="space-y-1.5">
          <Progress value={progressPercent} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {language === 'de'
              ? `Noch ${loyaltyInfo.pointsToNextTier} Punkte bis ${loyaltyInfo.nextTier}`
              : `${loyaltyInfo.pointsToNextTier} points to ${loyaltyInfo.nextTier}`}
          </p>
        </div>
      )}
    </div>
  );
};

export default LoyaltyBadge;
