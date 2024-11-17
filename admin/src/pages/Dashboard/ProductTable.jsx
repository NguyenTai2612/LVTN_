import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';
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
import Price from '../../components/Price';

const ProductStatistics = () => {
    const [selectedOption, setSelectedOption] = useState(0);
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
        fetchStatisticsData();
    }, []);

    const fetchStatisticsData = async () => {
        try {
            const total = await apiGetTotalProducts();
            setTotalProducts(total);
            setNewProducts(await apiGetNewProducts());
            setOutOfStockProducts(await apiGetOutOfStockProducts());
            setProductViews(await apiGetProductViews());
            setMostCanceledProducts(await apiGetMostCanceledProducts());
            setProductsByCategory(await apiGetProductsByCategory());
            setProductsBySubCategory(await apiGetProductsBySubCategory());
            setProductsByChildSubCategory(await apiGetProductsByChildSubCategory());
            setBestSellingProduct(await apiGetTopSellingProducts());
            setProductsInStock(await apiGetProductsInStock());
            setDiscountedProducts(await apiGetDiscountedProducts());
            setTopRatedProducts(await apiGetTopRatedProducts());
            setProductsByBrand(await apiGetProductsByBrand());
        } catch (error) {
            console.error("Error fetching product statistics:", error);
        }
    };

    const optionLabels = [
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

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    return (
        <Box sx={{ width: '100%' }}>
            {/* Dropdown for selecting a category */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 3 }}>
                <FormControl variant="outlined" sx={{ minWidth: 200 }}>
                    <InputLabel>Chọn Thống Kê</InputLabel> {/* Chèn nhãn cho Select */}
                    <Select
                        value={selectedOption}
                        onChange={handleOptionChange}
                        displayEmpty
                        sx={{ minWidth: 200 }}
                        label="Chọn Thống Kê" // Liên kết nhãn với Select
                    >
                        {optionLabels.map((label, index) => (
                            <MenuItem key={index} value={index}>
                                {label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>



            <div className="custom-divider"></div>

            {/* Conditional rendering based on selected option */}
            {selectedOption === 0 && (
                <Box p={3}>
                    <Typography variant="h6">
                        Tổng Số Lượng Sản Phẩm: {totalProducts?.totalProducts || 'Đang tải...'}
                    </Typography>
                </Box>
            )}
            {selectedOption === 1 && (
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
            {/* Các tùy chọn khác sẽ được hiển thị tương tự */}

            {selectedOption === 2 && (
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

            {selectedOption === 3 && (
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

            {selectedOption === 4 && (
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

            {selectedOption === 5 && (
                <Box p={3}>
                    <Box mt={3}>

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


            {selectedOption === 6 && (
                <Box p={3}>
                    <Box mt={3}>

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


            {selectedOption === 7 && (
                <Box p={3}>
                    <Box mt={3}>

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

            {selectedOption === 8 && (
                <Box p={3}>
                    <Box mt={3}>

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

            {selectedOption === 9 && (
                <Box p={3}>
                    <Box mt={3}>

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

            {selectedOption === 10 && (
                <Box p={3}>
                    <Box mt={3}>

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

            {selectedOption === 11 && (
                <Box p={3}>
                    <Box mt={3}>

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

            {selectedOption === 12 && (
                <Box p={3}>
                    <Box mt={3}>

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

export default ProductStatistics;
