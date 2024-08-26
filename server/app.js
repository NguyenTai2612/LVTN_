const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const authJwt = require('./helper/jwt.js')

app.use(cors());
app.options('*', cors());


app.use(bodyParser.json());
app.use(express.json());
// app.use(authJwt());



const stripe = require('./routes/stripe.js')
const categoryRoutes = require('./routes/categories');
const subCatRoutes = require('./routes/subCat');
const productRoutes = require('./routes/products');
const imageUploadRoutes = require('./routes/imageUpload'); // Add this line
const userRoutes = require('./routes/user'); 
const cart = require('./routes/cart.js'); 
const productReviews = require('./routes/productReviews.js'); 
const checkout = require('./routes/checkout.js'); 

app.use('/uploads', express.static('uploads'));
app.use('/api/category', categoryRoutes);
app.use('/api/subCat', subCatRoutes);
app.use('/api/products', productRoutes);
app.use('/api/imageUpload', imageUploadRoutes); // Add this line
app.use('/api/user', userRoutes);
app.use('/api/cart', cart);
app.use('/api/productReviews', productReviews);
app.use('/api/stripe', stripe);
app.use('/api/checkout', checkout);

mongoose.connect(process.env.CONNECTION_STRING)
  .then(() => {
    console.log('Database Connection is ready...');
    app.listen(process.env.PORT, () => {
      console.log(`Server is running at http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
