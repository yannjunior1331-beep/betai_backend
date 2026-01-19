// app/profile.jsx - Updated with meaningful support content
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Image,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Linking,
  Modal,
} from 'react-native';
import { theme } from '../../constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from '../../contexts/authContext';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import '../../utils/i18n';

const ProfileScreen = () => {
  const router = useRouter();
  const { 
    user, 
    betslips, 
    logout, 
    loading: authLoading, 
    isAuthenticated,
    updateBetslips 
  } = useAuth();
  
  const { t, i18n } = useTranslation();
  
  const [isPro, setIsPro] = useState(false);
  const [isAffiliate, setIsAffiliate] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedBetslip, setExpandedBetslip] = useState(null);
  const [selectedBetslipForDelete, setSelectedBetslipForDelete] = useState(null);
  const [activeSupportModal, setActiveSupportModal] = useState(null);

  // Get language state from i18n
  const isFrench = i18n.language === 'fr';

  // Initialize with user data
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        // Redirect to login if not authenticated
        Alert.alert(t('profile.authenticationRequired'), t('profile.pleaseLogin'), [
          {
            text: t('common.cancel'),
            style: 'cancel',
            onPress: () => router.back(),
          },
          {
            text: t('profile.loginNow'),
            onPress: () => router.push('/auth/login'),
          },
        ]);
      } else {
        loadUserData();
      }
    }
  }, [authLoading, isAuthenticated, t]);

  const loadUserData = async () => {
    try {
      // Set Pro/Affiliate status from user data
      if (user) {
        setIsPro(user.subscription === 'pro' || user.isPro === true);
        setIsAffiliate(!!user.promoCode || user.isAffiliate === true);
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to load user data:', error);
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserData();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    Alert.alert(
      t('profile.logout'),
      t('profile.logoutConfirm'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('profile.logoutBtn'),
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/auth/login');
          },
        },
      ]
    );
  };

  const handleBuyCoins = () => {
    // Redirect to paywall screen
    router.push('/paywall');
  };

  const handleBecomeAffiliate = () => {
    // Check if user already has a promo code (already an affiliate)
    if (user?.promoCode || user?.isAffiliate) {
      // User is already an affiliate - redirect directly to dashboard
      router.push('/affiliate/dashboard');
    } else {
      // User doesn't have a promo code - redirect to affiliate registration
      router.push('/affiliate/register');
    }
  };

  const handleLanguageToggle = () => {
    const newLanguage = i18n.language === 'en' ? 'fr' : 'en';
    i18n.changeLanguage(newLanguage).then(() => {
      Alert.alert(
        t('profile.languageChanged'),
        `${t('profile.languageSetTo')} ${newLanguage === 'fr' ? 'French' : 'English'}`
      );
    });
  };

  const handleSavedBetslipPress = (betslipId) => {
    if (expandedBetslip === betslipId) {
      setExpandedBetslip(null);
      setSelectedBetslipForDelete(null);
    } else {
      setExpandedBetslip(betslipId);
      setSelectedBetslipForDelete(betslipId);
    }
  };

  const handleNavigateToBetslip = () => {
    router.push('/betslip');
  };

  const handleSeeAllSaved = () => {
    if (betslips.length === 0) {
      Alert.alert(t('profile.noSavedBetslipsAlert'), t('profile.noSavedBetslipsMessage'));
      return;
    }
    router.push('/betslip/saved');
  };

  const handleRemoveBetslip = () => {
    if (!selectedBetslipForDelete) return;
    
    Alert.alert(
      t('profile.removeBetslip'),
      t('profile.removeBetslipConfirm'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('profile.remove'),
          style: 'destructive',
          onPress: () => {
            const updatedBetslips = betslips.filter(b => b._id !== selectedBetslipForDelete && b.id !== selectedBetslipForDelete);
            updateBetslips(updatedBetslips);
            setExpandedBetslip(null);
            setSelectedBetslipForDelete(null);
            Alert.alert(t('profile.successRemoved'), t('profile.betslipRemoved'));
          },
        },
      ]
    );
  };

  // Updated support handlers with meaningful content
  const handleSupportOption = (option) => {
    setActiveSupportModal(option);
  };

  const handleContactEmail = () => {
    const email = 'freecoder21@gmail.com';
    const subject = encodeURIComponent('Support Request - BetAI');
    const body = encodeURIComponent(`Hello BetAI Team,\n\nI need assistance with:\n\n[Please describe your issue here]\n\nMy username: ${user?.username || 'Not logged in'}\n\nThank you.`);
    const mailtoUrl = `mailto:${email}?subject=${subject}&body=${body}`;
    
    Linking.openURL(mailtoUrl).catch((err) => {
      Alert.alert(
        t('profile.emailError'),
        `${t('profile.copyEmail')}: ${email}`
      );
      // Copy to clipboard
      // Clipboard.setString(email); // You'll need to import Clipboard from react-native
    });
  };

  const handleVisitWebsite = () => {
    const websiteUrl = 'https://your-betai-website.com'; // Replace with your actual website
    Linking.openURL(websiteUrl).catch((err) => {
      Alert.alert(t('profile.websiteError'), t('profile.websiteUnavailable'));
    });
  };

  const handleOpenFAQ = () => {
    const faqUrl = 'https://your-betai-website.com/faq'; // Replace with your FAQ page
    Linking.openURL(faqUrl).catch((err) => {
      Alert.alert(t('profile.faqError'), t('profile.faqUnavailable'));
    });
  };

  // Close modal
  const closeSupportModal = () => {
    setActiveSupportModal(null);
  };

  // Get subscription display value
  const getSubscriptionDisplay = () => {
    if (!user?.subscription) return t('profile.none');
    
    // Handle different subscription types
    const subscription = user.subscription.toLowerCase();
    
    if (subscription === 'none') return t('profile.none');
    if (subscription === 'daily') return t('profile.daily');
    if (subscription === 'weekly') return t('profile.weekly');
    if (subscription === 'monthly') return t('profile.monthly');
    if (subscription === 'pro') return t('profile.pro');
    
    // Capitalize first letter if it's an unknown type
    return subscription.charAt(0).toUpperCase() + subscription.slice(1);
  };

  // Calculate user stats from real betslip data
  const calculateUserStats = () => {
    const userBetslips = betslips || [];
    
    const successfulBetslips = userBetslips.filter(b => b.status === 'won' || b.status === 'success').length;
    const totalBetslips = userBetslips.length;
    const successRate = totalBetslips > 0 ? Math.round((successfulBetslips / totalBetslips) * 100) : 0;
    
    // Calculate total winnings (assuming each betslip has a potentialWinnings field)
    const totalWinnings = userBetslips
      .filter(b => b.status === 'won')
      .reduce((sum, b) => sum + (b.potentialWinnings || 0), 0);
    
    // Calculate accuracy based on predicted vs actual outcomes
    const accuratePredictions = userBetslips.filter(b => b.accuracy === 'high' || b.accuracy >= 70).length;
    const accuracy = totalBetslips > 0 ? Math.round((accuratePredictions / totalBetslips) * 100) : 0;

    return {
      totalBetslips,
      successfulBetslips,
      successRate: `${successRate}%`,
      totalWinnings: `${totalWinnings.toFixed(2)}`,
      accuracy: `${accuracy}%`,
      userCredits: user?.credits || 0,
      subscription: getSubscriptionDisplay()
    };
  };

  const userStats = calculateUserStats();

  // Get confidence color function
  const getConfidenceColor = (confidence) => {
    if (!confidence) return theme.colors.lowProbability;
    if (confidence >= 80) return theme.colors.highProbability;
    if (confidence >= 60) return theme.colors.mediumProbability;
    return theme.colors.lowProbability;
  };

  // Get subscription color based on type
  const getSubscriptionColor = () => {
    if (!user?.subscription || user.subscription === 'none') return theme.colors.textSecondary;
    if (user.subscription === 'pro') return theme.colors.highProbability;
    return theme.colors.mediumProbability;
  };

  // Format betslips for display - UPDATED
  const formatSavedBetslips = () => {
    return (betslips || []).map(betslip => {
      // Handle both selections and matches arrays
      let selections = [];
      if (betslip.selections && Array.isArray(betslip.selections)) {
        selections = betslip.selections;
      } else if (betslip.matches && Array.isArray(betslip.matches)) {
        // Transform matches to selections format with prediction data
        selections = betslip.matches.map(match => ({
          // Map match fields to selection fields
          matchId: match.fixtureId,
          homeTeam: match.homeTeam,
          awayTeam: match.awayTeam,
          team1: match.homeTeam || match.team1 || t('profile.home'),
          team2: match.awayTeam || match.team2 || t('profile.away'),
          
          // Get the prediction data from NEW fields
          pick: match.pick,
          prediction: match.pick, // For compatibility
          predictionType: match.predictionType || match.pick,
          predictionValue: match.predictionValue,
          fullPrediction: match.fullPrediction || 
            (match.pick && match.predictionValue ? 
              `${match.pick} ${match.predictionValue}` : 
              match.pick || t('profile.noPrediction')),
          
          odd: match.odd,
          status: match.status,
          league: match.league || t('profile.unknownLeague'),
          confidence: match.confidence || 70,
          matchTime: match.matchTime || 'TBD',
          source: match.source || 'ai'
        }));
      }
      
      const selectionsCount = selections.length;
      
      // Convert date properly
      let dateString = t('profile.recently');
      if (betslip.createdAt) {
        try {
          const date = new Date(betslip.createdAt);
          dateString = date.toLocaleDateString(isFrench ? 'fr-FR' : 'en-US');
        } catch (e) {
          dateString = t('profile.recently');
        }
      }
      
      // Calculate potential return if not provided
      const stake = betslip.stake || 10;
      const totalOdds = betslip.totalOdds || betslip.totalOdd || 1.0;
      const potentialReturn = stake * totalOdds;
      
      return {
        id: betslip._id || betslip.id || Math.random().toString(),
        title: betslip.title || `Betslip #${Math.floor(Math.random() * 1000)}`,
        totalOdds: totalOdds,
        selectionsCount: selectionsCount,
        date: dateString,
        status: betslip.status || 'pending',
        potentialReturn: betslip.potentialReturn || potentialReturn,
        selections: selections,
        stake: stake,
        potentialWin: betslip.potentialWin || potentialReturn,
        source: betslip.source || 'ai',
        createdAt: betslip.createdAt,
        aiConfidence: betslip.aiConfidence || 70,
        successRate: betslip.successRate || 0,
        // Include the original betslip for reference
        original: betslip
      };
    });
  };

  const savedBetslips = formatSavedBetslips();

  // Render a selection item for expanded view
  const renderSelectionItem = (selection, index) => {
    if (!selection) return null;
    
    // Extract data from different possible structures
    const league = selection.league || selection.competition || t('profile.unknownLeague');
    const team1 = selection.team1 || selection.homeTeam || t('profile.home');
    const team2 = selection.team2 || selection.awayTeam || t('profile.away');
    const odd = selection.odd || 1.5;
    const confidence = selection.confidence || 70;
    const matchTime = selection.matchTime || 'TBD';
    const status = selection.status || 'UPCOMING';
    
    // Get the FULL prediction text from NEW fields
    const getFullPrediction = () => {
      // Check for fullPrediction first (already formatted)
      if (selection.fullPrediction) {
        return selection.fullPrediction;
      }
      
      // Check for predictionType and predictionValue
      if (selection.predictionType && selection.predictionValue) {
        const type = selection.predictionType.toUpperCase();
        const value = selection.predictionValue;
        
        switch(type) {
          case 'OVER':
            return `Over ${value}`;
          case 'UNDER':
            return `Under ${value}`;
          case 'BTTS':
            return `BTTS ${value === 'yes' ? 'Yes' : 'No'}`;
          case '1X2':
            if (value === '1') return 'Home Win';
            if (value === '2') return 'Away Win';
            if (value === 'X') return 'Draw';
            return `${value}`;
          case 'DC':
            return `Double Chance: ${value}`;
          case '1':
            return 'Home Win';
          case 'X':
            return 'Draw';
          case '2':
            return 'Away Win';
          case '1X':
            return 'Home Win or Draw';
          case 'X2':
            return 'Draw or Away Win';
          case '12':
            return 'Home Win or Away Win';
          default:
            return type;
        }
      }
      
      // Check for pick (basic type)
      if (selection.pick) {
        // If pick contains value (e.g., "OVER2.5"), parse it
        if (selection.pick.includes('OVER') && !selection.pick.includes(' ')) {
          const value = selection.pick.replace('OVER', '');
          return value ? `Over ${value}` : 'Over';
        }
        if (selection.pick.includes('UNDER') && !selection.pick.includes(' ')) {
          const value = selection.pick.replace('UNDER', '');
          return value ? `Under ${value}` : 'Under';
        }
        return selection.pick;
      }
      
      // Fallback to prediction or default
      return selection.prediction || t('profile.noPrediction');
    };
    
    const prediction = getFullPrediction();
    
    return (
      <View key={index} style={styles.selectionItem}>
        <View style={styles.selectionHeader}>
          <View style={styles.selectionHeaderLeft}>
            <Text style={styles.selectionLeague}>{league}</Text>
            <View style={[
              styles.statusBadge,
              { 
                backgroundColor: 
                  status === 'LIVE' ? theme.colors.liveStatus :
                  status === 'UPCOMING' ? theme.colors.upcomingStatus :
                  theme.colors.finishedStatus
              }
            ]}>
              <Text style={styles.statusText}>{status}</Text>
            </View>
          </View>
          <View style={styles.oddBadge}>
            <Text style={styles.oddText}>{parseFloat(odd).toFixed(2)}</Text>
          </View>
        </View>
        
        <Text style={styles.selectionTeams}>
          {team1} vs {team2}
        </Text>
        
        <View style={styles.selectionDetails}>
          <View style={styles.predictionContainer}>
            <Text style={styles.detailLabel}>{t('profile.prediction')}</Text>
            <Text style={styles.predictionText}>{prediction}</Text>
          </View>
          
          <View style={styles.confidenceContainer}>
            <Text style={styles.detailLabel}>{t('profile.aiConfidence')}:</Text>
            <View style={styles.confidenceBadge}>
              <Ionicons name="trending-up" size={10} color={getConfidenceColor(confidence)} />
              <Text style={[styles.confidenceText, { color: getConfidenceColor(confidence) }]}>
                {confidence}%
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.selectionFooter}>
          <Text style={styles.matchTime}>{matchTime}</Text>
          <Text style={styles.selectionSource}>
            {selection.source === 'ai' ? t('profile.aiGenerated') : t('profile.manual')}
          </Text>
        </View>
      </View>
    );
  };

  // Render Support Modal
  const renderSupportModal = () => {
    if (!activeSupportModal) return null;

    const getModalContent = () => {
      switch(activeSupportModal) {
        case t('profile.helpSupport'):
          return {
            title: t('profile.helpSupport'),
            icon: 'help-circle',
            content: (
              <View style={styles.modalContent}>
                <Text style={styles.modalDescription}>
                  {t('profile.helpSupportDescription')}
                </Text>
                
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={handleContactEmail}
                >
                  <Ionicons name="mail" size={20} color="#FFFFFF" />
                  <Text style={styles.actionButtonText}>{t('profile.contactViaEmail')}</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.actionButton, styles.secondaryButton]}
                  onPress={handleOpenFAQ}
                >
                  <Ionicons name="help-buoy" size={20} color={theme.colors.accent} />
                  <Text style={[styles.actionButtonText, { color: theme.colors.accent }]}>
                    {t('profile.viewFAQ')}
                  </Text>
                </TouchableOpacity>
                
                <View style={styles.contactInfo}>
                  <Text style={styles.contactLabel}>{t('profile.ourEmail')}</Text>
                  <Text style={styles.contactValue}>freecoder21@gmail.com</Text>
                  <Text style={styles.contactNote}>{t('profile.responseTime')}</Text>
                </View>
              </View>
            )
          };
        
        case t('profile.termsConditions'):
          return {
            title: t('profile.termsConditions'),
            icon: 'document-text',
            content: (
              <View style={styles.modalContent}>
                <Text style={styles.modalDescription}>
                  {t('profile.termsDescription')}
                </Text>
                
                <View style={styles.termsSection}>
                  <Text style={styles.sectionTitle}>📜 {t('profile.termsSection1')}</Text>
                  <Text style={styles.sectionText}>{t('profile.termsContent1')}</Text>
                </View>
                
                <View style={styles.termsSection}>
                  <Text style={styles.sectionTitle}>⚖️ {t('profile.termsSection2')}</Text>
                  <Text style={styles.sectionText}>{t('profile.termsContent2')}</Text>
                </View>
                
                <View style={styles.termsSection}>
                  <Text style={styles.sectionTitle}>💳 {t('profile.termsSection3')}</Text>
                  <Text style={styles.sectionText}>{t('profile.termsContent3')}</Text>
                </View>
                
                <TouchableOpacity 
                  style={[styles.actionButton, styles.secondaryButton]}
                  onPress={() => {
                    // You can link to your full terms page here
                    Alert.alert(t('profile.fullTerms'), t('profile.fullTermsMessage'));
                  }}
                >
                  <Ionicons name="reader" size={20} color={theme.colors.accent} />
                  <Text style={[styles.actionButtonText, { color: theme.colors.accent }]}>
                    {t('profile.readFullTerms')}
                  </Text>
                </TouchableOpacity>
              </View>
            )
          };
        
        case t('profile.privacyPolicy'):
          return {
            title: t('profile.privacyPolicy'),
            icon: 'shield-checkmark',
            content: (
              <View style={styles.modalContent}>
                <Text style={styles.modalDescription}>
                  {t('profile.privacyDescription')}
                </Text>
                
                <View style={styles.privacySection}>
                  <Ionicons name="lock-closed" size={24} color={theme.colors.accent} />
                  <Text style={styles.privacyTitle}>{t('profile.dataSecurity')}</Text>
                  <Text style={styles.privacyText}>{t('profile.dataSecurityContent')}</Text>
                </View>
                
                <View style={styles.privacySection}>
                  <Ionicons name="eye-off" size={24} color={theme.colors.accent} />
                  <Text style={styles.privacyTitle}>{t('profile.dataUsage')}</Text>
                  <Text style={styles.privacyText}>{t('profile.dataUsageContent')}</Text>
                </View>
                
                <View style={styles.privacySection}>
                  <Ionicons name="trash" size={24} color={theme.colors.accent} />
                  <Text style={styles.privacyTitle}>{t('profile.dataDeletion')}</Text>
                  <Text style={styles.privacyText}>{t('profile.dataDeletionContent')}</Text>
                </View>
              </View>
            )
          };
        
        case t('profile.aboutBetai'):
          return {
            title: t('profile.aboutBetai'),
            icon: 'information-circle',
            content: (
              <View style={styles.modalContent}>
                <Text style={styles.modalDescription}>
                  {t('profile.aboutDescription')}
                </Text>
                
                <View style={styles.aboutSection}>
                  <Ionicons name="bulb" size={24} color={theme.colors.accent} />
                  <Text style={styles.aboutTitle}>{t('profile.ourMission')}</Text>
                  <Text style={styles.aboutText}>{t('profile.ourMissionContent')}</Text>
                </View>
                
                <View style={styles.aboutSection}>
                  <Ionicons name="analytics" size={24} color={theme.colors.accent} />
                  <Text style={styles.aboutTitle}>{t('profile.ourTechnology')}</Text>
                  <Text style={styles.aboutText}>{t('profile.ourTechnologyContent')}</Text>
                </View>
                
                <View style={styles.aboutSection}>
                  <Ionicons name="people" size={24} color={theme.colors.accent} />
                  <Text style={styles.aboutTitle}>{t('profile.ourTeam')}</Text>
                  <Text style={styles.aboutText}>{t('profile.ourTeamContent')}</Text>
                </View>
                
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={handleVisitWebsite}
                >
                  <Ionicons name="globe" size={20} color="#FFFFFF" />
                  <Text style={styles.actionButtonText}>{t('profile.visitOurWebsite')}</Text>
                </TouchableOpacity>
              </View>
            )
          };
        
        default:
          return null;
      }
    };

    const modalData = getModalContent();
    if (!modalData) return null;

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={!!activeSupportModal}
        onRequestClose={closeSupportModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}>
                <Ionicons name={modalData.icon} size={24} color={theme.colors.accent} />
                <Text style={styles.modalTitle}>{modalData.title}</Text>
              </View>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={closeSupportModal}
              >
                <Ionicons name="close" size={24} color={theme.colors.textPrimary} />
              </TouchableOpacity>
            </View>

            {/* Modal Content */}
            <ScrollView 
              style={styles.modalBody}
              showsVerticalScrollIndicator={false}
            >
              {modalData.content}
            </ScrollView>

            {/* Modal Footer */}
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={[styles.modalActionButton, styles.primaryActionButton]}
                onPress={handleContactEmail}
              >
                <Ionicons name="mail" size={18} color="#FFFFFF" />
                <Text style={styles.primaryActionButtonText}>
                  {t('profile.contactSupport')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  // Loading state
  if (authLoading || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
        <Text style={styles.loadingText}>{t('profile.loadingProfile')}</Text>
      </View>
    );
  }

  // Not authenticated state
  if (!isAuthenticated) {
    return (
      <View style={styles.authContainer}>
        <Ionicons name="person-circle" size={80} color={theme.colors.textMuted} />
        <Text style={styles.authTitle}>{t('profile.authenticationRequired')}</Text>
        <Text style={styles.authText}>{t('profile.pleaseLoginView')}</Text>
        <TouchableOpacity 
          style={styles.authButton}
          onPress={() => router.push('/auth/login')}
        >
          <Ionicons name="log-in" size={20} color="#FFFFFF" />
          <Text style={styles.authButtonText}>{t('profile.loginNow')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[theme.colors.accent]}
          tintColor={theme.colors.accent}
        />
      }
    >
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ 
                uri: user?.avatar || `https://ui-avatars.com/api/?name=${user?.username || 'User'}&background=${theme.colors.accent.replace('#', '')}&color=fff`
              }}
              style={styles.avatar}
            />
            {isPro && (
              <View style={styles.proBadge}>
                <Ionicons name="star" size={12} color="#FFFFFF" />
                <Text style={styles.proBadgeText}>PRO</Text>
              </View>
            )}
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.username || 'Guest User'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'guest@example.com'}</Text>
            <View style={styles.statsRow}>
              <View style={styles.statBadge}>
                <Ionicons name="trophy" size={14} color={theme.colors.accent} />
                <Text style={styles.statBadgeText}>{userStats.successRate} {t('profile.success')}</Text>
              </View>
              <View style={styles.statBadge}>
                <Ionicons name="trending-up" size={14} color={theme.colors.highProbability} />
                <Text style={styles.statBadgeText}>{userStats.accuracy} {t('profile.accuracy')}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsSection}>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="receipt" size={24} color={theme.colors.accent} />
            <Text style={styles.statValue}>{userStats.totalBetslips}</Text>
            <Text style={styles.statLabel}>{t('profile.totalBetslips')}</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="card" size={24} color={getSubscriptionColor()} />
            <Text style={[styles.statValue, { color: getSubscriptionColor() }]}>
              {userStats.subscription}
            </Text>
            <Text style={styles.statLabel}>{t('profile.subscription')}</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="diamond-outline" size={24} color="#F7931A" />
            <Text style={styles.statValue}>{userStats.userCredits.toFixed(0)}</Text>
            <Text style={styles.statLabel}>{t('profile.credits')}</Text>
          </View>
        </View>
      </View>

      {/* Create New Betslip */}
      <View style={styles.createBetslipSection}>
        <TouchableOpacity 
          style={styles.createBetslipButton}
          onPress={handleNavigateToBetslip}
        >
          <Ionicons name="add-circle" size={24} color={theme.colors.accent} />
          <View style={styles.createBetslipContent}>
            <Text style={styles.createBetslipTitle}>{t('profile.createNewBetslip')}</Text>
            <Text style={styles.createBetslipText}>{t('profile.generateAiPowered')}</Text>
          </View>
          <Ionicons name="arrow-forward" size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Saved Betslips Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <Ionicons name="bookmark" size={20} color={theme.colors.accent} />
            <Text style={styles.sectionTitle}>
              {t('profile.savedBetslips')} {betslips?.length > 0 && `(${betslips.length})`}
            </Text>
          </View>
        </View>

        {savedBetslips.length > 0 ? (
          <View style={styles.savedBetslips}>
            {savedBetslips.slice(0, 3).map((betslip) => (
              <View key={betslip.id} style={styles.betslipCard}>
                {/* Betslip Header - Clickable */}
                <TouchableOpacity 
                  style={styles.betslipContent}
                  onPress={() => handleSavedBetslipPress(betslip.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.betslipInfo}>
                    <Text style={styles.betslipTitle} numberOfLines={1}>
                      {betslip.title}
                    </Text>
                    <View style={styles.betslipDetails}>
                      <View style={styles.betslipDetail}>
                        <Ionicons name="calendar" size={12} color={theme.colors.textSecondary} />
                        <Text style={styles.betslipDetailText}>{betslip.date}</Text>
                      </View>
                      <View style={styles.betslipDetail}>
                        <Ionicons name="football" size={12} color={theme.colors.textSecondary} />
                        <Text style={styles.betslipDetailText}>
                          {betslip.selectionsCount} {betslip.selectionsCount === 1 ? t('profile.match') : t('profile.matches')}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.betslipOdd}>
                    <Text style={styles.betslipOddLabel}>{t('profile.totalOdds')}</Text>
                    <Text style={styles.betslipOddValue}>{betslip.totalOdds.toFixed(2)}</Text>
                  </View>
                  <View style={styles.betslipExpandIcon}>
                    <Ionicons 
                      name={expandedBetslip === betslip.id ? "chevron-up" : "chevron-down"} 
                      size={20} 
                      color={theme.colors.accent} 
                    />
                  </View>
                </TouchableOpacity>

                {/* Expanded Betslip Details */}
                {expandedBetslip === betslip.id && (
                  <View style={styles.expandedDetails}>
                    {/* Betslip Summary */}
                    <View style={styles.betslipSummary}>
                      <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>{t('profile.aiConfidence')}</Text>
                        <View style={styles.confidenceMeterContainer}>
                          <View style={styles.confidenceMeter}>
                            <View 
                              style={[
                                styles.confidenceFill, 
                                { 
                                  width: `${betslip.aiConfidence}%`,
                                  backgroundColor: getConfidenceColor(betslip.aiConfidence)
                                }
                              ]} 
                            />
                          </View>
                          <Text style={[styles.confidenceValue, { color: getConfidenceColor(betslip.aiConfidence) }]}>
                            {betslip.aiConfidence}%
                          </Text>
                        </View>
                      </View>
                      
                      <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>{t('profile.successRate')}</Text>
                        <Text style={[styles.successRate, { color: getConfidenceColor(betslip.successRate) }]}>
                          {betslip.successRate}%
                        </Text>
                      </View>
                    </View>

                    {/* Potential Return Section */}
                    <View style={styles.potentialWinSection}>
                      <View style={styles.stakeBox}>
                        <Text style={styles.stakeLabel}>{t('profile.stake')}</Text>
                        <Text style={styles.stakeAmount}>${betslip.stake?.toFixed(2) || '10.00'}</Text>
                      </View>
                      <Ionicons name="arrow-forward" size={16} color={theme.colors.textSecondary} />
                      <View style={styles.potentialBox}>
                        <Text style={styles.potentialLabel}>{t('profile.potentialReturn')}</Text>
                        <Text style={styles.potentialAmount}>
                          ${betslip.potentialReturn?.toFixed(2)}
                        </Text>
                      </View>
                    </View>

                    {/* Selections List */}
                    {betslip.selections && betslip.selections.length > 0 && (
                      <View style={styles.selectionsSection}>
                        <Text style={styles.selectionsTitle}>{t('profile.selectionsInBetslip')}</Text>
                        <View style={styles.selectionsList}>
                          {betslip.selections.map((selection, index) => renderSelectionItem(selection, index))}
                        </View>
                      </View>
                    )}

                    {/* Delete Button (Replaces the "Use Betslip" button) */}
                    <TouchableOpacity 
                      style={styles.deleteButton}
                      onPress={handleRemoveBetslip}
                    >
                      <Ionicons name="trash-outline" size={18} color="#FFFFFF" />
                      <Text style={styles.deleteButtonText}>{t('profile.deleteThisBetslip')}</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyBetslips}>
            <Ionicons name="bookmark-outline" size={48} color={theme.colors.textMuted} />
            <Text style={styles.emptyBetslipsTitle}>{t('profile.noSavedBetslips')}</Text>
            <Text style={styles.emptyBetslipsText}>
              {t('profile.createFirstOne')}
            </Text>
            <TouchableOpacity 
              style={styles.emptyButton}
              onPress={handleNavigateToBetslip}
            >
              <Ionicons name="add" size={20} color="#FFFFFF" />
              <Text style={styles.emptyButtonText}>{t('profile.createBetslip')}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Account Options */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <Ionicons name="person-circle" size={20} color={theme.colors.accent} />
            <Text style={styles.sectionTitle}>{t('profile.account')}</Text>
          </View>
        </View>

        <View style={styles.optionsList}>
          {/* Language Toggle Option */}
          <TouchableOpacity style={styles.option} onPress={handleLanguageToggle}>
            <View style={styles.optionLeft}>
              <Ionicons name="language" size={22} color={theme.colors.textPrimary} />
              <Text style={styles.optionText}>{t('profile.language')}</Text>
            </View>
            <View style={styles.optionRight}>
              <View style={styles.languageToggle}>
                <Text style={styles.languageText}>{isFrench ? 'FR' : 'EN'}</Text>
                <View style={[styles.toggleSwitch, isFrench ? styles.toggleActive : null]}>
                  <View style={[styles.toggleKnob, isFrench ? styles.toggleKnobActive : null]} />
                </View>
              </View>
            </View>
          </TouchableOpacity>

          {/* Buy Coins */}
          <TouchableOpacity 
            style={styles.option}
            onPress={handleBuyCoins}
          >
            <View style={styles.optionLeft}>
              <Ionicons name="diamond-outline" size={22} color="#F7931A" />
              <Text style={styles.optionText}>{t('profile.buyCoins')}</Text>
            </View>
            <View style={styles.optionRight}>
              <View style={styles.coinsBadge}>
                <Text style={styles.coinsBadgeText}>{t('profile.getCoins')}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={theme.colors.textSecondary} />
            </View>
          </TouchableOpacity>

          {/* Become Affiliate */}
          <TouchableOpacity 
            style={[styles.option, isAffiliate && styles.affiliateOption]}
            onPress={handleBecomeAffiliate}
          >
            <View style={styles.optionLeft}>
              <Ionicons 
                name={isAffiliate ? "people" : "people-outline"} 
                size={22} 
                color={isAffiliate ? theme.colors.highProbability : theme.colors.textPrimary} 
              />
              <Text style={styles.optionText}>
                {isAffiliate ? t('profile.affiliateProgram') : t('profile.becomeAffiliate')}
              </Text>
            </View>
            {!isAffiliate ? (
              <View style={styles.optionRight}>
                <View style={styles.earnBadge}>
                  <Text style={styles.earnBadgeText}>{t('profile.earn')}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={theme.colors.textSecondary} />
              </View>
            ) : (
              <View style={styles.affiliateActiveBadge}>
                <Text style={styles.affiliateActiveText}>{t('profile.active')}</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Settings */}
          <View style={styles.option}>
            <View style={styles.optionLeft}>
              <Ionicons name="notifications" size={22} color={theme.colors.textPrimary} />
              <Text style={styles.optionText}>{t('profile.notifications')}</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: theme.colors.border, true: theme.colors.accent }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>
      </View>

      {/* Support & Legal */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <Ionicons name="help-circle" size={20} color={theme.colors.accent} />
            <Text style={styles.sectionTitle}>{t('profile.supportLegal')}</Text>
          </View>
        </View>

        <View style={styles.supportOptions}>
          <TouchableOpacity 
            style={styles.supportOption}
            onPress={() => handleSupportOption(t('profile.helpSupport'))}
          >
            <Ionicons name="help" size={18} color={theme.colors.textSecondary} />
            <Text style={styles.supportOptionText}>{t('profile.helpSupport')}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.supportOption}
            onPress={() => handleSupportOption(t('profile.termsConditions'))}
          >
            <Ionicons name="document-text" size={18} color={theme.colors.textSecondary} />
            <Text style={styles.supportOptionText}>{t('profile.termsConditions')}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.supportOption}
            onPress={() => handleSupportOption(t('profile.privacyPolicy'))}
          >
            <Ionicons name="shield-checkmark" size={18} color={theme.colors.textSecondary} />
            <Text style={styles.supportOptionText}>{t('profile.privacyPolicy')}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.supportOption}
            onPress={() => handleSupportOption(t('profile.aboutBetai'))}
          >
            <Ionicons name="information-circle" size={18} color={theme.colors.textSecondary} />
            <Text style={styles.supportOptionText}>{t('profile.aboutBetai')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out" size={20} color="#EF4444" />
        <Text style={styles.logoutText}>{t('profile.logout')}</Text>
      </TouchableOpacity>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.version}>{t('profile.version')}</Text>
        <Text style={styles.copyright}>{t('profile.copyright')}</Text>
      </View>

      {/* Support Modal */}
      {renderSupportModal()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body.fontSize,
    marginTop: theme.spacing.md,
  },
  authContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  authTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.title.fontSize,
    fontWeight: '700',
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  authText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body.fontSize,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  authButton: {
    backgroundColor: theme.colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  authButtonText: {
    color: '#FFFFFF',
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
  },
  header: {
    backgroundColor: theme.colors.cardBackground,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    ...theme.shadows.medium,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: theme.spacing.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: theme.colors.accent,
  },
  proBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: theme.colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    gap: 2,
  },
  proBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: theme.colors.textPrimary,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 2,
  },
  userEmail: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    marginBottom: theme.spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.cardElevated,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statBadgeText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
  statsSection: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    alignItems: 'center',
    ...theme.shadows.small,
  },
  statValue: {
    color: theme.colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 2,
  },
  statLabel: {
    color: theme.colors.textSecondary,
    fontSize: 11,
  },
  createBetslipSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  createBetslipButton: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    ...theme.shadows.medium,
  },
  createBetslipContent: {
    flex: 1,
  },
  createBetslipTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.subtitle.fontSize,
    fontWeight: '600',
    marginBottom: 2,
  },
  createBetslipText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.small.fontSize,
  },
  section: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.title.fontSize,
    fontWeight: '700',
  },
  seeAll: {
    color: theme.colors.accent,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
  },
  savedBetslips: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.medium,
  },
  betslipCard: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  betslipContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  betslipInfo: {
    flex: 1,
  },
  betslipTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
    marginBottom: 4,
  },
  betslipDetails: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  betslipDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  betslipDetailText: {
    color: theme.colors.textSecondary,
    fontSize: 11,
  },
  betslipOdd: {
    alignItems: 'center',
    marginHorizontal: theme.spacing.md,
  },
  betslipOddLabel: {
    color: theme.colors.textSecondary,
    fontSize: 10,
    marginBottom: 2,
  },
  betslipOddValue: {
    color: theme.colors.accent,
    fontSize: 18,
    fontWeight: '700',
  },
  betslipExpandIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expandedDetails: {
    padding: theme.spacing.md,
    paddingTop: 0,
    backgroundColor: theme.colors.cardElevated,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  betslipSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryLabel: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    marginBottom: 4,
  },
  confidenceMeterContainer: {
    alignItems: 'center',
  },
  confidenceMeter: {
    width: 60,
    height: 6,
    backgroundColor: theme.colors.border,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 3,
  },
  confidenceFill: {
    height: '100%',
    borderRadius: 3,
  },
  confidenceValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  successRate: {
    fontSize: 15,
    fontWeight: '700',
  },
  potentialWinSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  stakeBox: {
    alignItems: 'center',
    flex: 1,
  },
  stakeLabel: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    marginBottom: 4,
  },
  stakeAmount: {
    color: theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  potentialBox: {
    alignItems: 'center',
    flex: 1,
  },
  potentialLabel: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    marginBottom: 4,
  },
  potentialAmount: {
    color: theme.colors.highProbability,
    fontSize: 18,
    fontWeight: '800',
  },
  selectionsSection: {
    paddingVertical: theme.spacing.md,
  },
  selectionsTitle: {
    color: theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
  },
  selectionsList: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
  },
  selectionItem: {
    marginBottom: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  selectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  selectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    flex: 1,
  },
  selectionLeague: {
    color: theme.colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  oddBadge: {
    backgroundColor: theme.colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
    minWidth: 45,
    alignItems: 'center',
  },
  oddText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  selectionTeams: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '700',
    marginBottom: theme.spacing.sm,
  },
  selectionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  predictionContainer: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  detailLabel: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    marginBottom: 2,
  },
  predictionText: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
  },
  confidenceContainer: {
    alignItems: 'flex-end',
  },
  confidenceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  confidenceText: {
    fontSize: 11,
    fontWeight: '600',
  },
  selectionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing.xs,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  matchTime: {
    color: theme.colors.textSecondary,
    fontSize: 11,
  },
  selectionSource: {
    color: theme.colors.textSecondary,
    fontSize: 10,
    fontStyle: 'italic',
  },
  deleteButton: {
    backgroundColor: '#EF4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.md,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
  },
  emptyBetslips: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    alignItems: 'center',
    ...theme.shadows.medium,
  },
  emptyBetslipsTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.subtitle.fontSize,
    fontWeight: '600',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  emptyBetslipsText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body.fontSize,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    lineHeight: 20,
  },
  emptyButton: {
    backgroundColor: theme.colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
  },
  optionsList: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.medium,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  affiliateOption: {
    backgroundColor: `${theme.colors.highProbability}10`,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    flex: 1,
  },
  optionText: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '500',
  },
  optionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  languageToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  languageText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    minWidth: 20,
  },
  toggleSwitch: {
    width: 40,
    height: 20,
    backgroundColor: theme.colors.border,
    borderRadius: 10,
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: theme.colors.accent,
  },
  toggleKnob: {
    width: 16,
    height: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginLeft: 0,
  },
  toggleKnobActive: {
    marginLeft: 20,
  },
  coinsBadge: {
    backgroundColor: '#F7931A',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  coinsBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  earnBadge: {
    backgroundColor: theme.colors.highProbability,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  earnBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  affiliateActiveBadge: {
    backgroundColor: theme.colors.highProbability,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  affiliateActiveText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  supportOptions: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.medium,
  },
  supportOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    gap: theme.spacing.md,
  },
  supportOptionText: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.body.fontSize,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    backgroundColor: `${theme.colors.lowProbability}20`,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
  },
  logoutText: {
    color: '#EF4444',
    fontSize: theme.typography.subtitle.fontSize,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: theme.spacing.xl,
    marginTop: theme.spacing.md,
  },
  version: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    marginBottom: 4,
  },
  copyright: {
    color: theme.colors.textMuted,
    fontSize: 11,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  modalContainer: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    ...theme.shadows.xlarge,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  modalTitle: {
    color: theme.colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    maxHeight: '70%',
  },
  modalContent: {
    padding: theme.spacing.lg,
  },
  modalDescription: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body.fontSize,
    lineHeight: 22,
    marginBottom: theme.spacing.lg,
  },
  actionButton: {
    backgroundColor: theme.colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  secondaryButton: {
    backgroundColor: `${theme.colors.accent}20`,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
  },
  contactInfo: {
    backgroundColor: theme.colors.cardBackground,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.md,
  },
  contactLabel: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    marginBottom: 4,
  },
  contactValue: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
    marginBottom: 4,
  },
  contactNote: {
    color: theme.colors.textMuted,
    fontSize: 11,
    fontStyle: 'italic',
  },
  termsSection: {
    backgroundColor: theme.colors.cardBackground,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    color: theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: theme.spacing.sm,
  },
  sectionText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body.fontSize,
    lineHeight: 20,
  },
  privacySection: {
    backgroundColor: theme.colors.cardBackground,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
  },
  privacyTitle: {
    color: theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  privacyText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body.fontSize,
    lineHeight: 20,
    textAlign: 'center',
  },
  aboutSection: {
    backgroundColor: theme.colors.cardBackground,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
  },
  aboutTitle: {
    color: theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  aboutText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body.fontSize,
    lineHeight: 20,
    textAlign: 'center',
  },
  modalFooter: {
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  modalActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  primaryActionButton: {
    backgroundColor: theme.colors.accent,
  },
  primaryActionButtonText: {
    color: '#FFFFFF',
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
  },
});

export default ProfileScreen;