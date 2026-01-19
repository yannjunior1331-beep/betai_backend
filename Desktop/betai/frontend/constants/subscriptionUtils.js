// In constants/subscriptionUtils.js
export const checkSubscriptionStatus = (user) => {
  if (!user) {
    return {
      isValid: false,
      hasSubscription: false,
      isActive: false,
      message: 'User not found'
    };
  }

  // Admins always have access
  if (user.isAdmin === true) {
    return {
      isValid: true,
      hasSubscription: true,
      isActive: true,
      isAdmin: true,
      message: 'Admin access'
    };
  }

  // Check if user has any subscription
  if (!user.subscription || user.subscription === 'none') {
    return {
      isValid: false,
      hasSubscription: false,
      isActive: false,
      message: 'No subscription'
    };
  }

  // Check subscription end date
  if (!user.subscriptionEndDate) {
    return {
      isValid: false,
      hasSubscription: true,
      isActive: false,
      message: 'Subscription expired'
    };
  }

  const currentDate = new Date();
  const endDate = new Date(user.subscriptionEndDate);
  
  if (endDate < currentDate) {
    return {
      isValid: false,
      hasSubscription: true,
      isActive: false,
      message: 'Subscription expired'
    };
  }

  // Subscription is valid
  const daysLeft = Math.ceil((endDate - currentDate) / (1000 * 60 * 60 * 24));
  
  return {
    isValid: true,
    hasSubscription: true,
    isActive: true,
    daysLeft,
    message: `Active (${daysLeft} days left)`
  };
};

export const getUserAccessLevel = (user) => {
  const subStatus = checkSubscriptionStatus(user);
  
  if (user.isAffiliate) {
    return {
      level: 'affiliate',
      hasFullAccess: false,
      accessibleTabs: ['profile'], // Affiliates only get profile
      canAccessPaywall: false,
      message: 'Affiliate access'
    };
  }
  
  if (subStatus.isValid || user.isAdmin) {
    return {
      level: user.isAdmin ? 'admin' : 'subscribed',
      hasFullAccess: true,
      accessibleTabs: ['index', 'betslip', 'profile'],
      canAccessPaywall: false,
      message: 'Full access granted'
    };
  }
  
  // Free/non-subscribed user
  return {
    level: 'free',
    hasFullAccess: false,
    accessibleTabs: ['index', 'profile', 'paywall'],
    canAccessPaywall: true,
    message: 'Limited access - Subscribe for full features'
  };
};