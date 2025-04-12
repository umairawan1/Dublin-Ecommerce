const express = require('express')
const mongoose = require('mongoose');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRouter = require('./routes/auth/auth-routes')
const adminProductsRouter = require('./routes/admin/products-routes')
const shopProductsRouter = require('./routes/shop/products-routes')
const shopCartRouter = require('./routes/shop/cart-routes')
const shopAddressRouter = require('./routes/shop/address-routes')
const shopSearchRouter = require('./routes/shop/search-routes')


const app = express()

const PORT = process.env.PORT || 5000;
const DB_URI = process.env.MONGO_URI;

mongoose.connect(DB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));


//http://localhost:1573/auth/login
  app.use(
    cors({
      origin: 'http://localhost:1573', // frontend origin
      credentials: true, // allow cookies / credentials
      methods: ['GET', 'POST', 'DELETE', 'PUT'],
    })
  );
  

app.use(cookieParser());
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/admin/products',adminProductsRouter);
app.use('/api/shop/products',shopProductsRouter)
app.use('/api/shop/cart',shopCartRouter)
app.use('/api/shop/address',shopAddressRouter)
app.use('/api/shop/search',shopSearchRouter)

app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`)); 