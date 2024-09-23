import React, { useContext, useEffect, useState } from 'react'
import SearchBox from '../../components/SearchBox'
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TooltipBox from '@mui/material/Tooltip';
import Pagination from '@mui/material/Pagination';
import Rating from '@mui/material/Rating';
import { FiEdit3 } from "react-icons/fi";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { MdOutlineDeleteOutline } from "react-icons/md";
import Button from '@mui/material/Button';
import { PiExport } from "react-icons/pi";
import { IoMdAdd } from "react-icons/io";
import Checkbox from '@mui/material/Checkbox';
import Drawer from '@mui/material/Drawer';
import HomeIcon from '@mui/icons-material/Home';
import { Modal, Box } from '@mui/material';
import axios from 'axios';

import { IoCloseSharp } from "react-icons/io5";

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { FaImage } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { deleteData, fetchDataFromApi } from '../../utils/api';
import { MyContext } from '../../App';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '@mui/material';
import { emphasize, styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import {
    apiGetProducts,
    apiGetProductDetails,
    deleteProductAndImages,
    apiGetProductPage,
    deleteProductsAndImages,
} from "../../services/product";
import Price from '../../components/Price/index';

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
    const backgroundColor =
        theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[800];
    return {
        backgroundColor,
        height: theme.spacing(3),
        color: theme.palette.text.primary,
        fontWeight: theme.typography.fontWeightRegular,
        '&:hover, &:focus': {
            backgroundColor: emphasize(backgroundColor, 0.06),
        },
        '&:active': {
            boxShadow: theme.shadows[1],
            backgroundColor: emphasize(backgroundColor, 0.12),
        },
    };
});

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const ProductList = () => {
    const [file, setFile] = useState(null);

    const [showBy, setShowBy] = useState("None");
    const [categoryBy, setCategoryBy] = useState('None');

    const [isAllChecked, setIsAllChecked] = useState(false);
    const [products, setProducts] = useState({ data: [], totalPages: 0 });
    const [currentPage, setCurrentPage] = useState(1);
    const [productDetails, setProductDetails] = useState({});

    const [selectedProducts, setSelectedProducts] = useState([]); // Danh sách sản phẩm được chọn
    const [files, setFiles] = useState([]);

    const [open, setOpen] = useState(false)

    const context = useContext(MyContext)

    const [page, setPage] = useState(1);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handlePageChange = (event, page) => {
        setCurrentPage(page);
    };

    const fetchProducts = async () => {
        try {
            const response = await apiGetProductPage(currentPage, 30);
            if (response?.err === 0) {
                setProducts({
                    data: response.response.data,
                    totalPages: response.response.totalPages
                });

                // Fetch details for all products
                const detailsPromises = response.response.data.map((product) =>
                    apiGetProductDetails(product.id)
                );
                const results = await Promise.all(detailsPromises);
                const details = {};
                results.forEach((result) => {
                    if (result.data.err === 0) {
                        details[result.data.response.id] = result.data.response;
                    }
                });
                setProductDetails(details);
            }
        } catch (error) {
            console.error("Failed to fetch products or product details", error);
        }
    };


    const handleDeleteProduct = async (productId) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await deleteProductAndImages(productId);
            await fetchProducts();

            if (result.err === 0) {
                // Thành công, fetch lại dữ liệu sản phẩm
                alert('Product deleted successfully');
            } else {
                // Hiển thị thông báo lỗi nếu có
                alert('Product deleted successfully');
            }
        } catch (error) {
            // Hiển thị thông báo lỗi chung nếu xảy ra lỗi trong quá trình gọi API
            alert('An error occurred while deleting the product: ' + (error.message || 'Unknown error'));
        } finally {
            setIsLoading(false);
        }
    };

    // Xử lý khi bấm "Select All"
    const handleSelectAll = () => {
        if (isAllChecked) {
            setSelectedProducts([]); // Nếu đang chọn tất cả, thì bỏ chọn tất cả
        } else {
            setSelectedProducts(products.data.map(item => item.id)); // Chọn tất cả sản phẩm
        }
        setIsAllChecked(!isAllChecked); // Đảo trạng thái select all
    };

    // Xử lý khi chọn/bỏ chọn một sản phẩm
    const handleSelectProduct = (id) => {
        if (selectedProducts.includes(id)) {
            setSelectedProducts(selectedProducts.filter((productId) => productId !== id)); // Bỏ chọn sản phẩm
        } else {
            setSelectedProducts([...selectedProducts, id]); // Chọn sản phẩm
        }
    };

    // Gọi API để xóa các sản phẩm được chọn
    const handleDeleteSelectedProducts = async () => {
        setIsLoading(true); // Đặt trạng thái loading
        setError(null); // Đặt lại lỗi
        try {
            // Gọi API để xóa các sản phẩm đã chọn
            await deleteProductsAndImages(selectedProducts);

            // Fetch lại danh sách sản phẩm sau khi xóa
            await fetchProducts();
            alert('Sản phẩm đã được xóa thành công');
        } catch (error) {
            // Hiển thị thông báo lỗi nếu có
            alert('Đã xảy ra lỗi trong quá trình xóa sản phẩm: ' + (error.message || 'Lỗi không xác định'));
        } finally {
            setIsLoading(false); // Đặt lại trạng thái loading
            setSelectedProducts([]); // Reset danh sách đã chọn
            setIsAllChecked(false); // Bỏ chọn tất cả
        }
    };


    useEffect(() => {

        fetchProducts();
    }, [currentPage]);



    const selectAll = (e) => {
        if (e.target.checked === true) {
            setIsAllChecked(true)
        } else {
            setIsAllChecked(false)
        }
    }

    // Mở modal
    const handleOpen = () => setOpen(true);

    // Đóng modal
    const handleClose = () => setOpen(false);

    const handleFileChange = (event) => {
        setFiles(event.target.files); // Đảm bảo sử dụng setFiles thay vì setSelectedFiles
      };

    // Hàm xử lý khi submit form
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (files.length === 0) {
            alert("Please upload at least one CSV file.");
            return;
        }

        const formData = new FormData();

        // Lặp qua danh sách các file và thêm vào FormData
        for (let i = 0; i < files.length; i++) {
            formData.append('csvFiles', files[i]);
        }

        try {
            const response = await axios.post('http://localhost:5000/api/v1/uploadCSV/import-csv', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Files uploaded successfully!');
            handleClose();
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to upload the files.');
        }
    };



    const toggleDrawer = (newOpen) => {

        setOpen(newOpen);

    };



    return (
        <>

            <div className='card shadow my-4 border-0 flex-center p-3' style={{ backgroundColor: '#343A40' }}>
                <div className='flex items-center justify-between'>
                    <h1 className='font-weight-bold text-white'>Products List</h1>

                    <div className='ml-auto '>
                        <Breadcrumbs aria-label="breadcrumb">
                            <StyledBreadcrumb
                                component={Link}
                                href="#"
                                label="Dashboard"
                                to="/"
                                icon={<HomeIcon fontSize="small"
                                />}
                            />
                            <StyledBreadcrumb component={Link} href="#" label="Product" to='http://localhost:5173/product/list' />


                        </Breadcrumbs>
                    </div>
                    <div className='ml-4 flex items-center gap-3'>
                        {/* <Button className='btn-border btn-sm bg-white'><PiExport /> Export</Button> */}
                        <Link to={'/product/upload'}><Button className='btn-blue btn-sm'><IoMdAdd /> Add Product</Button></Link>
                    </div>

                    <div className='ml-4 flex items-center gap-3'>
                        {/* <Button className='btn-border btn-sm bg-white'><PiExport /> Export</Button> */}

                        <Button className='btn-blue btn-sm' onClick={handleOpen}>
                            <IoMdAdd /> Import CSV
                        </Button>

                    </div>
                </div>
            </div>

            {/* Modal */}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="import-csv-modal"
                aria-describedby="import-csv-form"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <h2 id="import-csv-modal">Upload CSV File</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="file"
                            accept=".csv"
                            multiple  // Cho phép chọn nhiều file
                            onChange={handleFileChange}
                        />
                        <Button type="submit" variant="contained" color="primary">
                            Upload CSVs
                        </Button>
                    </form>
                </Box>
            </Modal>

            <div className='card shadow my-4 border-0'>
                <div className='flex items-center mb-4 justify-between pt-3 px-4'>
                    {/* <h2 className='mb-0 font-bold text-md '>Best Selling Products</h2> */}


                    <div className='mr-auto flex items-center gap-4'>
                        <button
                            onClick={handleDeleteSelectedProducts}
                            disabled={selectedProducts.length === 0}
                            className='delete-button1'
                        >
                            Xóa các sản phẩm đã chọn
                        </button>

                        <div className='filter-container col-md-5'>
                            <h6 className='mb-2'>Show By</h6>
                            <FormControl size="small" className="w-100">
                                <Select
                                    value={showBy}
                                    onChange={(e) => setShowBy(e.target.value)}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    labelId="show-by-label"
                                    className="w-100"
                                >
                                    <MenuItem value="None">
                                        <em>None</em>
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </div>

                        <div className='filter-container col-md-5'>
                            <h6 className='mb-2'>Category By</h6>
                            <FormControl size="small" className="w-100">
                                <Select
                                    value={categoryBy}
                                    onChange={(e) => setCategoryBy(e.target.value)}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    labelId="category-by-label"
                                    className="w-100"
                                >
                                    <MenuItem value="None">
                                        <em>None</em>
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </div>

                        <SearchBox />
                    </div>


                </div>
                <div className='table-responsive mb-2'>
                    <table className='table w-[100%] table-striped'>
                        <thead className='thead-dark'>
                            <tr>
                                <th><Checkbox
                                    {...label}
                                    size='small'
                                    checked={isAllChecked}
                                    onChange={handleSelectAll}
                                />
                                </th>
                                <th>PRODUCTS</th>
                                <th>CATEGORY</th>
                                <th>SUB CATEGORY</th>
                                <th>CHILD SUB CAT</th>
                                <th>BRAND</th>
                                <th>PRICE</th>
                                <th>STOCK</th>
                                <th>RATING</th>
                                {/* <th>ORDER</th>
                                <th>SALES</th> */}
                                <th>ACTIONS</th>

                            </tr>
                        </thead>

                        <tbody>
                            {products && products.data && products.data.length > 0 && (
                                <>




                                    {products.data.map((item, index) => {
                                        const details = productDetails[item.id] || {};
                                        const primaryImage = details?.ProductImages?.[0]?.imageUrl || "";

                                        return (
                                            <tr key={index}>
                                                <td>
                                                    <Checkbox
                                                        {...label}
                                                        size='small'
                                                        checked={selectedProducts.includes(item.id)}
                                                        onChange={() => handleSelectProduct(item.id)}
                                                    />
                                                </td>
                                                <td>
                                                    <div className='flex items-center gap-5 w-[300px]'>
                                                        <div className='imgWrapper shadow overflow-hidden w-[25%] h-[25%] rounded-md'>
                                                            <img src={primaryImage} className='w-100' alt={item.name} />
                                                        </div>
                                                        <div className='info w-[75%]'>
                                                            <h6>{details.name || item.name}</h6>
                                                            <p>{details.description || item.description}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{details?.Category?.name || item.category?.name}</td>
                                                <td>{details?.SubCategory?.subCat || item.subCat?.subCat}</td>
                                                <td>{details?.ChildSubCategory?.name || item.subCat?.name}</td>
                                                <td>{details?.Brand?.name || item.brand}</td>
                                                <td>
                                                    <div className='w-[90px]'>
                                                        {/* <del className="old text-danger">{details.oldPrice || item.oldPrice} VND</del> */}
                                                        <span className="new font-weight-bold">
                                                            <Price amount={details.price || item.price} />
                                                        </span>
                                                    </div>
                                                </td>
                                                <td>{details.countInStock || item.countInStock}</td>
                                                <td>
                                                    <Rating
                                                        name="size-small"
                                                        value={parseFloat(details.rating || item.rating)}
                                                        precision={0.5}
                                                        readOnly
                                                        size='small'
                                                    />
                                                </td>
                                                <td>
                                                    <div className='actions flex items-center gap-2'>
                                                        <TooltipBox title="Edit" placement="top">
                                                            <Link to={`/product/edit/${item.id}`}>
                                                                <button className='edit-button flex items-center justify-center w-[30px] h-[30px] rounded-md duration-300'>
                                                                    <FiEdit3 />
                                                                </button>
                                                            </Link>
                                                        </TooltipBox>
                                                        <TooltipBox title="View" placement="top">
                                                            <Link to={`/product/detail/${item.id}`}>
                                                                <button className='view-button flex items-center justify-center w-[30px] h-[30px] rounded-md duration-300'>
                                                                    <MdOutlineRemoveRedEye />
                                                                </button>
                                                            </Link>
                                                        </TooltipBox>
                                                        <TooltipBox title="Delete" placement="top">
                                                            <button
                                                                onClick={() => handleDeleteProduct(item.id)}
                                                                className='delete-button flex items-center justify-center w-[30px] h-[30px] rounded-md duration-300'>
                                                                <MdOutlineDeleteOutline />
                                                            </button>
                                                        </TooltipBox>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}


                                </>
                            )}


                        </tbody>


                    </table>

                </div>

                <div className="table-footer flex items-center justify-between py-2 px-3 mb-2">
                    {products.totalPages > 1 &&
                        <div className="d-flex tableFooter flex items-center justify-end py-2 px-3 mb-2 ml-auto">
                            <Pagination
                                count={products.totalPages}
                                color="primary"
                                className="pagination"
                                page={currentPage}
                                onChange={handlePageChange}
                                showFirstButton
                                showLastButton
                            />
                        </div>
                    }
                </div>

            </div>

        </>
    )
}

export default ProductList
// edited/////////////// okk