# 📚 Book Shop - React Native Mobile App

A complete, feature-rich book shopping mobile application built with React Native and Expo. This app demonstrates best practices for React Native development including navigation, state management, persistent storage, and responsive UI design.

## ✨ Features

- **📖 Book Catalog**: Browse a curated collection of books with detailed information
- **🔍 Search & Filter**: Search by title/author and filter by category
- **📝 Book Details**: View comprehensive book information including ratings, descriptions, and availability
- **🛒 Shopping Cart**: Add/remove items, adjust quantities with persistent storage
- **💳 Checkout Flow**: Complete checkout process with form validation
- **✅ Order Confirmation**: Post-purchase confirmation with order details
- **💾 Persistent Storage**: Cart data persists across app sessions using AsyncStorage
- **♿ Accessibility**: Built-in accessibility features with proper labels and roles
- **🎨 Modern UI**: Clean, intuitive interface with custom theme system

## 🏗️ Architecture

### Project Structure

```
book-shop/
├── App.js                          # Main app entry with navigation
├── src/
│   ├── screens/                    # Screen components
│   │   ├── HomeScreen.js          # Main book listing
│   │   ├── BookDetailsScreen.js   # Book detail view
│   │   ├── CartScreen.js          # Shopping cart
│   │   ├── CheckoutScreen.js      # Checkout form
│   │   └── OrderConfirmationScreen.js
│   ├── components/                 # Reusable components
│   │   └── BookCard.js            # Book list item
│   ├── context/                    # State management
│   │   └── CartContext.js         # Cart context provider
│   ├── data/                       # Static data
│   │   └── books.js               # Book catalog
│   ├── utils/                      # Utility functions
│   │   └── currency.js            # Currency formatting
│   └── theme.js                    # App-wide theme
└── assets/                         # Static assets
```

### Key Technologies

- **React Native** (v0.81.5) - Mobile framework
- **Expo** (~54.0) - Development platform
- **React Navigation** (v6) - Navigation library
- **AsyncStorage** - Persistent local storage
- **React Hooks** - State management (useState, useEffect, useContext, useMemo, useCallback)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Expo Go app (for testing on physical device) OR
- iOS Simulator (Mac only) / Android Emulator

### Installation

1. **Clone or navigate to the project**:

   ```bash
   cd /Users/admin/WorkSpace/mma301/book-shop
   ```

2. **Install dependencies** (if not already installed):

   ```bash
   npm install
   ```

3. **Start the development server**:

   ```bash
   npm start
   ```

4. **Run on a platform**:
   - **iOS Simulator** (Mac only):
     ```bash
     npm run ios
     ```
   - **Android Emulator**:
     ```bash
     npm run android
     ```
   - **Expo Go** (Physical Device):
     - Open Expo Go app
     - Scan the QR code from the terminal

## 📱 App Screens

### 1. Home Screen

- Displays all books in a scrollable list
- Search bar for finding books by title or author
- Category filter chips (All, Classic, Science Fiction, etc.)
- Cart icon with badge showing item count
- Tappable book cards with "Add to Cart" button

### 2. Book Details Screen

- Large book cover image
- Complete book information (title, author, description, price, rating)
- Metadata (ISBN, publisher, pages, publication date)
- Quantity selector
- "Add to Cart" button with real-time price calculation
- Stock availability indicator

### 3. Shopping Cart Screen

- List of all cart items with images
- Quantity adjustment controls
- Remove item functionality
- Real-time price calculations (subtotal, tax, total)
- "Proceed to Checkout" button
- "Clear Cart" option
- Empty state with "Continue Shopping" button

### 4. Checkout Screen

- Form fields for shipping information:
  - Full Name
  - Email
  - Phone Number
  - Street Address
  - City & Postal Code
  - Country
- Order summary with price breakdown
- Form validation before order placement
- "Place Order" button

### 5. Order Confirmation Screen

- Success message with checkmark
- Order ID and timestamp
- Order total
- Shipping address confirmation
- "What's Next?" information section
- "Continue Shopping" button

## 🎨 Design System

The app uses a consistent design system defined in `src/theme.js`:

- **Colors**: Primary, secondary, success, danger, warning, backgrounds, text
- **Spacing**: Consistent spacing scale (xs to xxl)
- **Typography**: Font sizes and weights
- **Shadows**: Pre-defined shadow styles for elevation
- **Border Radius**: Consistent corner radius values

## 🔧 State Management

### Cart Context

The app uses React Context API for cart state management:

```javascript
const {
  cart, // Array of cart items
  addToCart, // Add item to cart
  removeFromCart, // Remove item from cart
  updateQuantity, // Update item quantity
  clearCart, // Clear all items
  getCartTotal, // Calculate total price
  getCartCount, // Get total item count
} = useCart();
```

### Persistent Storage

Cart data is automatically saved to AsyncStorage and restored on app launch.

## ✅ Best Practices Implemented

### React Native Best Practices

- ✅ Functional components with hooks
- ✅ Memoization with `useMemo` and `useCallback`
- ✅ Proper use of `FlatList` for lists
- ✅ StyleSheet.create for styles
- ✅ SafeAreaView for proper screen boundaries
- ✅ KeyboardAvoidingView for forms
- ✅ Proper image handling with uri sources

### Performance

- ✅ List rendering optimized with `keyExtractor`
- ✅ Debounced search filtering
- ✅ Memoized computed values
- ✅ Optimized re-renders with React.memo patterns

### Accessibility

- ✅ Accessible labels for screen readers
- ✅ Proper accessibility roles
- ✅ Minimum touch target sizes (44x44)
- ✅ High contrast text and backgrounds

### Code Quality

- ✅ Clean, readable code structure
- ✅ Consistent naming conventions
- ✅ Proper component separation
- ✅ Reusable utility functions
- ✅ Type-safe prop handling

## 🧪 Testing

### Manual Testing Checklist

- [ ] Browse books and verify images load
- [ ] Search for books by title/author
- [ ] Filter books by category
- [ ] View book details
- [ ] Add items to cart with different quantities
- [ ] Navigate to cart and verify items
- [ ] Update quantities in cart
- [ ] Remove items from cart
- [ ] Complete checkout with valid/invalid data
- [ ] Verify order confirmation
- [ ] Close and reopen app - cart should persist
- [ ] Test on both iOS and Android

### Future Testing Enhancements

- Unit tests with Jest
- Component tests with React Native Testing Library
- Integration tests for cart flow
- E2E tests with Detox

## 🐛 Known Limitations

This is a demo application with the following intentional limitations:

1. **Mock Data**: Uses static book data (no real backend)
2. **Mock Checkout**: No real payment processing
3. **No Authentication**: No user login/signup
4. **No Order History**: Orders are not persisted
5. **Image Loading**: Uses external image URLs (requires internet)

## 🚀 Future Enhancements

Potential features for future development:

- [ ] User authentication (signup/login)
- [ ] Backend API integration
- [ ] Real payment processing
- [ ] Order history and tracking
- [ ] User reviews and ratings
- [ ] Wishlist functionality
- [ ] Push notifications
- [ ] Social sharing
- [ ] Multiple languages (i18n)
- [ ] Dark mode support
- [ ] Advanced search filters
- [ ] Barcode scanner for ISBN

## 📝 Development Notes

### From PE MMA301 Requirements

This Book Shop app was built as a practical exam project demonstrating:

1. **Mobile UI Development**: Clean, professional interface
2. **State Management**: React Context with AsyncStorage
3. **Navigation**: Multi-screen flow with React Navigation
4. **Form Handling**: Validation and user input
5. **Data Management**: CRUD operations on cart
6. **Best Practices**: Hooks, memoization, accessibility

### Technology Choices

- **Expo**: Chosen for rapid development and easy deployment
- **React Navigation**: Industry-standard navigation library
- **AsyncStorage**: Simple, reliable persistence
- **Functional Components**: Modern React patterns
- **Context API**: Lightweight state management (no Redux needed)

## 📄 License

This is a demo project created for educational purposes.

## 👨‍💻 Developer

Built with ❤️ using React Native and Expo

---

**Happy Shopping! 📚🛒**
