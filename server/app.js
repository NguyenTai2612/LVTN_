const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());

const categoryRoutes = require('./routes/categories');
const subCatRoutes = require('./routes/subCat');
const productRoutes = require('./routes/products');
const imageUploadRoutes = require('./routes/imageUpload'); // Add this line

app.use('/uploads', express.static('uploads'));
app.use('/api/category', categoryRoutes);
app.use('/api/subCat', subCatRoutes);
app.use('/api/products', productRoutes);
app.use('/api/imageUpload', imageUploadRoutes); // Add this line

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
