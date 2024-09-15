"use strict";
const { Cart, Product, ProductImage } = require("../models");

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
    const cartItems = await Cart.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Product,
          attributes: [
            "id",
            "name",
            "price",
            "oldPrice",
            "description",
            "countInStock",
          ],
          include: [
            {
              model: ProductImage,  // Assuming Product has many ProductImages
              attributes: ["imageUrl"],  
            },
          ],
        },
      ],
    });
    return cartItems;
  } catch (error) {
    throw new Error(`Error retrieving cart: ${error.message}`);
  }
};


const updateCartItem = async (updateData) => {
  try {
    const cartItem = await Cart.findByPk(updateData.id);

    if (!cartItem) {
      throw new Error("Cart item not found");
    }

    // Recalculate subTotal
    const newSubTotal = (cartItem.price * updateData.quantity).toFixed(2);

    // Update the item with new quantity and subTotal
    const [updated] = await Cart.update(
      {
        quantity: updateData.quantity,
        subTotal: newSubTotal,
      },
      { where: { id: updateData.id } }
    );

    if (updated) {
      return await Cart.findByPk(updateData.id);
    }

    throw new Error("Error updating cart item");
  } catch (error) {
    throw new Error(`Error updating cart item: ${error.message}`);
  }
};

const deleteCartItem = async (id) => {
  try {
    const deleted = await Cart.destroy({ where: { id } });
    if (deleted) {
      return { message: "Cart item deleted successfully" };
    }
    throw new Error("Cart item not found");
  } catch (error) {
    throw new Error(`Error deleting cart item: ${error.message}`);
  }
};


const deleteAllCartByUserId = async (userId) => {
  try {
    const result = await Cart.destroy({
      where: {
        user_id: userId,
      },
    });

    // Kiểm tra xem có xóa được giỏ hàng nào không
    if (result === 0) {
      return { message: "Không tìm thấy giỏ hàng của người dùng này.", success: false };
    }

    return { message: "Đã xóa tất cả sản phẩm trong giỏ hàng.", success: true };
  } catch (error) {
    throw new Error('Lỗi khi xóa giỏ hàng.');
  }
};

module.exports = { deleteAllCartByUserId };


module.exports = {
  addToCart,
  getCartByUserId,
  updateCartItem,
  deleteCartItem,
  deleteAllCartByUserId,
};
