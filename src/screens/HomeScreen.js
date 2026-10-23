import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { categories, promoBanners } from '../data/productsData';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import CategoryPill from '../components/CategoryPill';
import ProductCard from '../components/ProductCard';

export default function HomeScreen({ navigation }) {
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    applyPromo,
  } = useApp();

  const handleSelectCategory = (catId) => {
    setSelectedCategory(catId);
    navigation.navigate('Products');
  };

  const handleSearchSubmit = () => {
    navigation.navigate('Products');
  };

  const popularProducts = products.slice(0, 4);
  const freshPicks = products.slice(4, 10);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <Header navigation={navigation} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar matching Figma */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color={colors.textLight} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search fresh groceries, fruits, milk..."
              placeholderTextColor={colors.textLight}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearchSubmit}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color={colors.textLight} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => navigation.navigate('Products')}
            activeOpacity={0.8}
          >
            <Ionicons name="options-outline" size={20} color={colors.white} />
          </TouchableOpacity>
        </View>

        {/* Promo Banner Card */}
        <View style={styles.bannerContainer}>
          <View style={[styles.bannerCard, { backgroundColor: promoBanners[0].color }]}>
            <View style={styles.bannerBadge}>
              <Text style={styles.bannerBadgeText}>{promoBanners[0].tag}</Text>
            </View>
            <Text style={styles.bannerTitle}>{promoBanners[0].title}</Text>
            <Text style={styles.bannerSubtitle}>{promoBanners[0].subtitle}</Text>
            <View style={styles.bannerBottomRow}>
              <TouchableOpacity
                style={styles.bannerCodeChip}
                onPress={() => applyPromo(promoBanners[0].code)}
                activeOpacity={0.7}
              >
                <Text style={styles.bannerCodeText}>Use Code: {promoBanners[0].code}</Text>
                <Ionicons name="copy-outline" size={14} color={colors.primaryDark} style={{ marginLeft: 4 }} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.bannerShopNow}
                onPress={() => navigation.navigate('Products')}
              >
                <Text style={styles.bannerShopNowText}>Shop Deals</Text>
                <Ionicons name="arrow-forward" size={14} color={colors.white} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Categories Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Products')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {categories.map((cat) => (
            <CategoryPill
              key={cat.id}
              category={cat}
              isSelected={selectedCategory === cat.id}
              onSelect={handleSelectCategory}
            />
          ))}
        </ScrollView>

        {/* Popular Groceries Horizontal Slider */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Popular Groceries</Text>
            <Text style={styles.sectionSubtitle}>Top rated fresh items</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Products')}>
            <Text style={styles.seeAllText}>View All ({products.length})</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalProductsScroll}
        >
          {popularProducts.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              navigation={navigation}
              horizontal={true}
            />
          ))}
        </ScrollView>

        {/* Daily Fresh Picks Grid */}
        <View style={[styles.sectionHeader, { marginTop: 16 }]}>
          <View>
            <Text style={styles.sectionTitle}>Daily Fresh Picks</Text>
            <Text style={styles.sectionSubtitle}>Directly sourced today</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Products')}>
            <Text style={styles.seeAllText}>Explore</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.gridContainer}>
          {freshPicks.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              navigation={navigation}
              horizontal={false}
            />
          ))}
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
    paddingBottom: 30,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    marginRight: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: colors.textDark,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerContainer: {
    paddingHorizontal: 16,
    marginTop: 12,
  },
  bannerCard: {
    borderRadius: 20,
    padding: 18,
    elevation: 4,
  },
  bannerBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  bannerBadgeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.white,
  },
  bannerSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
  },
  bannerBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
  },
  bannerCodeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  bannerCodeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  bannerShopNow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  bannerShopNowText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
    marginRight: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textDark,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 2,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  categoriesScroll: {
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  horizontalProductsScroll: {
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
});
