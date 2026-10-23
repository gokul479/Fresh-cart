import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useApp } from '../context/AppContext';

export default function ProductDetailsScreen({ route, navigation }) {
  const { product } = route.params || {};
  const {
    user,
    isFavourite,
    toggleFavourite,
    addToCart,
    cart,
    cartCount,
  } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No product selected.</Text>
          <TouchableOpacity
            style={styles.backHomeBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backHomeText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Restrict Product Details Screen to Customer Only as per Exam Requirement
  if (user?.role !== 'Customer') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
        <View style={styles.navBar}>
          <TouchableOpacity
            style={styles.navIconBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={colors.textDark} />
          </TouchableOpacity>
          <Text style={styles.navTitle}>Product Details (Customer Only)</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.adminBlockedContainer}>
          <View style={styles.adminBlockedIconCircle}>
            <Ionicons name="shield-checkmark" size={54} color={colors.accent} />
          </View>
          <Text style={styles.adminBlockedTitle}>Customer Only Screen</Text>
          <Text style={styles.adminBlockedSubtitle}>
            As per College Examination specifications, Product Details & Shopping view is strictly for Customer accounts.
            {"\n\n"}
            Active Profile: Store Administrator (Gokul).
            {"\n"}
            Admins manage product catalog directly from the Products screen.
          </Text>

          <TouchableOpacity
            style={styles.adminBlockedBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.85}
          >
            <Ionicons name="arrow-back" size={18} color={colors.white} style={{ marginRight: 6 }} />
            <Text style={styles.adminBlockedBtnText}>Back to Products</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const favorited = isFavourite(product.id);
  const inCartItem = cart.find((item) => item.id === product.id);

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const heartScale = useRef(new Animated.Value(1)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  const handleToggleFav = () => {
    Animated.sequence([
      Animated.timing(heartScale, { toValue: 1.45, duration: 110, useNativeDriver: true }),
      Animated.spring(heartScale, { toValue: 1, friction: 3, tension: 70, useNativeDriver: true }),
    ]).start();
    toggleFavourite(product);
  };

  const handleAddToCart = () => {
    Animated.sequence([
      Animated.timing(buttonScale, { toValue: 0.88, duration: 80, useNativeDriver: true }),
      Animated.spring(buttonScale, { toValue: 1, friction: 3, tension: 80, useNativeDriver: true }),
    ]).start();
    addToCart(product, quantity);
  };

  const calculatedTotal = (product.price * quantity).toFixed(2);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      {/* Custom Top Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity
          style={styles.navIconBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textDark} />
        </TouchableOpacity>

        <Text style={styles.navTitle}>Product Details</Text>

        <View style={styles.navRightRow}>
          <TouchableOpacity
            style={[styles.navIconBtn, { marginRight: 8 }]}
            onPress={handleToggleFav}
            activeOpacity={0.7}
          >
            <Animated.View style={{ transform: [{ scale: heartScale }] }}>
              <Ionicons
                name={favorited ? 'heart' : 'heart-outline'}
                size={22}
                color={favorited ? colors.danger : colors.textDark}
              />
            </Animated.View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navIconBtn}
            onPress={() => navigation.navigate('My Cart')}
            activeOpacity={0.7}
          >
            <Ionicons name="cart-outline" size={22} color={colors.textDark} />
            {cartCount > 0 && (
              <View style={styles.navCartBadge}>
                <Text style={styles.navCartBadgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image Showcase */}
        <View style={styles.imageShowcase}>
          {imageError ? (
            <View style={styles.fallbackBox}>
              <Ionicons name="basket-outline" size={80} color={colors.primary} />
            </View>
          ) : (
            <Image
              source={{ uri: product.image }}
              style={styles.heroImage}
              resizeMode="contain"
              onError={() => setImageError(true)}
            />
          )}

          {product.badge && (
            <View style={styles.floatingBadge}>
              <Text style={styles.floatingBadgeText}>{product.badge}</Text>
            </View>
          )}
        </View>

        {/* Content Card */}
        <View style={styles.detailsCard}>
          {/* Category & Origin */}
          <View style={styles.metaRow}>
            <View style={styles.categoryTag}>
              <Ionicons name="pricetag-outline" size={13} color={colors.primaryDark} />
              <Text style={styles.categoryTagText}>{product.category}</Text>
            </View>

            {product.origin && (
              <View style={styles.originTag}>
                <Ionicons name="location-outline" size={13} color={colors.textMedium} />
                <Text style={styles.originTagText}>{product.origin}</Text>
              </View>
            )}
          </View>

          {/* Product Name */}
          <Text style={styles.productTitle}>{product.name}</Text>

          {/* Pack Size / Unit & Rating */}
          <View style={styles.ratingAndUnitRow}>
            <Text style={styles.unitSize}>Pack Size: {product.unit || 'Standard'}</Text>
            <View style={styles.ratingBox}>
              <Ionicons name="star" size={15} color={colors.star} />
              <Text style={styles.ratingScore}>{product.rating || '4.8'}</Text>
              <Text style={styles.reviewsCount}>({product.reviewsCount || 120} reviews)</Text>
            </View>
          </View>

          {/* Price & Quantity Selector Row */}
          <View style={styles.priceAndCounterRow}>
            <View>
              <Text style={styles.priceLabel}>Unit Price</Text>
              <View style={styles.priceValues}>
                <Text style={styles.activePrice}>₹{product.price}</Text>
                {product.originalPrice && (
                  <Text style={styles.originalPrice}>
                    ₹{product.originalPrice}
                  </Text>
                )}
              </View>
            </View>

            {/* Quantity Selector [- QTY +] */}
            <View style={styles.counterBox}>
              <TouchableOpacity
                style={styles.counterBtn}
                onPress={decreaseQuantity}
                disabled={quantity <= 1}
              >
                <Ionicons
                  name="remove"
                  size={18}
                  color={quantity <= 1 ? colors.textMuted : colors.textDark}
                />
              </TouchableOpacity>
              <Text style={styles.counterValue}>{quantity}</Text>
              <TouchableOpacity
                style={styles.counterBtn}
                onPress={increaseQuantity}
              >
                <Ionicons name="add" size={18} color={colors.textDark} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Description */}
          <Text style={styles.sectionHeader}>Product Overview</Text>
          <Text style={styles.descriptionText}>
            {product.description ||
              'Freshly sourced, healthy, and handpicked daily grocery product directly brought from certified organic sustainable farms. Rich in essential vitamins, natural minerals, and pure authentic flavour.'}
          </Text>

          {/* Nutritional Highlights */}
          <View style={styles.highlightsContainer}>
            <View style={styles.highlightCard}>
              <Ionicons name="leaf-outline" size={20} color={colors.primary} />
              <Text style={styles.highlightLabel}>100% Organic</Text>
              <Text style={styles.highlightSub}>No pesticides</Text>
            </View>
            <View style={styles.highlightCard}>
              <Ionicons name="shield-checkmark-outline" size={20} color={colors.accent} />
              <Text style={styles.highlightLabel}>Guaranteed Fresh</Text>
              <Text style={styles.highlightSub}>Quality tested</Text>
            </View>
            <View style={styles.highlightCard}>
              <Ionicons name="cube-outline" size={20} color="#0284C7" />
              <Text style={styles.highlightLabel}>Eco Pack</Text>
              <Text style={styles.highlightSub}>100% Recyclable</Text>
            </View>
          </View>

          {/* Already In Cart Notice */}
          {inCartItem && (
            <View style={styles.inCartBanner}>
              <Ionicons name="information-circle" size={18} color={colors.primary} />
              <Text style={styles.inCartBannerText}>
                Currently {inCartItem.quantity} in your cart
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('My Cart')}>
                <Text style={styles.viewCartLink}>View Cart →</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomPriceContainer}>
          <Text style={styles.bottomTotalLabel}>Total Amount</Text>
          <Text style={styles.bottomTotalPrice}>₹{calculatedTotal}</Text>
        </View>

        <TouchableOpacity
          onPress={handleAddToCart}
          activeOpacity={0.85}
        >
          <Animated.View style={[styles.addToCartButton, { transform: [{ scale: buttonScale }] }]}>
            <Ionicons name="cart" size={20} color={colors.white} style={{ marginRight: 8 }} />
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </Animated.View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 16,
    color: colors.textMedium,
  },
  backHomeBtn: {
    marginTop: 12,
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  backHomeText: {
    color: colors.white,
    fontWeight: '700',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.white,
  },
  navIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textDark,
  },
  navRightRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navCartBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: colors.primary,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  navCartBadgeText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: '700',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  imageShowcase: {
    width: '100%',
    height: 250,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  heroImage: {
    width: '80%',
    height: '85%',
  },
  fallbackBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingBadge: {
    position: 'absolute',
    bottom: 14,
    left: 16,
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  floatingBadgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  detailsCard: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -20,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
  },
  categoryTagText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDark,
    marginLeft: 4,
    textTransform: 'capitalize',
  },
  originTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  originTagText: {
    fontSize: 12,
    color: colors.textMedium,
    marginLeft: 4,
  },
  productTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textDark,
    lineHeight: 28,
  },
  ratingAndUnitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  unitSize: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textLight,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingScore: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textDark,
    marginLeft: 4,
  },
  reviewsCount: {
    fontSize: 12,
    color: colors.textLight,
    marginLeft: 4,
  },
  priceAndCounterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },
  priceLabel: {
    fontSize: 12,
    color: colors.textLight,
  },
  priceValues: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 2,
  },
  activePrice: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary,
  },
  originalPrice: {
    fontSize: 14,
    color: colors.textLight,
    textDecorationLine: 'line-through',
    marginLeft: 6,
  },
  counterBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  counterBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDark,
    paddingHorizontal: 16,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 16,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textDark,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: colors.textMedium,
    lineHeight: 22,
  },
  highlightsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 10,
  },
  highlightCard: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  highlightLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textDark,
    marginTop: 6,
    textAlign: 'center',
  },
  highlightSub: {
    fontSize: 10,
    color: colors.textLight,
    marginTop: 2,
    textAlign: 'center',
  },
  inCartBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primaryLight,
    padding: 12,
    borderRadius: 12,
    marginTop: 16,
  },
  inCartBannerText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primaryDark,
    flex: 1,
    marginLeft: 6,
  },
  viewCartLink: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 8,
  },
  bottomPriceContainer: {
    flex: 1,
  },
  bottomTotalLabel: {
    fontSize: 12,
    color: colors.textLight,
  },
  bottomTotalPrice: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
  },
  addToCartButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
    elevation: 3,
  },
  addToCartText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.white,
  },
  adminBlockedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  adminBlockedIconCircle: {
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
  adminBlockedTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textDark,
    marginBottom: 12,
    textAlign: 'center',
  },
  adminBlockedSubtitle: {
    fontSize: 14,
    color: colors.textMedium,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 26,
  },
  adminBlockedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
    elevation: 2,
  },
  adminBlockedBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.white,
  },
});
