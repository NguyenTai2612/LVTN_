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
    const cartId = req.params.cartId; // Extract cartId from URL parameters
    const { quantity } = req.body; // Extract quantity from request body

    if (!cartId) {
      return res.status(400).json({ message: 'Cart ID is required' });
    }
    if (quantity === undefined) {
      return res.status(400).json({ message: 'Quantity is required' });
    }

    const updatedCartItem = await cartService.updateCartItem({ id: cartId, quantity });

    res.status(200).json(updatedCartItem);
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
