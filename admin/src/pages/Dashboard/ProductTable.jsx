import React, { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Grid, Card, CardContent } from '@mui/material';
import {
    apiGetNewProducts,
    apiGetOutOfStockProducts,
    apiGetProductViews,
    apiGetMostCanceledProducts,
    apiGetTotalProducts,
    apiGetProductsByCategory,
    apiGetProductsBySubCategory,
    apiGetProductsInStock,
    apiGetDiscountedProducts,
    apiGetTopRatedProducts,
    apiGetProductsByBrand,
    apiGetTopSellingProducts,
    apiGetProductsByChildSubCategory
} from '../../services/stats';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';

import Price from '../../components/Price';

const ProductStatistics = () => {
    const [selectedChip, setSelectedChip] = useState(0);
    const [newProducts, setNewProducts] = useState([]);
    const [outOfStockProducts, setOutOfStockProducts] = useState([]);
    const [productViews, setProductViews] = useState([]);
    const [mostCanceledProducts, setMostCanceledProducts] = useState([]);
    const [totalProducts, setTotalProducts] = useState(null);
    const [productsByCategory, setProductsByCategory] = useState([]);
    const [productsBySubCategory, setProductsBySubCategory] = useState([]);
    const [productsByChildSubCategory, setProductsByChildSubCategory] = useState([]);
    const [bestSellingProduct, setBestSellingProduct] = useState([]);
    const [productsInStock, setProductsInStock] = useState([]);
    const [discountedProducts, setDiscountedProducts] = useState([]);
    const [topRatedProducts, setTopRatedProducts] = useState([]);
    const [productsByBrand, setProductsByBrand] = useState([]);


    useEffect(() => {
        // Fetch statistics data when component mounts
        fetchStatisticsData();
    }, []);

    const fetchStatisticsData = async () => {
        try {
            const total = await apiGetTotalProducts();
            setTotalProducts(total);

            const newProd = await apiGetNewProducts();
            setNewProducts(newProd);

            const outOfStock = await apiGetOutOfStockProducts();
            setOutOfStockProducts(outOfStock);

            const views = await apiGetProductViews();
            setProductViews(views);

            const canceledProducts = await apiGetMostCanceledProducts();
            setMostCanceledProducts(canceledProducts);

            const categoryData = await apiGetProductsByCategory();
            setProductsByCategory(categoryData);
            
            const subCategoryData = await apiGetProductsBySubCategory();
            setProductsBySubCategory(subCategoryData);

            const childSubCategoryData = await apiGetProductsByChildSubCategory();
            setProductsByChildSubCategory(childSubCategoryData);

            const bestSelling = await apiGetTopSellingProducts();
            setBestSellingProduct(bestSelling);

            const inStockData = await apiGetProductsInStock();
            setProductsInStock(inStockData);

            const discountedData = await apiGetDiscountedProducts();
            setDiscountedProducts(discountedData);

            const topRated = await apiGetTopRatedProducts();
            setTopRatedProducts(topRated);

            const brandData = await apiGetProductsByBrand();
            setProductsByBrand(brandData);


        } catch (error) {
            console.error("Error fetching product statistics:", error);
        }
    };

    const handleChipClick = (index) => {
        setSelectedChip(index);
    };

    // const maxRevenue = Math.max(...revenueByProduct.map(item => item.totalRevenue));

    const chipLabels = [
        "Tổng Số Lượng Sản Phẩm",
        "Sản Phẩm Mới",
        "Sản Phẩm Hết Hàng",
        "Lượt Xem Sản Phẩm",
        "Đơn Hàng Bị Hủy Nhiều Nhất",
        "Theo Danh Mục",
        "Theo Tiểu Mục",
        "Danh mục con của tiểu mục",
        "Sản Phẩm Bán Chạy",
        "Sản Phẩm Còn Lại",
        "Sản Phẩm Giảm Giá",
        "Sản Phẩm Có Điểm Đánh Giá Cao",
        "Sản Phẩm Theo Thương Hiệu"
    ];

    const formatTooltipValue = (value) => <Price amount={value} />;

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center', mb: 3 }}>
                {chipLabels.map((label, index) => (
                    <Chip
                        key={index}
                        label={label}
                        onClick={() => handleChipClick(index)}
                        color={selectedChip === index ? 'primary' : 'default'}
                        sx={{ margin: 1 }}
                    />
                ))}
            </Box>
            <div className="custom-divider"></div>


            {/* Conditional rendering based on selected chip */}
            {selectedChip === 0 && (
                <Box p={3}>
                    <Typography variant="h6">
                        Tổng Số Lượng Sản Phẩm: {totalProducts?.totalProducts || 'Đang tải...'}
                    </Typography>
                </Box>
            )}

            {selectedChip === 1 && (
                <Box p={3}>
                    <Typography variant="h6">Sản Phẩm Mới</Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Tên Sản Phẩm</TableCell>
                                    <TableCell>Ngày Thêm</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {newProducts.map((product, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell>{new Date(product.createdAt).toLocaleDateString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}

            {selectedChip === 2 && (
                <Box p={3}>
                    <Typography variant="h6">Sản Phẩm Hết Hàng</Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Tên Sản Phẩm</TableCell>
                                    <TableCell>Ngày Hết Hàng</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {outOfStockProducts.map((product, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell>{new Date(product.createdAt).toLocaleDateString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}

            {selectedChip === 3 && (
                <Box p={3}>
                    <Typography variant="h6">Lượt Xem Sản Phẩm</Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Tên Sản Phẩm</TableCell>
                                    <TableCell>Lượt Xem</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {productViews.map((product, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell>{product.views}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}

            {selectedChip === 4 && (
                <Box p={3}>
                    <Typography variant="h6">Đơn Hàng Bị Hủy Nhiều Nhất</Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Tên Sản Phẩm</TableCell>
                                    <TableCell>Số Lượng Bị Hủy</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {mostCanceledProducts.map((product, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{product.Product.name}</TableCell>
                                        <TableCell>{product.cancelCount}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}

            {selectedChip === 5 && (
                <Box p={3}>
                    <Box mt={3}>
                        {/* <Typography variant="h6">Theo Danh Mục</Typography> */}
                        {/* <LineChart width={600} height={300} data={monthlySales}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis tickFormatter={(value) => formatCurrency(value)} />
                            <Tooltip formatter={(value) => formatCurrency(value)} />
                            <Legend />
                            <Line type="monotone" dataKey="totalSales" stroke="#8884d8" activeDot={{ r: 8 }} />
                        </LineChart> */}
                    </Box>
                    <Typography variant="h6">Theo Danh Mục</Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Danh Mục</TableCell>
                                    <TableCell>Số Lượng</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {productsByCategory.length > 0 ? (
                                    productsByCategory.map((category, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{category.name}</TableCell>
                                            <TableCell>{category.product_count}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={2}>Không có dữ liệu</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}


            {selectedChip === 6 && (
                <Box p={3}>
                    <Box mt={3}>
                        {/* <Typography variant="h6">Biểu Đồ Doanh Thu Theo Tuần</Typography> */}
                        {/* <BarChart width={600} height={300} data={weeklySales}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="week" />
                            <YAxis tickFormatter={(value) => formatCurrency(value)} />
                            <Tooltip formatter={(value) => formatCurrency(value)} />
                            <Legend />
                            <Bar dataKey="totalSales" fill="#82ca9d" />
                        </BarChart> */}
                    </Box>
                    <Typography variant="h6">Theo Tiểu Mục</Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Tiểu Mục</TableCell>
                                    <TableCell>Số Lượng</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {productsBySubCategory.length > 0 ? (
                                    productsBySubCategory.map((subCategory, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{subCategory.subCat}</TableCell>
                                            <TableCell>{subCategory.product_count}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={2}>Không có dữ liệu</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}


            {selectedChip === 7 && (
                <Box p={3}>
                    <Box mt={3}>
                        {/* <Typography variant="h6">Biểu Đồ Doanh Thu Theo Tuần</Typography> */}
                        {/* <BarChart width={600} height={300} data={weeklySales}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="week" />
                            <YAxis tickFormatter={(value) => formatCurrency(value)} />
                            <Tooltip formatter={(value) => formatCurrency(value)} />
                            <Legend />
                            <Bar dataKey="totalSales" fill="#82ca9d" />
                        </BarChart> */}
                    </Box>
                    <Typography variant="h6">Danh mục con của tiểu mục</Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Tiểu mục</TableCell>
                                    <TableCell>Danh mục con của tiểu mục</TableCell>
                                    <TableCell>Số Lượng</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {productsByChildSubCategory.length > 0 ? (
                                    productsByChildSubCategory.map((subCategory, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{subCategory.subCategory}</TableCell>
                                            <TableCell>{subCategory.childSubCat}</TableCell>
                                            <TableCell>{subCategory.product_count}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={2}>Không có dữ liệu</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}

            {selectedChip === 8 && (
                <Box p={3}>
                    <Box mt={3}>
                        {/* <Typography variant="h6">Biểu Đồ Doanh Thu Theo Ngày</Typography>
                        <LineChart width={600} height={300} data={dailySales}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis tickFormatter={(value) => formatCurrency(value)} />
                            <Tooltip formatter={(value) => formatCurrency(value)} />
                            <Legend />
                            <Line type="monotone" dataKey="totalSales" stroke="#8884d8" activeDot={{ r: 8 }} />
                        </LineChart> */}
                    </Box>
                    <Typography variant="h6">Sản Phẩm Bán Chạy</Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Tên Sản Phẩm</TableCell>
                                    <TableCell>Đã Bán</TableCell>
                                    <TableCell>Doanh Thu</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {bestSellingProduct.length > 0 ? (
                                    bestSellingProduct.map((product, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{product.Product?.name}</TableCell>
                                            <TableCell>{product.totalSales}</TableCell>
                                            <TableCell><Price amount={product.Product?.price} /></TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={2}>Không có dữ liệu</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                </Box>
            )}

            {selectedChip === 9 && (
                <Box p={3}>
                    <Box mt={3}>
                        {/* <Typography variant="h6">Biểu Đồ Doanh Thu Theo Ngày</Typography>
                        <LineChart width={600} height={300} data={dailySales}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis tickFormatter={(value) => formatCurrency(value)} />
                            <Tooltip formatter={(value) => formatCurrency(value)} />
                            <Legend />
                            <Line type="monotone" dataKey="totalSales" stroke="#8884d8" activeDot={{ r: 8 }} />
                        </LineChart> */}
                    </Box>
                    <Typography variant="h6">Sản Phẩm Còn Lại</Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Tên Sản Phẩm</TableCell>
                                    <TableCell>Số Lượng Còn Lại</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {productsInStock.length > 0 ? (
                                    productsInStock.map((product, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{product.name}</TableCell>
                                            <TableCell>{product.countInStock}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={2}>Không có dữ liệu</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                </Box>
            )}

            {selectedChip === 10 && (
                <Box p={3}>
                    <Box mt={3}>
                        {/* <Typography variant="h6">Biểu Đồ Doanh Thu Theo Ngày</Typography>
                        <LineChart width={600} height={300} data={dailySales}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis tickFormatter={(value) => formatCurrency(value)} />
                            <Tooltip formatter={(value) => formatCurrency(value)} />
                            <Legend />
                            <Line type="monotone" dataKey="totalSales" stroke="#8884d8" activeDot={{ r: 8 }} />
                        </LineChart> */}
                    </Box>
                    <Typography variant="h6">Sản Phẩm Giảm Giá</Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Tên Sản Phẩm</TableCell>
                                    <TableCell>Giá Gốc</TableCell>
                                    <TableCell>Giá Giảm</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {discountedProducts.length > 0 ? (
                                    discountedProducts.map((product, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{product.name}</TableCell>
                                            <TableCell><Price amount={product.price} /></TableCell>
                                            <TableCell> {product.discount}% </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3}>Không có dữ liệu</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                </Box>
            )}

            {selectedChip === 11 && (
                <Box p={3}>
                    <Box mt={3}>
                        {/* <Typography variant="h6">Biểu Đồ Doanh Thu Theo Ngày</Typography>
                        <LineChart width={600} height={300} data={dailySales}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis tickFormatter={(value) => formatCurrency(value)} />
                            <Tooltip formatter={(value) => formatCurrency(value)} />
                            <Legend />
                            <Line type="monotone" dataKey="totalSales" stroke="#8884d8" activeDot={{ r: 8 }} />
                        </LineChart> */}
                    </Box>
                    <Typography variant="h6">Sản Phẩm Có Điểm Đánh Giá Cao</Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Tên Sản Phẩm</TableCell>
                                    <TableCell>Điểm Đánh Giá</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {topRatedProducts.length > 0 ? (
                                    topRatedProducts.map((product, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{product.name}</TableCell>
                                            <TableCell>{product.rating}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={2}>Không có dữ liệu</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                </Box>
            )}

            {selectedChip === 12 && (
                <Box p={3}>
                    <Box mt={3}>
                        {/* <Typography variant="h6">Biểu Đồ Doanh Thu Theo Ngày</Typography>
                        <LineChart width={600} height={300} data={dailySales}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis tickFormatter={(value) => formatCurrency(value)} />
                            <Tooltip formatter={(value) => formatCurrency(value)} />
                            <Legend />
                            <Line type="monotone" dataKey="totalSales" stroke="#8884d8" activeDot={{ r: 8 }} />
                        </LineChart> */}
                    </Box>
                    <Typography variant="h6">Sản Phẩm Theo Thương Hiệu</Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Thương Hiệu</TableCell>
                                    <TableCell>Số Lượng</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {productsByBrand.length > 0 ? (
                                    productsByBrand.map((brand, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{brand.name}</TableCell>
                                            <TableCell>{brand.product_count}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={2}>Không có dữ liệu</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                </Box>
            )}

        </Box>
    );
};

export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

export default ProductStatistics;
//