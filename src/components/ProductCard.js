import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows } from '../theme/colors';
import { useApp } from '../context/AppContext';

export default function ProductCard({ product, navigation, horizontal = false }) {
  const { user, isFavourite, toggleFavourite, addToCart, showToast } = useApp();
  const [imageError, setImageError] = useState(false);
  const favorited = isFavourite(product.id);

  const heartScale = useRef(new Animated.Value(1)).current;
  const addScale = useRef(new Animated.Value(1)).current;

  const handleCardPress = () => {
    if (user?.role !== 'Customer') {
      showToast('⚠️ Product Details is strictly for Customers! (Active: Admin Gokul)');
      return;
    }
    navigation.navigate('Product Details', { product });
  };

  const handleAddToCart = (e) => {
    e?.stopPropagation();
    Animated.sequence([
      Animated.timing(addScale, { toValue: 0.75, duration: 80, useNativeDriver: true }),
      Animated.spring(addScale, { toValue: 1, friction: 3, tension: 80, useNativeDriver: true }),
    ]).start();
    addToCart(product, 1);
  };

  const handleToggleFavourite = (e) => {
    e?.stopPropagation();
    Animated.sequence([
      Animated.timing(heartScale, { toValue: 1.45, duration: 120, useNativeDriver: true }),
      Animated.spring(heartScale, { toValue: 1, friction: 3, tension: 60, useNativeDriver: true }),
    ]).start();
    toggleFavourite(product);
  };

  return (
    <TouchableOpacity
      style={[styles.card, horizontal ? styles.cardHorizontal : styles.cardGrid]}
      onPress={handleCardPress}
      activeOpacity={0.88}
    >
      {/* Top Badges & Favorite Row */}
      <View style={styles.topRow}>
        {product.badge ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{product.badge}</Text>
          </View>
        ) : (
          <View style={{ width: 1 }} />
        )}

        <TouchableOpacity
          style={styles.favouriteButton}
          onPress={handleToggleFavourite}
          activeOpacity={0.7}
        >
          <Animated.View style={{ transform: [{ scale: heartScale }] }}>
            <Ionicons
              name={favorited ? 'heart' : 'heart-outline'}
              size={20}
              color={favorited ? colors.danger : colors.textLight}
            />
          </Animated.View>
        </TouchableOpacity>
      </View>

      {/* Product Image */}
      <View style={styles.imageContainer}>
        {imageError ? (
          <View style={styles.fallbackImage}>
            <Ionicons name="basket-outline" size={44} color={colors.primary} />
          </View>
        ) : (
          <Image
            source={{ uri: product.image }}
            style={styles.productImage}
            resizeMode="contain"
            onError={() => setImageError(true)}
          />
        )}
      </View>

      {/* Info Section */}
      <View style={styles.infoContainer}>
        <Text style={styles.unitText}>{product.unit || 'Per unit'}</Text>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>

        {/* Rating */}
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={13} color={colors.star} />
          <Text style={styles.ratingScore}>{product.rating || '4.8'}</Text>
          <Text style={styles.reviewsCount}>({product.reviewsCount || 45})</Text>
        </View>

        {/* Price and Add button */}
        <View style={styles.bottomRow}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>₹{product.price}</Text>
            {product.originalPrice && (
              <Text style={styles.originalPrice}>
                ₹{product.originalPrice}
              </Text>
            )}
          </View>

          <TouchableOpacity
            onPress={handleAddToCart}
            activeOpacity={0.8}
          >
            <Animated.View style={[styles.addButton, { transform: [{ scale: addScale }] }]}>
              <Ionicons name="add" size={22} color={colors.white} />
            </Animated.View>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 12,
    ...shadows.sm,
  },
  cardGrid: {
    width: '47%',
    marginHorizontal: '1.5%',
    marginVertical: 6,
  },
  cardHorizontal: {
    width: 175,
    marginRight: 14,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  badge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  favouriteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    width: '100%',
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  productImage: {
    width: '90%',
    height: '100%',
    borderRadius: 12,
  },
  fallbackImage: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.primarySoft,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    marginTop: 6,
  },
  unitText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textLight,
    textTransform: 'uppercase',
  },
  productName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textDark,
    marginTop: 2,
    minHeight: 36,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
  ratingScore: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textDark,
    marginLeft: 3,
  },
  reviewsCount: {
    fontSize: 11,
    color: colors.textLight,
    marginLeft: 3,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
  },
  originalPrice: {
    fontSize: 12,
    color: colors.textLight,
    textDecorationLine: 'line-through',
    marginLeft: 5,
  },
  addButton: {
    backgroundColor: colors.primary,
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
