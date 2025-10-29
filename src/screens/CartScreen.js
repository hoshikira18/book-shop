import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '../context/CartContext';
import { theme } from '../theme';
import { formatCurrency } from '../utils/currency';

export const CartScreen = ({ navigation }) => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  const handleCheckout = () => {
    if (cart.length === 0) {
      Alert.alert('Cart Empty', 'Please add items to your cart before checking out.');
      return;
    }
    navigation.navigate('Checkout');
  };

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: clearCart },
      ]
    );
  };

  const handleRemoveItem = (item) => {
    Alert.alert(
      'Remove Item',
      `Remove ${item.title} from cart?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removeFromCart(item.id) },
      ]
    );
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.itemAuthor} numberOfLines={1}>
          {item.author}
        </Text>
        <Text style={styles.itemPrice}>{formatCurrency(item.price)}</Text>
        
        <View style={styles.itemFooter}>
          <View style={styles.quantityControls}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => updateQuantity(item.id, item.quantity - 1)}
              accessible={true}
              accessibilityLabel="Decrease quantity"
              accessibilityRole="button"
            >
              <Text style={styles.quantityButtonText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.quantityValue}>{item.quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => updateQuantity(item.id, item.quantity + 1)}
              accessible={true}
              accessibilityLabel="Increase quantity"
              accessibilityRole="button"
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemoveItem(item)}
            accessible={true}
            accessibilityLabel={`Remove ${item.title} from cart`}
            accessibilityRole="button"
          >
            <Text style={styles.removeButtonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.itemTotal}>
        {formatCurrency(item.price * item.quantity)}
      </Text>
    </View>
  );

  const renderEmptyCart = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateIcon}>🛒</Text>
      <Text style={styles.emptyStateTitle}>Your cart is empty</Text>
      <Text style={styles.emptyStateDescription}>
        Add some books to get started!
      </Text>
      <TouchableOpacity
        style={styles.shopButton}
        onPress={() => navigation.navigate('Home')}
        accessible={true}
        accessibilityLabel="Continue shopping"
        accessibilityRole="button"
      >
        <Text style={styles.shopButtonText}>Continue Shopping</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footer}>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Subtotal</Text>
        <Text style={styles.summaryValue}>{formatCurrency(getCartTotal())}</Text>
      </View>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Tax (10%)</Text>
        <Text style={styles.summaryValue}>{formatCurrency(getCartTotal() * 0.1)}</Text>
      </View>
      <View style={[styles.summaryRow, styles.totalRow]}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>{formatCurrency(getCartTotal() * 1.1)}</Text>
      </View>
      
      <TouchableOpacity
        style={styles.checkoutButton}
        onPress={handleCheckout}
        accessible={true}
        accessibilityLabel="Proceed to checkout"
        accessibilityRole="button"
      >
        <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
      </TouchableOpacity>
      
      {cart.length > 0 && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={handleClearCart}
          accessible={true}
          accessibilityLabel="Clear all items from cart"
          accessibilityRole="button"
        >
          <Text style={styles.clearButtonText}>Clear Cart</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (cart.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        {renderEmptyCart()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shopping Cart</Text>
        <Text style={styles.headerSubtitle}>
          {cart.length} {cart.length === 1 ? 'item' : 'items'}
        </Text>
      </View>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.id}
        renderItem={renderCartItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      {renderFooter()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  headerSubtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  listContent: {
    padding: theme.spacing.md,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  itemImage: {
    width: 80,
    height: 120,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  itemDetails: {
    flex: 1,
    marginLeft: theme.spacing.md,
    marginRight: theme.spacing.sm,
  },
  itemTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  itemAuthor: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  itemPrice: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
  },
  quantityButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.bold,
  },
  quantityValue: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    paddingHorizontal: theme.spacing.md,
    minWidth: 40,
    textAlign: 'center',
  },
  removeButton: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
  },
  removeButtonText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.danger,
    fontWeight: theme.fontWeight.medium,
  },
  itemTotal: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  footer: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    ...theme.shadows.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  summaryLabel: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },
  summaryValue: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
  },
  totalRow: {
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    marginBottom: theme.spacing.lg,
  },
  totalLabel: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  totalValue: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
  },
  checkoutButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  checkoutButtonText: {
    color: theme.colors.background,
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
  },
  clearButton: {
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
  },
  clearButtonText: {
    color: theme.colors.danger,
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyStateIcon: {
    fontSize: 80,
    marginBottom: theme.spacing.lg,
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
    marginBottom: theme.spacing.xl,
  },
  shopButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    minHeight: 48,
    justifyContent: 'center',
  },
  shopButtonText: {
    color: theme.colors.background,
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
  },
});
