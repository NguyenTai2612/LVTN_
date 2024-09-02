'use strict';
const cartService = require('../services/cart');

const addToCart = async (req, res) => {
  try {
    const cartItem = await cartService.addToCart(req.body);
    res.status(201).json(cartItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getCartByUserId = async (req, res) => {
  try {
    const cartItems = await cartService.getCartByUserId(req.params.userId);
    res.status(200).json(cartItems);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const cartItem = await cartService.updateCartItem(req.body);
    res.status(200).json(cartItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const response = await cartService.deleteCartItem(req.params.cartId);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  addToCart,
  getCartByUserId,
  updateCartItem,
  deleteCartItem,
};
