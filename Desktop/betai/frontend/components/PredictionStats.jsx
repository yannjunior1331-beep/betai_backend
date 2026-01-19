// app/components/PredictionStats.jsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { theme } from '../constants/theme';

const PredictionStats = ({ predictions }) => {
  const ProbabilityBar = ({ label, value, color }) => {
    return (
      <View style={styles.probabilityRow}>
        <View style={styles.probabilityInfo}>
          <Text style={styles.probabilityLabel}>{label}</Text>
          <Text style={styles.probabilityValue}>{value}%</Text>
        </View>
        <View style={styles.barContainer}>
          <View 
            style={[
              styles.barFill, 
              { 
                width: `${value}%`,
                backgroundColor: color
              }
            ]} 
          />
        </View>
      </View>
    );
  };

  const getOutcomeColor = (value) => {
    if (value >= 60) return theme.colors.highProbability;
    if (value >= 40) return theme.colors.mediumProbability;
    return theme.colors.lowProbability;
  };

  const getStatColor = (value) => {
    if (value >= 70) return theme.colors.highProbability;
    if (value >= 40) return theme.colors.mediumProbability;
    return theme.colors.lowProbability;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Match Predictions</Text>
      
      {/* Main Outcomes */}
      <View style={styles.outcomeContainer}>
        <ProbabilityBar 
          label="Home Win" 
          value={predictions.homeWin} 
          color={getOutcomeColor(predictions.homeWin)}
        />
        <ProbabilityBar 
          label="Draw" 
          value={predictions.draw} 
          color={theme.colors.neutralProbability}
        />
        <ProbabilityBar 
          label="Away Win" 
          value={predictions.awayWin} 
          color={getOutcomeColor(predictions.awayWin)}
        />
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Over 2.5</Text>
          <Text style={[
            styles.statValue,
            { color: getStatColor(predictions.over25Goals) }
          ]}>
            {predictions.over25Goals}%
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Under 2.5</Text>
          <Text style={[
            styles.statValue,
            { color: getStatColor(predictions.under25Goals) }
          ]}>
            {predictions.under25Goals}%
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>BTTS Yes</Text>
          <Text style={[
            styles.statValue,
            { color: getStatColor(predictions.bttsYes) }
          ]}>
            {predictions.bttsYes}%
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>BTTS No</Text>
          <Text style={[
            styles.statValue,
            { color: getStatColor(predictions.bttsNo) }
          ]}>
            {predictions.bttsNo}%
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>CS Home</Text>
          <Text style={[
            styles.statValue,
            { color: getStatColor(predictions.cleanSheetHome) }
          ]}>
            {predictions.cleanSheetHome}%
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>CS Away</Text>
          <Text style={[
            styles.statValue,
            { color: getStatColor(predictions.cleanSheetAway) }
          ]}>
            {predictions.cleanSheetAway}%
          </Text>
        </View>
      </View>

      {/* Most Likely Score */}
      <View style={styles.scorePrediction}>
        <Text style={styles.scoreLabel}>Most Likely Score:</Text>
        <View style={styles.scoreBadge}>
          <Text style={styles.scoreText}>{predictions.mostLikelyScore}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.cardElevated,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.subtitle.fontSize,
    fontWeight: '600',
    marginBottom: theme.spacing.lg,
  },
  outcomeContainer: {
    marginBottom: theme.spacing.lg,
  },
  probabilityRow: {
    marginBottom: theme.spacing.sm,
  },
  probabilityInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  probabilityLabel: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body.fontSize,
  },
  probabilityValue: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
  },
  barContainer: {
    height: 6,
    backgroundColor: theme.colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  statItem: {
    width: '48%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.sm,
  },
  statLabel: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.small.fontSize,
  },
  statValue: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
  },
  scorePrediction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  scoreLabel: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body.fontSize,
  },
  scoreBadge: {
    backgroundColor: theme.colors.accent,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.round,
  },
  scoreText: {
    color: '#FFFFFF',
    fontSize: theme.typography.subtitle.fontSize,
    fontWeight: '800',
  },
});

export default PredictionStats;