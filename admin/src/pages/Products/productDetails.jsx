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
import { apiGetProductDetails } from '../../services/product';
import { apiGetProductSpecifications } from '../../services/productSpecification';

import { apiAddReview, apiGetReviews } from '../../services/review';

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

    const [productData, setProductData] = useState({});
    const [reviewData, setReviewData] = useState([]);
    const [specifications, setSpecifications] = useState([]);
    const [rating, setRating] = useState(1);
    const [reviews, setReviews] = useState({
        productId: "",
        customerName: "",
        customerId: "",
        review: "",
        customerRating: "",
    });
    const [isLoading, setIsLoading] = useState(false);

    const { id } = useParams();
    const context = useContext(MyContext);

    useEffect(() => {
        window.scrollTo(0, 0);
        context.setProgress(20);
        const fetchProductDetails = async () => {
            try {
                const response = await apiGetProductDetails(id);
                setProductData(response.data.response);

                // Fetch product specifications
                const specResponse = await apiGetProductSpecifications(id);
                setSpecifications(Array.isArray(specResponse.data.response) ? specResponse.data.response : []);

                // Fetch reviews
                const reviewResponse = await apiGetReviews(id);
                setReviewData(Array.isArray(reviewResponse.data.response) ? reviewResponse.data.response : []);
            } catch (error) {
                console.error("Error fetching product details:", error);
            }
        };

        fetchProductDetails();
        context.setProgress(100);

    }, [id]);

    const onChangeInput = (e) => {
        setReviews({
            ...reviews,
            [e.target.name]: e.target.value,
        });
    };

    const changeRating = (e) => {
        setRating(e.target.value);
        setReviews({
            ...reviews,
            customerRating: e.target.value,
        });
    };

    const addReview = async (e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user) {
            console.error("User not found in localStorage.");
            return;
        }

        const reviewData = {
            user_id: user.id,
            product_id: id,
            rating: parseInt(reviews.customerRating, 10),
            comment: reviews.review,
            createdAt: new Date().toISOString(),
        };

        setIsLoading(true);

        try {
            await apiAddReview(reviewData);
            const reviewResponse = await apiGetReviews(id);
            setReviewData(Array.isArray(reviewResponse.data.response) ? reviewResponse.data.response : []);
            setReviews({
                productId: id,
                customerName: user.name,
                customerId: user.userId,
                review: "",
                customerRating: 1,
            });
            setRating(1);
        } catch (error) {
            console.error("Error posting review:", error);
        } finally {
            setIsLoading(false);
        }
    };

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
                                <div className='pt-3 pb-3 pl-4 pr-4'>
                                    <ProductZoom
                                        images={productData.ProductImages?.map((img) => img.imageUrl) || []}
                                    />
                                </div>
                            </div>

                            <div className="col-md-8 d-flex">
                                <div className='pt-3 pb-3 pr-4'>
                                    <div className="product-info">
                                        <div className="product-title">{productData?.name}</div>

                                        <div className="product-details">
                                            <ul className="product-info">
                                                <li>
                                                    <MdOutlineBrandingWatermark className="icon" />
                                                    <span className="label">Brand</span>
                                                    <span className="colon">:</span>
                                                    <span className="value">{productData.Brand?.name}</span>
                                                </li>
                                                <li>
                                                    <TbCategoryPlus className="icon" />
                                                    <span className="label">Category</span>
                                                    <span className="colon">:</span>
                                                    <span className="value">{productData?.Category?.name}</span>
                                                </li>

                                                <li>
                                                    <TbCategoryPlus className="icon" />
                                                    <span className="label">Sub Cat</span>
                                                    <span className="colon">:</span>
                                                    <span className="value">{productData?.SubCategory?.subCat}</span>
                                                </li>

                                                <li>
                                                    <GoCodeReview className="icon" />
                                                    <span className="label">Review</span>
                                                    <span className="colon">:</span>
                                                    <span className="value">(<b className='text-blue'>{reviewData.length}</b>) Review</span>
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
                                            {specifications.map((spec, index) => (
                                                <tr key={index}>
                                                    <th>{spec.spec_key}</th>
                                                    <td>{spec.spec_value}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className='p-4 w-100'>
                                <h6 className="review-title">Product Description</h6>
                                <p>{productData?.description}</p>

                                <br />
                                {
                                    <div className="tab-content">
                                    <div className="row">
                                      <div className="col-md-8">
                                        <h6 className="review-title">Product Reviews</h6>
                                        {reviewData
                                          .slice(0)
                                          .reverse()
                                          .map((review, index) => (
                                            <div className="review-card" key={index}>
                                              <div className="review-header">
                                                <div className="review-avatar-container">
                                                  <Avatar img="https://mironcoder-hotash.netlify.app/images/avatar/01.webp" />
                                                </div>
                                                <div className="review-user-info">
                                                  <h6 className="review-username">
                                                    {review["User.name"] || "Unknown User"}
                                                  </h6>
                                                  <span className="review-date">
                                                    {review?.createdAt
                                                      ? new Date(
                                                          review.createdAt
                                                        ).toLocaleString()
                                                      : "Date and time not available"}
                                                  </span>
                                                </div>
                                                <div className="review-rating">
                                                  <Rating
                                                    name="read-only"
                                                    value={review.rating}
                                                    readOnly
                                                    size="small"
                                                    precision={0.5}
                                                  />
                                                </div>
                                              </div>
                                              <div className="review-content">
                                                <p className="review-text">
                                                  {review?.comment ||
                                                    "This is a sample review text. The product was excellent, and I am very satisfied with my purchase!"}
                                                </p>
                                              </div>
                                            </div>
                                          ))}
                                        <br />
                                        {/* <h5 className="write-review-title">Write a Review</h5>
                                        <form onSubmit={addReview}>
                                          <div className="form-group">
                                            <label>Your Rating</label>
                                            <select
                                              name="customerRating"
                                              className="form-control"
                                              onChange={changeRating}
                                              value={rating}
                                            >
                                              <option value={1}>1 Star</option>
                                              <option value={2}>2 Stars</option>
                                              <option value={3}>3 Stars</option>
                                              <option value={4}>4 Stars</option>
                                              <option value={5}>5 Stars</option>
                                            </select>
                                          </div>
                                          <div className="form-group">
                                            <label>Your Review</label>
                                            <textarea
                                              name="review"
                                              className="form-control"
                                              rows="4"
                                              onChange={onChangeInput}
                                              value={reviews.review}
                                            />
                                          </div>
                                          <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            disabled={isLoading}
                                          >
                                            {isLoading ? "Submitting..." : "Submit Review"}
                                          </Button>
                                        </form> */}
                                      </div>
                                    </div>
                                  </div>



                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <br />
            <br />
            <br />
        </>
    )
}


export default ProductDetails