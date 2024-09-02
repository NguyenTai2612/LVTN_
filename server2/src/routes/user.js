'use strict';
const verifyToken = require('../middlewares/verifyToken')
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');


router.use(verifyToken);
router.get('/get-current', userController.getCurrent);



module.exports = router;
