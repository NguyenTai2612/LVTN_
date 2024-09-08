'use strict';
const verifyToken = require('../middlewares/verifyToken')
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');


// router.use(verifyToken);
router.get('/get-current', verifyToken, userController.getCurrent);


router.get('/', userController.getAllUsers);

// Get user by id
router.get('/:id', userController.getUserById);

// Update user by id
router.put('/:id', userController.updateUser);

// Delete user by id
router.delete('/:id', userController.deleteUser);

// Route để xác thực mật khẩu hiện tại
router.post('/verify-password', verifyToken, userController.verifyPassword);

// Route để cập nhật mật khẩu
router.put('/update-password', verifyToken, userController.updatePassword);

module.exports = router;
