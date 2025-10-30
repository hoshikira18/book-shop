# 📚 Book Shop - React Native Mobile Application

A complete e-commerce mobile application for browsing and purchasing books. This project is built with React Native and Expo, featuring both customer shopping functionality and admin management capabilities.

## 📱 What is This Project?

This is a **mobile application** that runs on both iOS and Android devices. It's like an online bookstore that fits in your pocket! The app has two main modes:

- **Customer Mode**: Browse books, add them to cart, and place orders
- **Admin Mode**: Manage books inventory, view sales statistics, and track orders

## ✨ Main Features

### For Customers:

- 📖 **Browse Books**: View a catalog of books with covers, prices, and ratings
- 🔍 **Search & Filter**: Find books by title, author, or category
- � **Book Details**: See detailed information including descriptions, ISBN, publisher, etc.
- 🛒 **Shopping Cart**: Add/remove books, adjust quantities
- 💳 **Checkout**: Complete purchase with shipping information
- 📦 **Order History**: View past orders and details
- 🔐 **User Account**: Sign up, login, and stay logged in

### For Admins:

- ➕ **Add Products**: Add new books to the catalog with images
- ✏️ **Edit Products**: Update book information and stock levels
- 🗑️ **Delete Products**: Remove books from the catalog
- 📊 **Revenue Statistics**: View sales data and popular books
- 📦 **Order Management**: Track all customer orders

## 🛠️ Technology Stack (What's Used to Build This)

### Core Technologies:

- **React Native** (v0.81.5) - Framework for building mobile apps using JavaScript
- **Expo** (~54.0) - Development platform that makes React Native easier
- **React** (v19.1.0) - JavaScript library for building user interfaces

### Key Libraries:

- **React Navigation** - Handles moving between different screens in the app
- **Expo SQLite** - Local database for storing users, products, and orders
- **AsyncStorage** - Saves data locally (like shopping cart)
- **Expo Image Picker** - Allows users to select images from device

## 📂 Project Structure Explained

````
book-shop/
├── App.js                              # Main entry point - starts the app
├── index.js                            # Root file that launches App.js
├── package.json                        # Lists all dependencies and scripts
├── app.json                            # Expo configuration
│
├── assets/                             # Images, fonts, and other static files
│
└── src/                                # Source code folder
    ├── components/                     # Reusable UI pieces
    │   └── BookCard.js                # Component to display a single book
    │
    ├── context/                        # Global state management
    │   ├── AuthContext.js             # Manages user login/logout
    │   ├── CartContext.js             # Manages shopping cart
    │   └── ProductContext.js          # Manages book catalog
    │
    ├── data/                           # Static data
    │   └── books.js                   # Initial book catalog data
    │
    ├── screens/                        # Different pages/screens of the app
    │   ├── HomeScreen.js              # Main screen showing all books
    │   ├── BookDetailsScreen.js       # Detailed view of a single book
    │   ├── CartScreen.js              # Shopping cart page
    │   ├── CheckoutScreen.js          # Checkout form
    │   ├── OrderConfirmationScreen.js # Order success page
    │   ├── LoginScreen.js             # User login
    │   ├── SignupScreen.js            # User registration
    │   ├── AdminDashboardScreen.js    # Admin home screen
    │   ├── ManageProductsScreen.js    # Admin product list
    │   ├── AddProductScreen.js        # Admin add new book
    │   ├── EditProductScreen.js       # Admin edit book
    │   ├── ProductDetailsScreen.js    # Admin view book details
    │   └── RevenueStatisticsScreen.js # Admin sales statistics
    │
    ├── utils/                          # Helper functions
    │   ├── currency.js                # Format prices (e.g., $19.99)
    │   ├── database.js                # Database operations
    │   └── insertBooks.js             # Script to populate database
    │
    └── theme.js                        # Color scheme and styling constants

## 🚀 Getting Started (Step-by-Step for Beginners)

### What You Need First (Prerequisites)

Before you can run this app, you need to install some software on your computer:

1. **Node.js** (v18 or later) - Download from [nodejs.org](https://nodejs.org/)
   - This is a JavaScript runtime that lets you run the app
   - After installing, verify by typing in terminal: `node --version`

2. **A way to view the app**:
   - **Option A (Easiest)**: Download "Expo Go" app on your iPhone or Android phone
   - **Option B**: Install Android Studio (for Android Emulator) or Xcode (for iOS Simulator, Mac only)

### Installation Steps

#### Step 1: Open Terminal/Command Prompt
- **Mac**: Open "Terminal" app
- **Windows**: Open "Command Prompt" or "PowerShell"

#### Step 2: Navigate to the Project Folder
```bash
cd /Users/admin/WorkSpace/mma301/book-shop
````

(Or wherever you've saved this project)

#### Step 3: Install All Dependencies

This downloads all the necessary libraries and packages:

```bash
npm install
```

Wait for this to complete (may take a few minutes).

#### Step 4: Initialize the Database

This creates the database and adds sample books:

```bash
node src/utils/insertBooks.js
```

#### Step 5: Start the App

```bash
npm start
```

This will open a new window in your browser with a QR code.

#### Step 6: View the App

**Option A - Using Your Phone (Recommended for Beginners):**

1. Install "Expo Go" from App Store (iPhone) or Play Store (Android)
2. Open Expo Go app
3. Tap "Scan QR Code"
4. Point your camera at the QR code in the terminal
5. The app will load on your phone!

**Option B - Using Simulator/Emulator:**

- For iOS (Mac only): Press `i` in the terminal or run `npm run ios`
- For Android: Press `a` in the terminal or run `npm run android`

### Default Login Credentials

**Admin Account:**

- Email: `admin@bookshop.com`
- Password: `admin123`

**Customer Account:**

- You can create a new account using the "Sign Up" option in the app

## 📱 How to Use the App

### Customer Journey:

1. **Browse Books**:

   - Open the app to see the home screen with all available books
   - Scroll through the catalog
   - Use the search bar to find specific books
   - Filter by category (Fiction, Non-Fiction, Science, etc.)

2. **View Book Details**:

   - Tap on any book card to see full details
   - See price, description, author, rating, and stock availability
   - Select quantity using + and - buttons

3. **Add to Cart**:

   - Tap "Add to Cart" button
   - See confirmation and cart badge update
   - Continue shopping or go to cart

4. **Checkout**:

   - Tap cart icon (top right)
   - Review your items and adjust quantities if needed
   - Tap "Proceed to Checkout"
   - Fill in shipping information
   - Tap "Place Order"
   - See order confirmation with order details

5. **View Order History**:
   - Access from the menu to see past orders

### Admin Journey:

1. **Login as Admin**:

   - Use credentials: `admin@bookshop.com` / `admin123`
   - Access admin dashboard

2. **Manage Products**:

   - View all products in inventory
   - Add new books with title, author, price, description, and image
   - Edit existing book information
   - Delete books from catalog
   - Update stock quantities

3. **View Statistics**:
   - See revenue overview
   - Check most popular books
   - View order trends
   - Track sales performance

## 🏗️ How the App Works (Technical Overview)

### The Database (SQLite)

The app uses a local database stored on your device. It has 4 tables:

- **users**: Stores user accounts (customers and admins)
- **products**: Stores all book information
- **orders**: Stores order details
- **order_items**: Stores which books are in each order

### Navigation Flow

```
Login/Signup → Home Screen → Book Details → Cart → Checkout → Order Confirmation
                   ↓
              Admin Dashboard → Manage Products → Add/Edit/Delete Books
                   ↓
              Revenue Statistics
```

### State Management (How Data is Shared)

The app uses **React Context** - think of it as a central storage that all screens can access:

1. **AuthContext**: Knows who is logged in (customer or admin)
2. **CartContext**: Remembers what's in the shopping cart
3. **ProductContext**: Manages the list of all books

### Data Persistence (Remembering Data)

- **Shopping Cart**: Saved using AsyncStorage (like cookies in a browser)
- **User Session**: Remembers if you're logged in
- **Database**: SQLite stores users, products, and orders permanently

## � Important Files Explained

### Core Files:

- **App.js**: The "brain" of the app - sets up navigation and wraps everything
- **index.js**: The starting point that launches App.js
- **package.json**: Lists all external libraries the app needs

### Screen Files (src/screens/):

Each file represents one page in the app:

- **HomeScreen.js**: The main page showing all books
- **LoginScreen.js**: Where users log in
- **CartScreen.js**: Shows your shopping cart
- **AdminDashboardScreen.js**: Admin control panel

### Context Files (src/context/):

These manage shared data across the app:

- **AuthContext.js**: Handles login/logout/user info
- **CartContext.js**: Manages shopping cart operations
- **ProductContext.js**: Manages book catalog

### Utility Files (src/utils/):

Helper functions:

- **database.js**: Functions to interact with SQLite database
- **currency.js**: Formats numbers as currency ($19.99)
- **insertBooks.js**: Script to add initial books to database

## 🎨 Design & Styling

The app uses a theme system (`src/theme.js`) that defines:

- **Colors**: Consistent color palette throughout the app
- **Spacing**: Standard sizes for margins and padding
- **Typography**: Font sizes and styles
- **Shadows**: Drop shadows for cards and buttons

This makes the app look professional and consistent.

## 🔧 Common Issues & Solutions

### Problem: "npm: command not found"

**Solution**: You need to install Node.js first from [nodejs.org](https://nodejs.org/)

### Problem: App won't start

**Solution**:

1. Make sure you ran `npm install` first
2. Try clearing cache: `npm start -- --clear`
3. Delete `node_modules` folder and run `npm install` again

### Problem: "Database not initialized"

**Solution**: Run `node src/utils/insertBooks.js` to create the database

### Problem: Can't see the app on Expo Go

**Solution**:

1. Make sure your phone and computer are on the same WiFi network
2. Try scanning the QR code again
3. Check if Expo Go app is updated to the latest version

### Problem: Images not loading

**Solution**: Make sure you have an internet connection (book cover images are loaded from URLs)

### Problem: App crashes on startup

**Solution**:

1. Check terminal for error messages
2. Try restarting the Expo server (`npm start`)
3. Restart your phone/emulator

## 💡 Tips for Developers

### Making Changes to the Code

1. **Edit a Screen**:

   - Go to `src/screens/` folder
   - Find the screen you want to modify
   - Make your changes
   - Save the file - the app will automatically reload!

2. **Change Colors/Styling**:

   - Edit `src/theme.js` to change the color scheme
   - Changes apply app-wide

3. **Add a New Screen**:

   - Create a new file in `src/screens/`
   - Add it to the navigation in `App.js`
   - Import and add a new `<Stack.Screen>` component

4. **Modify Database**:
   - Edit `src/utils/database.js`
   - Be careful changing table structures!

### Understanding React Native Basics

**Components**: Building blocks of the UI (like LEGO pieces)

- `<View>`: Like a `<div>` in HTML - a container
- `<Text>`: Displays text
- `<Image>`: Shows images
- `<TouchableOpacity>`: A button that can be tapped
- `<FlatList>`: Efficiently displays lists of data

**Hooks**: Special functions that add capabilities to components

- `useState`: Stores data that can change
- `useEffect`: Runs code when component loads or updates
- `useContext`: Accesses shared data from Context

**Navigation**: Moving between screens

- `navigation.navigate('ScreenName')`: Go to a screen
- `navigation.goBack()`: Go back to previous screen

## 📚 Learning Resources

### For React Native Beginners:

- [React Native Official Docs](https://reactnative.dev/docs/getting-started) - Best starting point
- [Expo Documentation](https://docs.expo.dev/) - Learn about Expo features
- [React Documentation](https://react.dev/) - Understand React basics

### YouTube Channels:

- Programming with Mosh
- The Net Ninja
- Academind

### Practice:

1. Try changing button colors
2. Add new fields to forms
3. Modify text on screens
4. Add new books to the database
5. Create a new feature!

## 🤝 How to Modify This Project

### Scenario 1: Adding a New Book Category

1. Go to `src/data/books.js`
2. Add books with your new category name
3. The category will automatically appear in filters!

### Scenario 2: Changing the App Name

1. Open `app.json`
2. Change the `"name"` field
3. Restart the app

### Scenario 3: Adding User Profile Pictures

1. Install image picker (already installed!)
2. Add an image field to the users table in `database.js`
3. Create a profile screen
4. Add image selection functionality

### Scenario 4: Adding a Wishlist Feature

1. Create `WishlistContext.js` in `src/context/`
2. Add wishlist table to database
3. Create `WishlistScreen.js` in `src/screens/`
4. Add "Add to Wishlist" buttons

## � Project Statistics

- **Lines of Code**: ~3000+
- **Number of Screens**: 13
- **Number of Components**: 1 reusable component
- **Context Providers**: 3
- **Database Tables**: 4
- **External Libraries**: 10+

## ⚠️ Important Notes

1. **This is a Learning Project**: Not production-ready for a real store
2. **No Real Payments**: Checkout is simulated only
3. **Local Data**: Everything is stored on the device
4. **Security**: Passwords are NOT encrypted (don't use real passwords!)
5. **Internet Required**: For loading book cover images

## 🎯 What You Can Learn From This Project

- ✅ How to build a complete mobile app
- ✅ Navigation between multiple screens
- ✅ Working with forms and user input
- ✅ Managing state with Context API
- ✅ Using a local database (SQLite)
- ✅ Persisting data with AsyncStorage
- ✅ Building reusable components
- ✅ Implementing user authentication
- ✅ Creating admin and customer roles
- ✅ CRUD operations (Create, Read, Update, Delete)
- ✅ Working with images
- ✅ Form validation
- ✅ List rendering and filtering
- ✅ Search functionality

## 📞 Need Help?

If you're stuck or have questions:

1. **Check the terminal** for error messages
2. **Read the error carefully** - it often tells you what's wrong
3. **Google the error message** - someone else probably had the same issue
4. **Check React Native docs** for component usage
5. **Use console.log()** to debug - add `console.log('test')` to see if code runs

### Debugging Tips:

```javascript
// Add this to any file to see what's happening:
console.log("Current user:", user);
console.log("Cart items:", cart);
console.log("Navigation state:", navigation);
```

Look for these messages in the terminal where you ran `npm start`.

## 🚀 Next Steps After Understanding This Project

1. **Customize it**: Change colors, add features, make it yours!
2. **Build something new**: Use this as a template for other apps
3. **Learn backend**: Connect this to a real server (Node.js, Firebase)
4. **Deploy it**: Publish to App Store or Google Play
5. **Add testing**: Learn to write tests for your code

---

## 📝 Summary

This is a **full-featured mobile book shopping app** that demonstrates professional React Native development. It's perfect for learning because it includes:

- Complete user flows (browsing, cart, checkout)
- Admin management panel
- Database integration
- Modern React patterns
- Clean, readable code

**You don't need to be an expert** to understand this project - just take it one screen at a time, read the code, and experiment!

---

**Happy Learning and Coding! 🎉📱**

If you're taking over this project, start by running it, clicking through all the screens, and then reading through the screen files one by one. You'll understand it faster than you think!
