import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface FraudSignal {
  type: 'velocity' | 'device' | 'address' | 'email' | 'amount';
  score: number;
  reason: string;
}

interface FraudCheckResult {
  isRisky: boolean;
  riskScore: number;
  signals: FraudSignal[];
  shouldBlock: boolean;
}

// Device fingerprint - simple browser-based fingerprint
const getDeviceFingerprint = (): string => {
  const nav = window.navigator;
  const screen = window.screen;
  
  const data = [
    nav.userAgent,
    nav.language,
    nav.platform,
    screen.width + 'x' + screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
  ].join('|');
  
  // Simple hash
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
};

// Store fingerprint in localStorage
const getOrCreateSessionId = (): string => {
  let sessionId = localStorage.getItem('noor_session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('noor_session_id', sessionId);
  }
  return sessionId;
};

export const useFraudDetection = () => {
  const [isChecking, setIsChecking] = useState(false);
  
  const checkFraud = useCallback(async (
    userId: string | null,
    email: string,
    orderTotal: number,
    shippingAddress: {
      address: string;
      city: string;
      postalCode: string;
      country: string;
    }
  ): Promise<FraudCheckResult> => {
    setIsChecking(true);
    const signals: FraudSignal[] = [];
    let riskScore = 0;
    
    try {
      const deviceFingerprint = getDeviceFingerprint();
      const sessionId = getOrCreateSessionId();
      
      // Check 1: Velocity - multiple orders in short time
      if (userId) {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
        const { data: recentOrders } = await supabase
          .from('orders')
          .select('id')
          .eq('user_id', userId)
          .gte('created_at', oneHourAgo);
        
        if (recentOrders && recentOrders.length >= 3) {
          signals.push({
            type: 'velocity',
            score: 30,
            reason: `${recentOrders.length} orders in the last hour`,
          });
          riskScore += 30;
        }
      }
      
      // Check 2: High-value orders from new accounts
      if (userId && orderTotal > 500) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('created_at')
          .eq('user_id', userId)
          .single();
        
        if (profile) {
          const accountAge = Date.now() - new Date(profile.created_at).getTime();
          const daysSinceCreation = accountAge / (1000 * 60 * 60 * 24);
          
          if (daysSinceCreation < 1 && orderTotal > 200) {
            signals.push({
              type: 'amount',
              score: 25,
              reason: `High-value order (${orderTotal}€) from account less than 24h old`,
            });
            riskScore += 25;
          }
        }
      }
      
      // Check 3: Disposable email domains
      const disposableDomains = ['tempmail.com', 'guerrillamail.com', '10minutemail.com', 'mailinator.com'];
      const emailDomain = email.split('@')[1]?.toLowerCase();
      if (emailDomain && disposableDomains.includes(emailDomain)) {
        signals.push({
          type: 'email',
          score: 40,
          reason: 'Disposable email address detected',
        });
        riskScore += 40;
      }
      
      // Check 4: Very high order amounts
      if (orderTotal > 1000) {
        signals.push({
          type: 'amount',
          score: 15,
          reason: `Order amount (${orderTotal}€) exceeds normal threshold`,
        });
        riskScore += 15;
      }
      
      // Log the check for audit
      console.log('[Fraud Detection]', {
        riskScore,
        signals,
        deviceFingerprint,
        sessionId,
      });
      
    } catch (error) {
      console.error('Fraud detection error:', error);
    }
    
    setIsChecking(false);
    
    return {
      isRisky: riskScore > 30,
      riskScore,
      signals,
      shouldBlock: riskScore >= 70,
    };
  }, []);
  
  return {
    checkFraud,
    isChecking,
  };
};

export default useFraudDetection;
