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

    const [productList, setProductList] = useState([]);

    const [open, setOpen] = useState(false)

    const context = useContext(MyContext)

    const [categoryVal, setCategoryVal] = useState('');
    const [subCategoryVal, setSubCategoryVal] = useState('');
    const [isFeatured, setIsFeatured] = useState('None');


    const handleChange = (event, value) => {
        context.setProgress(40)

        fetchDataFromApi(`/api/products?page=${value}`).then((res) => {
            setProductList(res);
            context.setProgress(100)

        })
    };

    const selectAll = (e) => {
        if (e.target.checked === true) {
            setIsAllChecked(true)
        } else {
            setIsAllChecked(false)
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0)
        context.setProgress(40)

        fetchDataFromApi("/api/products").then((res) => {
            setProductList(res)
            context.setProgress(100)

        })
    }, [])

    const toggleDrawer = (newOpen) => {

        setOpen(newOpen);

    };

    const deleteProduct = (id) => {
        context.setProgress(40)
        deleteData(`/api/products/${id}`).then((res) => {
            context.setProgress(100)
            context.setAlertBox({
                open: true,
                error: false,
                msg: 'Product Deleted!'
            })
            fetchDataFromApi("/api/products").then((res) => {
                setProductList(res)
            })
        })
    }

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
                                    {
                                        context.catData?.categoryList?.length !== 0 && context.catData?.categoryList?.map((cat, index) => {
                                            return (
                                                <MenuItem className='text-capitalize' value={cat.id} key={index}>{cat.name}</MenuItem>
                                            )
                                        })
                                    }
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
                                    {
                                        context.catData?.categoryList?.length !== 0 && context.catData?.categoryList?.map((cat, index) => {
                                            return (
                                                <MenuItem className='text-capitalize' value={cat.id} key={index}>{cat.name}</MenuItem>
                                            )
                                        })
                                    }
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
                            {
                                productList?.products?.length !== 0 && productList?.products?.map((item, index) => {
                                    return (
                                        <tr>
                                            <td><Checkbox {...label} size='small' checked={isAllChecked} /></td>
                                            <td>
                                                <div className='flex items-center gap-5 w-[300px]'>
                                                    <div className='imgWrapper shadow overflow-hidden w-[25%] h-[25%] rounded-md'>
                                                        <img src={`http://localhost:4000/uploads/${item?.images[0]}`} className='w-100' />
                                                    </div>

                                                    <div className='info w-[75%]'>
                                                        <h6>{item.name}</h6>
                                                        <p>{item.description}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{item.category?.name}</td>
                                            <td>{item.subCat?.subCat}</td>
                                            <td>{item.brand}</td>
                                            <td>
                                                <div className='w-[90px]'>
                                                    <del class="old">{item.oldPrice} VND</del>
                                                    <span class="new text-danger">{item.price} VND</span>
                                                </div>
                                            </td>
                                            <td>300</td>
                                            <td><Rating name="size-small" defaultValue={item.rating} precision={0.5} readOnly size='small' /></td>
                                            {/* <td>350</td>
                                            <td>$35k</td> */}
                                            <td>
                                                <div className='actions flex items-center gap-2'>
                                                    <TooltipBox title="Edit" placement="top">
                                                        <Link to={`/product/edit/${item.id}`}>
                                                            <button
                                                                className='edit-button flex items-center justify-center w-[30px] h-[30px] rounded-md duration-300'
                                                            // onClick={() => toggleDrawer(true)}
                                                            ><FiEdit3 /></button>
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
                                    )
                                })
                            }


                        </tbody>
                    </table>
                    {productList?.totalPages > 1 &&
                        <div className='table-footer flex items-center justify-end py-2 px-3 mb-2 ml-auto'>
                            <Pagination count={productList?.totalPages} color="primary" className="pagination" showFirstButton showLastButton onChange={handleChange} />
                        </div>
                    }
                </div>


            </div>
            <Drawer open={open} onClose={() => toggleDrawer(false)} anchor={"right"} className='sidepanel'>
                <form className='form w-[100%] mt-4 relative' >
                    <Button className='close_ ' onClick={() => toggleDrawer(false)} ><IoMdClose /></Button>
                    <div className='card shadow border-0 flex-center p-3'>
                        <h2 className='font-weight-bold text-black/70 mb-4'>Basic Information</h2>
                        <div className='row'>
                            <div className='col-md-12 col_'>
                                <h4>Product Name</h4>
                                <div className='form-group'>
                                    <input type='text' className='input' />
                                </div>
                            </div>

                            <div className='col-md-12 col_'>
                                <h4>Product Description</h4>
                                <div className='form-group'>
                                    <textarea className='input' />
                                </div>
                            </div>

                            <div className='col-md-4 col_'>
                                <h4>Category</h4>
                                <div className='form-group'>
                                    <FormControl size="small" className="w-100">
                                        <Select
                                            value={categoryVal}
                                            onChange={(e) => setCategoryVal(e.target.value)}
                                            displayEmpty
                                            inputProps={{ 'aria-label': 'Without label' }}
                                            labelId="demo-select-small-label"
                                            className="w-100">
                                            <MenuItem value=""> <em>None</em>
                                            </MenuItem>
                                            <MenuItem value={'Guitar'}>Guitar</MenuItem>
                                            <MenuItem value={'Piano'}>Piano</MenuItem>
                                            <MenuItem value={'Organ'}>Organ</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                            </div>

                            <div className='col-md-4 col_'>
                                <h4>Sub Category</h4>
                                <div className='form-group'>
                                    <FormControl size="small" className="w-100">
                                        <Select
                                            value={subCategoryVal}
                                            onChange={(e) => setSubCategoryVal(e.target.value)}
                                            displayEmpty
                                            inputProps={{ 'aria-label': 'Without label' }}
                                            labelId="demo-select-small-label"
                                            className="w-100">
                                            <MenuItem value=""> <em>None</em>
                                            </MenuItem>
                                            <MenuItem value={'Yamaha'}>Yamaha</MenuItem>
                                            <MenuItem value={'Kawai'}>Kawai</MenuItem>
                                            <MenuItem value={'Roland'}>Roland</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                            </div>

                            <div className='col-md-4 col_'>
                                <h4>Price</h4>
                                <div className='form-group'>
                                    <input type='text' className='input' />
                                </div>
                            </div>
                        </div>

                        <div className='row'>
                            <div className='col-md-4 col_'>
                                <h4>Old Price</h4>
                                <div className='form-group'>
                                    <input type='text' className='input' />
                                </div>
                            </div>

                            <div className='col-md-4 col_'>
                                <h4>Is Featured</h4>
                                <div className='form-group'>
                                    <FormControl size="small" className="w-100">
                                        <Select
                                            value={isFeatured}
                                            onChange={(e) => setIsFeatured(e.target.value)}
                                            displayEmpty
                                            inputProps={{ 'aria-label': 'Without label' }}
                                            labelId="demo-select-small-label"
                                            className="w-100">
                                            <MenuItem value="None"> <em>None</em>
                                            </MenuItem>
                                            <MenuItem value={"True"}>True</MenuItem>
                                            <MenuItem value={"False"}>False</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                            </div>

                            <div className='col-md-4 col_'>
                                <h4>Product Stock</h4>
                                <div className='form-group'>
                                    <input type='text' className='input' />
                                </div>
                            </div>
                        </div>

                        <div className='row'>
                            <div className='col-md-4 col_'>
                                <h4>Brand</h4>
                                <div className='form-group'>
                                    <input type='text' className='input' />
                                </div>
                            </div>

                            <div className='col-md-4 col_'>
                                <h4>Discount</h4>
                                <div className='form-group'>
                                    <input type='text' className='input' />
                                </div>
                            </div>

                            <div className='col-md-4 col_'>
                                <h4>Rating</h4>
                                <div className='form-group'>
                                    <Rating name='read-only' value={4.5} size='small' precision={0.5} />
                                </div>
                            </div>
                        </div>


                    </div>



                    <br />
                    <br />
                    <br />



                </form >
            </Drawer>
        </>
    )
}

export default ProductList