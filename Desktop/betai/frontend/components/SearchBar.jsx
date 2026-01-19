import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { theme } from '../constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';

const SearchBar = ({
  value,
  onChangeText,
  placeholder = 'Search matches, teams...',
  onClear,
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.searchBox,
          focused && styles.focusedBox,
        ]}
      >
        {/* Search Icon */}
        <Ionicons
          name="search"
          size={18}
          color={theme.colors.textMuted}
          style={styles.leftIcon}
        />

        {/* Input */}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textMuted}
          style={styles.input}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />

        {/* Clear Button */}
        {!!value && (
          <TouchableOpacity
            onPress={() => {
              onChangeText('');
              onClear?.();
            }}
          >
            <Ionicons
              name="close-circle"
              size={18}
              color={theme.colors.textMuted}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.md,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.round,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    ...theme.shadows.small,
  },
  focusedBox: {
    borderWidth: 1,
    borderColor: theme.colors.accent,
  },
  leftIcon: {
    marginRight: theme.spacing.sm,
  },
  input: {
    flex: 1,
    color: theme.colors.textPrimary,
    fontSize: theme.typography.body.fontSize,
  },
});

export default SearchBar;
