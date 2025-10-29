import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { saveOrder } from '../utils/database';
import { theme } from '../theme';
import { formatCurrency } from '../utils/currency';

export const CheckoutScreen = ({ navigation }) => {
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });

  // Pre-fill form with user data
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.full_name || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  const subtotal = getCartTotal();
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const { fullName, email, phone, address, city, postalCode, country } = formData;
    
    if (!fullName || !email || !phone || !address || !city || !postalCode || !country) {
      Alert.alert('Validation Error', 'Please fill in all fields');
      return false;
    }

    if (!email.includes('@')) {
      Alert.alert('Validation Error', 'Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      // Save order to database
      const orderId = await saveOrder(
        {
          name: formData.fullName,
          email: formData.email,
          address: `${formData.address}, ${formData.city}, ${formData.postalCode}, ${formData.country}`,
          total: total,
        },
        cart,
        user.id
      );

      const orderDate = new Date().toISOString();

      // Clear the cart
      clearCart();

      // Navigate to order confirmation
      navigation.replace('OrderConfirmation', {
        orderId,
        orderDate,
        total,
        shippingInfo: formData,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to place order. Please try again.');
      console.error('Order error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>Shipping Information</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={formData.fullName}
              onChangeText={(value) => handleInputChange('fullName', value)}
              accessible={true}
              accessibilityLabel="Full name input"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
              accessible={true}
              accessibilityLabel="Email input"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={formData.phone}
              onChangeText={(value) => handleInputChange('phone', value)}
              keyboardType="phone-pad"
              accessible={true}
              accessibilityLabel="Phone number input"
            />
            
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Street Address"
              value={formData.address}
              onChangeText={(value) => handleInputChange('address', value)}
              multiline
              numberOfLines={3}
              accessible={true}
              accessibilityLabel="Address input"
            />
            
            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="City"
                value={formData.city}
                onChangeText={(value) => handleInputChange('city', value)}
                accessible={true}
                accessibilityLabel="City input"
              />
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder="Postal Code"
                value={formData.postalCode}
                onChangeText={(value) => handleInputChange('postalCode', value)}
                accessible={true}
                accessibilityLabel="Postal code input"
              />
            </View>
            
            <TextInput
              style={styles.input}
              placeholder="Country"
              value={formData.country}
              onChangeText={(value) => handleInputChange('country', value)}
              accessible={true}
              accessibilityLabel="Country input"
            />

            <View style={styles.orderSummary}>
              <Text style={styles.sectionTitle}>Order Summary</Text>
              <Text style={styles.itemCount}>{cart.length} {cart.length === 1 ? 'item' : 'items'}</Text>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>{formatCurrency(subtotal)}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tax (10%)</Text>
                <Text style={styles.summaryValue}>{formatCurrency(tax)}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Shipping</Text>
                <Text style={[styles.summaryValue, styles.freeShipping]}>FREE</Text>
              </View>
              
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
              </View>
            </View>

            <View style={styles.note}>
              <Text style={styles.noteText}>
                📌 This is a demo checkout. No real payment will be processed.
              </Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.placeOrderButton}
            onPress={handlePlaceOrder}
            accessible={true}
            accessibilityLabel="Place order"
            accessibilityRole="button"
          >
            <Text style={styles.placeOrderText}>
              Place Order • {formatCurrency(total)}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  input: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.fontSize.md,
    marginBottom: theme.spacing.md,
    minHeight: 48,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  orderSummary: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.md,
  },
  itemCount: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  summaryLabel: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
  summaryValue: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
  },
  freeShipping: {
    color: theme.colors.success,
  },
  totalRow: {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
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
  note: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  noteText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  footer: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    ...theme.shadows.lg,
  },
  placeOrderButton: {
    backgroundColor: theme.colors.success,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  placeOrderText: {
    color: theme.colors.background,
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
  },
});
