import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { theme } from '../constants/theme';
import { leagues } from '../constants/dummyData';

const LeagueHeader = ({ selectedLeague, onSelectLeague }) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ✅ "All" button */}
        <TouchableOpacity
          style={[
            styles.leagueButton,
            selectedLeague === 'all' && styles.leagueButtonActive,
          ]}
          onPress={() => onSelectLeague('all')}
        >
          <Text
            style={[
              styles.leagueButtonText,
              selectedLeague === 'all' && styles.leagueButtonTextActive,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>

        {/* Other leagues */}
        {leagues.map((league) => (
          <TouchableOpacity
            key={league.id}
            style={[
              styles.leagueButton,
              selectedLeague === league.id && styles.leagueButtonActive,
            ]}
            onPress={() => onSelectLeague(league.id)}
          >
            <Text
              style={[
                styles.leagueButtonText,
                selectedLeague === league.id && styles.leagueButtonTextActive,
              ]}
            >
              {league.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.cardBackground,
    paddingVertical: theme.spacing.sm,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
  },
  leagueButton: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    marginRight: theme.spacing.md,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.background,
  },
  leagueButtonActive: {
    backgroundColor: theme.colors.accent,
  },
  leagueButtonText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '500',
  },
  leagueButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default LeagueHeader;
