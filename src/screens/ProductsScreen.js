import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { categories } from '../data/productsData';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import CategoryPill from '../components/CategoryPill';
import ProductCard from '../components/ProductCard';

export default function ProductsScreen({ navigation }) {
  const {
    products,
    addProduct,
    user,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
  } = useApp();

  const [sortBy, setSortBy] = useState('default'); // 'default' | 'priceLow' | 'priceHigh' | 'rating'
  const [showAddModal, setShowAddModal] = useState(false);

  // New product form for Admin
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('vegetables');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdUnit, setNewProdUnit] = useState('500g');
  const [newProdDesc, setNewProdDesc] = useState('');

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const matchesCategory =
        selectedCategory === 'all' || prod.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'priceLow') return a.price - b.price;
      if (sortBy === 'priceHigh') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [products, selectedCategory, searchQuery, sortBy]);

  const handleAdminAddProduct = () => {
    if (!newProdName.trim() || !newProdPrice.trim()) {
      Alert.alert('Validation Error', 'Please enter product name and price.');
      return;
    }

    const priceNum = parseFloat(newProdPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid price.');
      return;
    }

    addProduct({
      name: newProdName.trim(),
      category: newProdCategory,
      price: priceNum,
      originalPrice: priceNum * 1.2,
      unit: newProdUnit.trim(),
      description: newProdDesc.trim() || 'Daily fresh organic grocery item from local farms.',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=500&q=80',
      stockCount: 50,
      badge: 'Admin Added',
    });

    setNewProdName('');
    setNewProdPrice('');
    setNewProdDesc('');
    setShowAddModal(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header navigation={navigation} title="Daily Groceries" />

      {/* Search and Filter Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color={colors.textLight} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search groceries by name or brand..."
            placeholderTextColor={colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={colors.textLight} />
            </TouchableOpacity>
          )}
        </View>

        {/* Admin Quick Action Button */}
        {user?.role === 'Admin' && (
          <TouchableOpacity
            style={styles.adminAddBtn}
            onPress={() => setShowAddModal(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="add-circle" size={20} color={colors.white} />
            <Text style={styles.adminAddText}>Add Item</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Category Pills Horizontal Slider */}
      <View style={styles.categoryContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {categories.map((cat) => (
            <CategoryPill
              key={cat.id}
              category={cat}
              isSelected={selectedCategory === cat.id}
              onSelect={setSelectedCategory}
            />
          ))}
        </ScrollView>
      </View>

      {/* Results Header and Sort Bar */}
      <View style={styles.resultsBar}>
        <Text style={styles.resultsCount}>
          Found <Text style={{ fontWeight: '800', color: colors.primary }}>{filteredProducts.length}</Text> items
        </Text>

        <View style={styles.sortButtonsRow}>
          <TouchableOpacity
            style={[styles.sortChip, sortBy === 'priceLow' && styles.sortChipActive]}
            onPress={() => setSortBy(sortBy === 'priceLow' ? 'default' : 'priceLow')}
          >
            <Text style={[styles.sortChipText, sortBy === 'priceLow' && styles.sortChipTextActive]}>
              Price: Low ↑
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.sortChip, sortBy === 'rating' && styles.sortChipActive]}
            onPress={() => setSortBy(sortBy === 'rating' ? 'default' : 'rating')}
          >
            <Text style={[styles.sortChipText, sortBy === 'rating' && styles.sortChipTextActive]}>
              Top Rated ★
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Products Grid */}
      <ScrollView
        contentContainerStyle={styles.scrollList}
        showsVerticalScrollIndicator={false}
      >
        {filteredProducts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="basket-outline" size={64} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>No Groceries Found</Text>
            <Text style={styles.emptySubtitle}>
              Try adjusting your search query or select another category.
            </Text>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
            >
              <Text style={styles.resetButtonText}>View All Products</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.grid}>
            {filteredProducts.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                navigation={navigation}
                horizontal={false}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Admin Add Product Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Grocery Item</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={24} color={colors.textDark} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalLabel}>Product Name *</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Organic Avocados"
                value={newProdName}
                onChangeText={setNewProdName}
              />

              <Text style={styles.modalLabel}>Price (₹) *</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. 50"
                keyboardType="numeric"
                value={newProdPrice}
                onChangeText={setNewProdPrice}
              />

              <Text style={styles.modalLabel}>Unit / Weight</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. 500g or 1 kg"
                value={newProdUnit}
                onChangeText={setNewProdUnit}
              />

              <Text style={styles.modalLabel}>Category</Text>
              <View style={styles.modalCategoryRow}>
                {['vegetables', 'fruits', 'dairy', 'bakery', 'beverages', 'snacks'].map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.modalCatChip,
                      newProdCategory === cat && styles.modalCatChipActive,
                    ]}
                    onPress={() => setNewProdCategory(cat)}
                  >
                    <Text
                      style={[
                        styles.modalCatChipText,
                        newProdCategory === cat && styles.modalCatChipTextActive,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.modalLabel}>Description</Text>
              <TextInput
                style={[styles.modalInput, { height: 70, textAlignVertical: 'top' }]}
                placeholder="Product description and freshness highlights..."
                multiline
                value={newProdDesc}
                onChangeText={setNewProdDesc}
              />

              <TouchableOpacity
                style={styles.modalSubmitButton}
                onPress={handleAdminAddProduct}
                activeOpacity={0.85}
              >
                <Text style={styles.modalSubmitText}>Save & Publish Item</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
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
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.white,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: colors.textDark,
  },
  adminAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    marginLeft: 8,
  },
  adminAddText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 12,
    marginLeft: 4,
  },
  categoryContainer: {
    backgroundColor: colors.white,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  categoryScroll: {
    paddingHorizontal: 16,
  },
  resultsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  resultsCount: {
    fontSize: 13,
    color: colors.textMedium,
  },
  sortButtonsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  sortChip: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  sortChipActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  sortChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMedium,
  },
  sortChipTextActive: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  scrollList: {
    paddingBottom: 40,
    paddingHorizontal: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textDark,
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.textMedium,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  resetButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 16,
  },
  resetButtonText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textDark,
  },
  modalLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textDark,
    marginTop: 10,
    marginBottom: 6,
  },
  modalInput: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.textDark,
  },
  modalCategoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  modalCatChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalCatChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  modalCatChipText: {
    fontSize: 12,
    color: colors.textMedium,
    textTransform: 'capitalize',
  },
  modalCatChipTextActive: {
    color: colors.white,
    fontWeight: '700',
  },
  modalSubmitButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  modalSubmitText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
});
