// app/components/TopEventsCarousel.jsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { theme } from '../constants/theme';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = screenWidth * 0.8;
const CARD_MARGIN = 10;
const SPACER_WIDTH = (screenWidth - CARD_WIDTH) / 2;

const TopEventsCarousel = ({ matches, onMatchPress }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);

  // Auto-scroll effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (flatListRef.current && matches.length > 1) {
        const nextIndex = (activeIndex + 1) % matches.length;
        setActiveIndex(nextIndex);
        flatListRef.current.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
      }
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [activeIndex, matches.length]);

  const renderItem = ({ item, index }) => {
    // Check if this is a spacer item (first or last)
    if (index === 0 || index === matches.length + 1) {
      return <View style={{ width: SPACER_WIDTH }} />;
    }

    // Get the actual match data (adjust index for spacer)
    const matchIndex = index - 1;
    const match = matches[matchIndex];

    // Safety check
    if (!match || !match.team1 || !match.team2) {
      return <View style={[styles.carouselCard, { backgroundColor: theme.colors.cardBackground }]} />;
    }

    return (
      <TouchableOpacity
        style={styles.carouselCard}
        onPress={() => onMatchPress(match)}
        activeOpacity={0.9}
      >
        {/* League Header */}
        <View style={styles.carouselLeagueHeader}>
          <Text style={styles.carouselLeagueName}>{match.league}</Text>
          <View style={[
            styles.statusBadge,
            { 
              backgroundColor: 
                match.status === 'LIVE' ? theme.colors.liveStatus :
                match.status === 'UPCOMING' ? theme.colors.upcomingStatus :
                theme.colors.finishedStatus
            }
          ]}>
            <Text style={styles.statusBadgeText}>{match.status}</Text>
          </View>
        </View>

        {/* Teams */}
        <View style={styles.carouselTeams}>
          <View style={styles.carouselTeam}>
            <Text style={styles.carouselTeamName} numberOfLines={1}>
              {match.team1.shortName}
            </Text>
            <Text style={styles.carouselTeamForm}>{match.team1.form.split('-')[0]}</Text>
          </View>

          <View style={styles.carouselCenter}>
            <Text style={styles.carouselVs}>VS</Text>
            {match.status === 'LIVE' ? (
              <Text style={styles.carouselScore}>
                {match.team1.score} - {match.team2.score}
              </Text>
            ) : (
              <Text style={styles.carouselTime}>{match.time}</Text>
            )}
          </View>

          <View style={styles.carouselTeam}>
            <Text style={styles.carouselTeamName} numberOfLines={1}>
              {match.team2.shortName}
            </Text>
            <Text style={styles.carouselTeamForm}>{match.team2.form.split('-')[0]}</Text>
          </View>
        </View>

        {/* Top Prediction */}
        <View style={styles.topPrediction}>
          <Text style={styles.topPredictionLabel}>Top Prediction:</Text>
          <View style={styles.predictionBadge}>
            <Text style={styles.predictionText}>
              {match.predictions.homeWin > match.predictions.awayWin 
                ? `${match.team1.shortName} Win`
                : `${match.team2.shortName} Win`}
            </Text>
            <Text style={styles.predictionValue}>
              {Math.max(match.predictions.homeWin, match.predictions.awayWin)}%
            </Text>
          </View>
        </View>

        {/* Key Stats */}
        <View style={styles.keyStats}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Over 2.5</Text>
            <Text style={[
              styles.statValue,
              { color: match.predictions.over25Goals >= 60 ? theme.colors.highProbability : theme.colors.mediumProbability }
            ]}>
              {match.predictions.over25Goals}%
            </Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>BTTS Yes</Text>
            <Text style={[
              styles.statValue,
              { color: match.predictions.bttsYes >= 60 ? theme.colors.highProbability : theme.colors.mediumProbability }
            ]}>
              {match.predictions.bttsYes}%
            </Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>AI Confidence</Text>
            <Text style={[
              styles.statValue,
              { 
                color: 
                  match.predictions.confidence >= 80 ? theme.colors.highProbability :
                  match.predictions.confidence >= 60 ? theme.colors.mediumProbability :
                  theme.colors.lowProbability
              }
            ]}>
              {match.predictions.confidence}%
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const getItemLayout = (data, index) => {
    const length = CARD_WIDTH + (CARD_MARGIN * 2);
    return {
      length,
      offset: length * index,
      index,
    };
  };

  // Create data array with spacers
  const carouselData = [
    { id: 'left-spacer', isSpacer: true },
    ...matches,
    { id: 'right-spacer', isSpacer: true },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Top Events</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={carouselData}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id || index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + CARD_MARGIN * 2}
        snapToAlignment="center"
        decelerationRate="fast"
        contentContainerStyle={styles.carouselContent}
        getItemLayout={getItemLayout}
        initialScrollIndex={1}
        onMomentumScrollEnd={(event) => {
          const contentOffsetX = event.nativeEvent.contentOffset.x;
          const index = Math.round((contentOffsetX - SPACER_WIDTH) / (CARD_WIDTH + CARD_MARGIN * 2));
          if (index >= 0 && index < matches.length) {
            setActiveIndex(index);
          }
        }}
      />

      {/* Indicators */}
      {matches.length > 1 && (
        <View style={styles.indicators}>
          {matches.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                index === activeIndex && styles.indicatorActive,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.title.fontSize,
    fontWeight: '700',
  },
  seeAll: {
    color: theme.colors.accent,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
  },
  carouselContent: {
    alignItems: 'center',
  },
  carouselCard: {
    width: CARD_WIDTH,
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginHorizontal: CARD_MARGIN,
    ...theme.shadows.medium,
  },
  carouselLeagueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  carouselLeagueName: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  statusBadgeText: {
    color: '#FFFFFF',
    fontSize: theme.typography.small.fontSize,
    fontWeight: '600',
  },
  carouselTeams: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  carouselTeam: {
    flex: 1,
    alignItems: 'center',
  },
  carouselTeamName: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.subtitle.fontSize,
    fontWeight: '700',
    marginBottom: 4,
  },
  carouselTeamForm: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.small.fontSize,
  },
  carouselCenter: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  carouselVs: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.small.fontSize,
    marginBottom: 4,
  },
  carouselScore: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.title.fontSize,
    fontWeight: '800',
  },
  carouselTime: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.subtitle.fontSize,
    fontWeight: '600',
  },
  topPrediction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.cardElevated,
    borderRadius: theme.borderRadius.md,
  },
  topPredictionLabel: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body.fontSize,
  },
  predictionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.accent,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.round,
  },
  predictionText: {
    color: '#FFFFFF',
    fontSize: theme.typography.small.fontSize,
    fontWeight: '600',
    marginRight: theme.spacing.xs,
  },
  predictionValue: {
    color: '#FFFFFF',
    fontSize: theme.typography.subtitle.fontSize,
    fontWeight: '800',
  },
  keyStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.small.fontSize,
    marginBottom: 4,
  },
  statValue: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: '700',
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: theme.spacing.lg,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.textMuted,
    marginHorizontal: 4,
  },
  indicatorActive: {
    backgroundColor: theme.colors.accent,
    width: 24,
  },
});

export default TopEventsCarousel;