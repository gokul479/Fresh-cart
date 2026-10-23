import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useApp } from '../context/AppContext';

export default function CustomDrawerContent(props) {
  const { navigation } = props;
  const { user, cartCount, favourites, switchRole, switchUser, signOut } = useApp();

  const handleRoleToggle = () => {
    const nextRole = user?.role === 'Customer' ? 'Admin' : 'Customer';
    switchRole(nextRole);
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Do you want to log out from FreshCart?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => {
          signOut();
          navigation.closeDrawer();
          navigation.replace('Sign In');
        },
      },
    ]);
  };

  const menuItems = [
    {
      title: 'Home',
      icon: 'home-outline',
      targetScreen: 'Home',
      badge: null,
    },
    {
      title: 'Daily Products',
      icon: 'basket-outline',
      targetScreen: 'Products',
      badge: null,
    },
    {
      title: 'My Favourites',
      icon: 'heart-outline',
      targetScreen: 'Favourite',
      badge: favourites.length > 0 ? favourites.length : null,
      badgeColor: colors.danger,
    },
    {
      title: 'My Cart',
      icon: 'cart-outline',
      targetScreen: 'My Cart',
      badge: cartCount > 0 ? cartCount : null,
      badgeColor: colors.primary,
    },
    {
      title: 'Customer Profile',
      icon: 'person-outline',
      targetScreen: 'Profile',
      badge: null,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card Header */}
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: user?.avatar }}
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName} numberOfLines={1}>
              {user?.name || 'Customer'}
            </Text>
            <Text style={styles.userEmail} numberOfLines={1}>
              {user?.email}
            </Text>
            <View style={styles.roleTag}>
              <Text style={styles.roleTagText}>{user?.role || 'Customer'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Drawer Menu Navigation Links */}
        <View style={styles.menuContainer}>
          <Text style={styles.menuSectionTitle}>NAVIGATION MENU</Text>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => {
                navigation.navigate(item.targetScreen);
                navigation.closeDrawer();
              }}
              activeOpacity={0.7}
            >
              <View style={styles.menuLeft}>
                <Ionicons name={item.icon} size={22} color={colors.textDark} />
                <Text style={styles.menuTitle}>{item.title}</Text>
              </View>

              {item.badge !== null && (
                <View
                  style={[
                    styles.menuBadge,
                    { backgroundColor: item.badgeColor || colors.primary },
                  ]}
                >
                  <Text style={styles.menuBadgeText}>{item.badge}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.divider} />

        {/* Role Toggle Option for Examiner */}
        <View style={styles.roleSection}>
          <Text style={styles.menuSectionTitle}>EXAMINER / TEST ACCOUNT SWITCHER</Text>
          <View style={styles.accountsContainer}>
            <TouchableOpacity
              style={[
                styles.accountCard,
                user?.email === 'kishore.customer@example.com' && styles.accountCardActiveCustomer,
              ]}
              onPress={() => switchUser('kishore.customer@example.com')}
              activeOpacity={0.8}
            >
              <View style={styles.accountLeft}>
                <Ionicons
                  name="person-circle"
                  size={20}
                  color={user?.email === 'kishore.customer@example.com' ? colors.primaryDark : colors.textMedium}
                />
                <Text style={styles.accountName}>Customer (Kishore)</Text>
              </View>
              {user?.email === 'kishore.customer@example.com' && (
                <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.accountCard,
                user?.email === 'gokul.admin@groceryapp.com' && styles.accountCardActiveAdmin,
              ]}
              onPress={() => switchUser('gokul.admin@groceryapp.com')}
              activeOpacity={0.8}
            >
              <View style={styles.accountLeft}>
                <Ionicons
                  name="shield-checkmark"
                  size={20}
                  color={user?.email === 'gokul.admin@groceryapp.com' ? colors.accent : colors.textMedium}
                />
                <Text style={styles.accountName}>Admin (Gokul)</Text>
              </View>
              {user?.email === 'gokul.admin@groceryapp.com' && (
                <Ionicons name="checkmark-circle" size={18} color={colors.accent} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.accountCard,
                user?.email === 'madan.customer@example.com' && styles.accountCardActiveCustomer,
              ]}
              onPress={() => switchUser('madan.customer@example.com')}
              activeOpacity={0.8}
            >
              <View style={styles.accountLeft}>
                <Ionicons
                  name="person-circle"
                  size={20}
                  color={user?.email === 'madan.customer@example.com' ? colors.primaryDark : colors.textMedium}
                />
                <Text style={styles.accountName}>Customer (Madan)</Text>
              </View>
              {user?.email === 'madan.customer@example.com' && (
                <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity
          style={styles.signOutBtn}
          onPress={handleSignOut}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.danger} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
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
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primaryLight,
  },
  userInfo: {
    flex: 1,
    marginLeft: 14,
  },
  userName: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textDark,
  },
  userEmail: {
    fontSize: 12,
    color: colors.textMedium,
    marginTop: 2,
  },
  roleTag: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  roleTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 14,
  },
  menuContainer: {
    paddingVertical: 4,
  },
  menuSectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textLight,
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textDark,
    marginLeft: 12,
  },
  menuBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  menuBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.white,
  },
  roleSection: {
    paddingVertical: 4,
  },
  accountsContainer: {
    gap: 8,
    marginTop: 4,
  },
  accountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  accountCardActiveCustomer: {
    backgroundColor: '#F0FDF4',
    borderColor: colors.primary,
  },
  accountCardActiveAdmin: {
    backgroundColor: '#FFF7ED',
    borderColor: colors.accent,
  },
  accountLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textDark,
    marginLeft: 8,
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    marginTop: 24,
  },
  signOutText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.danger,
    marginLeft: 10,
  },
});
