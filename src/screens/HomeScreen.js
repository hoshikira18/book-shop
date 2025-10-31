import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookCard } from '../components/BookCard';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import { categories } from '../data/books';
import { theme } from '../theme';

export const HomeScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('none'); // 'none', 'asc', 'desc'
  const { addToCart, getCartCount } = useCart();
  const { user, signout } = useAuth();
  const { products, loading } = useProducts();

  // Use products from ProductContext, fallback to static books
  const booksToDisplay = products.length > 0 ? products : [];

  const handleSignout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => signout(),
        },
      ]
    );
  };

  // Filter books based on search query and category
  const filteredBooks = useMemo(() => {
    return booksToDisplay.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory =
        selectedCategory === 'All' || book.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, booksToDisplay]);

  // Sort books based on price
  const sortedBooks = useMemo(() => {
    const books = [...filteredBooks];
    
    if (sortOrder === 'asc') {
      return books.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'desc') {
      return books.sort((a, b) => b.price - a.price);
    }
    
    return books;
  }, [filteredBooks, sortOrder]);

  const handleAddToCart = useCallback((book) => {
    addToCart(book, 1);
  }, [addToCart]);

  const handleBookPress = useCallback((book) => {
    navigation.navigate('BookDetails', { book });
  }, [navigation]);

  const renderCategoryFilter = useCallback(() => (
    <View style={styles.categoryContainer}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={categories}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryButton,
              selectedCategory === item && styles.categoryButtonActive,
            ]}
            onPress={() => setSelectedCategory(item)}
            accessible={true}
            accessibilityLabel={`Filter by ${item}`}
            accessibilityRole="button"
            accessibilityState={{ selected: selectedCategory === item }}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === item && styles.categoryTextActive,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  ), [selectedCategory]);

  const renderHeader = useCallback(() => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View>
          <Text style={styles.headerTitle}>Book Shop</Text>
          {user && (
            <Text style={styles.welcomeText}>Welcome, {user.full_name}</Text>
          )}
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => navigation.navigate('Cart')}
            accessible={true}
            accessibilityLabel={`Cart with ${getCartCount()} items`}
            accessibilityRole="button"
          >
            <Text style={styles.cartIcon}>🛒</Text>
            {getCartCount() > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{getCartCount()}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.signoutButton}
            onPress={handleSignout}
            accessible={true}
            accessibilityLabel="Sign out"
            accessibilityRole="button"
          >
            <Text style={styles.signoutIcon}>🚪</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TextInput
        style={styles.searchInput}
        placeholder="Search books or authors..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {renderCategoryFilter()}
      {renderSortFilter()}
    </View>
  ), [searchQuery, user, getCartCount, renderCategoryFilter, handleSignout]);

  const renderSortFilter = useCallback(() => (
    <View style={styles.sortContainer}>
      <Text style={styles.sortLabel}>Sort by price:</Text>
      <View style={styles.sortButtons}>
        <TouchableOpacity
          style={[
            styles.sortButton,
            sortOrder === 'none' && styles.sortButtonActive,
          ]}
          onPress={() => setSortOrder('none')}
        >
          <Text
            style={[
              styles.sortButtonText,
              sortOrder === 'none' && styles.sortButtonTextActive,
            ]}
          >
            Default
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.sortButton,
            sortOrder === 'asc' && styles.sortButtonActive,
          ]}
          onPress={() => setSortOrder('asc')}
        >
          <Text
            style={[
              styles.sortButtonText,
              sortOrder === 'asc' && styles.sortButtonTextActive,
            ]}
          >
            Low to High ↑
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.sortButton,
            sortOrder === 'desc' && styles.sortButtonActive,
          ]}
          onPress={() => setSortOrder('desc')}
        >
          <Text
            style={[
              styles.sortButtonText,
              sortOrder === 'desc' && styles.sortButtonTextActive,
            ]}
          >
            High to Low ↓
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  ), [sortOrder]);

  const renderEmptyState = useCallback(() => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>📚</Text>
      <Text style={styles.emptyStateTitle}>No books found</Text>
      <Text style={styles.emptyStateDescription}>
        Try adjusting your search or filter
      </Text>
    </View>
  ), []);

  const renderBookItem = useCallback(({ item }) => (
    <BookCard
      book={item}
      onPress={() => handleBookPress(item)}
      onAddToCart={handleAddToCart}
    />
  ), [handleBookPress, handleAddToCart]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={{
            paddingHorizontal: theme.spacing.md,
        }}>
        {renderHeader()}
        </View>
      <FlatList
        data={sortedBooks}
        keyExtractor={(item) => item.id}
        renderItem={renderBookItem}
        // ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContent: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.md,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  headerTitle: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  welcomeText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartButton: {
    position: 'relative',
    padding: theme.spacing.sm,
    minHeight: 44,
    minWidth: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartIcon: {
    fontSize: 28,
  },
  signoutButton: {
    padding: theme.spacing.sm,
    minHeight: 44,
    minWidth: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  signoutIcon: {
    fontSize: 24,
  },
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: theme.colors.danger,
    borderRadius: theme.borderRadius.round,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: theme.colors.background,
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
  },
  searchInput: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.fontSize.md,
    marginBottom: theme.spacing.md,
    minHeight: 48,
  },
  categoryContainer: {
    marginBottom: theme.spacing.md,
  },
  categoryButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.backgroundSecondary,
    marginRight: theme.spacing.sm,
    minHeight: 36,
    justifyContent: 'center',
  },
  categoryButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  categoryText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    fontWeight: theme.fontWeight.medium,
  },
  categoryTextActive: {
    color: theme.colors.background,
  },
  sortContainer: {
    marginBottom: theme.spacing.md,
  },
  sortLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  sortButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  sortButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 36,
  },
  sortButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  sortButtonText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    fontWeight: theme.fontWeight.medium,
  },
  sortButtonTextActive: {
    color: theme.colors.background,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xxl * 2,
  },
  emptyStateText: {
    fontSize: 64,
    marginBottom: theme.spacing.md,
  },
  emptyStateTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  emptyStateDescription: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});
