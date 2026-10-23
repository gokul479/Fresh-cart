import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows } from '../theme/colors';
import { useApp } from '../context/AppContext';

export default function WelcomeScreen({ navigation }) {
  const { user } = useApp();

  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -6,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleEnterApp = () => {
    navigation.replace('MainApp');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Brand Logo / Tag */}
        <View style={styles.header}>
          <Image
            source={require('../../assets/brand-logo.jpg')}
            style={styles.brandLogo}
          />
          <Text style={styles.brandTitle}>FreshCart</Text>
          <Text style={styles.brandSubtitle}>Daily Fresh Groceries Delivered</Text>
        </View>

        {/* Hero Fresh Grocery Image with Floating Badges */}
        <View style={styles.heroImageContainer}>
          <Image
            source={require('../../assets/welcome-hero.jpg')}
            style={styles.heroImage}
            resizeMode="cover"
          />

          {/* Floating Top-Right Rating Badge */}
          <Animated.View
            style={[
              styles.ratingFloatingTag,
              { transform: [{ translateY: floatAnim }] },
            ]}
          >
            <Ionicons name="star" size={13} color="#EAB308" />
            <Text style={styles.ratingTagText}>4.9 (1.2k+ Reviews)</Text>
          </Animated.View>

          {/* Floating Bottom-Left Express Tag */}
          <View style={styles.discountFloatingTag}>
            <Ionicons name="flash" size={16} color={colors.accent} />
            <Text style={styles.discountTagText}>⚡ 30 Min Express Delivery</Text>
          </View>
        </View>

        {/* Main Title and Description */}
        <View style={styles.textContainer}>
          <Text style={styles.mainHeading}>
            Get Fresh & Organic <Text style={styles.highlightText}>Groceries</Text> at Your Doorstep
          </Text>
          <Text style={styles.description}>
            Shop from hundreds of handpicked farm-fresh vegetables, organic fruits, daily dairy, and bakery essentials with guaranteed quality.
          </Text>
        </View>

        {/* Value Propositions */}
        <View style={styles.featuresRow}>
          <View style={styles.featureItem}>
            <View style={[styles.featureIconBox, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="shield-checkmark" size={20} color={colors.primary} />
            </View>
            <Text style={styles.featureText}>100% Organic</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={[styles.featureIconBox, { backgroundColor: colors.accentLight }]}>
              <Ionicons name="pricetag" size={20} color={colors.accent} />
            </View>
            <Text style={styles.featureText}>Best Deals</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={[styles.featureIconBox, { backgroundColor: '#E0F2FE' }]}>
              <Ionicons name="time" size={20} color="#0284C7" />
            </View>
            <Text style={styles.featureText}>Super Fast</Text>
          </View>
        </View>

        {/* Auth Action Buttons */}
        <View style={styles.actionContainer}>
          {/* Sign In Button */}
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Sign In')}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryButtonText}>Customer / Admin Sign In</Text>
            <Ionicons name="arrow-forward" size={20} color={colors.white} />
          </TouchableOpacity>

          {/* Sign Up Button */}
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Sign Up')}
            activeOpacity={0.85}
          >
            <Text style={styles.secondaryButtonText}>Create New Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  brandLogo: {
    width: 64,
    height: 64,
    borderRadius: 20,
    marginBottom: 8,
    ...shadows.sm,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 13,
    color: colors.textMedium,
    fontWeight: '500',
    marginTop: 2,
  },
  heroImageContainer: {
    width: '100%',
    height: 220,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    marginVertical: 12,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  discountFloatingTag: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.sm,
  },
  discountTagText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textDark,
    marginLeft: 4,
  },
  ratingFloatingTag: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.sm,
  },
  ratingTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textDark,
    marginLeft: 4,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  mainHeading: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.textDark,
    textAlign: 'center',
    lineHeight: 32,
  },
  highlightText: {
    color: colors.primary,
  },
  description: {
    fontSize: 14,
    color: colors.textMedium,
    textAlign: 'center',
    lineHeight: 21,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 16,
  },
  featureItem: {
    alignItems: 'center',
  },
  featureIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  featureText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textDark,
  },
  actionContainer: {
    width: '100%',
    marginTop: 10,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 3,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
    marginRight: 8,
  },
  secondaryButton: {
    backgroundColor: colors.primaryLight,
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primaryDark,
  },
});
