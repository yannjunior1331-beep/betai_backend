import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../constants/theme';
import PredictionStats from './PredictionStats';

const MatchPredictionCard = ({ match, onPress }) => {
  if (!match) return null;

  const team1Form = match.team1?.form || '';
  const team2Form = match.team2?.form || '';

  const getStatusColor = (status) => {
    switch (status) {
      case 'LIVE': return theme.colors.liveStatus;
      case 'UPCOMING': return theme.colors.upcomingStatus;
      case 'FINISHED': return theme.colors.finishedStatus;
      default: return theme.colors.textSecondary;
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return theme.colors.highProbability;
    if (confidence >= 60) return theme.colors.mediumProbability;
    return theme.colors.lowProbability;
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      {/* League Header */}
      <View style={styles.leagueHeader}>
        {match.league?.logo && <Image source={{ uri: match.league.logo }} style={styles.leagueLogo} />}
        <Text style={styles.leagueName}>{match.league?.name || 'Unknown League'}</Text>
        <View style={styles.matchDayContainer}>
          <Text style={styles.matchDayText}>{match.matchDay || ''}</Text>
        </View>
      </View>

      {/* Match Info */}
      <View style={styles.matchInfo}>
        <Text style={styles.venueText}>{match.venue || ''}</Text>
        <Text style={styles.dateTimeText}>
          {match.date || ''} • {match.time || ''}
        </Text>
      </View>

      {/* Teams and Score */}
      <View style={styles.teamsContainer}>
        {/* Team 1 */}
        <View style={styles.teamColumn}>
          {match.team1?.logo && <Image source={{ uri: match.team1.logo }} style={styles.teamLogo} />}
          <Text style={styles.teamName} numberOfLines={1}>{match.team1?.name || 'Team 1'}</Text>
          {match.status === 'LIVE' && <Text style={styles.scoreText}>{match.team1?.score ?? 0}</Text>}
        </View>

        {/* Match Status */}
        <View style={styles.matchCenter}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(match.status) }]}>
            <Text style={styles.statusText}><Text style={styles.statusText}>{match.status}</Text></Text>
          </View>

          {match.status === 'LIVE' && (
            <>
              <Text style={styles.vsText}>VS</Text>
              <Text style={styles.currentScore}>
                {match.team1?.score ?? 0} : {match.team2?.score ?? 0}
              </Text>
              <Text style={styles.currentTime}>{match.currentTime || ''}</Text>
            </>
          )}

          {match.status === 'UPCOMING' && (
            <>
              <Text style={styles.vsText}>VS</Text>
              <Text style={styles.upcomingTime}>{match.time || ''}</Text>
            </>
          )}
        </View>

        {/* Team 2 */}
        <View style={styles.teamColumn}>
          {match.team2?.logo && <Image source={{ uri: match.team2.logo }} style={styles.teamLogo} />}
          <Text style={styles.teamName} numberOfLines={1}>{match.team2?.name || 'Team 2'}</Text>
          {match.status === 'LIVE' && <Text style={styles.scoreText}>{match.team2?.score ?? 0}</Text>}
        </View>
      </View>

      {/* Recent Form */}
      <View style={styles.formContainer}>
        {[team1Form, team2Form].map((formString, idx) => (
          <View key={idx} style={styles.formSection}>
            <Text style={styles.formLabel}>Form:</Text>
            <View style={styles.formBadges}>
              {formString.split('-').map((result, i) => (
                <View 
                  key={i} 
                  style={[styles.formBadge, { backgroundColor: result === 'W' ? '#22C55E' : result === 'D' ? '#FBBF24' : '#EF4444' }]}
                >
                  <Text style={styles.formBadgeText}>{result}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>

      {/* AI Confidence */}
      {match.predictions && (
        <View style={styles.confidenceContainer}>
          <Text style={styles.confidenceLabel}>AI Confidence:</Text>
          <View style={styles.confidenceBar}>
            <View style={[styles.confidenceFill, { width: `${match.predictions.confidence || 0}%`, backgroundColor: getConfidenceColor(match.predictions.confidence || 0) }]} />
          </View>
          <Text style={[styles.confidenceValue, { color: getConfidenceColor(match.predictions.confidence || 0) }]}>
            {match.predictions.confidence ?? 0}%
          </Text>
        </View>
      )}

      {/* Prediction Stats */}
      {match.predictions && <PredictionStats predictions={match.predictions} />}

      {/* AI Insights Preview */}
      {match.aiInsights?.length > 0 && (
        <View style={styles.insightsContainer}>
          <Text style={styles.insightsTitle}>AI Insight:</Text>
          <Text style={styles.insightText} numberOfLines={2}>{match.aiInsights[0]}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.sm,
    ...theme.shadows.medium,
  },
  leagueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  leagueLogo: {
    width: 20,
    height: 20,
    marginRight: theme.spacing.sm,
  },
  leagueName: {
    flex: 1,
    color: theme.colors.textPrimary,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
  },
  matchDayContainer: {
    backgroundColor: theme.colors.cardElevated,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  matchDayText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.small.fontSize,
  },
  matchInfo: {
    marginBottom: theme.spacing.lg,
  },
  venueText: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.subtitle.fontSize,
    fontWeight: '600',
    marginBottom: 2,
  },
  dateTimeText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.small.fontSize,
  },
  teamsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  teamColumn: {
    flex: 1,
    alignItems: 'center',
  },
  teamLogo: {
    width: 50,
    height: 50,
    marginBottom: theme.spacing.sm,
  },
  teamName: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
    textAlign: 'center',
    maxWidth: 100,
  },
  teamShortName: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.small.fontSize,
    marginTop: 2,
  },
  scoreText: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.title.fontSize,
    fontWeight: 'bold',
    marginTop: theme.spacing.sm,
  },
  matchCenter: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.sm,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: theme.typography.small.fontSize,
    fontWeight: '600',
  },
  vsText: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.small.fontSize,
    marginBottom: 4,
  },
  scoreContainer: {
    alignItems: 'center',
  },
  currentScore: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.header.fontSize,
    fontWeight: '800',
  },
  currentTime: {
    color: theme.colors.liveStatus,
    fontSize: theme.typography.small.fontSize,
    fontWeight: '600',
    marginTop: 2,
  },
  upcomingTime: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.subtitle.fontSize,
    fontWeight: '600',
  },
  formContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  formSection: {
    alignItems: 'center',
  },
  formLabel: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.small.fontSize,
    marginBottom: theme.spacing.xs,
  },
  formBadges: {
    flexDirection: 'row',
  },
  formBadge: {
    width: 25,
    height: 20,
    borderRadius: theme.borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 1,
  },
  formBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.cardElevated,
    borderRadius: theme.borderRadius.md,
  },
  confidenceLabel: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body.fontSize,
    marginRight: theme.spacing.md,
  },
  confidenceBar: {
    flex: 1,
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: theme.spacing.md,
  },
  confidenceFill: {
    height: '100%',
    borderRadius: 4,
  },
  confidenceValue: {
    fontSize: theme.typography.subtitle.fontSize,
    fontWeight: '600',
    minWidth: 40,
    textAlign: 'right',
  },
  insightsContainer: {
    marginTop: theme.spacing.lg,
    padding: theme.spacing.md,
    backgroundColor: `${theme.colors.accent}10`,
    borderRadius: theme.borderRadius.md,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.accent,
  },
  insightsTitle: {
    color: theme.colors.accent,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  insightText: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.body.fontSize,
    lineHeight: 20,
  },
});

export default MatchPredictionCard;