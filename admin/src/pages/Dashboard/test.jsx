import React, { useState, useEffect } from 'react';
import { Box, AppBar, Tabs, Tab, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
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
} from '../../services/stats'; // Import các API đã tạo
import Price from '../../components/Price';

const ProductStatistics = () => {
    const [value, setValue] = useState(0);
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
        // Call tất cả các API khi component được mount
        fetchStatisticsData();
    }, []);

    const fetchStatisticsData = async () => {
        try {
            const revenue = await apiGetTotalRevenue();
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

            const actualRevenueProduct = await apiGetActualRevenueByProduct();
            setActualRevenueByProduct(actualRevenueProduct);
        } catch (error) {
            console.error("Error fetching product statistics:", error);
        }
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <AppBar position="static" sx={{ backgroundColor: '#3f51b5' }}>
                <Tabs value={value} onChange={handleChange} aria-label="product statistics tabs">
                    <Tab label="Doanh Thu Tổng" />
                    <Tab label="Sản Phẩm Mới" />
                    <Tab label="Sản Phẩm Hết Hàng" />
                    <Tab label="Lượt Xem Sản Phẩm" />
                    <Tab label="Đơn Hàng Bị Hủy Nhiều Nhất" />
                    <Tab label="Doanh Thu Theo Tháng" />
                    <Tab label="Doanh Thu Theo Tuần" />
                    <Tab label="Doanh Thu Theo Ngày" />
                    <Tab label="Tổng Đơn Hàng" />
                    <Tab label="Doanh Thu Theo Sản Phẩm" />
                    <Tab label="Doanh Thu Thực Tế Theo Sản Phẩm" />
                </Tabs>
            </AppBar>

            {/* Tab 0: Doanh Thu Tổng */}
            {value === 0 && (
                <Box p={3}>
                    <Typography variant="h6">Doanh Thu Tổng: <Price amount={totalRevenue?.totalRevenue} /></Typography>
                </Box>
            )}

            {/* Tab 1: Sản phẩm mới */}
            {value === 1 && (
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
                                        <TableCell>{new Date(product.dateAdded).toLocaleDateString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}

            {/* Tab 2: Sản phẩm hết hàng */}
            {value === 2 && (
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
                                        <TableCell>{new Date(product.dateOutOfStock).toLocaleDateString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}

            {/* Tab 3: Lượt xem sản phẩm */}
            {value === 3 && (
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
                                {productViews.map((view, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{view.name}</TableCell>
                                        <TableCell>{view.views}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}

            {/* Tab 4: Đơn hàng bị hủy nhiều nhất */}
            {value === 4 && (
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
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell>{product.cancel_count}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}

            {/* Tab 5: Doanh thu theo tháng */}
            {value === 5 && (
                <Box p={3}>
                    <Typography variant="h6">Doanh Thu Theo Tháng</Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Tháng</TableCell>
                                    <TableCell>Doanh Thu</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {monthlySales.map((sales, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{sales.month}</TableCell>
                                        <TableCell><Price amount={sales.revenue} /></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}

            {/* Tab 6: Doanh thu theo tuần */}
            {value === 6 && (
                <Box p={3}>
                    <Typography variant="h6">Doanh Thu Theo Tuần</Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Tuần</TableCell>
                                    <TableCell>Doanh Thu</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {weeklySales.map((sales, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{sales.week}</TableCell>
                                        <TableCell><Price amount={sales.revenue} /></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}

            {/* Tab 7: Doanh thu theo ngày */}
            {value === 7 && (
                <Box p={3}>
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
                                        <TableCell><Price amount={sales.revenue} /></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}

            {/* Tab 8: Tổng đơn hàng */}
            {value === 8 && (
                <Box p={3}>
                    <Typography variant="h6">Tổng Đơn Hàng</Typography>
                    <Typography variant="h6">Tổng Số Đơn Hàng: {totalOrders?.totalOrders}</Typography>
                </Box>
            )}

            {/* Tab 9: Doanh thu theo sản phẩm */}
            {value === 9 && (
                <Box p={3}>
                    <Typography variant="h6">Doanh Thu Theo Sản Phẩm</Typography>
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
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell><Price amount={product.revenue} /></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}

            {/* Tab 10: Doanh thu thực tế theo sản phẩm */}
            {value === 10 && (
                <Box p={3}>
                    <Typography variant="h6">Doanh Thu Thực Tế Theo Sản Phẩm</Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Tên Sản Phẩm</TableCell>
                                    <TableCell>Doanh Thu Thực Tế</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {actualRevenueByProduct.map((product, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell><Price amount={product.actualRevenue} /></TableCell>
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

export default ProductStatistics;
