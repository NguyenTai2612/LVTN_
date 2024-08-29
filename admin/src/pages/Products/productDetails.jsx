import React, { useContext, useEffect, useRef, useState } from 'react'
import { emphasize, styled } from '@mui/material/styles';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Chip from '@mui/material/Chip';
import HomeIcon from '@mui/icons-material/Home';
import { Avatar, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, MenuItem, Select, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import { FaCloudUploadAlt, FaRegImages } from 'react-icons/fa';
import { deleteData, fetchDataFromApi, postData } from '../../utils/api';
import CircularProgress from '@mui/material/CircularProgress';
import { Link, useNavigate, useParams } from 'react-router-dom'
import ProductZoom from "../../components/ProductZoom";
import Price from "../../components/Price";
import { MyContext } from "../../App";
import { FaTags, FaBoxOpen, FaPalette, FaRuler, FaRegCalendarAlt, FaStar, FaTshirt } from 'react-icons/fa';
import { MdOutlineBrandingWatermark } from 'react-icons/md';
import { GoCodeReview } from "react-icons/go";
import { TbCategoryPlus } from "react-icons/tb";
import './ProductDetails.css';
import { Rating } from "@mui/material";

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

function handleClick(event) {
    event.preventDefault();
    console.info('You clicked a breadcrumb.');
}

const ProductDetails = () => {

    const [productData, setProductData] = useState([]);
    const [reviewData, setReviewData] = useState([]);

    const specifications = productData?.specifications || {};
    const { id } = useParams();
    const context = useContext(MyContext);
    useEffect(() => {
        window.scrollTo(0, 0);
        fetchDataFromApi(`/api/products/${id}`).then((res) => {
            setProductData(res)
        });

        fetchDataFromApi(`/api/productReviews?productId=${id}`).then((res) => {
            setReviewData(res);
        });

    }, [id]);




    return (
        <>
            <div className='card shadow my-4 border-0 flex-center p-3' style={{ backgroundColor: '#343A40' }}>
                <div className='flex items-center justify-between'>
                    <h1 className='font-weight-bold text-white'>Product Details</h1>

                    <div className='ml-auto flex items-center gap-3'>
                        <Breadcrumbs aria-label="breadcrumb">
                            <StyledBreadcrumb
                                component={Link}
                                href="#"
                                label="Dashboard"
                                to="/"
                                icon={<HomeIcon fontSize="small" />}
                            />
                            <StyledBreadcrumb component={Link} href="#" label="Product" to='http://localhost:5173/product/list' />


                        </Breadcrumbs>
                    </div>
                </div>
            </div>


            <div className='row'>
                <div className='col-md-12'>
                    <div className='card shadow my-4 border-0 flex-center p-3'>
                        <div className="row">
                            <div className="col-md-4">
                                <div className='pt-3 pb-3 pl-4 pr-4' >
                                    <ProductZoom images={productData?.images} />
                                </div>


                            </div>

                            <div className="col-md-8 d-flex">
                                <div className='pt-3 pb-3 pr-4' >
                                    <div className="product-info">

                                        <div className="product-title">{productData?.name}</div>


                                        <div className="product-details">

                                            <ul className="product-info">

                                                <li>
                                                    <MdOutlineBrandingWatermark className="icon" />
                                                    <span className="label">Brand</span>
                                                    <span className="colon">:</span>
                                                    <span className="value">{productData?.brand}</span>
                                                </li>
                                                <li>
                                                    <TbCategoryPlus className="icon" />
                                                    <span className="label">Category</span>
                                                    <span className="colon">:</span>
                                                    <span className="value">{productData?.catName}</span>
                                                </li>

                                                <li>
                                                    <GoCodeReview className="icon" />
                                                    <span className="label">Review</span>
                                                    <span className="colon">:</span>
                                                    <span className="value">(<b className='text-blue'>{reviewData?.length}</b>) Review</span>
                                                </li>
                                                <li>
                                                    <MdOutlineBrandingWatermark className="icon" />
                                                    <span className="label">Price</span>
                                                    <span className="colon">:</span>
                                                    <span className="value"><Price amount={productData?.price} /></span>
                                                </li>
                                                <li>
                                                    <MdOutlineBrandingWatermark className="icon" />
                                                    <span className="label">Discount</span>
                                                    <span className="colon">:</span>
                                                    <span className="value">- {productData?.discount} %</span>
                                                </li>
                                                <li>
                                                    <FaRegCalendarAlt className="icon" />
                                                    <span className="label">Published</span>
                                                    <span className="colon">:</span>
                                                    <span className="value">{productData?.dateCreated}</span>
                                                </li>

                                            </ul>
                                        </div>



                                    </div>

                                </div>
                                <div className="details-table mt-4">
                                    <h6 className="font-bold mb-3 ">Speciations</h6>
                                    <table className='mt-8'>
                                        <tbody>
                                            {Object.entries(specifications).map(
                                                ([key, value], index) => (
                                                    <tr key={index}>
                                                        <th>{key}</th>
                                                        <td>{value}</td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className='p-4'>
                                <h6 className="font-bold mb-3 ">Product Description</h6>
                                <p>{productData?.description}</p>

                                <br />
                                {
                                    reviewData?.length !== 0 &&
                                    <>
                                        <h6 className='font-bold mt-4 mb-4'>Customer_Reviews</h6>
                                        <div className="reviresSection">
                                            {
                                                reviewData?.length !== 0 && reviewData?.map((review, index) => {
                                                    return (
                                                        <div className="reviewsRow" key={index}>
                                                            <div className="row">
                                                                <div className="col-sm-7 d-flex">
                                                                    <div className="d-flex flex-column">
                                                                        <div className="userInfo d-flex align-items-center mb-3">
                                                                            <Avatar
                                                                                img="https://mironcoder-hotash.netlify.app/images/avatar/01.webp"
                                                                            />
                                                                            <div className="info pl-3">
                                                                                <h6>{review?.customerName}</h6>
                                                                                <span>{review?.dateCreated}</span>
                                                                            </div>
                                                                            <div className="rating mb-4" style={{ marginLeft: '150px' }}>
                                                                                <Rating
                                                                                    name="half-rating-read"
                                                                                    value={review?.customerRating}
                                                                                    readOnly
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="reviewText mb-3">
                                                                            <p>{review?.review || "This is a sample review text. The product was excellent, and I am very satisfied with my purchase!"}</p>
                                                                        </div>

                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            }
                                        </div>
                                    </>
                                }


                            </div>



                        </div>


                    </div>


                </div>




            </div >





            <br />
            <br />
            <br />

        </>
    )
}

export default ProductDetails