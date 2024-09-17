const express = require('express');
const router = express.Router();
const statsController = require('../controllers/stats');

// Các route thống kê product
router.get('/total-products', statsController.getTotalProducts);
router.get('/products-by-category', statsController.getProductsByCategory);
router.get('/products-by-subcategory', statsController.getProductsBySubCategory);
router.get('/best-selling-product', statsController.getBestSellingProduct);
router.get('/products-in-stock', statsController.getProductsInStock);
router.get('/discounted-products', statsController.getDiscountedProducts);
router.get('/top-rated-products', statsController.getTopRatedProducts);
router.get('/products-by-brand', statsController.getProductsByBrand);
router.get('/out-of-stock-products', statsController.getOutOfStockProducts);


// 5. API thống kê sản phẩm bị trả lại nhiều nhất 
// router.get('/most-returned-products', statsController.getMostReturnedProducts);

// revenue
router.get('/revenue-by-category', statsController.getRevenueByCategory);
router.get('/revenue-by-subCategory', statsController.getRevenueBySubCategory);


// 2. API thống kê sản phẩm mới được thêm 
router.get('/new-products', statsController.getNewProducts);

// 3. API thống kê các sản phẩm đã hết hàng 
router.get('/out-of-stock-products', statsController.getOutOfStockProducts);

// 4. API thống kê lượt xem sản phẩm 
router.get('/product-views', statsController.getProductViews);


// 10. API thống kê đơn hàng bị hủy nhiều nhất 
router.get('/most-canceled-products', statsController.getMostCanceledProducts);



// 7. API thống kê số lượng bán ra theo tháng 
router.get('/monthly-sales', statsController.getMonthlySales);

// 7. API thống kê số lượng bán ra theo tuan 
router.get('/week-sales', statsController.getWeeklySales);

// 7. API thống kê số lượng bán ra theo ngay 
router.get('/daily-sales', statsController.getDailySales);

// 8. API thống kê tổng số đơn hàng 
router.get('/total-orders', statsController.getTotalOrders);
// 9. API thống kê doanh thu theo từng sản phẩm 
router.get('/revenue-by-product', statsController.getRevenueByProduct);

// 9. API thống kê doanh thu thực tế 
router.get('/actualy-revenue', statsController.getActualRevenue);
router.get('/actualy-revenue-by-product', statsController.getActualRevenueByProduct);

module.exports = router;
