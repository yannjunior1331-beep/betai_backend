// app/betslip.jsx - Updated with keyboard dismiss functionality
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
  Animated,
  Keyboard,
} from 'react-native';
import { theme } from '../../constants/theme';
import BetslipCard from '../../components/betslipCard';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from '../../contexts/authContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import '../../utils/i18n';

const API_BASE_URL = 'http://192.168.55.215:3000/api';
const GENERATE_ENDPOINT = `${API_BASE_URL}/betslips/generate`;
const CREDITS_REQUIRED = 100; // Credits needed per generation

const BetslipGenerator = () => {
  const { 
    isAuthenticated, 
    user, 
    hasFullAccess,
    updateUser,
  } = useAuth();
  
  const { t } = useTranslation();
  
  const [targetOdd, setTargetOdd] = useState('');
  const [betslips, setBetslips] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [inputError, setInputError] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [creditWarningVisible, setCreditWarningVisible] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const textInputRef = useRef(null);

  // Keyboard listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setIsKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setIsKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  // Show authentication reminder if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      setCreditWarningVisible(true);
    } else if (isAuthenticated && user) {
      // Check if user has enough credits
      if (!hasFullAccess() && (user.credits || 0) < CREDITS_REQUIRED) {
        setCreditWarningVisible(true);
      } else {
        setCreditWarningVisible(false);
      }
    }
  }, [isAuthenticated, user]);

  // Add spinning animation effect
  useEffect(() => {
    let animationFrame;
    if (isGenerating) {
      const animate = () => {
        setRotation(prev => (prev + 10) % 360);
        animationFrame = requestAnimationFrame(animate);
      };
      animationFrame = requestAnimationFrame(animate);
    }
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isGenerating]);

  // Animate credit warning
  useEffect(() => {
    if (creditWarningVisible) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [creditWarningVisible, fadeAnim]);

  // Dismiss keyboard when tapping outside
  const dismissKeyboard = () => {
    if (isKeyboardVisible) {
      Keyboard.dismiss();
    }
  };

  // Check if user can generate betslips
  const canGenerateBetslips = () => {
    // Admins or users with full access (valid subscription) can generate freely
    if (hasFullAccess()) {
      return true;
    }
    
    // Check credits for regular users
    if (isAuthenticated && user) {
      const userCredits = user.credits || 0;
      return userCredits >= CREDITS_REQUIRED;
    }
    
    // Non-logged in users cannot generate
    return false;
  };

  // Validate input on change - FIXED STYLING
  const handleTargetOddChange = (text) => {
    // Remove non-numeric characters except decimal point
    const cleanedText = text.replace(/[^0-9.]/g, '');
    
    // Allow only one decimal point
    const parts = cleanedText.split('.');
    if (parts.length > 2) {
      setTargetOdd(parts[0] + '.' + parts.slice(1).join(''));
      return;
    }
    
    setTargetOdd(cleanedText);
    
    // Validate for max 10 limit
    const numericValue = parseFloat(cleanedText);
    if (!isNaN(numericValue) && numericValue > 10) {
      setInputError(true);
    } else {
      setInputError(false);
    }
  };

  const handleGenerate = async () => {
    // Dismiss keyboard first
    dismissKeyboard();
    
    // Check if user can generate
    if (!canGenerateBetslips()) {
      setShowCreditModal(true);
      return;
    }

    // Validation
    if (!targetOdd || isNaN(targetOdd) || parseFloat(targetOdd) < 1.1) {
      Alert.alert(t('betslip.errors.invalidInput'), t('betslip.errors.invalidOdd'));
      setInputError(true);
      return;
    }

    const numericValue = parseFloat(targetOdd);
    if (numericValue > 10) {
      Alert.alert(t('betslip.errors.invalidInput'), t('betslip.errors.oddTooHigh'));
      setInputError(true);
      return;
    }

    setIsGenerating(true);
    setInputError(false);
    
    try {
      // Add auth token if user is logged in
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (isAuthenticated) {
        const token = await AsyncStorage.getItem('@FootGpt_token');
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }

      const response = await fetch(GENERATE_ENDPOINT, {
        method: 'POST',
        headers,
        body: JSON.stringify({ targetOdd: numericValue }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}: ${t('betslip.errors.generationError')}`);
      }
      
      if (data.success) {
        // ✅ Format betslips with additional data for better display
        const formattedBetslips = (data.betslips || []).map((betslip, index) => ({
          ...betslip,
          id: betslip.id || `betslip-${Date.now()}-${index}`,
          timestamp: betslip.timestamp || new Date().toISOString(),
          matchCount: betslip.matchCount || betslip.selections?.length || 0,
          stake: betslip.stake || 10,
          potentialReturn: betslip.potentialReturn || (betslip.stake || 10) * (betslip.totalOdd || 1),
          // Ensure selections have all required fields
          selections: (betslip.selections || []).map(selection => ({
            ...selection,
            matchId: selection.matchId || `match-${Math.random().toString(36).substr(2, 9)}`,
            league: selection.league || 'Premier League',
            team1: selection.team1 || 'Team A',
            team2: selection.team2 || 'Team B',
            prediction: selection.prediction || '1',
            odd: selection.odd || 1.5,
            confidence: selection.confidence || 70,
            matchTime: selection.matchTime || '20:00',
            status: selection.status || t('betslip.selections.upcoming')
          }))
        }));
        
        setBetslips(formattedBetslips);
        
        if (formattedBetslips.length === 0) {
          Alert.alert(
            t('betslip.errors.noBetslips'),
            data.message || t('betslip.errors.noBetslipsMessage')
          );
        }
        
        // Deduct credits if not admin/pro
        if (isAuthenticated && user && !hasFullAccess()) {
          const newCredits = Math.max(0, (user.credits || 0) - CREDITS_REQUIRED);
          updateUser({ credits: newCredits });
          
          // Show warning if now insufficient
          if (newCredits < CREDITS_REQUIRED) {
            setCreditWarningVisible(true);
          }
        }
      } else {
        Alert.alert(t('betslip.errors.generationFailed'), data.error || t('betslip.errors.generationError'));
        setBetslips([]);
      }
      
    } catch (error) {
      console.error('API Error:', error);
      
      if (error.message.includes('Network request failed') || error.message.includes('fetch')) {
        Alert.alert(
          t('betslip.connectionError.title'),
          t('betslip.connectionError.message', { ip: 'http:// 192.168.55.215:3000' })
        );
      } else {
        Alert.alert(t('common.error'), error.message || t('common.error'));
      }
      
      setBetslips([]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClear = () => {
    dismissKeyboard();
    setTargetOdd('');
    setBetslips([]);
    setInputError(false);
  };

  // Get user credits display info
  const getUserCreditsInfo = () => {
    if (!isAuthenticated) {
      return {
        text: t('betslip.authStatus.loginToGenerate'),
        color: theme.colors.mediumProbability,
        icon: 'log-in',
      };
    }
    
    const isAdmin = user?.isAdmin || false;
    const credits = user?.credits || 0;
    
    if (isAdmin) {
      return {
        text: t('betslip.authStatus.adminUnlimited'),
        color: theme.colors.highProbability,
        icon: 'shield-checkmark',
      };
    }
    
    if (hasFullAccess()) {
      return {
        text: t('betslip.authStatus.proUnlimited'),
        color: theme.colors.accent,
        icon: 'infinite',
      };
    }
    
    if (credits >= CREDITS_REQUIRED) {
      return {
        text: t('betslip.authStatus.credits', { count: credits }),
        color: theme.colors.highProbability,
        icon: 'wallet',
      };
    }
    
    return {
      text: t('betslip.authStatus.needCredits', { count: credits, required: CREDITS_REQUIRED }),
      color: '#ff9500',
      icon: 'warning',
    };
  };

  // Render credit warning message
  const renderCreditWarning = () => {
    if (!creditWarningVisible) return null;
    
    const creditsInfo = getUserCreditsInfo();
    
    return (
      <Animated.View style={[styles.creditWarning, { opacity: fadeAnim }]}>
        <View style={styles.creditWarningContent}>
          <Ionicons name={creditsInfo.icon} size={16} color="#FFFFFF" />
          <Text style={styles.creditWarningText}>
            {isAuthenticated 
              ? t('betslip.creditsNeeded', { 
                  credits: CREDITS_REQUIRED, 
                  plural: CREDITS_REQUIRED > 1 ? 's' : '' 
                }) + ' ' + t('betslip.youHaveCredits', { 
                  count: user?.credits || 0, 
                  plural: (user?.credits || 0) !== 1 ? 's' : '' 
                })
              : t('betslip.loginToGenerate')
            }
          </Text>
        </View>
        <View style={styles.creditWarningActions}>
          <TouchableOpacity 
            style={styles.creditWarningCloseBtn}
            onPress={() => setCreditWarningVisible(false)}
          >
            <Ionicons name="close" size={16} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.creditWarningAction}
            onPress={() => {
              dismissKeyboard();
              setCreditWarningVisible(false);
              // Navigate to appropriate screen
              // if (isAuthenticated) {
              //   navigation.navigate('PurchaseCredits');
              // } else {
              //   navigation.navigate('Login');
              // }
            }}
          >
            <Text style={styles.creditWarningActionText}>
              {isAuthenticated ? t('betslip.getCredits') : t('betslip.goToLogin')}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  // ✅ Show authentication status
  const renderAuthStatus = () => {
    const creditsInfo = getUserCreditsInfo();
    
    return (
      <View style={styles.authStatus}>
        <Ionicons name={creditsInfo.icon} size={16} color={creditsInfo.color} />
        <Text style={[styles.authStatusText, { color: creditsInfo.color }]}>
          {isAuthenticated ? `${user?.username} • ${creditsInfo.text}` : creditsInfo.text}
        </Text>
      </View>
    );
  };

  const renderBetslip = ({ item, index }) => (
    <View style={styles.betslipWrapper}>
      {index > 0 && <View style={styles.betslipDivider} />}
      <BetslipCard betslip={item} index={index + 1} />
    </View>
  );

  // Credit purchase modal
  const renderCreditModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showCreditModal}
      onRequestClose={() => {
        dismissKeyboard();
        setShowCreditModal(false);
      }}
    >
      <TouchableWithoutFeedback onPress={() => setShowCreditModal(false)}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {isAuthenticated ? t('betslip.needCredits') : t('betslip.loginRequired')}
                </Text>
                <TouchableOpacity 
                  onPress={() => setShowCreditModal(false)}
                  style={styles.modalClose}
                >
                  <Ionicons name="close" size={24} color={theme.colors.textPrimary} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.modalBody}>
                <Ionicons 
                  name={isAuthenticated ? "wallet-outline" : "log-in-outline"} 
                  size={60} 
                  color={theme.colors.accent} 
                  style={styles.modalIcon}
                />
                
                <Text style={styles.modalText}>
                  {isAuthenticated 
                    ? t('betslip.creditsNeeded', { 
                        credits: CREDITS_REQUIRED, 
                        plural: CREDITS_REQUIRED > 1 ? 's' : '' 
                      }) + '\n\n' + t('betslip.youHaveCredits', { 
                        count: user?.credits || 0, 
                        plural: (user?.credits || 0) !== 1 ? 's' : '' 
                      })
                    : t('betslip.loginToGenerate')
                  }
                </Text>
                
                <View style={styles.modalActions}>
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.modalButtonSecondary]}
                    onPress={() => setShowCreditModal(false)}
                  >
                    <Text style={styles.modalButtonSecondaryText}>{t('common.cancel')}</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.modalButtonPrimary]}
                    onPress={() => {
                      setShowCreditModal(false);
                      // Navigate to appropriate screen
                      // if (isAuthenticated) {
                      //   navigation.navigate('PurchaseCredits');
                      // } else {
                      //   navigation.navigate('Login');
                      // }
                    }}
                  >
                    <Text style={styles.modalButtonPrimaryText}>
                      {isAuthenticated ? t('betslip.getCredits') : t('betslip.goToLogin')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{t('betslip.title')}</Text>
            <Text style={styles.subtitle}>
              {t('betslip.subtitle')}
            </Text>
            {renderAuthStatus()}
          </View>

          {/* Credit Warning Message */}
          {renderCreditWarning()}

          {/* Simple Input Section - FIXED STYLING */}
          <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <View style={styles.inputSection}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{t('betslip.targetOdd')}</Text>
                <View style={[
                  styles.inputWrapper,
                  inputError && styles.inputWrapperError
                ]}>
                  <TextInput
                    ref={textInputRef}
                    style={[
                      styles.input,
                      inputError && styles.inputError
                    ]}
                    placeholder={t('betslip.targetOddPlaceholder')}
                    placeholderTextColor={theme.colors.textMuted}
                    keyboardType="decimal-pad"
                    value={targetOdd}
                    onChangeText={handleTargetOddChange}
                    editable={!isGenerating}
                    onSubmitEditing={dismissKeyboard}
                    returnKeyType="done"
                    blurOnSubmit={true}
                  />
                  {inputError && (
                    <View style={styles.errorIcon}>
                      <Ionicons name="alert-circle" size={20} color="#ff3b30" />
                    </View>
                  )}
                </View>
                {inputError && (
                  <Text style={styles.errorText}>
                    {t('betslip.oddLimitWarning')}
                  </Text>
                )}
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.clearButton]}
                  onPress={handleClear}
                  disabled={isGenerating}
                >
                  <Text style={styles.clearButtonText}>{t('betslip.clear')}</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.button, 
                    styles.generateButton,
                    !canGenerateBetslips() && styles.generateButtonDisabled
                  ]}
                  onPress={handleGenerate}
                  disabled={isGenerating || inputError || !canGenerateBetslips()}
                >
                  {isGenerating ? (
                    <>
                      <View style={styles.spinningIcon}>
                        <Ionicons 
                          name="sync" 
                          size={20} 
                          color="#FFFFFF" 
                          style={{ transform: [{ rotate: `${rotation}deg` }] }}
                        />
                      </View>
                      <Text style={styles.generateButtonText}>{t('betslip.generating')}</Text>
                    </>
                  ) : (
                    <>
                      <Ionicons name="flash" size={20} color="#FFFFFF" />
                      <Text style={styles.generateButtonText}>{t('betslip.generate')}</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>

          {/* Results Section */}
          <View style={styles.resultsSection}>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsTitle}>
                {t('betslip.generatedBetslips')} {betslips.length > 0 && `(${betslips.length})`}
              </Text>
              {!isAuthenticated && betslips.length > 0 && (
                <TouchableOpacity 
                  style={styles.loginTipButton}
                  onPress={() => {
                    dismissKeyboard();
                    setShowCreditModal(true);
                  }}
                >
                  <Ionicons name="log-in" size={14} color={theme.colors.accent} />
                  <Text style={styles.loginTipText}>{t('betslip.loginToSave')}</Text>
                </TouchableOpacity>
              )}
            </View>

            {isGenerating ? (
              <View style={styles.loadingContainer}>
                <View style={[styles.loadingSpinner, { transform: [{ rotate: `${rotation}deg` }] }]}>
                  <Ionicons name="football" size={40} color={theme.colors.accent} />
                </View>
                <Text style={styles.loadingText}>{t('betslip.aiAnalyzing')}</Text>
                <Text style={styles.loadingSubtext}>{t('betslip.mayTakeTime')}</Text>
              </View>
            ) : betslips.length > 0 ? (
              <FlatList
                data={betslips}
                renderItem={renderBetslip}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.betslipsList}
                keyboardShouldPersistTaps="handled"
              />
            ) : (
              <TouchableWithoutFeedback onPress={dismissKeyboard}>
                <View style={styles.emptyState}>
                  <Ionicons name="ticket" size={60} color={theme.colors.textMuted} />
                  <Text style={styles.emptyStateTitle}>{t('betslip.noBetslipsYet')}</Text>
                  <Text style={styles.emptyStateText}>
                    {t('betslip.noBetslipsDescription')}
                  </Text>
                  <View style={styles.tipsContainer}>
                    <Text style={styles.tipsTitle}>{t('betslip.tips.title')}</Text>
                    <Text style={styles.tip}>{t('betslip.tips.targetOdds')}</Text>
                    <Text style={styles.tip}>{t('betslip.tips.maxOdd')}</Text>
                    <Text style={styles.tip}>{t('betslip.tips.aiConfidence')}</Text>
                    <Text style={styles.tip}>{t('betslip.tips.successRate')}</Text>
                    <Text style={styles.tip}>
                      {isAuthenticated 
                        ? hasFullAccess() 
                          ? t('betslip.tips.proSubscription') 
                          : t('betslip.tips.creditsNeeded', { credits: CREDITS_REQUIRED })
                        : t('betslip.tips.loginToGenerate')
                      }
                    </Text>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            )}
          </View>
        </View>
        
        {/* Credit Modal */}
        {renderCreditModal()}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body.fontSize,
    marginBottom: theme.spacing.sm,
  },
  authStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.cardElevated,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.md,
    alignSelf: 'flex-start',
  },
  authStatusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  // Credit Warning Styles
  creditWarning: {
    backgroundColor: '#ff9500',
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  creditWarningContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  creditWarningText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  creditWarningActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  creditWarningCloseBtn: {
    padding: 4,
  },
  creditWarningAction: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  creditWarningActionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  inputSection: {
    backgroundColor: theme.colors.cardBackground,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  inputContainer: {
    marginBottom: theme.spacing.lg,
  },
  inputLabel: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body.fontSize,
    marginBottom: theme.spacing.sm,
  },
  // FIXED Input Styles - prevents white background issue
  inputWrapper: {
    position: 'relative',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  inputWrapperError: {
    borderColor: '#ff3b30',
    backgroundColor: '#fff0f0',
  },
  input: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    color: theme.colors.textPrimary,
    fontSize: 18,
    fontWeight: '600',
    backgroundColor: 'transparent',
  },
  inputError: {
    color: '#ff3b30',
  },
  errorIcon: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 12,
    marginTop: 8,
    fontWeight: '500',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  button: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  clearButton: {
    backgroundColor: theme.colors.cardElevated,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  clearButtonText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
  },
  generateButton: {
    backgroundColor: theme.colors.accent,
  },
  generateButtonDisabled: {
    backgroundColor: theme.colors.textMuted,
    opacity: 0.7,
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
  },
  spinningIcon: {
    marginRight: 4,
  },
  resultsSection: {
    flex: 1,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  resultsTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.title.fontSize,
    fontWeight: '700',
  },
  loginTipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: `${theme.colors.accent}15`,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  loginTipText: {
    color: theme.colors.accent,
    fontSize: 12,
    fontWeight: '600',
  },
  betslipsList: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 100,
  },
  betslipWrapper: {
    position: 'relative',
  },
  betslipDivider: {
    height: 20,
    borderLeftWidth: 2,
    borderLeftColor: theme.colors.border,
    borderStyle: 'dashed',
    marginLeft: 20,
    marginBottom: -10,
    marginTop: -10,
    zIndex: 1,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
    marginHorizontal: theme.spacing.lg,
  },
  loadingSpinner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  loadingText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body.fontSize,
    marginBottom: theme.spacing.sm,
  },
  loadingSubtext: {
    color: theme.colors.textMuted,
    fontSize: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
    marginHorizontal: theme.spacing.lg,
  },
  emptyStateTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.title.fontSize,
    fontWeight: '600',
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  emptyStateText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body.fontSize,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: theme.spacing.xl,
  },
  tipsContainer: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    width: '100%',
    ...theme.shadows.medium,
  },
  tipsTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.subtitle.fontSize,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
  },
  tip: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body.fontSize,
    marginBottom: 4,
    paddingLeft: 4,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    width: '100%',
    maxWidth: 400,
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
  modalTitle: {
    color: theme.colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  modalClose: {
    padding: 4,
  },
  modalBody: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  modalIcon: {
    marginBottom: theme.spacing.lg,
  },
  modalText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body.fontSize,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: theme.spacing.xl,
  },
  modalActions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  modalButtonSecondary: {
    backgroundColor: theme.colors.cardElevated,
  },
  modalButtonSecondaryText: {
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  modalButtonPrimary: {
    backgroundColor: theme.colors.accent,
  },
  modalButtonPrimaryText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default BetslipGenerator;