import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows } from '../theme/colors';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';

export default function FavouriteScreen({ navigation }) {
  const {
    user,
    favourites,
    toggleFavourite,
    addToCart,
    showToast,
  } = useApp();

  const handleAddAllToCart = () => {
    if (favourites.length === 0) return;
    favourites.forEach((prod) => {
      addToCart(prod, 1);
    });
    showToast(`Added all ${favourites.length} favourite items to cart! 🛒`);
  };

  // Restrict Favourites to Customer Only as per Exam Requirement
  if (user?.role !== 'Customer') {
    return (
      <SafeAreaView style={styles.container}>
        <Header navigation={navigation} title="Favourites (Customer Only) ❤️" />
        <View style={styles.emptyContainer}>
          <View style={[styles.emptyHeartIcon, { backgroundColor: colors.accentLight }]}>
            <Ionicons name="shield-checkmark" size={54} color={colors.accent} />
          </View>
          <Text style={styles.emptyTitle}>Customer Only Feature</Text>
          <Text style={styles.emptySubtitle}>
            As per College Examination specifications, Add to Favourites and Wishlists are strictly reserved for Customer accounts.
            {"\n\n"}
            Active Profile: Store Administrator (Gokul).
          </Text>
          <TouchableOpacity
            style={[styles.exploreButton, { backgroundColor: colors.accent }]}
            onPress={() => navigation.navigate('Products')}
            activeOpacity={0.85}
          >
            <Ionicons name="storefront-outline" size={18} color={colors.white} style={{ marginRight: 6 }} />
            <Text style={styles.exploreButtonText}>Manage Products (Admin Action)</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header navigation={navigation} title="My Favourites ❤️" />

      {/* Top Banner or Batch Add */}
      {favourites.length > 0 && (
        <View style={styles.topActionBar}>
          <Text style={styles.countText}>
            You have <Text style={{ fontWeight: '800', color: colors.primary }}>{favourites.length}</Text> saved items
          </Text>

          <TouchableOpacity
            style={styles.addAllButton}
            onPress={handleAddAllToCart}
            activeOpacity={0.8}
          >
            <Ionicons name="cart" size={16} color={colors.white} style={{ marginRight: 4 }} />
            <Text style={styles.addAllButtonText}>Add All to Cart</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {favourites.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyHeartIcon}>
              <Ionicons name="heart-dislike-outline" size={54} color={colors.danger} />
            </View>
            <Text style={styles.emptyTitle}>No Favourites Yet</Text>
            <Text style={styles.emptySubtitle}>
              Tap the ❤️ icon on any grocery item to save it here for fast re-ordering.
            </Text>
            <TouchableOpacity
              style={styles.exploreButton}
              onPress={() => navigation.navigate('Products')}
              activeOpacity={0.85}
            >
              <Text style={styles.exploreButtonText}>Explore Fresh Groceries</Text>
              <Ionicons name="arrow-forward" size={16} color={colors.white} style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {favourites.map((product) => (
              <TouchableOpacity
                key={product.id}
                style={styles.favouriteCard}
                onPress={() => navigation.navigate('Product Details', { product })}
                activeOpacity={0.9}
              >
                {/* Product Image */}
                <Image
                  source={{ uri: product.image }}
                  style={styles.productImage}
                  resizeMode="contain"
                />

                {/* Details */}
                <View style={styles.details}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.unitText}>{product.unit}</Text>
                    {/* Remove button */}
                    <TouchableOpacity
                      onPress={() => toggleFavourite(product)}
                      style={styles.removeBtn}
                    >
                      <Ionicons name="heart" size={22} color={colors.danger} />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.productName} numberOfLines={1}>
                    {product.name}
                  </Text>

                  {/* Rating */}
                  <View style={styles.ratingRow}>
                    <Ionicons name="star" size={13} color={colors.star} />
                    <Text style={styles.ratingText}>{product.rating}</Text>
                    <Text style={styles.categoryBadge}>{product.category}</Text>
                  </View>

                  {/* Price and Add to Cart Action */}
                  <View style={styles.actionRow}>
                    <Text style={styles.price}>₹{product.price}</Text>

                    <TouchableOpacity
                      style={styles.addToCartBtn}
                      onPress={() => addToCart(product, 1)}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="cart-outline" size={16} color={colors.white} />
                      <Text style={styles.addToCartBtnText}>Add to Cart</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topActionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  countText: {
    fontSize: 13,
    color: colors.textMedium,
  },
  addAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  addAllButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 24,
  },
  emptyHeartIcon: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.dangerLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
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
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 24,
  },
  exploreButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  listContainer: {
    gap: 12,
  },
  favouriteCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  productImage: {
    width: 85,
    height: 85,
    borderRadius: 14,
    backgroundColor: colors.background,
  },
  details: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  unitText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textLight,
    textTransform: 'uppercase',
  },
  removeBtn: {
    padding: 2,
  },
  productName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textDark,
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textDark,
    marginLeft: 3,
  },
  categoryBadge: {
    fontSize: 11,
    color: colors.primaryDark,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
    marginLeft: 8,
    textTransform: 'capitalize',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  price: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
  },
  addToCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  addToCartBtnText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 4,
  },
});
