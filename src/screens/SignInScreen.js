import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Image,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows } from '../theme/colors';
import { useApp } from '../context/AppContext';

const { width } = Dimensions.get('window');

export default function SignInScreen({ navigation }) {
  const { signIn, showToast } = useApp();

  const [selectedPersona, setSelectedPersona] = useState('kishore'); // 'kishore' | 'madan' | 'gokul'
  const [email, setEmail] = useState('kishore.customer@example.com');
  const [password, setPassword] = useState('kishore123');
  const [selectedRole, setSelectedRole] = useState('Customer'); // 'Customer' | 'Admin'
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [focusedField, setFocusedField] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Animations
  const floatAnim = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const roleSlide = useRef(new Animated.Value(0)).current; // 0: Customer, 1: Admin
  const cardScaleKishore = useRef(new Animated.Value(1)).current;
  const cardScaleMadan = useRef(new Animated.Value(1)).current;
  const cardScaleAdmin = useRef(new Animated.Value(1)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Gentle floating looping animation for grocery badges
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -8,
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

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim2, {
          toValue: 8,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim2, {
          toValue: 0,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const selectPersona = (personaKey) => {
    setSelectedPersona(personaKey);
    setErrors({});

    if (personaKey === 'kishore') {
      setSelectedRole('Customer');
      setEmail('kishore.customer@example.com');
      setPassword('kishore123');
      bounceCard(cardScaleKishore);
      Animated.spring(roleSlide, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: false,
      }).start();
    } else if (personaKey === 'madan') {
      setSelectedRole('Customer');
      setEmail('madan.customer@example.com');
      setPassword('madan123');
      bounceCard(cardScaleMadan);
      Animated.spring(roleSlide, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: false,
      }).start();
    } else if (personaKey === 'gokul') {
      setSelectedRole('Admin');
      setEmail('gokul.admin@groceryapp.com');
      setPassword('gokul123');
      bounceCard(cardScaleAdmin);
      Animated.spring(roleSlide, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: false,
      }).start();
    }
  };

  const switchRole = (role) => {
    if (role === 'Customer') {
      selectPersona(selectedPersona === 'madan' ? 'madan' : 'kishore');
    } else {
      selectPersona('gokul');
    }
  };

  const bounceCard = (scaleRef) => {
    Animated.sequence([
      Animated.timing(scaleRef, {
        toValue: 0.94,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleRef, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 4) {
      newErrors.password = 'Password must be at least 4 characters';
    }

    if (selectedRole === 'Admin') {
      if (email.trim().toLowerCase() !== 'gokul.admin@groceryapp.com') {
        newErrors.email = 'Admin Email: gokul.admin@groceryapp.com';
      }
      if (password !== 'gokul123') {
        newErrors.password = 'Admin Password: gokul123';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = () => {
    if (!validate()) return;

    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      signIn(email, password, selectedRole);
      navigation.replace('MainApp');
    }, 450);
  };

  const isCustomer = selectedRole === 'Customer';
  const roleColor = isCustomer ? colors.primary : colors.accent;

  // Interpolated background color for role slider
  const sliderPosition = roleSlide.interpolate({
    inputRange: [0, 1],
    outputRange: [4, (width - 48) / 2],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={isCustomer ? colors.primaryDark : '#C2410C'}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Creative Curved Hero Header with Floating Badges */}
          <View
            style={[
              styles.heroBanner,
              { backgroundColor: isCustomer ? colors.primaryDark : '#9A3412' },
            ]}
          >
            {/* Top Navigation Row inside Hero */}
            <View style={styles.heroTopBar}>
              <TouchableOpacity
                style={styles.heroBackBtn}
                onPress={() => navigation.goBack()}
                activeOpacity={0.7}
              >
                <Ionicons name="chevron-back" size={22} color={colors.white} />
              </TouchableOpacity>

              <View style={styles.hubBadge}>
                <Ionicons name="radio" size={12} color="#4ADE80" />
                <Text style={styles.hubBadgeText}>Sulur Hub Online</Text>
              </View>
            </View>

            {/* Brand Title with Custom 3D Logo */}
            <View style={styles.heroBrandRow}>
              <Image
                source={require('../../assets/brand-logo.jpg')}
                style={styles.heroLogoImage}
              />
              <View>
                <Text style={styles.heroAppName}>FreshCart</Text>
                <Text style={styles.heroSubText}>
                  {isCustomer ? 'Premium Customer Portal' : 'Store Administrator Console'}
                </Text>
              </View>
            </View>

            {/* Creative Floating Food Emojis / Chips */}
            <Animated.View
              style={[
                styles.floatingChip,
                styles.floatingChipLeft,
                { transform: [{ translateY: floatAnim }] },
              ]}
            >
              <Text style={styles.emojiText}>🥑</Text>
              <Text style={styles.floatingChipLabel}>100% Organic</Text>
            </Animated.View>

            <Animated.View
              style={[
                styles.floatingChip,
                styles.floatingChipRight,
                { transform: [{ translateY: floatAnim2 }] },
              ]}
            >
              <Text style={styles.emojiText}>⚡</Text>
              <Text style={styles.floatingChipLabel}>30 Min Express</Text>
            </Animated.View>
          </View>

          {/* Overlapping Main Content Sheet */}
          <View style={styles.contentSheet}>
            {/* Modern Sliding Role Toggle */}
            <View style={styles.sliderContainer}>
              <Animated.View
                style={[
                  styles.activeSliderIndicator,
                  {
                    left: sliderPosition,
                    backgroundColor: roleColor,
                  },
                ]}
              />

              <TouchableOpacity
                style={styles.sliderTab}
                onPress={() => switchRole('Customer')}
                activeOpacity={0.9}
              >
                <Ionicons
                  name="bag-handle"
                  size={16}
                  color={isCustomer ? colors.white : colors.textMedium}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={[
                    styles.sliderTabText,
                    isCustomer && styles.sliderTabTextActive,
                  ]}
                >
                  Customer Mode
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.sliderTab}
                onPress={() => switchRole('Admin')}
                activeOpacity={0.9}
              >
                <Ionicons
                  name="shield-checkmark"
                  size={16}
                  color={!isCustomer ? colors.white : colors.textMedium}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={[
                    styles.sliderTabText,
                    !isCustomer && styles.sliderTabTextActive,
                  ]}
                >
                  Admin Mode
                </Text>
              </TouchableOpacity>
            </View>

            {/* VIP 1-Tap Persona Cards */}
            <View style={styles.personaSection}>
              <Text style={styles.sectionHeaderTitle}>
                CHOOSE ONE-TAP LOGIN PROFILE
              </Text>

              <View style={styles.personaRow}>
                {/* Kishore Card */}
                <Animated.View
                  style={[
                    { flex: 1 },
                    { transform: [{ scale: cardScaleKishore }] },
                  ]}
                >
                  <TouchableOpacity
                    style={[
                      styles.personaCard,
                      selectedPersona === 'kishore' && styles.personaCardActiveCustomer,
                    ]}
                    onPress={() => selectPersona('kishore')}
                    activeOpacity={0.85}
                  >
                    <View style={styles.personaAvatarContainer}>
                      <Image
                        source={{
                          uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
                        }}
                        style={styles.personaAvatar}
                      />
                      <View style={[styles.avatarStatusDot, { backgroundColor: colors.primary }]} />
                    </View>

                    <Text style={styles.personaName} numberOfLines={1}>
                      Kishore
                    </Text>
                    <View style={styles.roleBadgeCustomer}>
                      <Text style={styles.roleBadgeTextCustomer}>⭐ Customer</Text>
                    </View>
                    <Text style={styles.personaHint} numberOfLines={1}>Auto Kishore</Text>

                    {selectedPersona === 'kishore' && (
                      <View style={[styles.checkPill, { backgroundColor: colors.primary }]}>
                        <Ionicons name="checkmark-circle" size={13} color={colors.white} />
                        <Text style={styles.checkPillText}>Active</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </Animated.View>

                {/* Madan Card */}
                <Animated.View
                  style={[
                    { flex: 1 },
                    { transform: [{ scale: cardScaleMadan }] },
                  ]}
                >
                  <TouchableOpacity
                    style={[
                      styles.personaCard,
                      selectedPersona === 'madan' && styles.personaCardActiveCustomer,
                    ]}
                    onPress={() => selectPersona('madan')}
                    activeOpacity={0.85}
                  >
                    <View style={styles.personaAvatarContainer}>
                      <Image
                        source={{
                          uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
                        }}
                        style={styles.personaAvatar}
                      />
                      <View style={[styles.avatarStatusDot, { backgroundColor: colors.primary }]} />
                    </View>

                    <Text style={styles.personaName} numberOfLines={1}>
                      Madan
                    </Text>
                    <View style={styles.roleBadgeCustomer}>
                      <Text style={styles.roleBadgeTextCustomer}>⭐ Customer</Text>
                    </View>
                    <Text style={styles.personaHint} numberOfLines={1}>Auto Madan</Text>

                    {selectedPersona === 'madan' && (
                      <View style={[styles.checkPill, { backgroundColor: colors.primary }]}>
                        <Ionicons name="checkmark-circle" size={13} color={colors.white} />
                        <Text style={styles.checkPillText}>Active</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </Animated.View>

                {/* Gokul Card */}
                <Animated.View
                  style={[
                    { flex: 1 },
                    { transform: [{ scale: cardScaleAdmin }] },
                  ]}
                >
                  <TouchableOpacity
                    style={[
                      styles.personaCard,
                      selectedPersona === 'gokul' && styles.personaCardActiveAdmin,
                    ]}
                    onPress={() => selectPersona('gokul')}
                    activeOpacity={0.85}
                  >
                    <View style={styles.personaAvatarContainer}>
                      <Image
                        source={{
                          uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
                        }}
                        style={styles.personaAvatar}
                      />
                      <View style={[styles.avatarStatusDot, { backgroundColor: colors.accent }]} />
                    </View>

                    <Text style={styles.personaName} numberOfLines={1}>
                      Gokul
                    </Text>
                    <View style={styles.roleBadgeAdmin}>
                      <Text style={styles.roleBadgeTextAdmin}>👑 Admin</Text>
                    </View>
                    <Text style={styles.personaHint} numberOfLines={1}>Auto Admin</Text>

                    {selectedPersona === 'gokul' && (
                      <View style={[styles.checkPill, { backgroundColor: colors.accent }]}>
                        <Ionicons name="shield-checkmark" size={13} color={colors.white} />
                        <Text style={styles.checkPillText}>Active</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </Animated.View>
              </View>
            </View>

            {/* Credential Inputs */}
            <View style={styles.inputsCard}>
              {/* Email Field */}
              <View style={styles.inputGroup}>
                <View style={styles.labelRow}>
                  <Text style={styles.inputLabel}>
                    {isCustomer ? 'Customer Registered Email' : 'Admin Security Email'}
                  </Text>
                  {isCustomer ? (
                    <Text style={styles.verifiedBadge}>Verified ID</Text>
                  ) : (
                    <Text style={[styles.verifiedBadge, { color: colors.accent }]}>Root Access</Text>
                  )}
                </View>

                <View
                  style={[
                    styles.inputFieldBox,
                    focusedField === 'email' && [
                      styles.inputFieldBoxFocused,
                      { borderColor: roleColor },
                    ],
                    errors.email && styles.inputFieldBoxError,
                  ]}
                >
                  <Ionicons
                    name={isCustomer ? 'mail-outline' : 'shield-outline'}
                    size={20}
                    color={
                      errors.email
                        ? colors.danger
                        : focusedField === 'email'
                        ? roleColor
                        : colors.textLight
                    }
                    style={styles.fieldIcon}
                  />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter email address"
                    placeholderTextColor={colors.textLight}
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (errors.email) setErrors({ ...errors, email: null });
                    }}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  {email.length > 0 && (
                    <TouchableOpacity
                      onPress={() => setEmail('')}
                      style={styles.clearIconBtn}
                    >
                      <Ionicons name="close-circle" size={18} color={colors.textLight} />
                    </TouchableOpacity>
                  )}
                </View>
                {errors.email && (
                  <Text style={styles.errorText}>
                    <Ionicons name="alert-circle" size={12} color={colors.danger} /> {errors.email}
                  </Text>
                )}
              </View>

              {/* Password Field */}
              <View style={styles.inputGroup}>
                <View style={styles.labelRow}>
                  <Text style={styles.inputLabel}>Secure Password</Text>
                  <TouchableOpacity
                    onPress={() =>
                      showToast(
                        isCustomer
                          ? 'Customer Default: madan123'
                          : 'Admin Default: gokul123'
                      )
                    }
                  >
                    <Text style={[styles.forgotLink, { color: roleColor }]}>
                      Hint?
                    </Text>
                  </TouchableOpacity>
                </View>

                <View
                  style={[
                    styles.inputFieldBox,
                    focusedField === 'password' && [
                      styles.inputFieldBoxFocused,
                      { borderColor: roleColor },
                    ],
                    errors.password && styles.inputFieldBoxError,
                  ]}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={
                      errors.password
                        ? colors.danger
                        : focusedField === 'password'
                        ? roleColor
                        : colors.textLight
                    }
                    style={styles.fieldIcon}
                  />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter password"
                    placeholderTextColor={colors.textLight}
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (errors.password) setErrors({ ...errors, password: null });
                    }}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.clearIconBtn}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color={colors.textMedium}
                    />
                  </TouchableOpacity>
                </View>
                {errors.password && (
                  <Text style={styles.errorText}>
                    <Ionicons name="alert-circle" size={12} color={colors.danger} /> {errors.password}
                  </Text>
                )}
              </View>

              {/* Remember Me Row */}
              <View style={styles.optionsRow}>
                <TouchableOpacity
                  style={styles.rememberMeBtn}
                  onPress={() => setRememberMe(!rememberMe)}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.checkbox,
                      rememberMe && { backgroundColor: roleColor, borderColor: roleColor },
                    ]}
                  >
                    {rememberMe && <Ionicons name="checkmark" size={13} color={colors.white} />}
                  </View>
                  <Text style={styles.rememberMeText}>Remember session</Text>
                </TouchableOpacity>

                <View style={styles.secureBadgeRow}>
                  <Ionicons name="shield-checkmark" size={14} color={colors.success} />
                  <Text style={styles.secureBadgeText}>Encrypted</Text>
                </View>
              </View>

              {/* Main Submit Button */}
              <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                <TouchableOpacity
                  style={[
                    styles.submitBtn,
                    { backgroundColor: roleColor },
                    isSubmitting && { opacity: 0.8 },
                  ]}
                  onPress={handleSignIn}
                  disabled={isSubmitting}
                  activeOpacity={0.85}
                >
                  <Text style={styles.submitBtnText}>
                    {isSubmitting
                      ? 'Authenticating...'
                      : `Log In as ${
                          selectedPersona === 'kishore'
                            ? 'Customer (Kishore)'
                            : selectedPersona === 'madan'
                            ? 'Customer (Madan)'
                            : 'Admin (Gokul)'
                        }`}
                  </Text>
                  <Ionicons
                    name="arrow-forward-circle"
                    size={22}
                    color={colors.white}
                    style={{ marginLeft: 8 }}
                  />
                </TouchableOpacity>
              </Animated.View>
            </View>

            {/* Register New Account Link */}
            <View style={styles.signUpPromptRow}>
              <Text style={styles.signUpPromptText}>Need a new customer profile? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Sign Up')}>
                <Text style={[styles.signUpLinkText, { color: colors.primary }]}>
                  Register Free
                </Text>
              </TouchableOpacity>
            </View>

            {/* Creative Security Trust Watermark */}
            <View style={styles.securityBadge}>
              <Ionicons name="shield-checkmark" size={13} color={colors.textLight} />
              <Text style={styles.securityBadgeText}>
                256-bit SSL Encrypted • RVS Examination Model 2026
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: '#F8FAFC',
  },
  heroBanner: {
    paddingTop: 16,
    paddingBottom: 42,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    position: 'relative',
    overflow: 'hidden',
  },
  heroTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  heroBackBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hubBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  hubBadgeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 6,
  },
  quickSkipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
  },
  quickSkipText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
    marginRight: 4,
  },
  heroBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  heroLogoImage: {
    width: 52,
    height: 52,
    borderRadius: 16,
    marginRight: 14,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  heroAppName: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.white,
    letterSpacing: -0.5,
  },
  heroSubText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '500',
    marginTop: 2,
  },
  floatingChip: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    ...shadows.sm,
  },
  floatingChipLeft: {
    bottom: 12,
    left: 20,
  },
  floatingChipRight: {
    bottom: 12,
    right: 20,
  },
  emojiText: {
    fontSize: 14,
    marginRight: 4,
  },
  floatingChipLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textDark,
  },
  contentSheet: {
    marginTop: -20,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 36,
  },
  sliderContainer: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 16,
    height: 48,
    position: 'relative',
    alignItems: 'center',
    marginBottom: 16,
  },
  activeSliderIndicator: {
    position: 'absolute',
    width: (width - 48) / 2,
    height: 40,
    borderRadius: 12,
    ...shadows.sm,
  },
  sliderTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    height: '100%',
  },
  sliderTabText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMedium,
  },
  sliderTabTextActive: {
    color: colors.white,
  },
  personaSection: {
    marginBottom: 16,
  },
  sectionHeaderTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textLight,
    letterSpacing: 0.7,
    marginBottom: 8,
    marginLeft: 2,
  },
  personaRow: {
    flexDirection: 'row',
    gap: 12,
  },
  personaCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    position: 'relative',
    ...shadows.sm,
  },
  personaCardActiveCustomer: {
    borderColor: colors.primary,
    backgroundColor: '#F0FDF4',
  },
  personaCardActiveAdmin: {
    borderColor: colors.accent,
    backgroundColor: '#FFF7ED',
  },
  personaAvatarContainer: {
    position: 'relative',
    marginBottom: 6,
  },
  personaAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: colors.white,
  },
  avatarStatusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.white,
  },
  personaName: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textDark,
  },
  roleBadgeCustomer: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 3,
  },
  roleBadgeTextCustomer: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  roleBadgeAdmin: {
    backgroundColor: colors.accentLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 3,
  },
  roleBadgeTextAdmin: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.accent,
  },
  personaHint: {
    fontSize: 10,
    color: colors.textLight,
    marginTop: 4,
    fontWeight: '500',
  },
  checkPill: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 6,
    right: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  checkPillText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: '800',
    marginLeft: 2,
  },
  inputsCard: {
    backgroundColor: colors.white,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  inputGroup: {
    marginBottom: 14,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textDark,
  },
  verifiedBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
  },
  forgotLink: {
    fontSize: 11,
    fontWeight: '700',
  },
  inputFieldBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 50,
  },
  inputFieldBoxFocused: {
    backgroundColor: colors.white,
  },
  inputFieldBoxError: {
    borderColor: colors.danger,
    backgroundColor: colors.dangerLight,
  },
  fieldIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: colors.textDark,
  },
  clearIconBtn: {
    padding: 4,
  },
  errorText: {
    fontSize: 11,
    color: colors.danger,
    marginTop: 4,
    marginLeft: 4,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  rememberMeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  rememberMeText: {
    fontSize: 12,
    color: colors.textMedium,
    fontWeight: '600',
  },
  secureBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  secureBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.success,
    marginLeft: 4,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 14,
    ...shadows.md,
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.white,
  },
  signUpPromptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  signUpPromptText: {
    fontSize: 13,
    color: colors.textMedium,
  },
  signUpLinkText: {
    fontSize: 13,
    fontWeight: '800',
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    paddingVertical: 6,
  },
  securityBadgeText: {
    fontSize: 10,
    color: colors.textLight,
    fontWeight: '600',
    marginLeft: 4,
  },
});
