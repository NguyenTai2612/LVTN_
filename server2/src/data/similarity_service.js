const { ProductImage } = require('../models');
const tf = require('@tensorflow/tfjs-node');
const axios = require('axios');
const sharp = require('sharp');

let model;

// Load TensorFlow model
const loadModel = async () => {
  if (!model) {
    model = await tf.loadLayersModel('file://path/to/vgg16_model/model.json');
  }
};

// Preprocess image from URL
const preprocessImage = async (imageUrl) => {
  const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
  const imageBuffer = Buffer.from(response.data);

  const image = await sharp(imageBuffer)
    .resize(224, 224)
    .toBuffer();

  const tensor = tf.node.decodeImage(image, 3)
    .expandDims()
    .div(255.0);
  return tensor;
};

// Extract features
const extractFeatures = async (imageUrl) => {
  const tensor = await preprocessImage(imageUrl);
  const features = model.predict(tensor);
  return features.arraySync()[0];
};

// Main script
const updateFeaturesInDatabase = async () => {
  await loadModel();
  const productImages = await ProductImage.findAll();

  for (const image of productImages) {
    try {
      const features = await extractFeatures(image.imageUrl);
      await image.update({ features });
      console.log(`Updated features for image ID: ${image.id}`);
    } catch (error) {
      console.error(`Error processing image ID: ${image.id}`, error);
    }
  }

  console.log('Feature extraction completed.');
};

updateFeaturesInDatabase().catch(console.error);
