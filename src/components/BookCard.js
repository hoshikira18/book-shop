import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../theme';
import { formatCurrency } from '../utils/currency';

export const BookCard = ({ book, onPress, onAddToCart }) => {
  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress}
      activeOpacity={0.7}
      accessible={true}
      accessibilityLabel={`Book: ${book.title} by ${book.author}, Price: ${formatCurrency(book.price)}`}
      accessibilityRole="button"
    >
      <Image 
        source={{ uri: book.image }} 
        style={styles.image}
        resizeMode="cover"
        accessible={true}
        accessibilityLabel={`Cover of ${book.title}`}
      />
      <View style={styles.details}>
        <Text style={styles.title} numberOfLines={2}>{book.title}</Text>
        <Text style={styles.author} numberOfLines={1}>{book.author}</Text>
        <Text style={styles.category}>{book.category}</Text>
        <View style={styles.footer}>
          <Text style={styles.price}>{formatCurrency(book.price)}</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={(e) => {
              e.stopPropagation();
              onAddToCart(book);
            }}
            accessible={true}
            accessibilityLabel={`Add ${book.title} to cart`}
            accessibilityRole="button"
          >
            <Text style={styles.addButtonText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    flexDirection: 'row',
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  image: {
    width: 100,
    height: 150,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  details: {
    flex: 1,
    padding: theme.spacing.md,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  author: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  category: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.medium,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  price: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    minHeight: 44, // Minimum touch target size
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: theme.colors.background,
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
  },
});
