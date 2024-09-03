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
} from "../../services/product";

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
    const [catData, setCatData] = useState([]);

    const [perPage, setPerPage] = useState(10);
    const [showBy, setShowBy] = useState("None");
    const [categoryBy, setCategoryBy] = useState('None');

    const [isAllChecked, setIsAllChecked] = useState(false);
    const [products, setProducts] = useState([]);
    const [productDetails, setProductDetails] = useState({});
    const [open, setOpen] = useState(false)

    const context = useContext(MyContext)

    const [categoryVal, setCategoryVal] = useState('');
    const [subCategoryVal, setSubCategoryVal] = useState('');
    const [isFeatured, setIsFeatured] = useState('None');
    const [page, setPage] = useState(1);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await apiGetProducts();
                if (response?.data.err === 0) {
                    setProducts(response.data.response);
                    // Fetch details for all products
                    const detailsPromises = response.data.response.map((product) =>
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
        fetchProducts();
    }, []);

    const handleChange = (event, value) => {
        // context.setProgress(40)
        setPage(value)

    };

    const selectAll = (e) => {
        if (e.target.checked === true) {
            setIsAllChecked(true)
        } else {
            setIsAllChecked(false)
        }
    }



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
                </div>
            </div>
            <div className='card shadow my-4 border-0'>
                <div className='flex items-center mb-4 justify-between pt-3 px-4'>
                    {/* <h2 className='mb-0 font-bold text-md '>Best Selling Products</h2> */}


                    <div className='mr-auto flex items-center gap-4'>


                        <div className='col-md-5'>
                            <h6 className='mb-2'>Show By</h6>
                            <FormControl size="small" className="w-100">

                                <Select
                                    value={showBy}
                                    onChange={(e) => setShowBy(e.target.value)}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    labelId="demo-select-small-label"
                                    className="w-100">
                                    <MenuItem value="None">
                                        <em>None</em>
                                    </MenuItem>

                                </Select>


                            </FormControl>



                        </div>

                        <div className='col-md-5'>
                            <h6 className='mb-2'>Category By</h6>
                            <FormControl size="small" className="w-100">

                                <Select
                                    value={categoryBy}
                                    onChange={(e) => setCategoryBy(e.target.value)}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    labelId="demo-select-small-label"
                                    className="w-100">
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
                                <th><Checkbox {...label} size='small' onChange={selectAll} /></th>
                                <th>PRODUCTS</th>
                                <th>CATEGORY</th>
                                <th>SUB CATEGORY</th>
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
                            {products?.length !== 0 && products?.map((item, index) => {
                                // Lấy thông tin chi tiết từ productDetails
                                const details = productDetails[item.id] || {};

                                // Lấy hình ảnh chính
                                const primaryImage = details?.ProductImages?.[0]?.imageUrl || "";

                                return (
                                    <tr key={index}>
                                        <td><Checkbox {...label} size='small' checked={isAllChecked} /></td>
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
                                        <td>{details?.Brand?.name || item.brand}</td>
                                        <td>
                                            <div className='w-[90px]'>
                                                <del className="old">{details.oldPrice || item.oldPrice} VND</del>
                                                <span className="new text-danger">{details.price || item.price} VND</span>
                                            </div>
                                        </td>
                                        <td>{details.countInStock || item.countInStock}</td>
                                        <td><Rating name="size-small" value={parseFloat(details.rating || item.rating)} precision={0.5} readOnly size='small' /></td>
                                        <td>
                                            <div className='actions flex items-center gap-2'>
                                                <TooltipBox title="Edit" placement="top">
                                                    <Link to={`/product/edit/${item.id}`}>
                                                        <button className='edit-button flex items-center justify-center w-[30px] h-[30px] rounded-md duration-300'><FiEdit3 /></button>
                                                    </Link>
                                                </TooltipBox>
                                                <TooltipBox title="View" placement="top">
                                                    <Link to={`/product/detail/${item.id}`}>
                                                        <button className='view-button flex items-center justify-center w-[30px] h-[30px] rounded-md duration-300'><MdOutlineRemoveRedEye /></button>
                                                    </Link>
                                                </TooltipBox>
                                                <TooltipBox title="Delete" placement="top">
                                                    <button
                                                        onClick={() => deleteProduct(item.id)}
                                                        className='delete-button flex items-center justify-center w-[30px] h-[30px] rounded-md duration-300'>
                                                        <MdOutlineDeleteOutline />
                                                    </button>
                                                </TooltipBox>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>


                    </table>

                </div>


            </div>

        </>
    )
}

export default ProductList
//