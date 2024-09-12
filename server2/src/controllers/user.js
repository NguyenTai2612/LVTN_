const userService = require("../services/user");

const getCurrent = async (req, res ) => {
  const { id } = req.user
  try {
      const respone = await userService.getOne(id)
      return res.status(200).json(respone)
  } catch (error) {
      return res.status(500).json({
          err: -1,
          msg: 'Failed at post controller : ' + error,
      })
  }
}

const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving users", error });
  }
};

// Get user by id
const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user", error });
  }
};

// Update user by id
const updateUser = async (req, res) => {
  try {
    const updatedUser = await userService.updateUser(req.params.id, req.body);
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found or not updated" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

// Delete user by id
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await userService.deleteUser(id);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in deleteUser controller:", error);
    res.status(500).json({ message: "Error deleting user", error });
  }
};

// const verifyPassword = async (req, res) => {
//     const { userId, currentPassword } = req.body;
//     console.log('Received request to verify password with:', { userId, currentPassword }); // Debug log

//     try {
//         const isPasswordValid = await userService.verifyPassword(userId, currentPassword);
//         if (isPasswordValid) {
//             res.status(200).json({ message: 'Password is correct' });
//         } else {
//             res.status(400).json({ message: 'Incorrect password' });
//         }
//     } catch (error) {
//         console.error('Error verifying password:', error);
//         res.status(500).json({ message: 'Error verifying password', error });
//     }
// };

// const updatePassword = async (req, res) => {
//   const { currentPassword, newPassword } = req.body;
//   const userId = req.user.id;

//   if (!currentPassword || !newPassword) {
//     return res
//       .status(400)
//       .json({ message: "Current and new passwords are required" });
//   }

//   try {
//     const isPasswordValid = await userService.verifyPassword(
//       userId,
//       currentPassword
//     );
//     if (!isPasswordValid) {
//       return res.status(401).json({ message: "Invalid current password" });
//     }

//     const updatedUser = await userService.updatePassword(userId, newPassword);
//     if (updatedUser) {
//       return res.status(200).json({ message: "Password updated successfully" });
//     } else {
//       return res.status(404).json({ message: "User not found" });
//     }
//   } catch (error) {
//     console.error("Error updating password:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// Xác minh mật khẩu
// Xác thực mật khẩu hiện tại
const verifyPassword = async (req, res) => {
    const { userId, currentPassword } = req.body;

    try {
        const isPasswordValid = await userService.verifyPassword(userId, currentPassword);
        if (isPasswordValid) {
            res.status(200).json({ message: 'Password is correct' });
        } else {
            res.status(400).json({ message: 'Incorrect password' });
        }
    } catch (error) {
        console.error('Error verifying password:', error);
        res.status(500).json({ message: 'Error verifying password', error });
    }
};

const updatePassword = async (req, res) => {
    const { userId, newPassword } = req.body;

    try {
        // Cập nhật mật khẩu của người dùng
        await userService.updatePassword(userId, newPassword);
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ message: 'Error updating password', error });
    }
};
module.exports = {
  getCurrent,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  verifyPassword,
  updatePassword,
};
