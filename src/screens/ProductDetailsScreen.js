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
import { theme } from '../theme';
import { formatCurrency } from '../utils/currency';

export const ProductDetailsScreen = ({ navigation, route }) => {
  const { product } = route.params;

  const renderInfoRow = (label, value) => {
    if (!value) return null;
    return (
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>{label}:</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {product.image ? (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: product.image }}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        ) : (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderIcon}>📖</Text>
          </View>
        )}

        <View style={styles.content}>
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.author}>by {product.author}</Text>
          <Text style={styles.price}>{formatCurrency(product.price)}</Text>

          {product.rating > 0 && (
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>⭐ {product.rating.toFixed(1)}</Text>
            </View>
          )}

          {product.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{product.description}</Text>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Product Details</Text>
            {renderInfoRow('Category', product.category)}
            {renderInfoRow('ISBN', product.isbn)}
            {renderInfoRow('Stock', product.stock?.toString())}
            {renderInfoRow('Pages', product.pages?.toString())}
            {renderInfoRow('Language', product.language)}
            {renderInfoRow('Publisher', product.publisher)}
            {renderInfoRow('Publication Date', product.publication_date)}
          </View>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('EditProduct', { product })}
          >
            <Text style={styles.editButtonText}>Edit Product</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  imageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    width: '100%',
    height: 300,
    backgroundColor: theme.colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderIcon: {
    fontSize: 80,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 8,
  },
  author: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: 12,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: theme.colors.text,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    width: 140,
  },
  infoValue: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  editButton: {
    backgroundColor: theme.colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 16,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
