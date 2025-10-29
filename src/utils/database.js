import * as SQLite from 'expo-sqlite';

let db;

// Initialize the database
export const initDatabase = async () => {
  try {
    db = await SQLite.openDatabaseAsync('bookshop.db');
    
    // Create tables if they don't exist
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'customer',
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        price REAL NOT NULL,
        category TEXT NOT NULL,
        isbn TEXT,
        description TEXT,
        stock INTEGER DEFAULT 0,
        image TEXT,
        rating REAL DEFAULT 0,
        pages INTEGER,
        language TEXT,
        publisher TEXT,
        publication_date TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        customer_name TEXT NOT NULL,
        customer_email TEXT NOT NULL,
        customer_address TEXT NOT NULL,
        total_amount REAL NOT NULL,
        order_date TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        FOREIGN KEY (user_id) REFERENCES users (id)
      );

      CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        book_id INTEGER NOT NULL,
        book_title TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders (id)
      );
    `);
    
    // Create default admin account if not exists
    const adminExists = await db.getFirstAsync(
      'SELECT * FROM users WHERE email = ?',
      ['admin@bookshop.com']
    );
    
    if (!adminExists) {
      await db.runAsync(
        'INSERT INTO users (full_name, email, password, role, created_at) VALUES (?, ?, ?, ?, ?)',
        ['Admin', 'admin@bookshop.com', 'admin123', 'admin', new Date().toISOString()]
      );
      console.log('Default admin account created: admin@bookshop.com / admin123');
    }
    
    console.log('Database initialized successfully');
    return db;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// Get database instance
export const getDatabase = () => {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
};

// Save an order to the database
export const saveOrder = async (orderData, cartItems, userId) => {
  try {
    const database = getDatabase();
    const orderDate = new Date().toISOString();
    
    // Insert order
    const result = await database.runAsync(
      'INSERT INTO orders (user_id, customer_name, customer_email, customer_address, total_amount, order_date) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, orderData.name, orderData.email, orderData.address, orderData.total, orderDate]
    );
    
    const orderId = result.lastInsertRowId;
    
    // Insert order items
    for (const item of cartItems) {
      await database.runAsync(
        'INSERT INTO order_items (order_id, book_id, book_title, quantity, price) VALUES (?, ?, ?, ?, ?)',
        [orderId, item.id, item.title, item.quantity, item.price]
      );
    }
    
    return orderId;
  } catch (error) {
    console.error('Error saving order:', error);
    throw error;
  }
};

// Get all orders
export const getAllOrders = async () => {
  try {
    const database = getDatabase();
    const orders = await database.getAllAsync('SELECT * FROM orders ORDER BY order_date DESC');
    return orders;
  } catch (error) {
    console.error('Error getting orders:', error);
    throw error;
  }
};

// Get order details with items
export const getOrderDetails = async (orderId) => {
  try {
    const database = getDatabase();
    
    const order = await database.getFirstAsync('SELECT * FROM orders WHERE id = ?', [orderId]);
    
    if (!order) {
      return null;
    }
    
    const items = await database.getAllAsync(
      'SELECT * FROM order_items WHERE order_id = ?',
      [orderId]
    );
    
    return {
      ...order,
      items
    };
  } catch (error) {
    console.error('Error getting order details:', error);
    throw error;
  }
};

// Delete an order
export const deleteOrder = async (orderId) => {
  try {
    const database = getDatabase();
    
    // Delete order items first (foreign key constraint)
    await database.runAsync('DELETE FROM order_items WHERE order_id = ?', [orderId]);
    
    // Delete order
    await database.runAsync('DELETE FROM orders WHERE id = ?', [orderId]);
    
    return true;
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
};

// Clear all data (for testing/development)
export const clearDatabase = async () => {
  try {
    const database = getDatabase();
    await database.execAsync(`
      DELETE FROM order_items;
      DELETE FROM orders;
    `);
    console.log('Database cleared successfully');
  } catch (error) {
    console.error('Error clearing database:', error);
    throw error;
  }
};

// ============ AUTH FUNCTIONS ============

// Register a new user
export const registerUser = async (fullName, email, password, role = 'customer') => {
  try {
    const database = getDatabase();
    
    // Check if email already exists
    const existingUser = await database.getFirstAsync(
      'SELECT * FROM users WHERE email = ?',
      [email.toLowerCase()]
    );
    
    if (existingUser) {
      throw new Error('Email already registered');
    }
    
    // Insert new user
    const result = await database.runAsync(
      'INSERT INTO users (full_name, email, password, role, created_at) VALUES (?, ?, ?, ?, ?)',
      [fullName, email.toLowerCase(), password, role, new Date().toISOString()]
    );
    
    return {
      id: result.lastInsertRowId,
      full_name: fullName,
      email: email.toLowerCase(),
      role: role
    };
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

// Login user
export const loginUser = async (email, password) => {
  try {
    const database = getDatabase();
    
    const user = await database.getFirstAsync(
      'SELECT id, full_name, email, role FROM users WHERE email = ? AND password = ?',
      [email.toLowerCase(), password]
    );
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    return user;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

// Get user by ID
export const getUserById = async (userId) => {
  try {
    const database = getDatabase();
    
    const user = await database.getFirstAsync(
      'SELECT id, full_name, email, role, created_at FROM users WHERE id = ?',
      [userId]
    );
    
    return user;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

// Get all users (admin only)
export const getAllUsers = async () => {
  try {
    const database = getDatabase();
    const users = await database.getAllAsync(
      'SELECT id, full_name, email, role, created_at FROM users ORDER BY created_at DESC'
    );
    return users;
  } catch (error) {
    console.error('Error getting users:', error);
    throw error;
  }
};

// ============ PRODUCT FUNCTIONS ============

// Add a new product
export const addProduct = async (productData) => {
  try {
    const database = getDatabase();
    const now = new Date().toISOString();
    
    const result = await database.runAsync(
      `INSERT INTO products (title, author, price, category, isbn, description, stock, image, rating, pages, language, publisher, publication_date, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        productData.title,
        productData.author,
        productData.price,
        productData.category,
        productData.isbn || null,
        productData.description || null,
        productData.stock || 0,
        productData.image || null,
        productData.rating || 0,
        productData.pages || null,
        productData.language || null,
        productData.publisher || null,
        productData.publication_date || null,
        now,
        now
      ]
    );
    
    return {
      id: result.lastInsertRowId,
      ...productData,
      created_at: now,
      updated_at: now
    };
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

// Get all products
export const getAllProducts = async () => {
  try {
    const database = getDatabase();
    const products = await database.getAllAsync('SELECT * FROM products ORDER BY created_at DESC');
    return products;
  } catch (error) {
    console.error('Error getting products:', error);
    throw error;
  }
};

// Get product by ID
export const getProductById = async (productId) => {
  try {
    const database = getDatabase();
    const product = await database.getFirstAsync('SELECT * FROM products WHERE id = ?', [productId]);
    return product;
  } catch (error) {
    console.error('Error getting product:', error);
    throw error;
  }
};

// Update product
export const updateProduct = async (productId, productData) => {
  try {
    const database = getDatabase();
    const now = new Date().toISOString();
    
    await database.runAsync(
      `UPDATE products SET 
        title = ?, author = ?, price = ?, category = ?, isbn = ?, 
        description = ?, stock = ?, image = ?, rating = ?, pages = ?, 
        language = ?, publisher = ?, publication_date = ?, updated_at = ?
       WHERE id = ?`,
      [
        productData.title,
        productData.author,
        productData.price,
        productData.category,
        productData.isbn || null,
        productData.description || null,
        productData.stock || 0,
        productData.image || null,
        productData.rating || 0,
        productData.pages || null,
        productData.language || null,
        productData.publisher || null,
        productData.publication_date || null,
        now,
        productId
      ]
    );
    
    return {
      id: productId,
      ...productData,
      updated_at: now
    };
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// Delete product
export const deleteProduct = async (productId) => {
  try {
    const database = getDatabase();
    await database.runAsync('DELETE FROM products WHERE id = ?', [productId]);
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};
