import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { formatCurrency } from '../utils/currency';

export const OrderConfirmationScreen = ({ route, navigation }) => {
  const { orderId, orderDate, total, shippingInfo } = route.params;

  const handleContinueShopping = () => {
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.successIcon}>
          <Text style={styles.successEmoji}>✅</Text>
        </View>

        <Text style={styles.title}>Order Placed Successfully!</Text>
        <Text style={styles.subtitle}>
          Thank you for your order. You will receive a confirmation email shortly.
        </Text>

        <View style={styles.orderCard}>
          <View style={styles.orderHeader}>
            <Text style={styles.orderLabel}>Order ID</Text>
            <Text style={styles.orderValue}>{orderId}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.orderRow}>
            <Text style={styles.orderLabel}>Order Date</Text>
            <Text style={styles.orderValue}>
              {new Date(orderDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>

          <View style={styles.orderRow}>
            <Text style={styles.orderLabel}>Order Time</Text>
            <Text style={styles.orderValue}>
              {new Date(orderDate).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>

          <View style={styles.orderRow}>
            <Text style={styles.orderLabel}>Total Amount</Text>
            <Text style={[styles.orderValue, styles.totalAmount]}>
              {formatCurrency(total)}
            </Text>
          </View>
        </View>

        <View style={styles.shippingCard}>
          <Text style={styles.cardTitle}>Shipping Address</Text>
          <Text style={styles.shippingText}>{shippingInfo.fullName}</Text>
          <Text style={styles.shippingText}>{shippingInfo.address}</Text>
          <Text style={styles.shippingText}>
            {shippingInfo.city}, {shippingInfo.postalCode}
          </Text>
          <Text style={styles.shippingText}>{shippingInfo.country}</Text>
          
          <View style={styles.contactInfo}>
            <Text style={styles.shippingText}>📧 {shippingInfo.email}</Text>
            <Text style={styles.shippingText}>📱 {shippingInfo.phone}</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>What's Next?</Text>
          <View style={styles.infoItem}>
            <Text style={styles.infoNumber}>1</Text>
            <Text style={styles.infoText}>
              You'll receive an order confirmation email
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoNumber}>2</Text>
            <Text style={styles.infoText}>
              Your order will be processed within 1-2 business days
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoNumber}>3</Text>
            <Text style={styles.infoText}>
              You'll receive shipping updates via email
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoNumber}>4</Text>
            <Text style={styles.infoText}>
              Estimated delivery: 5-7 business days
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleContinueShopping}
          accessible={true}
          accessibilityLabel="Continue shopping"
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>Continue Shopping</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
  },
  successIcon: {
    alignItems: 'center',
    marginVertical: theme.spacing.xl,
  },
  successEmoji: {
    fontSize: 80,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    lineHeight: 22,
  },
  orderCard: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.md,
  },
  orderHeader: {
    marginBottom: theme.spacing.md,
  },
  orderLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  orderValue: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.md,
  },
  orderRow: {
    marginBottom: theme.spacing.md,
  },
  totalAmount: {
    fontSize: theme.fontSize.xl,
    color: theme.colors.primary,
  },
  shippingCard: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  cardTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  shippingText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  contactInfo: {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  infoCard: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  infoTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  infoNumber: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
    width: 30,
  },
  infoText: {
    flex: 1,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    lineHeight: 22,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  buttonText: {
    color: theme.colors.background,
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
  },
});
