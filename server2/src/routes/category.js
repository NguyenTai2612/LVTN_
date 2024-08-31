const express = require('express');
const { getCategories } = require('../controllers/category');

const router = express.Router();

router.get('/all', getCategories); // This should match the route defined in your Express app

module.exports = router;
