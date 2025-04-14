const express = require('express');
const sequelize = require('./db');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRouter = require('./routes/auth/auth-routes');
const adminProductsRouter = require('./routes/admin/products-routes');
const shopProductsRouter = require('./routes/shop/products-routes');
const shopCartRouter = require('./routes/shop/cart-routes');
const shopAddressRouter = require('./routes/shop/address-routes');
const shopSearchRouter = require('./routes/shop/search-routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Sequelize connection
sequelize.authenticate()
  .then(() => {
    console.log('MySQL connected');
    return sequelize.sync();
  })
  // .then(() => {
    
  // })
  .catch(err => console.log('DB connection error:', err));

// Middleware
app.use(
  cors({
    origin: 'http://localhost:1573',
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
  })
);
app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/admin/products', adminProductsRouter);
app.use('/api/shop/products', shopProductsRouter);
app.use('/api/shop/cart', shopCartRouter);
app.use('/api/shop/address', shopAddressRouter);
app.use('/api/shop/search', shopSearchRouter);

// Start server
app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`));
