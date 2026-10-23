import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows } from '../theme/colors';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';

export default function CartScreen({ navigation }) {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    deliveryFee,
    discountAmount,
    grandTotal,
    promoCode,
    applyPromo,
    user,
    switchUser,
  } = useApp();

  const [inputCoupon, setInputCoupon] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const modalScale = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    if (showSuccessModal) {
      Animated.spring(modalScale, {
        toValue: 1,
        friction: 5,
        tension: 45,
        useNativeDriver: true,
      }).start();
    } else {
      modalScale.setValue(0.3);
    }
  }, [showSuccessModal]);

  const handleApplyCoupon = () => {
    if (inputCoupon.trim()) {
      applyPromo(inputCoupon.trim());
      setInputCoupon('');
    }
  };

  const handleCheckout = () => {
    if (cart.length > 0) {
      setShowSuccessModal(true);
    }
  };

  const handleFinishOrder = () => {
    setShowSuccessModal(false);
    clearCart();
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header navigation={navigation} title="My Shopping Cart 🛒" showCart={false} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Identity & Cart Isolation Card */}
        <View style={styles.isolationCard}>
          <View style={styles.isolationTopRow}>
            <Image source={{ uri: user?.avatar }} style={styles.userCartAvatar} />
            <View style={styles.userCartInfo}>
              <View style={styles.userNameBadgeRow}>
                <Text style={styles.userCartName} numberOfLines={1}>
                  {user?.name}'s Private Cart
                </Text>
                <View
                  style={[
                    styles.rolePill,
                    user?.role === 'Admin' ? styles.rolePillAdmin : styles.rolePillCustomer,
                  ]}
                >
                  <Text
                    style={[
                      styles.rolePillText,
                      user?.role === 'Admin' ? styles.rolePillTextAdmin : styles.rolePillTextCustomer,
                    ]}
                  >
                    {user?.role === 'Admin' ? '👑 Admin' : '👤 Customer'}
                  </Text>
                </View>
              </View>
              <Text style={styles.userCartEmail} numberOfLines={1}>
                {user?.email}
              </Text>
            </View>
          </View>

          <View style={styles.isolationDivider} />

          {/* Quick Account Switcher for Examiner / Testing */}
          <View style={styles.quickSwitchContainer}>
            <Text style={styles.quickSwitchLabel}>TEST DIFFERENT USER CARTS (1-TAP):</Text>
            <View style={styles.quickSwitchButtonsRow}>
              <TouchableOpacity
                style={[
                  styles.switchChip,
                  user?.email === 'kishore.customer@example.com' && styles.switchChipActiveCustomer,
                ]}
                onPress={() => switchUser('kishore.customer@example.com')}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={user?.email === 'kishore.customer@example.com' ? 'checkmark-circle' : 'person-outline'}
                  size={13}
                  color={user?.email === 'kishore.customer@example.com' ? colors.white : colors.textDark}
                />
                <Text
                  style={[
                    styles.switchChipText,
                    user?.email === 'kishore.customer@example.com' && styles.switchChipTextActive,
                  ]}
                >
                  Kishore
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.switchChip,
                  user?.email === 'gokul.admin@groceryapp.com' && styles.switchChipActiveAdmin,
                ]}
                onPress={() => switchUser('gokul.admin@groceryapp.com')}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={user?.email === 'gokul.admin@groceryapp.com' ? 'checkmark-circle' : 'shield-outline'}
                  size={13}
                  color={user?.email === 'gokul.admin@groceryapp.com' ? colors.white : colors.textDark}
                />
                <Text
                  style={[
                    styles.switchChipText,
                    user?.email === 'gokul.admin@groceryapp.com' && styles.switchChipTextActive,
                  ]}
                >
                  Admin Gokul
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.switchChip,
                  user?.email === 'madan.customer@example.com' && styles.switchChipActiveCustomer,
                ]}
                onPress={() => switchUser('madan.customer@example.com')}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={user?.email === 'madan.customer@example.com' ? 'checkmark-circle' : 'person-outline'}
                  size={13}
                  color={user?.email === 'madan.customer@example.com' ? colors.white : colors.textDark}
                />
                <Text
                  style={[
                    styles.switchChipText,
                    user?.email === 'madan.customer@example.com' && styles.switchChipTextActive,
                  ]}
                >
                  Madan
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.isolationNoticeRow}>
            <Ionicons name="lock-closed" size={13} color={colors.primary} />
            <Text style={styles.isolationNoticeText}>
              Cart items are 100% private to {user?.name}. Admin and Customer products do not mix.
            </Text>
          </View>
        </View>

        {cart.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyCartIcon}>
              <Ionicons name="cart-outline" size={60} color={colors.primary} />
            </View>
            <Text style={styles.emptyTitle}>Cart is Empty for {user?.name}</Text>
            <Text style={styles.emptySubtitle}>
              {user?.role === 'Admin'
                ? 'Admin store cart is empty. Add grocery samples from the catalog to test.'
                : `Looks like ${user?.name} hasn't added any fresh groceries yet. Explore our daily items!`}
            </Text>
            <TouchableOpacity
              style={styles.startShoppingBtn}
              onPress={() => navigation.navigate('Products')}
              activeOpacity={0.85}
            >
              <Text style={styles.startShoppingBtnText}>
                {user?.role === 'Admin' ? 'Browse Products' : 'Start Shopping Now'}
              </Text>
              <Ionicons name="arrow-forward" size={16} color={colors.white} style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Cart Header Row */}
            <View style={styles.cartInfoBar}>
              <Text style={styles.cartItemsCountText}>
                Total Items: <Text style={{ fontWeight: '800', color: colors.primary }}>{cart.length}</Text>
              </Text>
              <TouchableOpacity onPress={clearCart} style={styles.clearCartBtn}>
                <Ionicons name="trash-outline" size={14} color={colors.danger} />
                <Text style={styles.clearCartText}>Clear All</Text>
              </TouchableOpacity>
            </View>

            {/* List of Cart Items */}
            <View style={styles.itemsList}>
              {cart.map((item) => {
                const itemTotal = (item.product.price * item.quantity).toFixed(2);
                return (
                  <View key={item.id} style={styles.cartItemCard}>
                    {/* Item Image */}
                    <Image
                      source={{ uri: item.product.image }}
                      style={styles.itemImage}
                      resizeMode="contain"
                    />

                    {/* Item Details */}
                    <View style={styles.itemInfo}>
                      <View style={styles.itemTopRow}>
                        <Text style={styles.itemName} numberOfLines={1}>
                          {item.product.name}
                        </Text>
                        <TouchableOpacity
                          onPress={() => removeFromCart(item.id)}
                          style={styles.deleteBtn}
                        >
                          <Ionicons name="close" size={18} color={colors.textLight} />
                        </TouchableOpacity>
                      </View>

                      <Text style={styles.itemUnit}>
                        {item.product.unit} • ₹{item.product.price}/unit
                      </Text>

                      {/* Quantity Controls Row */}
                      <View style={styles.quantityRow}>
                        {/* Dynamic Subtotal for this product */}
                        <Text style={styles.itemSubtotal}>₹{itemTotal}</Text>

                        {/* - [qty] + controls */}
                        <View style={styles.qtyControlBox}>
                          <TouchableOpacity
                            style={styles.qtyBtn}
                            onPress={() => updateCartQuantity(item.id, -1)}
                            activeOpacity={0.7}
                          >
                            <Ionicons
                              name={item.quantity === 1 ? 'trash-outline' : 'remove'}
                              size={16}
                              color={item.quantity === 1 ? colors.danger : colors.textDark}
                            />
                          </TouchableOpacity>

                          <Text style={styles.qtyNumber}>{item.quantity}</Text>

                          <TouchableOpacity
                            style={styles.qtyBtn}
                            onPress={() => updateCartQuantity(item.id, 1)}
                            activeOpacity={0.7}
                          >
                            <Ionicons name="add" size={16} color={colors.textDark} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Promo Code Coupon Box */}
            <View style={styles.couponContainer}>
              <Text style={styles.couponLabel}>Have a Promo Code?</Text>
              <View style={styles.couponInputWrapper}>
                <Ionicons name="pricetag-outline" size={18} color={colors.primary} style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.couponInput}
                  placeholder="Enter FRESH25 for 25% OFF"
                  placeholderTextColor={colors.textLight}
                  value={inputCoupon}
                  onChangeText={setInputCoupon}
                  autoCapitalize="characters"
                />
                <TouchableOpacity
                  style={styles.applyCouponBtn}
                  onPress={handleApplyCoupon}
                  activeOpacity={0.8}
                >
                  <Text style={styles.applyCouponBtnText}>Apply</Text>
                </TouchableOpacity>
              </View>
              {promoCode ? (
                <View style={styles.activePromoNotice}>
                  <Ionicons name="checkmark-circle" size={15} color={colors.success} />
                  <Text style={styles.activePromoNoticeText}>
                    Active Promo: {promoCode} (Saved ₹{discountAmount.toFixed(2)})
                  </Text>
                </View>
              ) : null}
            </View>

            {/* Delivery Address Card */}
            <View style={styles.addressCard}>
              <View style={styles.addressHeader}>
                <Ionicons name="location" size={18} color={colors.primary} />
                <Text style={styles.addressTitle}>
                  {user?.role === 'Admin' ? 'Store Hub Location' : 'Delivering to'}
                </Text>
                {user?.role === 'Customer' ? (
                  <TouchableOpacity onPress={() => navigation.navigate('Edit Profile')}>
                    <Text style={styles.addressChangeLink}>Change</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.adminStoreHubPill}>
                    <Text style={styles.adminStoreHubPillText}>Admin Hub</Text>
                  </View>
                )}
              </View>
              <Text style={styles.addressCustomerName}>{user?.name} ({user?.phone})</Text>
              <Text style={styles.addressDetailsText}>{user?.address}</Text>
            </View>

            {/* Price Breakdown Bill Summary */}
            <View style={styles.billSummaryCard}>
              <Text style={styles.billTitle}>Bill Summary</Text>

              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Item Subtotal</Text>
                <Text style={styles.billValue}>₹{cartSubtotal.toFixed(2)}</Text>
              </View>

              <View style={styles.billRow}>
                <Text style={styles.billLabel}>
                  Delivery Fee {cartSubtotal >= 499 ? '(FREE above ₹499)' : ''}
                </Text>
                <Text style={[styles.billValue, deliveryFee === 0 && { color: colors.primary }]}>
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </Text>
              </View>

              {discountAmount > 0 && (
                <View style={styles.billRow}>
                  <Text style={[styles.billLabel, { color: colors.primary }]}>
                    Promo Discount ({promoCode})
                  </Text>
                  <Text style={[styles.billValue, { color: colors.primary }]}>
                    -₹{discountAmount.toFixed(2)}
                  </Text>
                </View>
              )}

              <View style={styles.billDivider} />

              <View style={styles.totalRow}>
                <View>
                  <Text style={styles.totalLabel}>Grand Total</Text>
                  <Text style={styles.totalTaxNote}>Inclusive of all taxes</Text>
                </View>
                <Text style={styles.grandTotalPrice}>₹{grandTotal.toFixed(2)}</Text>
              </View>
            </View>

            {/* Checkout Action Button */}
            <TouchableOpacity
              style={styles.checkoutBtn}
              onPress={handleCheckout}
              activeOpacity={0.85}
            >
              <Text style={styles.checkoutBtnText}>
                Place Order • ₹{grandTotal.toFixed(2)}
              </Text>
              <Ionicons name="arrow-forward" size={18} color={colors.white} style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      {/* Order Success Celebratory Modal */}
      <Modal
        visible={showSuccessModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <Animated.View style={[styles.successModalCard, { transform: [{ scale: modalScale }] }]}>
            <View style={styles.successBadge}>
              <Ionicons name="checkmark-done" size={48} color={colors.white} />
            </View>

            <Text style={styles.successHeading}>Order Placed Successfully! 🎉</Text>
            <Text style={styles.successMessage}>
              Thank you, {user?.name}! Your fresh groceries will be delivered to your address in Sulur, Coimbatore in 30 minutes.
            </Text>

            <View style={styles.orderSummaryBox}>
              <View style={styles.orderSummaryRow}>
                <Text style={styles.summaryLabel}>Order ID:</Text>
                <Text style={styles.summaryValue}>#FC-{Math.floor(100000 + Math.random() * 900000)}</Text>
              </View>
              <View style={styles.orderSummaryRow}>
                <Text style={styles.summaryLabel}>Total Paid:</Text>
                <Text style={[styles.summaryValue, { color: colors.primary, fontWeight: '800' }]}>
                  ₹{grandTotal.toFixed(2)}
                </Text>
              </View>
              <View style={styles.orderSummaryRow}>
                <Text style={styles.summaryLabel}>Estimated Time:</Text>
                <Text style={styles.summaryValue}>30 mins (Express Delivery)</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.doneBtn}
              onPress={handleFinishOrder}
              activeOpacity={0.85}
            >
              <Text style={styles.doneBtnText}>Continue Shopping</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
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
  isolationCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    ...shadows.sm,
  },
  isolationTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userCartAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
  },
  userCartInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userNameBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userCartName: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textDark,
    flex: 1,
    marginRight: 6,
  },
  rolePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  rolePillCustomer: {
    backgroundColor: colors.primaryLight,
  },
  rolePillAdmin: {
    backgroundColor: colors.accentLight,
  },
  rolePillText: {
    fontSize: 10,
    fontWeight: '800',
  },
  rolePillTextCustomer: {
    color: colors.primaryDark,
  },
  rolePillTextAdmin: {
    color: colors.accent,
  },
  userCartEmail: {
    fontSize: 11,
    color: colors.textMedium,
    marginTop: 2,
  },
  isolationDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 10,
  },
  quickSwitchContainer: {
    marginBottom: 8,
  },
  quickSwitchLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textLight,
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  quickSwitchButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  switchChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    paddingVertical: 7,
    paddingHorizontal: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  switchChipActiveCustomer: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  switchChipActiveAdmin: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  switchChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textDark,
    marginLeft: 4,
  },
  switchChipTextActive: {
    color: colors.white,
  },
  isolationNoticeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 4,
  },
  isolationNoticeText: {
    fontSize: 11,
    color: colors.textMedium,
    marginLeft: 6,
    flex: 1,
    lineHeight: 15,
  },
  adminStoreHubPill: {
    backgroundColor: colors.accentLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  adminStoreHubPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.accent,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 24,
  },
  emptyCartIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textDark,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textMedium,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  startShoppingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 24,
    elevation: 3,
  },
  startShoppingBtnText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  cartInfoBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cartItemsCountText: {
    fontSize: 14,
    color: colors.textDark,
  },
  clearCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearCartText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.danger,
    marginLeft: 4,
  },
  itemsList: {
    gap: 12,
  },
  cartItemCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: colors.background,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  itemTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textDark,
    flex: 1,
    marginRight: 6,
  },
  deleteBtn: {
    padding: 2,
  },
  itemUnit: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 2,
  },
  quantityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  itemSubtotal: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
  },
  qtyControlBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textDark,
    paddingHorizontal: 12,
  },
  couponContainer: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 14,
    marginTop: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  couponLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 8,
  },
  couponInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    height: 46,
  },
  couponInput: {
    flex: 1,
    fontSize: 13,
    color: colors.textDark,
  },
  applyCouponBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  applyCouponBtnText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  activePromoNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  activePromoNoticeText: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '600',
    marginLeft: 6,
  },
  addressCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 14,
    marginTop: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  addressTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textDark,
    flex: 1,
    marginLeft: 6,
  },
  addressChangeLink: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  addressCustomerName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textDark,
  },
  addressDetailsText: {
    fontSize: 12,
    color: colors.textMedium,
    marginTop: 2,
  },
  billSummaryCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginTop: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  billTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textDark,
    marginBottom: 12,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  billLabel: {
    fontSize: 13,
    color: colors.textMedium,
  },
  billValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textDark,
  },
  billDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textDark,
  },
  totalTaxNote: {
    fontSize: 10,
    color: colors.textLight,
  },
  grandTotalPrice: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.primary,
  },
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 18,
    elevation: 3,
  },
  checkoutBtnText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  successModalCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    width: '100%',
  },
  successBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successHeading: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textDark,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 13,
    color: colors.textMedium,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 19,
  },
  orderSummaryBox: {
    backgroundColor: colors.background,
    borderRadius: 14,
    padding: 14,
    width: '100%',
    marginVertical: 16,
  },
  orderSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.textMedium,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textDark,
  },
  doneBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
  },
  doneBtnText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
});
