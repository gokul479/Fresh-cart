import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useApp } from '../context/AppContext';

export default function Header({ navigation, title, showBack = false, showCart = true, showDrawer = true }) {
  const { cartCount, user } = useApp();
  const badgeScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (cartCount > 0) {
      Animated.sequence([
        Animated.timing(badgeScale, {
          toValue: 1.4,
          duration: 140,
          useNativeDriver: true,
        }),
        Animated.spring(badgeScale, {
          toValue: 1,
          friction: 4,
          tension: 60,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [cartCount]);

  return (
    <View style={styles.headerContainer}>
      <View style={styles.leftContainer}>
        {showBack ? (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={colors.textDark} />
          </TouchableOpacity>
        ) : showDrawer ? (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.openDrawer()}
            activeOpacity={0.7}
          >
            <Ionicons name="menu" size={26} color={colors.textDark} />
          </TouchableOpacity>
        ) : null}

        <View style={styles.titleWrapper}>
          {title ? (
            <Text style={styles.headerTitle} numberOfLines={1}>
              {title}
            </Text>
          ) : (
            <>
              <View style={styles.locationRow}>
                <Ionicons name="location-sharp" size={14} color={colors.primary} />
                <Text style={styles.locationText}>Sulur, Coimbatore</Text>
              </View>
              <Text style={styles.greetingText}>
                Hello, {user?.name ? user.name.split(' ')[0] : 'Shopper'} 👋
              </Text>
            </>
          )}
        </View>
      </View>

      <View style={styles.rightContainer}>
        {showCart && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => {
              navigation.navigate('My Cart');
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="cart-outline" size={24} color={colors.textDark} />
            {cartCount > 0 && (
              <Animated.View
                style={[
                  styles.badge,
                  { transform: [{ scale: badgeScale }] },
                ]}
              >
                <Text style={styles.badgeText}>{cartCount > 99 ? '99+' : cartCount}</Text>
              </Animated.View>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  titleWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: colors.textDark,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 12,
    color: colors.textMedium,
    fontWeight: '500',
    marginLeft: 3,
  },
  greetingText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDark,
    marginTop: 1,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: 3,
    right: 3,
    backgroundColor: colors.primary,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
});
