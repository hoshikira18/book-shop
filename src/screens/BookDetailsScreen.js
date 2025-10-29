import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '../context/CartContext';
import { theme } from '../theme';
import { formatCurrency } from '../utils/currency';

export const BookDetailsScreen = ({ route, navigation }) => {
  const { book } = route.params;
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(book, quantity);
    Alert.alert(
      'Added to Cart',
      `${quantity} x ${book.title} added to your cart`,
      [
        { text: 'Continue Shopping', style: 'cancel' },
        { text: 'View Cart', onPress: () => navigation.navigate('Cart') },
      ]
    );
  };

  const incrementQuantity = () => {
    if (quantity < book.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Image
          source={{ uri: book.image }}
          style={styles.image}
          resizeMode="contain"
          accessible={true}
          accessibilityLabel={`Cover of ${book.title}`}
        />
        
        <View style={styles.content}>
          <Text style={styles.title}>{book.title}</Text>
          <Text style={styles.author}>by {book.author}</Text>
          
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Category</Text>
              <Text style={styles.metaValue}>{book.category}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Rating</Text>
              <Text style={styles.metaValue}>⭐ {book.rating}/5</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Pages</Text>
              <Text style={styles.metaValue}>{book.pages}</Text>
            </View>
          </View>

          <View style={styles.priceRow}>
            <View>
              <Text style={styles.priceLabel}>Price</Text>
              <Text style={styles.price}>{formatCurrency(book.price)}</Text>
            </View>
            <View style={styles.stockInfo}>
              <Text style={styles.stockLabel}>In Stock:</Text>
              <Text style={styles.stockValue}>{book.stock} available</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{book.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Book Details</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>ISBN:</Text>
              <Text style={styles.detailValue}>{book.isbn}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Publisher:</Text>
              <Text style={styles.detailValue}>{book.publisher}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Language:</Text>
              <Text style={styles.detailValue}>{book.language}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Publication Date:</Text>
              <Text style={styles.detailValue}>
                {new Date(book.publicationDate).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.quantityContainer}>
          <Text style={styles.quantityLabel}>Quantity:</Text>
          <View style={styles.quantityControls}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={decrementQuantity}
              disabled={quantity <= 1}
              accessible={true}
              accessibilityLabel="Decrease quantity"
              accessibilityRole="button"
            >
              <Text style={styles.quantityButtonText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.quantityValue}>{quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={incrementQuantity}
              disabled={quantity >= book.stock}
              accessible={true}
              accessibilityLabel="Increase quantity"
              accessibilityRole="button"
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={handleAddToCart}
          accessible={true}
          accessibilityLabel={`Add ${quantity} copies to cart`}
          accessibilityRole="button"
        >
          <Text style={styles.addToCartText}>
            Add to Cart • {formatCurrency(book.price * quantity)}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 400,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  content: {
    padding: theme.spacing.lg,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  author: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
  },
  metaItem: {
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  metaValue: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  priceLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  price: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
  },
  stockInfo: {
    alignItems: 'flex-end',
  },
  stockLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  stockValue: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.success,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  description: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    lineHeight: 24,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
  },
  detailLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    width: 140,
  },
  detailValue: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    flex: 1,
  },
  footer: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    ...theme.shadows.lg,
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  quantityLabel: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
  },
  quantityButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: theme.fontSize.xl,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.bold,
  },
  quantityValue: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    paddingHorizontal: theme.spacing.lg,
    minWidth: 60,
    textAlign: 'center',
  },
  addToCartButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  addToCartText: {
    color: theme.colors.background,
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
  },
});
