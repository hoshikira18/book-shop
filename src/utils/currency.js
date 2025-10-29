/**
 * Format a number as currency
 * @param {number} amount - The amount to format
 * @param {string} currencyCode - Currency code (default: USD)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currencyCode = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(amount);
};

/**
 * Calculate total price for items in cart
 * @param {Array} items - Array of cart items with price and quantity
 * @returns {number} Total price
 */
export const calculateTotal = (items) => {
  return items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
};

/**
 * Calculate tax (example: 10%)
 * @param {number} subtotal - Subtotal amount
 * @param {number} taxRate - Tax rate (default: 0.1 for 10%)
 * @returns {number} Tax amount
 */
export const calculateTax = (subtotal, taxRate = 0.1) => {
  return subtotal * taxRate;
};
