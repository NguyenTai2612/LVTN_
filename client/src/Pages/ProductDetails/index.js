import React, { useContext, useEffect, useState } from "react";
import ProductZoom from "../../Components/ProductZoom";
import Gift from "../../Components/Gift";
import { Rating } from "@mui/material";
import QuantityBox from "../../Components/QuantityBox";
import Button from "@mui/material/Button";
import { FaCartPlus } from "react-icons/fa";
import RelatedProduct from "./RelatedProducts";
import { Link, useParams } from "react-router-dom";
import Price from "../../Components/Price";
import { MyContext } from "../../App";
import CircularProgress from "@mui/material/CircularProgress";
import {
  apiGetProductDetails,
  incrementProductViews,
} from "../../services/product";
import { apiGetProductSpecifications } from "../../services/productSpecification";
import { apiGetReviews, apiAddReview } from "../../services/review";
import { addToCart } from "../../services/cart";
import { Avatar } from "@mui/material";
const ProductDetails = () => {
  const [activeSize, setActiveSize] = useState(null);
  const [activeTabs, setActiveTabs] = useState(0);
  const [productData, setProductData] = useState(null);
  const [specifications, setSpecifications] = useState([]);
  const [relatedProductData, setRelatedProductData] = useState([]);
  const [recentlyViewedProd, setRecentlyViewedProd] = useState([]);
  const [cartFields, setCartFields] = useState({});
  const [productQty, setProductQty] = useState(1); // Khởi tạo với giá trị mặc định là 1

  const [isLoading, setIsLoading] = useState(false);
  const [reviewData, setReviewData] = useState([]);

  const { id } = useParams();
  const context = useContext(MyContext);
  console.log("Product Quantity Before Add to Cart:", productQty);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProductDetails = async () => {
      try {
        const response = await apiGetProductDetails(id);
        setProductData(response.data.response);
        console.log("setProductData", response.data.response);

        await incrementProductViews(id);

        // Fetch product specifications
        const specResponse = await apiGetProductSpecifications(id);
        setSpecifications(specResponse.data.response);

        // Fetch reviews
        const reviewResponse = await apiGetReviews(id);
        // console.log(reviewResponse.data.response);
        setReviewData(reviewResponse.data.response);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleQuantityChange = (val) => {
    console.log("Updating quantity to:", val); // Kiểm tra giá trị nhận được
    setProductQty(val);
  };

  const quantity = (val) => {
    setProductQty(val);
  };

  const addtoCart = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      console.error("User not found in localStorage.");
      return;
    }

    const price = productData?.price || 0;
    const subTotal = productQty * price;

    const cartItem = {
      user_id: user.id,
      product_id: productData.id,
      quantity: productQty,
      price: price,
      subTotal: subTotal, // Đảm bảo giá trị subTotal được tính toán và truyền đúng
    };

    console.log("Cart Item to be sent:", cartItem); // Thêm console.log để kiểm tra

    try {
      await addToCart(cartItem);
      context.setAddingInCart(true);
      context.setAlertBox({
        open: true,
        error: false,
        msg: "Thêm vào giỏ thành công.",
      });

      setTimeout(() => {
        context.setAddingInCart(false);
      }, 100);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const [rating, setRating] = useState(1);
  const [reviews, setReviews] = useState({
    productId: "",
    customerName: "",
    customerId: "",
    review: "",
    customerRating: "",
  });

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
      createdAt: new Date().toISOString(), // Format date if needed
    };

    setIsLoading(true);

    try {
      await apiAddReview(reviewData);
      // Fetch reviews again to update the list
      const reviewResponse = await apiGetReviews(id);
      setReviewData(reviewResponse.data.response);
      // Clear the form after submission
      setReviews({
        productId: id,
        customerName: user.name,
        customerId: user.userId,
        review: "",
        customerRating: 1,
      });
      setRating(1); // Reset rating
    } catch (error) {
      console.error("Error posting review:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!productData) {
    return <CircularProgress />;
  }

  return (
    <div>
      <section className="productDetails section">
        <div className="container">
          <nav class="woocommerce-breadcrumb" aria-label="Breadcrumb">
            <ul class="breadcrumb-list">
              <li>
                <a href="/">Trang chủ</a>
              </li>
              <li>
                <span class="breadcrumb-separator">›</span>
              </li>
              <li>
                <Link to={`/product/category/${productData?.Category?.id}`}>
                  {productData?.Category?.name || "Danh mục"}
                </Link>
              </li>
              <li>
                <span class="breadcrumb-separator">›</span>
              </li>
              <li>
                <Link
                  to={`/listing/subcategory/${productData?.SubCategory?.id}`}
                >
                  {productData?.SubCategory?.subCat || "Danh mục con"}
                </Link>
              </li>
              <li class="breadcrumb-current">{productData?.name}</li>
            </ul>
            <div class="custom-divider"></div>
          </nav>

          <div className="row">
            <div className="col-md-4">
              <ProductZoom
                images={productData.ProductImages.map((img) => img.imageUrl)}
              />
            </div>

            <div className="col-md-8 d-flex">
              <div className="product-info">
                <div className="product-title">{productData.name}</div>
                <div className="mt-2">
                  {productData.Brand?.name && (
                    <span className="badge1 bg-blue text-white mr-3">
                      {productData.Brand.name}
                    </span>
                  )}
                </div>
                <div className="rating-review">
                  <Rating
                    name="read-only"
                    value={parseInt(productData.rating)}
                    readOnly
                    size="small"
                    precision={0.5}
                  />
                  <span className="cursor">{reviewData.length} Reviews</span>
                  <div
                    className="d-flex align-items-center mt-1"
                    style={{ marginLeft: "17px" }}
                  >
                    <div className="d-flex align-items-center mr-4">
                      <span
                        className={`badge ${
                          productData.countInStock > 0 ? "bg-success" : "bg-danger"
                        } text-white mr-3`}
                      >
                        {productData.countInStock > 0 ? "IN STOCK" : "OUT OF STOCK"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="product-price mt-3 mr-2">
                  {productData.price === 0 ? (
                    <span className="text-danger">Vui lòng liên hệ</span>
                  ) : (
                    <Price amount={productData.price} />
                  )}
                </div>

                <div className="d-flex align-items-center">
                  <span className="mb-3"> Giá gốc:</span>
                  <span className="original-price ml-4">
                    <div style={{ marginLeft: "9px" }}>
                      <Price amount={productData.oldPrice} />
                    </div>
                  </span>
                  <span className="discount mr-auto">-{Math.floor(productData.discount)} %</span>
                </div>

                <div className="warranty">
                  <span>Bảo hành:</span>
                  <span className="font-weight-bold ml-5">12 Tháng</span>
                </div>

                <div className="d-flex align-items-center mb-3">
                  <QuantityBox
                    item={{ quantity: productQty }} // Kiểm tra giá trị truyền vào
                    onQuantityChange={handleQuantityChange} // Hàm xử lý thay đổi số lượng
                  />
                  &nbsp; &nbsp; &nbsp; &nbsp;
                  <Button
                    className="btn-add-to-cart mr-auto"
                    onClick={addtoCart}
                  >
                    <FaCartPlus /> &nbsp;
                    {context.addingInCart === true
                      ? "adding..."
                      : "Thêm vào giỏ hàng"}
                  </Button>
                </div>

              
              </div>
              <div className="gift-section">
                <Gift />
              </div>
            </div>
          </div>

          <br />

          <div className="card p-5 detailsPageTabs">
            <div className="customTabs">
              <ul className="list list-inline">
                <li className="list-inline-item">
                  <Button
                    className={`${activeTabs === 0 ? "active" : ""}`}
                    onClick={() => setActiveTabs(0)}
                  >
                    Mô Tả Sản Phẩm
                  </Button>
                </li>
                <li className="list-inline-item">
                  <Button
                    className={`${activeTabs === 1 ? "active" : ""}`}
                    onClick={() => setActiveTabs(1)}
                  >
                    thông số kỹ thuật
                  </Button>
                </li>
                <li className="list-inline-item">
                  <Button
                    className={`${activeTabs === 2 ? "active" : ""}`}
                    onClick={() => setActiveTabs(2)}
                  >
                    Đánh giá ({reviewData.length})
                  </Button>
                </li>
              </ul>
              <br />
              {activeTabs === 0 && (
                <div className="tabContent">
                  <p>{productData.description}</p>
                </div>
              )}
              {activeTabs === 1 && (
                <div className="tabContent">
                  <div className="table-responsive">
                  <div className="details-table">
                  {/* <h6 className="font-bold mb-3">THÔNG SỐ KỸ THUẬT</h6> */}
                  <table>
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
                </div>
              )}
              {activeTabs === 2 && (
                <div className="tab-content">
                  <div className="row">
                    <div className="col-md-8">
                      <h6 className="review-title">Đánh giá sản phẩm</h6>
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
                      <h5 className="write-review-title">Viết đánh giá</h5>
                      <form onSubmit={addReview}>
                        <div className="form-group">
                          <label>Chất lượng sản phẩm</label>
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
                          <label>Đánh giá của bạn</label>
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
                          {isLoading ? "Submitting..." : "Gửi"}
                        </Button>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <br />
          <RelatedProduct />
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;
//edit3
