import React, { useState } from 'react';
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
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useApp } from '../context/AppContext';

export default function EditProfileScreen({ navigation }) {
  const { user, updateProfile } = useApp();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9+\-\s]{8,15}$/;

    if (!name.trim()) {
      newErrors.name = 'Name cannot be empty';
    }

    if (!email.trim()) {
      newErrors.email = 'Email cannot be empty';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Phone number cannot be empty';
    } else if (!phoneRegex.test(phone.trim())) {
      newErrors.phone = 'Enter a valid phone number';
    }

    if (!address.trim()) {
      newErrors.address = 'Delivery address cannot be empty';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      updateProfile({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim(),
      });
      navigation.goBack();
    }
  };

  const handleResetToDemo = () => {
    setName('Priya Sharma');
    setEmail('priya.customer@example.com');
    setPhone('+91 98765 43210');
    setAddress('14/B Green Garden, RVS College Road, Sulur, Coimbatore - 641402');
    setErrors({});
  };

  // Restrict Edit Profile to Customer Only as per Exam Requirement
  if (user?.role !== 'Customer') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={colors.textDark} />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>Edit Profile (Customer Only)</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.restrictedContainer}>
          <View style={styles.restrictedIconBox}>
            <Ionicons name="shield-checkmark" size={54} color={colors.accent} />
          </View>
          <Text style={styles.restrictedTitle}>Customer Only Feature</Text>
          <Text style={styles.restrictedSubText}>
            As per College Examination specifications, Edit Profile is strictly reserved for Customer accounts.
            {"\n\n"}
            Store Administrator (Gokul) credentials are permanent and protected by system security.
          </Text>

          <TouchableOpacity
            style={styles.backProfileBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.85}
          >
            <Ionicons name="arrow-back" size={18} color={colors.white} style={{ marginRight: 6 }} />
            <Text style={styles.backProfileBtnText}>Back to Profile</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      {/* Top Header */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Edit Customer Profile</Text>
        <TouchableOpacity onPress={handleResetToDemo}>
          <Text style={styles.resetLink}>Reset</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Note */}
          <View style={styles.noteBanner}>
            <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
            <Text style={styles.noteBannerText}>
              Update your delivery and contact information below. Changes reflect across your orders immediately.
            </Text>
          </View>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            {/* Full Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Customer Full Name *</Text>
              <View
                style={[
                  styles.inputWrapper,
                  errors.name && styles.inputWrapperError,
                ]}
              >
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={errors.name ? colors.danger : colors.textLight}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    if (errors.name) setErrors({ ...errors, name: null });
                  }}
                  placeholder="Enter your name"
                />
              </View>
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            {/* Email Address */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address *</Text>
              <View
                style={[
                  styles.inputWrapper,
                  errors.email && styles.inputWrapperError,
                ]}
              >
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={errors.email ? colors.danger : colors.textLight}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errors.email) setErrors({ ...errors, email: null });
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholder="Enter email address"
                />
              </View>
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            {/* Phone Number */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number *</Text>
              <View
                style={[
                  styles.inputWrapper,
                  errors.phone && styles.inputWrapperError,
                ]}
              >
                <Ionicons
                  name="call-outline"
                  size={20}
                  color={errors.phone ? colors.danger : colors.textLight}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={(text) => {
                    setPhone(text);
                    if (errors.phone) setErrors({ ...errors, phone: null });
                  }}
                  keyboardType="phone-pad"
                  placeholder="Enter phone number"
                />
              </View>
              {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
            </View>

            {/* Delivery Address */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Delivery Address *</Text>
              <View
                style={[
                  styles.inputWrapper,
                  styles.addressWrapper,
                  errors.address && styles.inputWrapperError,
                ]}
              >
                <Ionicons
                  name="location-outline"
                  size={20}
                  color={errors.address ? colors.danger : colors.textLight}
                  style={[styles.inputIcon, { marginTop: 12 }]}
                />
                <TextInput
                  style={[styles.input, styles.addressInput]}
                  value={address}
                  onChangeText={(text) => {
                    setAddress(text);
                    if (errors.address) setErrors({ ...errors, address: null });
                  }}
                  multiline
                  placeholder="Door No, Street Name, Sulur, Coimbatore..."
                />
              </View>
              {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
            </View>

            {/* Save Changes Button */}
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              activeOpacity={0.85}
            >
              <Ionicons name="checkmark-done" size={20} color={colors.white} style={{ marginRight: 6 }} />
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textDark,
  },
  resetLink: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
    padding: 6,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  noteBanner: {
    flexDirection: 'row',
    backgroundColor: colors.primarySoft,
    padding: 14,
    borderRadius: 14,
    marginBottom: 20,
    alignItems: 'center',
  },
  noteBannerText: {
    flex: 1,
    fontSize: 12,
    color: colors.primaryDark,
    lineHeight: 18,
    marginLeft: 8,
  },
  formContainer: {},
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 50,
  },
  addressWrapper: {
    height: 80,
    alignItems: 'flex-start',
  },
  addressInput: {
    height: 72,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  inputWrapperError: {
    borderColor: colors.danger,
    backgroundColor: colors.dangerLight,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.textDark,
  },
  errorText: {
    fontSize: 12,
    color: colors.danger,
    marginTop: 4,
    marginLeft: 4,
  },
  saveButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 10,
    elevation: 3,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
  cancelButton: {
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 6,
  },
  cancelButtonText: {
    fontSize: 14,
    color: colors.textMedium,
    fontWeight: '600',
  },
  restrictedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    marginTop: 40,
  },
  restrictedIconBox: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#FED7AA',
  },
  restrictedTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textDark,
    marginBottom: 12,
    textAlign: 'center',
  },
  restrictedSubText: {
    fontSize: 14,
    color: colors.textMedium,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  backProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
    elevation: 2,
  },
  backProfileBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.white,
  },
});
