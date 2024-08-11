const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv/config");

app.use(cors());
app.options("*", cors());
app.use(bodyParser.json());

const categoryRoutes = require('./routes/categories');
const subCatSchema = require('./routes/subCat');
const productRoutes = require('./routes/products');


app.use('/uploads', express.static('uploads'));
app.use('/api/category', categoryRoutes);
app.use('/api/subCat', subCatSchema);
app.use('/api/products', productRoutes);

mongoose.connect(process.env.CONNECTION_STRING)
  .then(() => {
    console.log("Database Connection is ready...");
    app.listen(process.env.PORT, () => {
      console.log(`server is running http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
