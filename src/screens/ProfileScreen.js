import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows } from '../theme/colors';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';

export default function ProfileScreen({ navigation }) {
  const { user, cartCount, favourites, switchRole, signOut } = useApp();

  const handleRoleToggle = () => {
    const nextRole = user?.role === 'Customer' ? 'Admin' : 'Customer';
    switchRole(nextRole);
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            signOut();
            navigation.replace('Sign In');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        navigation={navigation}
        title={user?.role === 'Admin' ? 'Admin Profile 🛡️' : 'Customer Profile 👤'}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header Card */}
        <View style={styles.profileHeaderCard}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: user?.avatar }}
              style={styles.avatarImage}
            />
            {user?.role === 'Customer' ? (
              <TouchableOpacity
                style={styles.editAvatarBadge}
                onPress={() => navigation.navigate('Edit Profile')}
              >
                <Ionicons name="pencil" size={13} color={colors.white} />
              </TouchableOpacity>
            ) : (
              <View style={[styles.editAvatarBadge, { backgroundColor: colors.accent }]}>
                <Ionicons name="shield-checkmark" size={13} color={colors.white} />
              </View>
            )}
          </View>

          <Text style={styles.userName}>{user?.name || 'Customer'}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>

          {/* Role and Status Badges */}
          <View style={styles.badgesRow}>
            <View style={styles.roleBadge}>
              <Ionicons
                name={user?.role === 'Admin' ? 'shield-checkmark' : 'person'}
                size={13}
                color={user?.role === 'Admin' ? colors.accent : colors.primaryDark}
                style={{ marginRight: 4 }}
              />
              <Text
                style={[
                  styles.roleBadgeText,
                  user?.role === 'Admin' && { color: colors.accent },
                ]}
              >
                Role: {user?.role || 'Customer'}
              </Text>
            </View>

            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={13} color={colors.success} style={{ marginRight: 3 }} />
              <Text style={styles.verifiedBadgeText}>Verified</Text>
            </View>
          </View>

          {/* Edit Profile Quick Button (Customer Only) or Protected Info (Admin) */}
          {user?.role === 'Customer' ? (
            <TouchableOpacity
              style={styles.editProfileBtn}
              onPress={() => navigation.navigate('Edit Profile')}
              activeOpacity={0.8}
            >
              <Ionicons name="create-outline" size={16} color={colors.primary} style={{ marginRight: 6 }} />
              <Text style={styles.editProfileBtnText}>Edit Profile Information</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.adminProtectedBox}>
              <Ionicons name="lock-closed" size={14} color={colors.accent} style={{ marginRight: 6 }} />
              <Text style={styles.adminProtectedText}>
                Store Admin (Gokul) Profile is Protected & Read-Only
              </Text>
            </View>
          )}
        </View>

        {/* Quick Stats Grid */}
        <View style={styles.statsContainer}>
          <TouchableOpacity
            style={styles.statCard}
            onPress={() => navigation.navigate('My Cart')}
            activeOpacity={0.8}
          >
            <View style={[styles.statIconBox, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="cart" size={20} color={colors.primary} />
            </View>
            <Text style={styles.statNumber}>{cartCount}</Text>
            <Text style={styles.statLabel}>Cart Items</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statCard}
            onPress={() => navigation.navigate('Favourite')}
            activeOpacity={0.8}
          >
            <View style={[styles.statIconBox, { backgroundColor: colors.dangerLight }]}>
              <Ionicons name="heart" size={20} color={colors.danger} />
            </View>
            <Text style={styles.statNumber}>{favourites.length}</Text>
            <Text style={styles.statLabel}>Favourites</Text>
          </TouchableOpacity>

          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: '#E0F2FE' }]}>
              <Ionicons name="bag-check" size={20} color="#0284C7" />
            </View>
            <Text style={styles.statNumber}>14</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
        </View>

        {/* Customer Information Card (Dynamic for Admin vs Customer) */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionCardTitle}>
            {user?.role === 'Admin' ? 'Administrator Credentials' : 'Personal Details'}
          </Text>

          {user?.role === 'Admin' ? (
            <>
              <View style={styles.infoRow}>
                <View style={[styles.infoIconBox, { backgroundColor: colors.accentLight }]}>
                  <Ionicons name="shield-checkmark" size={18} color={colors.accent} />
                </View>
                <View style={styles.infoTextWrapper}>
                  <Text style={styles.infoLabel}>System Role</Text>
                  <Text style={styles.infoValue}>Super Administrator / Store Manager</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={[styles.infoIconBox, { backgroundColor: colors.accentLight }]}>
                  <Ionicons name="business-outline" size={18} color={colors.accent} />
                </View>
                <View style={styles.infoTextWrapper}>
                  <Text style={styles.infoLabel}>Assigned Store Hub</Text>
                  <Text style={styles.infoValue}>Sulur Express Supermarket, CBE</Text>
                </View>
              </View>
            </>
          ) : (
            <>
              <View style={styles.infoRow}>
                <View style={styles.infoIconBox}>
                  <Ionicons name="call-outline" size={18} color={colors.primary} />
                </View>
                <View style={styles.infoTextWrapper}>
                  <Text style={styles.infoLabel}>Phone Number</Text>
                  <Text style={styles.infoValue}>{user?.phone || 'Not provided'}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.infoIconBox}>
                  <Ionicons name="location-outline" size={18} color={colors.primary} />
                </View>
                <View style={styles.infoTextWrapper}>
                  <Text style={styles.infoLabel}>Delivery Address</Text>
                  <Text style={styles.infoValue}>{user?.address || 'Sulur, Coimbatore'}</Text>
                </View>
              </View>
            </>
          )}
        </View>

        {/* Account Settings Menu */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionCardTitle}>Account & Settings</Text>

          {/* Edit Profile Menu Item (Customer Only) or Manage Products (Admin) */}
          {user?.role === 'Customer' ? (
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('Edit Profile')}
            >
              <Ionicons name="person-circle-outline" size={22} color={colors.textDark} />
              <Text style={styles.menuItemText}>Edit Profile (Customer Only)</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textLight} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('Products')}
            >
              <Ionicons name="storefront-outline" size={22} color={colors.accent} />
              <Text style={styles.menuItemText}>Manage Products (Admin Action)</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textLight} />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('Favourite')}
          >
            <Ionicons name="heart-outline" size={22} color={colors.textDark} />
            <Text style={styles.menuItemText}>My Favourites</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textLight} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('My Cart')}
          >
            <Ionicons name="cart-outline" size={22} color={colors.textDark} />
            <Text style={styles.menuItemText}>My Cart</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textLight} />
          </TouchableOpacity>

          {/* Role Toggle Item for Examiner Demo */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleRoleToggle}
          >
            <Ionicons name="swap-horizontal-outline" size={22} color={colors.accent} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.menuItemText}>Switch User Role</Text>
              <Text style={styles.menuItemSub}>
                Active: {user?.role} ({user?.name}). Tap for {user?.role === 'Customer' ? 'Admin (Gokul)' : 'Customer (Kishore)'}
              </Text>
            </View>
            <View style={styles.toggleBadge}>
              <Text style={styles.toggleBadgeText}>Toggle</Text>
            </View>
          </TouchableOpacity>

          {/* Sign Out */}
          <TouchableOpacity
            style={[styles.menuItem, { borderBottomWidth: 0 }]}
            onPress={handleSignOut}
          >
            <Ionicons name="log-out-outline" size={22} color={colors.danger} />
            <Text style={[styles.menuItemText, { color: colors.danger }]}>Sign Out</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.danger} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  profileHeaderCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatarImage: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: colors.primaryLight,
  },
  editAvatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textDark,
  },
  userEmail: {
    fontSize: 13,
    color: colors.textMedium,
    marginTop: 2,
  },
  badgesRow: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.success,
  },
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 16,
  },
  editProfileBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  adminProtectedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  adminProtectedText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.accent,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  statIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textDark,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textMedium,
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 16,
    marginTop: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  sectionCardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textDark,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  infoIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoTextWrapper: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: colors.textLight,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textDark,
    marginTop: 2,
    lineHeight: 18,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textDark,
    marginLeft: 12,
    flex: 1,
  },
  menuItemSub: {
    fontSize: 11,
    color: colors.textLight,
    marginTop: 2,
  },
  toggleBadge: {
    backgroundColor: colors.accentLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  toggleBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.accent,
  },
});
