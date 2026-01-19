import { useEffect } from 'react';
import { router } from 'expo-router';
import { useAuth } from '../contexts/authContext';

export default function ProtectedRoute({ children, allow }) {
  const {
    loading,
    isAuthenticated,
    hasFullAccess,
    hasAffiliateAccess,
  } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.replace('/(auth)/login');
      return;
    }

    // FULL ACCESS ONLY
    if (allow === 'full' && !hasFullAccess()) {
      router.replace('/(tab)/paywall');
      return;
    }

    // AFFILIATE ONLY
    if (allow === 'affiliate' && !hasAffiliateAccess()) {
      router.replace('/(tab)/paywall');
    }
  }, [loading, isAuthenticated]);

  if (loading) return null;

  return children;
}
