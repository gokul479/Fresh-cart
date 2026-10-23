import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function CategoryPill({ category, isSelected, onSelect }) {
  return (
    <TouchableOpacity
      style={[
        styles.pillContainer,
        isSelected && styles.pillSelected,
      ]}
      onPress={() => onSelect(category.id)}
      activeOpacity={0.8}
    >
      <Ionicons
        name={category.icon}
        size={18}
        color={isSelected ? colors.white : colors.primary}
        style={styles.icon}
      />
      <Text
        style={[
          styles.pillText,
          isSelected && styles.pillTextSelected,
        ]}
      >
        {category.name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pillContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 24,
    marginRight: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  icon: {
    marginRight: 6,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMedium,
  },
  pillTextSelected: {
    color: colors.white,
  },
});
