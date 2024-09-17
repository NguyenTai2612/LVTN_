import React, { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Grid, Card, CardContent } from '@mui/material';
import {
    apiGetTotalRevenue,
    apiGetNewProducts,
    apiGetOutOfStockProducts,
    apiGetProductViews,
    apiGetMostCanceledProducts,
    apiGetMonthlySales,
    apiGetWeeklySales,
    apiGetDailySales,
    apiGetTotalOrders,
    apiGetRevenueByProduct,
    apiGetActualRevenueByProduct
} from '../../services/stats';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';

import Price from '../../components/Price';

const ProductStatistics = () => {
    const [selectedChip, setSelectedChip] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(null);
    const [newProducts, setNewProducts] = useState([]);
    const [outOfStockProducts, setOutOfStockProducts] = useState([]);
    const [productViews, setProductViews] = useState([]);
    const [mostCanceledProducts, setMostCanceledProducts] = useState([]);
    const [monthlySales, setMonthlySales] = useState([]);
    const [weeklySales, setWeeklySales] = useState([]);
    const [dailySales, setDailySales] = useState([]);
    const [totalOrders, setTotalOrders] = useState(null);
    const [revenueByProduct, setRevenueByProduct] = useState([]);
    const [actualRevenueByProduct, setActualRevenueByProduct] = useState([]);


    useEffect(() => {
        // Fetch statistics data when component mounts
        fetchStatisticsData();
    }, []);

    const fetchStatisticsData = async () => {
        try {
            const revenue = await apiGetTotalRevenue();
            console.log('revenue', revenue)
            setTotalRevenue(revenue);

            const newProd = await apiGetNewProducts();
            setNewProducts(newProd);

            const outOfStock = await apiGetOutOfStockProducts();
            setOutOfStockProducts(outOfStock);

            const views = await apiGetProductViews();
            setProductViews(views);

            const canceledProducts = await apiGetMostCanceledProducts();
            setMostCanceledProducts(canceledProducts);

            const monthly = await apiGetMonthlySales();
            setMonthlySales(monthly);

            const weekly = await apiGetWeeklySales();
            setWeeklySales(weekly);

            const daily = await apiGetDailySales();
            setDailySales(daily);

            const total = await apiGetTotalOrders();
            setTotalOrders(total);

            const revenueProduct = await apiGetRevenueByProduct();
            setRevenueByProduct(revenueProduct);
            console.log('revenueProduct', revenueProduct)

            const actualRevenueProduct = await apiGetActualRevenueByProduct();
            setActualRevenueByProduct(actualRevenueProduct);
        } catch (error) {
            console.error("Error fetching product statistics:", error);
        }
    };

    const handleChipClick = (index) => {
        setSelectedChip(index);
    };

    const maxRevenue = Math.max(...revenueByProduct.map(item => item.totalRevenue));

    const chipLabels = [
        "Doanh Thu Tổng",
        "Sản Phẩm Mới",
        "Sản Phẩm Hết Hàng",
        "Lượt Xem Sản Phẩm",
        "Đơn Hàng Bị Hủy Nhiều Nhất",
        "Doanh Thu Theo Tháng",
        "Doanh Thu Theo Tuần",
        "Doanh Thu Theo Ngày",
        "Tổng Đơn Hàng",
        "Doanh Thu Theo Sản Phẩm",
        "Doanh Thu Thực Tế Theo Sản Phẩm"
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
                        Doanh Thu Tổng: <Price amount={totalRevenue?.data[0]?.totalActualRevenue} />
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
                        <Typography variant="h6">Biểu Đồ Doanh Thu Theo Tháng</Typography>
                        <LineChart width={600} height={300} data={monthlySales}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis tickFormatter={(value) => formatCurrency(value)} />
                            {/* Custom Tooltip to format price */}
                            <Tooltip formatter={(value) => formatCurrency(value)} />
                            <Legend />
                            <Line type="monotone" dataKey="totalSales" stroke="#8884d8" activeDot={{ r: 8 }} />
                        </LineChart>
                    </Box>
                    <Typography variant="h6">Doanh Thu Theo Tháng</Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Tháng</TableCell>
                                    <TableCell>Doanh Thu</TableCell>
                                    <TableCell>Tổng số sản phẩm</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {monthlySales.map((sales, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{sales.month}</TableCell>
                                        <TableCell><Price amount={sales.totalSales} /></TableCell>
                                        <TableCell>{sales.totalProductsSold}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}


            {selectedChip === 6 && (
                <Box p={3}>
                    <Box mt={3}>
                        <Typography variant="h6">Biểu Đồ Doanh Thu Theo Tuần</Typography>
                        <BarChart width={600} height={300} data={weeklySales}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="week" />
                            <YAxis tickFormatter={(value) => formatCurrency(value)} />
                            {/* Custom Tooltip to format price */}
                            <Tooltip formatter={(value) => formatCurrency(value)} />
                            <Legend />
                            <Bar dataKey="totalSales" fill="#82ca9d" />
                        </BarChart>
                    </Box>
                    <Typography variant="h6">Doanh Thu Theo Tuần</Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Tuần</TableCell>
                                    <TableCell>Doanh Thu</TableCell>
                                    <TableCell>Tổng số sản phẩm</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {weeklySales.map((sales, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{sales.week}</TableCell>
                                        <TableCell><Price amount={sales.totalSales} /></TableCell>
                                        <TableCell>{sales.totalProductsSold}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}

            {selectedChip === 7 && (
                <Box p={3}>
                    <Box mt={3}>
                        <Typography variant="h6">Biểu Đồ Doanh Thu Theo Ngày</Typography>
                        <LineChart width={600} height={300} data={dailySales}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis tickFormatter={(value) => formatCurrency(value)} />
                            {/* Custom Tooltip to format price */}
                            <Tooltip formatter={(value) => formatCurrency(value)} />
                            <Legend />
                            <Line type="monotone" dataKey="totalSales" stroke="#8884d8" activeDot={{ r: 8 }} />
                        </LineChart>
                    </Box>
                    <Typography variant="h6">Doanh Thu Theo Ngày</Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Ngày</TableCell>
                                    <TableCell>Doanh Thu</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {dailySales.map((sales, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{sales.date}</TableCell>
                                        <TableCell><Price amount={sales.totalSales} /></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                </Box>
            )}

            {selectedChip === 8 && (
                <Box p={3}>
                    <Typography variant="h6">Tổng Số Đơn Hàng: {totalOrders?.totalOrders}</Typography>
                </Box>
            )}

            {selectedChip === 9 && (
                <Box p={3}>
                    <Typography variant="h6">Doanh Thu Theo Sản Phẩm</Typography>
                    <BarChart width={600} height={300} data={revenueByProduct}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="Product.name" />
                        <YAxis
                            tickFormatter={(value) => formatCurrency(value)}
                            domain={[0, maxRevenue * 1.1]} // Thêm một khoảng dư để hiển thị đầy đủ cột
                        />
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                        <Legend />
                        <Bar dataKey="totalRevenue" fill="#8884d8" />
                    </BarChart>

                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Tên Sản Phẩm</TableCell>
                                    <TableCell>Doanh Thu</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {revenueByProduct.map((product, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{product.Product.name}</TableCell>
                                        <TableCell><Price amount={product.totalRevenue} /></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}

            {selectedChip === 10 && (
                <Box p={3}>
                    <Typography variant="h6">Doanh Thu Thực Tế Theo Sản Phẩm</Typography>
                    <BarChart width={600} height={300} data={actualRevenueByProduct}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="productName" />
                        {/* Custom tick formatter for YAxis */}
                        <YAxis tickFormatter={(value) => formatCurrency(value)} />
                        {/* Custom Tooltip to format price */}
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                        <Legend />
                        <Bar dataKey="totalActualRevenue" fill="#8884d8" />
                    </BarChart>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Tên Sản Phẩm</TableCell>
                                    <TableCell>Doanh Thu</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {actualRevenueByProduct.map((product, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{product.productName}</TableCell>
                                        <TableCell><Price amount={product.totalActualRevenue} /></TableCell>
                                    </TableRow>
                                ))}
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
