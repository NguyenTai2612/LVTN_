import React, { useState, useEffect } from 'react';
import { Box, AppBar, Tabs, Tab, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { 
    apiGetTotalProducts, 
    apiGetProductsByCategory, 
    apiGetProductsBySubCategory, 
    apiGetBestSellingProduct, 
    apiGetProductsInStock, 
    apiGetDiscountedProducts, 
    apiGetTopRatedProducts, 
    apiGetProductsByBrand 
} from '../../services/stats'; // Import các API đã tạo
import Price from '../../components/Price';

const ProductStatistics = () => {
    const [value, setValue] = useState(0);
    const [totalProducts, setTotalProducts] = useState(null);
    const [productsByCategory, setProductsByCategory] = useState([]);
    const [productsBySubCategory, setProductsBySubCategory] = useState([]);
    const [bestSellingProduct, setBestSellingProduct] = useState([]);
    const [productsInStock, setProductsInStock] = useState([]);
    const [discountedProducts, setDiscountedProducts] = useState([]);
    const [topRatedProducts, setTopRatedProducts] = useState([]);
    const [productsByBrand, setProductsByBrand] = useState([]);

    useEffect(() => {
        // Call tất cả các API khi component được mount
        fetchStatisticsData();
    }, []);

    const fetchStatisticsData = async () => {
        try {
            const total = await apiGetTotalProducts();
            setTotalProducts(total);

            const categoryData = await apiGetProductsByCategory();
            setProductsByCategory(categoryData);

            const subCategoryData = await apiGetProductsBySubCategory();
            setProductsBySubCategory(subCategoryData);

            const bestSelling = await apiGetBestSellingProduct();
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

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <AppBar position="static" sx={{ backgroundColor: '#3f51b5' }}>
                <Tabs value={value} onChange={handleChange} aria-label="product statistics tabs">
                    <Tab label="Số Lượng" />
                    <Tab label="Danh Mục" />
                    <Tab label="Tiểu Mục" />
                    <Tab label="Bán Chạy Nhất" />
                    <Tab label="Còn Trong Kho" />
                    <Tab label="Giảm Giá" />
                    <Tab label="Lượt Đánh Giá Cao Nhất" />
                    <Tab label="Thương Hiệu" />
                </Tabs>
            </AppBar>

            {/* Tab 0: Tổng số sản phẩm */}
            {value === 0 && (
                <Box p={3}>
                    <Typography variant="h6">Tổng Số Lượng Sản Phẩm: {totalProducts?.totalProducts}</Typography>
                </Box>
            )}

            {/* Tab 1: Sản phẩm theo danh mục */}
            {value === 1 && (
                <Box p={3}>
                    <Typography variant="h6">Sản Phẩm Theo Danh Mục</Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Danh Mục</TableCell>
                                    <TableCell>Số Lượng</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {productsByCategory.map((category, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{category.name}</TableCell>
                                        <TableCell>{category.product_count}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}

            {/* Tab 2: Sản phẩm theo tiểu mục */}
            {value === 2 && (
                <Box p={3}>
                    <Typography variant="h6">Sản Phẩm Theo Tiểu Mục</Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Tiểu Mục</TableCell>
                                    <TableCell>Số Lượng</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {productsBySubCategory.map((subCategory, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{subCategory.subCat}</TableCell>
                                        <TableCell>{subCategory.product_count}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}

            {/* Tab 3: Sản phẩm bán chạy nhất */}
            {value === 3 && (
                <Box p={3}>
                    <Typography variant="h6">Sản Phẩm Bán Chạy Nhất</Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Tên Sản Phẩm</TableCell>
                                    <TableCell>Số Lượng Bán</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {bestSellingProduct.map((product, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{product.Product.name}</TableCell>
                                        <TableCell>{product.total_sold}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}

            {/* Tab 4: Sản phẩm còn trong kho */}
            {value === 4 && (
                <Box p={3}>
                    <Typography variant="h6">Sản Phẩm Còn Trong Kho</Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Tên Sản Phẩm</TableCell>
                                    <TableCell>Số Lượng Còn Lại</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {productsInStock.map((product, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell>{product.countInStock}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}

            {/* Tab 5: Sản phẩm đang giảm giá */}
            {value === 5 && (
                <Box p={3}>
                    <Typography variant="h6">Sản Phẩm Đang Giảm Giá</Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Tên Sản Phẩm</TableCell>
                                    <TableCell>Giá</TableCell>
                                    <TableCell>Mức Giảm Giá (%)</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {discountedProducts.map((product, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell>
                                            <Price amount={product.price} />
                                        </TableCell>
                                        <TableCell>{product.discount}%</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}

            {/* Tab 6: Sản phẩm được đánh giá cao nhất */}
            {value === 6 && (
                <Box p={3}>
                    <Typography variant="h6">Sản Phẩm Được Đánh Giá Cao Nhất</Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Tên Sản Phẩm</TableCell>
                                    <TableCell>Điểm Đánh Giá</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {topRatedProducts.map((product, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell>{product.rating}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}

            {/* Tab 7: Sản phẩm theo thương hiệu */}
            {value === 7 && (
                <Box p={3}>
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
                                {productsByBrand.map((brand, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{brand.name}</TableCell>
                                        <TableCell>{brand.product_count}</TableCell>
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
