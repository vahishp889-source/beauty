const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'beauty-secret-key-2024';

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/beauty';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// User Model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

// Product Model
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, enum: ['makeup', 'skincare', 'fragrance'], required: true },
  images: [{ type: String }],
  shades: [{
    name: String,
    color: String,
    inStock: { type: Boolean, default: true },
  }],
  rating: { type: Number, default: 0 },
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: Number,
    comment: String,
    createdAt: { type: Date, default: Date.now },
  }],
  stock: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  isNew: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Product = mongoose.model('Product', productSchema);

// Order Model
const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    productName: String,
    shade: String,
    quantity: Number,
    price: Number,
  }],
  shippingAddress: {
    firstName: String,
    lastName: String,
    email: String,
    address: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    phone: String,
  },
  subtotal: Number,
  shipping: Number,
  tax: Number,
  total: Number,
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  paymentMethod: String,
  notes: String,
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model('Order', orderSchema);

// Auth Middleware
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.userId).select('-password');
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Admin Middleware
const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin only.' });
  }
};

// AUTH ROUTES
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  res.json({ user: req.user });
});

// PRODUCT ROUTES
app.get('/api/products', async (req, res) => {
  try {
    const { category, brand, minPrice, maxPrice, sort, search, page = 1, limit = 12 } = req.query;
    let query = {};
    
    if (category && category !== 'all') query.category = category;
    if (brand) query.brand = { $in: brand.split(',') };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
      ];
    }

    let sortOption = {};
    if (sort) {
      switch (sort) {
        case 'price-low': sortOption = { price: 1 }; break;
        case 'price-high': sortOption = { price: -1 }; break;
        case 'rating': sortOption = { rating: -1 }; break;
        case 'newest': sortOption = { createdAt: -1 }; break;
        default: sortOption = { featured: -1, createdAt: -1 };
      }
    }

    const products = await Product.find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Product.countDocuments(query);

    res.json({
      products,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('reviews.user', 'name');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ product });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/products', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ product });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.put('/api/products/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ product });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.delete('/api/products/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ORDER ROUTES
app.post('/api/orders', async (req, res) => {
  try {
    const { items, shippingAddress, pricing, pricingINR, paymentMethod, status, notes } = req.body;
    
    const orderData = {
      shippingAddress,
      paymentMethod,
      status: status || 'pending',
      notes: notes || '',
    };

    // Handle authenticated user
    if (req.user) {
      orderData.user = req.user._id;
    }

    // Format items - use items array as provided (may include productName for display)
    if (items && items.length > 0) {
      orderData.items = items.map(item => ({
        product: item.product || null,
        shade: item.shade || null,
        quantity: item.quantity,
        price: item.price,
      }));
    }

    // Use pricing data
    if (pricingINR) {
      orderData.subtotal = pricingINR.subtotal;
      orderData.shipping = pricingINR.shipping;
      orderData.tax = pricingINR.tax;
      orderData.total = pricingINR.total;
    } else if (pricing) {
      orderData.subtotal = pricing.subtotal;
      orderData.shipping = pricing.shipping;
      orderData.tax = pricing.tax;
      orderData.total = pricing.total;
    }

    const order = new Order(orderData);
    await order.save();
    
    // Update user's orders if authenticated
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, { $push: { orders: order._id } });
    }

    res.status(201).json({ order });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/orders', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name images price')
      .sort({ createdAt: -1 });
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/orders/:id', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name images price')
      .populate('user', 'name email');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ADMIN ROUTES
app.get('/api/admin/stats', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    res.json({
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/admin/orders', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.put('/api/admin/orders/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Seed Data Endpoint (for development)
app.post('/api/seed', async (req, res) => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@beauty.com',
      password: adminPassword,
      role: 'admin',
    });

    // Create products
    const products = await Product.insertMany([
      {
        name: 'Matte Lipstick Collection',
        brand: 'MAC',
        description: 'A collection of highly pigmented matte lipsticks with intense color payoff and long-lasting wear.',
        price: 54,
        category: 'makeup',
        images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600'],
        shades: [
          { name: 'Ruby Woo', color: '#C25B56' },
          { name: 'Velvet Teddy', color: '#B76E79' },
          { name: 'Lady Danger', color: '#D62828' },
        ],
        rating: 4.8,
        stock: 150,
        isNew: true,
        featured: true,
      },
      {
        name: "Pro Filt'r Soft Matte Foundation",
        brand: 'FENTY BEAUTY',
        description: 'A soft matte foundation that provides medium coverage with a natural finish.',
        price: 39,
        category: 'makeup',
        images: ['https://images.unsplash.com/photo-1596462502278-27bfdd403348?w=600'],
        shades: [
          { name: 'Shade 1', color: '#8D5524' },
          { name: 'Shade 2', color: '#C68642' },
          { name: 'Shade 3', color: '#F5D5C8' },
        ],
        rating: 4.9,
        stock: 80,
        featured: true,
      },
      {
        name: 'Dior Sauvage Elixir',
        brand: 'DIOR',
        description: 'A powerful and mysterious fragrance with spicy notes and woody undertones.',
        price: 185,
        category: 'fragrance',
        images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?w=600'],
        shades: [],
        rating: 4.7,
        stock: 45,
        discount: 15,
        featured: true,
      },
      {
        name: 'Soft Matte Complete Foundation',
        brand: 'NARS',
        description: 'A full coverage foundation with a soft matte finish that lasts all day.',
        price: 49,
        category: 'makeup',
        images: ['https://images.unsplash.com/photo-1515688594390-b649af70d282?w=600'],
        shades: [
          { name: 'Siberia', color: '#F5D5C8' },
          { name: 'Shell Beach', color: '#E8B4A6' },
        ],
        rating: 4.6,
        stock: 120,
        featured: true,
      },
      {
        name: 'Naked3 Eyeshadow Palette',
        brand: 'URBAN DECAY',
        description: 'A palette of neutral pinkish nude shades for everyday looks.',
        price: 54,
        category: 'makeup',
        images: ['https://images.unsplash.com/photo-1583241800698-e8ab01830a07?w=600'],
        shades: [],
        rating: 4.8,
        stock: 65,
        featured: true,
      },
      {
        name: 'Tiffany & Co. Eau de Parfum',
        brand: 'TIFFANY',
        description: 'A luxurious fragrance with floral and woody notes.',
        price: 125,
        category: 'fragrance',
        images: ['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600'],
        shades: [],
        rating: 4.9,
        stock: 30,
        isNew: true,
      },
    ]);

    res.json({ message: 'Database seeded successfully', products, admin });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
