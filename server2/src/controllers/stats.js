const {
  Product,
  Category,
  SubCategory,
  Brand,
  OrderItem,
  Order,
  Payment,
  sequelize,
  User,
} = require("../models");
const { Op } = require("sequelize"); // Import toán tử
const { fn, col, literal } = require('sequelize');

// 1. Thống kê tổng số lượng sản phẩm
exports.getTotalProducts = async (req, res) => {
  try {
    const totalProducts = await Product.count();
    res.json({ totalProducts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Thống kê số lượng sản phẩm theo danh mục
exports.getProductsByCategory = async (req, res) => {
  try {
    const productsByCategory = await Category.findAll({
      attributes: ["name"], // Chỉ lấy tên của danh mục
      include: [
        {
          model: Product,
          attributes: ["id"], // Chỉ lấy id của sản phẩm
        },
      ],
    });

    // Xử lý để đếm số lượng sản phẩm
    const result = productsByCategory.map((category) => ({
      name: category.name,
      product_count: category.Products.length, // Đếm số lượng sản phẩm trong mỗi danh mục
      Products: category.Products, // Bao gồm danh sách sản phẩm
    }));

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Thống kê số lượng sản phẩm theo tiểu mục
exports.getProductsBySubCategory = async (req, res) => {
  try {
    const productsBySubCategory = await SubCategory.findAll({
      include: [
        {
          model: Product,
          attributes: ["id"],
        },
      ],
      attributes: ["subCat"], // Lấy tên tiểu mục
    });

    // Xử lý kết quả để đếm số lượng sản phẩm theo từng tiểu mục
    const result = productsBySubCategory.map((subCategory) => ({
      subCat: subCategory.subCat,
      product_count: subCategory.Products.length, // Đếm số lượng sản phẩm trong tiểu mục
      Products: subCategory.Products, // Bao gồm danh sách sản phẩm
    }));

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Thống kê sản phẩm bán chạy nhất
exports.getBestSellingProduct = async (req, res) => {
  try {
    const bestSellingProduct = await OrderItem.findAll({
      attributes: [
        "product_id",
        [sequelize.fn("SUM", sequelize.col("quantity")), "total_sold"],
      ],
      include: [{ model: Product, attributes: ["name"] }],
      group: ["product_id", "Product.name"],
      order: [[sequelize.fn("SUM", sequelize.col("quantity")), "DESC"]],
      limit: 1,
    });
    res.json(bestSellingProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 5. Thống kê sản phẩm tồn kho
exports.getProductsInStock = async (req, res) => {
  try {
    // Lấy sản phẩm có số lượng tồn kho lớn hơn 0
    const productsInStock = await Product.findAll({
      where: {
        countInStock: {
          [Op.gt]: 0, // So sánh để tìm sản phẩm có countInStock > 0
        },
      },
      attributes: ["id", "name", "countInStock"], // Lấy các thuộc tính cần thiết
    });

    res.status(200).json(productsInStock);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 6. Thống kê sản phẩm đang giảm giá
exports.getDiscountedProducts = async (req, res) => {
  try {
    // Tìm các sản phẩm có giá trị discount lớn hơn 0
    const discountedProducts = await Product.findAll({
      where: {
        discount: {
          [Op.gt]: 0, // Sử dụng Op.gt để so sánh
        },
      },
      attributes: ["name", "price", "discount"], // Lấy các thuộc tính cần thiết
    });

    res.status(200).json(discountedProducts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 7. Thống kê sản phẩm được đánh giá cao nhất
exports.getTopRatedProducts = async (req, res) => {
  try {
    const topRatedProducts = await Product.findAll({
      order: [["rating", "DESC"]],
      limit: 5,
      attributes: ["name", "rating"],
    });
    res.json(topRatedProducts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 8. Thống kê sản phẩm theo thương hiệu
exports.getProductsByBrand = async (req, res) => {
  try {
    const productsByBrand = await Brand.findAll({
      include: [
        {
          model: Product,
          attributes: ["id"], // Lấy ID của sản phẩm
        },
      ],
      attributes: ["name"], // Lấy tên thương hiệu
    });

    // Xử lý kết quả để đếm số lượng sản phẩm và lấy tất cả các ID sản phẩm
    const result = productsByBrand.map((brand) => ({
      name: brand.name,
      product_count: brand.Products.length, // Đếm số lượng sản phẩm
      Products: brand.Products.map((product) => ({ id: product.id })), // Lấy tất cả ID sản phẩm
    }));

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 9. Thống kê doanh thu theo danh mục
exports.getRevenueByCategory = async (req, res) => {
  try {
    // Sử dụng truy vấn SQL thô để tính doanh thu theo danh mục
    const revenueByCategory = await sequelize.query(
      `
        SELECT 
          c.name AS category_name,
          COALESCE(SUM(p.amount), 0) AS total_revenue
        FROM 
          Categories AS c
        LEFT JOIN 
          Products AS pr ON pr.category_id = c.id
        LEFT JOIN 
          OrderItems AS oi ON oi.product_id = pr.id
        LEFT JOIN 
          Orders AS o ON o.id = oi.order_id
        LEFT JOIN 
          Payments AS p ON p.order_id = o.id
        GROUP BY 
          c.id
      `,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );

    res.status(200).json(revenueByCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 10. Thống kê doanh thu theo danh mục phụ
exports.getRevenueBySubCategory = async (req, res) => {
  try {
    // Sử dụng truy vấn SQL thô để tính doanh thu theo tiểu mục
    const revenueBySubCategory = await sequelize.query(
      `
        SELECT 
          sc.subCat AS sub_category_name,
          COALESCE(SUM(p.amount), 0) AS total_revenue
        FROM 
          SubCategories AS sc
        LEFT JOIN 
          Products AS pr ON pr.sub_category_id = sc.id
        LEFT JOIN 
          OrderItems AS oi ON oi.product_id = pr.id
        LEFT JOIN 
          Orders AS o ON o.id = oi.order_id
        LEFT JOIN 
          Payments AS p ON p.order_id = o.id
        GROUP BY 
          sc.id
      `,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );

    res.status(200).json(revenueBySubCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 11. Thống kê sản phẩm hết hàng
exports.getOutOfStockProducts = async (req, res) => {
  try {
    const outOfStockProducts = await Product.findAll({
      where: { countInStock: 0 },
      attributes: ["name"],
    });
    res.json(outOfStockProducts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. API thống kê sản phẩm mới được thêm
exports.getNewProducts = async (req, res) => {
  try {
    const newProducts = await Product.findAll({
      where: {
        createdAt: {
          [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 ngày trước
          // [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) / 1 tuan truoc
        },
      },
    });
    res.json(newProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 1. API thống kê các sản phẩm đã hết hàng
exports.getOutOfStockProducts = async (req, res) => {
  try {
    const outOfStockProducts = await Product.findAll({
      where: {
        countInStock: 0,
      },
    });
    res.json(outOfStockProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. API thống kê lượt xem sản phẩm
exports.getProductViews = async (req, res) => {
  try {
    const products = await Product.findAll({
      order: [["views", "DESC"]],
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4. API thống kê số lượng bán ra theo tháng
exports.getMonthlySales = async (req, res) => {
  try {
    // Bước 1: Lấy danh sách order_id từ Payment với trạng thái đã thanh toán
    const paidOrders = await Payment.findAll({
      attributes: ["order_id"],
      where: {
        paymentStatus: "Đã thanh toán",
      },
      raw: true,
    });

    if (paidOrders.length === 0) {
      return res.json([]);
    }

    const paidOrderIds = paidOrders.map((order) => order.order_id);

    // Bước 2: Truy vấn bảng OrderItem và tính doanh thu theo tháng
    const monthlySales = await OrderItem.findAll({
      attributes: [
        [sequelize.fn("MONTH", sequelize.col("Order.createdAt")), "month"],
        [
          sequelize.literal("SUM(OrderItem.price * OrderItem.quantity)"),
          "totalSales",
        ],
        [
          sequelize.fn("SUM", sequelize.col("OrderItem.quantity")),
          "totalProductsSold",
        ],
      ],
      include: [
        {
          model: Order,
          attributes: [],
          where: {
            id: paidOrderIds,
          },
        },
      ],
      group: [sequelize.fn("MONTH", sequelize.col("Order.createdAt"))],
      order: [[sequelize.fn("MONTH", sequelize.col("Order.createdAt")), "ASC"]],
    });

    res.json(monthlySales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  API thống kê số lượng bán ra theo tuần
exports.getWeeklySales = async (req, res) => {
  try {
    // Bước 1: Lấy danh sách order_id từ Payment với trạng thái đã thanh toán
    const paidOrders = await Payment.findAll({
      attributes: ["order_id"],
      where: {
        paymentStatus: "Đã thanh toán",
      },
      raw: true,
    });

    if (paidOrders.length === 0) {
      return res.json([]);
    }

    const paidOrderIds = paidOrders.map((order) => order.order_id);

    // Bước 2: Truy vấn bảng OrderItem và tính doanh thu theo tuần
    const weeklySales = await OrderItem.findAll({
      attributes: [
        [sequelize.fn("WEEK", sequelize.col("Order.createdAt")), "week"],
        [
          sequelize.literal("SUM(OrderItem.price * OrderItem.quantity)"),
          "totalSales",
        ],
        [
          sequelize.fn("SUM", sequelize.col("OrderItem.quantity")),
          "totalProductsSold",
        ],
      ],
      include: [
        {
          model: Order,
          attributes: [],
          where: {
            id: paidOrderIds,
          },
        },
      ],
      group: [sequelize.fn("WEEK", sequelize.col("Order.createdAt"))],
      order: [[sequelize.fn("WEEK", sequelize.col("Order.createdAt")), "ASC"]],
    });

    res.json(weeklySales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDailySales = async (req, res) => {
  try {
    // Bước 1: Lấy danh sách order_id từ Payment với trạng thái đã thanh toán
    const paidOrders = await Payment.findAll({
      attributes: ["order_id"],
      where: {
        paymentStatus: "Đã thanh toán",
      },
      raw: true,
    });

    if (paidOrders.length === 0) {
      return res.json([]);
    }

    const paidOrderIds = paidOrders.map((order) => order.order_id);

    // Bước 2: Truy vấn bảng OrderItem và tính doanh thu theo ngày
    const dailySales = await OrderItem.findAll({
      attributes: [
        [sequelize.fn("DATE", sequelize.col("Order.createdAt")), "date"],
        [
          sequelize.literal("SUM(OrderItem.price * OrderItem.quantity)"),
          "totalSales",
        ],
        [
          sequelize.fn("SUM", sequelize.col("OrderItem.quantity")),
          "totalProductsSold",
        ],
      ],
      include: [
        {
          model: Order,
          attributes: [],
          where: {
            id: paidOrderIds,
          },
        },
      ],
      group: [sequelize.fn("DATE", sequelize.col("Order.createdAt"))],
      order: [[sequelize.fn("DATE", sequelize.col("Order.createdAt")), "ASC"]],
    });

    res.json(dailySales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 6. API thống kê doanh thu theo từng sản phẩm
exports.getRevenueByProduct = async (req, res) => {
  try {
    const revenueByProduct = await OrderItem.findAll({
      attributes: [
        "product_id",
        [
          sequelize.literal("SUM(OrderItem.price * OrderItem.quantity)"),
          "totalRevenue",
        ], // Chỉ định rõ OrderItem.price và OrderItem.quantity
      ],
      group: ["product_id"],
      include: [
        {
          model: Product,
          attributes: ["name"], // Lấy tên sản phẩm
        },
      ],
      order: [[sequelize.literal("totalRevenue"), "DESC"]], // Sắp xếp theo tổng doanh thu
    });
    res.json(revenueByProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 7. API thống kê đơn hàng bị hủy nhiều nhất
exports.getMostCanceledProducts = async (req, res) => {
  try {
    const canceledOrders = await OrderItem.findAll({
      attributes: [
        "product_id",
        [sequelize.fn("SUM", sequelize.col("quantity")), "cancelCount"],
      ],
      include: [
        {
          model: Order,
          where: { deliver_status: "Đã hủy" },
          attributes: [],
        },
        {
          model: Product,
          attributes: ["name"],
        },
      ],
      group: ["product_id", "Product.name"], // Group by product_id and Product.name
      order: [["cancelCount", "DESC"]],
    });
    res.json(canceledOrders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 8. API thống kê lượng truy cập vào từng sản phẩm
// exports.getProductPageViews = async (req, res) => {
//   try {
//     const products = await Product.findAll({
//       order: [['views', 'DESC']]
//     });
//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// 5. API thống kê tổng số đơn hàng
exports.getTotalOrders = async (req, res) => {
  try {
    const totalOrders = await Order.count();
    res.json({ totalOrders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  API thống kê doanh "thực tế"
exports.getActualRevenue = async (req, res) => {
  try {
    const actualRevenue = await Payment.findAll({
      attributes: [
        [sequelize.fn("SUM", sequelize.col("amount")), "totalActualRevenue"], // Tính tổng số tiền thanh toán thực tế
      ],
      where: {
        paymentStatus: "Đã thanh toán", // Chỉ lấy những khoản đã được thanh toán
      },
    });

    res.json(actualRevenue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getActualRevenueByProduct = async (req, res) => {
  try {
    // Bước 1: Lấy danh sách order_id từ Payment với trạng thái đã thanh toán
    const paidOrders = await Payment.findAll({
      attributes: ["order_id"], // Lấy order_id
      where: {
        paymentStatus: "Đã thanh toán", // Chỉ lấy những đơn hàng đã thanh toán
      },
      raw: true, // Trả về kết quả dưới dạng dữ liệu thô
    });

    // Nếu không có đơn hàng nào đã thanh toán, trả về kết quả rỗng
    if (paidOrders.length === 0) {
      return res.json([]);
    }

    // Lấy danh sách order_id
    const paidOrderIds = paidOrders.map((order) => order.order_id);

    // Bước 2: Truy vấn bảng OrderItem và tính doanh thu thực tế
    const actualRevenue = await OrderItem.findAll({
      attributes: [
        "product_id", // Lấy product_id từ OrderItem
        [
          sequelize.fn(
            "SUM",
            sequelize.literal("OrderItem.price * OrderItem.quantity")
          ),
          "totalActualRevenue",
        ], // Tính tổng doanh thu thực tế (OrderItem.price * OrderItem.quantity)
      ],
      where: {
        order_id: paidOrderIds, // Chỉ lấy những đơn hàng có trong danh sách đã thanh toán
      },
      include: [
        {
          model: Product,
          attributes: ["name"], // Lấy tên sản phẩm từ bảng Product
        },
      ],
      group: ["product_id", "Product.name"], // Nhóm theo product_id và tên sản phẩm
      raw: true, // Trả về kết quả dưới dạng dữ liệu thô
    });

    // Định dạng kết quả trước khi trả về
    const result = actualRevenue.map((item) => ({
      productId: item.product_id,
      productName: item["Product.name"], // Lấy tên sản phẩm từ kết quả
      totalActualRevenue: parseFloat(item.totalActualRevenue), // Chuyển đổi tổng doanh thu thành số thực
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRevenueByTime = async (req, res) => {
  const { period } = req.query; // period có thể là '7days', 'week', hoặc 'month'
  
  try {
    let dateFilter;
    switch (period) {
      case '7days':
        dateFilter = 'DATE(paymentDate) >= CURDATE() - INTERVAL 7 DAY';
        break;
      case 'week':
        dateFilter = 'YEARWEEK(paymentDate, 1) = YEARWEEK(CURDATE(), 1)';
        break;
      case 'month':
        dateFilter = 'MONTH(paymentDate) = MONTH(CURDATE()) AND YEAR(paymentDate) = YEAR(CURDATE())';
        break;
      default:
        return res.status(400).json({ error: 'Invalid period parameter. Allowed values are 7days, week, month.' });
    }

    const revenue = await Payment.findAll({
      attributes: [
        [fn('SUM', col('amount')), 'totalRevenue'],
      ],
      where: literal(dateFilter), // Sử dụng literal đúng cách
      having: literal('SUM(amount) IS NOT NULL') // Đảm bảo không có giá trị NULL
    });

    res.json(revenue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTopSellingProducts = async (req, res) => {
  try {
    const topSellingProducts = await OrderItem.findAll({
      attributes: [
        'product_id',
        [fn('SUM', col('quantity')), 'totalSales']
      ],
      group: 'product_id',
      order: [[fn('SUM', col('quantity')), 'DESC']],
      limit: 10, // Lấy top 10 sản phẩm bán chạy nhất
      include: [{
        model: Product,
        attributes: ['name', 'price'] // Lấy tên và giá sản phẩm
      }]
    });

    res.json(topSellingProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// exports.getActiveUsers = async (req, res) => {
//   const { period } = req.query; // period có thể là '7days', 'week', hoặc 'month'
  
//   try {
//     let dateFilter;

//     switch (period) {
//       case '7days':
//         dateFilter = 'DATE(lastActive) >= CURDATE() - INTERVAL 7 DAY';
//         break;
//       case 'week':
//         dateFilter = 'YEARWEEK(lastActive, 1) = YEARWEEK(CURDATE(), 1)';
//         break;
//       case 'month':
//         dateFilter = 'MONTH(lastActive) = MONTH(CURDATE()) AND YEAR(lastActive) = YEAR(CURDATE())';
//         break;
//       default:
//         return res.status(400).json({ error: 'Invalid period parameter' });
//     }

//     const activeUsers = await User.findAll({
//       attributes: [
//         [fn('COUNT', col('id')), 'activeUserCount']
//       ],
//       where: literal(dateFilter)
//     });

//     res.json(activeUsers);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };