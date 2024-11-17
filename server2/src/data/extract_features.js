// File: src/scripts/update_features.js
const fs = require('fs');
const path = require('path');
const tf = require('@tensorflow/tfjs'); // Dùng tfjs (không native bindings)
const axios = require('axios');
const sharp = require('sharp');
const { Product, ProductImage } = require('../models'); // Đường dẫn chính xác tới models

// Tải mô hình VGG16
// Load pre-trained ResNet50 model
const loadResNet50 = async () => {
  console.log("Loading ResNet50 model...");
  const model = await tf.loadGraphModel(
    'https://storage.googleapis.com/tfjs-models/savedmodel/resnet50/model.json'
  );
  console.log("ResNet50 model loaded successfully.");
  return model;
};

// Update features in the database
const updateProductFeatures = async () => {
  try {
    const model = await loadResNet50();
    const products = await Product.findAll({ include: ProductImage });

    for (const product of products) {
      const images = product.ProductImages.map((img) => img.imageUrl);

      if (images.length === 0) {
        console.warn(`No images found for product ID: ${product.id}`);
        continue;
      }

      const imageTensor = await preprocessImage(images[0]);
      if (!imageTensor) {
        console.warn(`Failed to preprocess image for product ID: ${product.id}`);
        continue;
      }

      const featuresTensor = model.execute(imageTensor);
      const features = Array.from(featuresTensor.dataSync());
      const featuresStr = JSON.stringify(features);

      product.features = featuresStr;
      await product.save();

      console.log(`Updated features for product ID: ${product.id}`);
    }
  } catch (error) {
    console.error("Error updating product features:", error.message);
  }
};


// Chạy script cập nhật
updateProductFeatures().catch((err) => console.error("Script execution failed:", err.message));
