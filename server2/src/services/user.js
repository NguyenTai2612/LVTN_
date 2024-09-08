const bcrypt = require("bcryptjs");
const db = require("../models");
const { User, Cart, Review } = require("../models");
// GET CURRENT
const getOne = (id) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.User.findOne({
        where: { id },
        raw: true,
        attributes: {
          exclude: ["password"],
        },
      });
      resolve({
        err: response ? 0 : 1,
        msg: response ? "OK" : "Failed to get user.",
        response,
      });
    } catch (error) {
      reject(error);
    }
  });

const getAllUsers = async () => {
  return await User.findAll();
};

// Get user by id
const getUserById = async (id) => {
  return await User.findByPk(id);
};

// Update user by id
const updateUser = async (id, data) => {
  const user = await User.findByPk(id);
  if (!user) {
    return null;
  }
  await user.update(data);
  return user;
};

// Delete user by id
const deleteUser = async (userId) => {
  try {
    // Xóa các bản ghi liên quan trong bảng Cart
    await Cart.destroy({ where: { user_id: userId } });

    // Xóa các bản ghi liên quan trong bảng Review
    await Review.destroy({ where: { user_id: userId } });

    // Xóa người dùng
    const deletedUser = await User.destroy({ where: { id: userId } });

    if (deletedUser) {
      return { message: "User deleted successfully" };
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

// const verifyPassword = async (userId, currentPassword) => {
//   try {
//       const user = await User.findByPk(userId);
//       if (!user) {
//           throw new Error('User not found');
//       }
//       const isMatch = await bcrypt.compare(currentPassword, user.password);
//       return isMatch;
//   } catch (error) {
//       console.error('Error verifying password in service:', error);
//       throw error;
//   }
// };

// const updatePassword = async (userId, newPassword) => {
//   try {
//     const user = await User.findByPk(userId);
//     if (!user) {
//       return null;
//     }
//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     user.password = hashedPassword;
//     await user.save();
//     return user;
//   } catch (error) {
//     throw error;
//   }
// };

const verifyPassword = async (userId, currentPassword) => {
  try {
      // Tìm người dùng theo ID
      const user = await User.findByPk(userId);
      if (!user) {
          throw new Error('User not found');
      }

      // So sánh mật khẩu hiện tại với mật khẩu trong cơ sở dữ liệu
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      return isMatch;
  } catch (error) {
      console.error('Error verifying password in service:', error);
      throw error;
  }
};

const updatePassword = async (userId, newPassword) => {
  try {
      // Tìm người dùng theo ID
      const user = await User.findByPk(userId);
      if (!user) {
          throw new Error('User not found');
      }

      // Mã hóa mật khẩu mới
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Cập nhật mật khẩu của người dùng
      user.password = hashedPassword;
      await user.save();
  } catch (error) {
      console.error('Error updating password in service:', error);
      throw error;
  }
};

module.exports = {
  getOne,
  getAllUsers,
  updateUser,
  deleteUser,
  getUserById,
  updatePassword,
  verifyPassword,
};
