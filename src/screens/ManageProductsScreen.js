import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAllProducts, deleteProduct } from '../utils/database';
import { useProducts } from '../context/ProductContext';
import { theme } from '../theme';
import { formatCurrency } from '../utils/currency';

export const ManageProductsScreen = ({ navigation }) => {
  const { products, loading, refreshProducts } = useProducts();
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refreshProducts();
    });
    return unsubscribe;
  }, [navigation, refreshProducts]);

  const handleDeleteProduct = (product) => {
    Alert.alert(
      'Delete Product',
      `Are you sure you want to delete "${product.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeleting(product.id);
              await deleteProduct(product.id);
              await refreshProducts();
              Alert.alert('Success', 'Product deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete product');
              console.error('Delete error:', error);
            } finally {
              setDeleting(null);
            }
          },
        },
      ]
    );
  };

  const renderProduct = ({ item }) => (
    <View style={styles.productCard}>
      <View style={styles.productInfo}>
        {item.image && (
          <View style={styles.imageContainer}>
            <Text style={styles.imageIcon}>📖</Text>
          </View>
        )}
        <View style={styles.productDetails}>
          <Text style={styles.productTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.productAuthor}>{item.author}</Text>
          <Text style={styles.productPrice}>{formatCurrency(item.price)}</Text>
          <Text style={styles.productStock}>Stock: {item.stock || 0}</Text>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('ProductDetails', { productId: item.id, product: item })}
        >
          <Text style={styles.actionButtonText}>View</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => navigation.navigate('EditProduct', { productId: item.id, product: item })}
        >
          <Text style={[styles.actionButtonText, styles.editButtonText]}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteProduct(item)}
          disabled={deleting === item.id}
        >
          {deleting === item.id ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Delete</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Manage Products</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddProduct')}
        >
          <Text style={styles.addButtonText}>+ Add Product</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={renderProduct}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No products available</Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => navigation.navigate('AddProduct')}
            >
              <Text style={styles.emptyButtonText}>Add Your First Product</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  listContent: {
    padding: 16,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  productInfo: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  imageContainer: {
    width: 60,
    height: 80,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  imageIcon: {
    fontSize: 32,
  },
  productDetails: {
    flex: 1,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  productAuthor: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 4,
  },
  productStock: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  editButton: {
    backgroundColor: '#f59e0b',
  },
  editButtonText: {
    color: '#fff',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
  },
  deleteButtonText: {
    color: '#fff',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: 16,
  },
  emptyButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
