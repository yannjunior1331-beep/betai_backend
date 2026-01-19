import { useCallback } from 'react';
import { useFocusEffect, router } from 'expo-router';
import { useAuth } from '../contexts/authContext';

export function useAccessGuard(type) {
  const { user, loading } = useAuth();

  useFocusEffect(
    useCallback(() => {
      if (loading) return;

      const now = new Date();
      const hasValidSubscription =
        user?.subscriptionEndDate &&
        new Date(user.subscriptionEndDate) > now;

      if (type === 'full') {
        if (!user?.isAdmin && !hasValidSubscription) {
          router.replace('/(tab)/paywall');
        }
      }

      if (type === 'affiliate') {
        if (!user?.isAffiliate && !user?.isAdmin) {
          router.replace('/(tab)/paywall');
        }
      }
    }, [loading, user])
  );
}
