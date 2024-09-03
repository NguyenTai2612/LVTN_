'use strict';
const { Cart } = require('../models');

const addToCart = async (cartData) => {
  try {
    const cartItem = await Cart.create(cartData);
    return cartItem;
  } catch (error) {
    throw new Error(`Error adding to cart: ${error.message}`);
  }
};

const getCartByUserId = async (userId) => {
  try {
    const cartItems = await Cart.findAll({ where: { user_id: userId } });
    return cartItems;
  } catch (error) {
    throw new Error(`Error retrieving cart: ${error.message}`);
  }
};

const updateCartItem = async (updateData) => {
  try {
    const cartItem = await Cart.findByPk(updateData.id);

    if (!cartItem) {
      throw new Error('Cart item not found');
    }

    // Recalculate subTotal
    const newSubTotal = (cartItem.price * updateData.quantity).toFixed(2);

    // Update the item with new quantity and subTotal
    const [updated] = await Cart.update(
      {
        quantity: updateData.quantity,
        subTotal: newSubTotal
      },
      { where: { id: updateData.id } }
    );

    if (updated) {
      return await Cart.findByPk(updateData.id);
    }

    throw new Error('Error updating cart item');
  } catch (error) {
    throw new Error(`Error updating cart item: ${error.message}`);
  }
};


const deleteCartItem = async (id) => {
  try {
    const deleted = await Cart.destroy({ where: { id } });
    if (deleted) {
      return { message: 'Cart item deleted successfully' };
    }
    throw new Error('Cart item not found');
  } catch (error) {
    throw new Error(`Error deleting cart item: ${error.message}`);
  }
};

module.exports = {
  addToCart,
  getCartByUserId,
  updateCartItem,
  deleteCartItem,
};
