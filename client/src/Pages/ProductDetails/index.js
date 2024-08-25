import React, { useContext, useEffect, useState } from "react";
import ProductZoom from "../../Components/ProductZoom";
import Gift from "../../Components/Gift";
import { Rating } from "@mui/material";
import QuantityBox from "../../Components/QuantityBox";
import Button from "@mui/material/Button";
import { FaCartPlus } from "react-icons/fa";
import RelatedProduct from "./RelatedProducts";
import { useParams } from "react-router-dom";
import { fetchDataFromApi, postData } from "../../utils/api";
import Price from "../../Components/Price";
import { MyContext } from "../../App";
import CircularProgress from "@mui/material/CircularProgress";

const ProductDetails = () => {
  const [activeSize, setActiveSize] = useState(null);
  const [activeTabs, setActiveTabs] = useState(0);
  const [productData, setProductData] = useState([]);
  const [relatedProductData, setRelatedProductData] = useState([]);
  const [recentlyViewdProd, setRecentlyViewdProd] = useState([]);
  let [cartFields, setCartFields] = useState({});
  let [productQty, setProductQty] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [reviewData, setReviewData] = useState([]);

  const specifications = productData?.specifications || {};
  const { id } = useParams();
  const context = useContext(MyContext);
  useEffect(() => {
    window.scrollTo(0, 0);

    fetchDataFromApi(`/api/products/${id}`).then((res) => {
      setProductData(res);

      fetchDataFromApi(`/api/products?subCatId=${res?.subCatId}`).then(
        (res) => {
          const filteredData = res?.products?.filter((item) => item.id !== id);
          setRelatedProductData(filteredData);
        }
      );

      fetchDataFromApi(`api/products/recentlyViewd`).then((response) => {
        console.log("Recently Viewed Products Data:", response);
        setRecentlyViewdProd(response);
      });

      postData(`/api/products/recentlyViewd`, res);
    });

    fetchDataFromApi(`/api/productReviews?productId=${id}`).then((res) => {
      setReviewData(res);
    });
  }, [id]);

  const quantity = (val) => {
    setProductQty(val);
  };

  const addtoCart = (data) => {
    const user = JSON.parse(localStorage.getItem("user"));

    cartFields.productTitle = productData?.name;
    cartFields.image = productData?.images[0];
    cartFields.rating = productData?.rating;
    cartFields.price = productData?.price;
    cartFields.brand = productData?.brand;
    cartFields.quantity = productQty;
    cartFields.subTotal = parseInt(productData?.price * productQty);
    cartFields.productId = productData?.id;
    cartFields.userId = user?.userId;

    context.addToCat(cartFields);
  };

  const selectedItem = () => {};

  const [rating, setRating] = useState(1);
  const [reviews, setReviews] = useState({
    productId: "",
    customerName: "",
    customerId: "",
    review: "",
    customerRating: "",
  });

  const onChangeInput = (e) => {
    setReviews(() => ({
      ...reviews,
      [e.target.name]: e.target.value,
    }));
  };

  const changeRating = (e) => {
    setRating(e.target.value);
    reviews.customerRating = e.target.value;
  };

  const addReview = (e) => {
    e.preventDefault();

    // const formdata = new FormData();
    const user = JSON.parse(localStorage.getItem("user"));

    reviews.customerName = user?.name;
    reviews.customerId = user?.userId;
    reviews.productId = id;

    setIsLoading(true);

    postData(`/api/productReviews/add`, reviews).then((res) => {
      setIsLoading(false);

      reviews.customerRating = 1
     
      setReviews({
        review:"",
        customerRating:1 
      })

      fetchDataFromApi(`/api/productReviews?productId=${id}`).then((res) => {
        setReviewData(res);
      });
    });
  };

  return (
    <div>
      <section className="productDetails section">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <ProductZoom images={productData?.images} />
            </div>

            <div className="col-md-8 d-flex">
              <div className="product-info">
                <div className="product-title">{productData?.name}</div>
                <div className="mt-2 ">
                  <span className="badge1 bg-blue text-white mr-3">
                    {productData?.brand}
                  </span>
                </div>
                <div className="rating-review">
                  <Rating
                    name="read-only"
                    value={parseInt(productData?.rating)}
                    readOnly
                    size="small"
                    precision={0.5}
                  />
                  <span className="cursor">1 Review</span>
                  <div
                    className="d-flex align-items-center mt-1"
                    style={{ marginLeft: "17px" }}
                  >
                    <div className="d-flex align-items-center mr-4">
                      <span className="badge bg-success text-white mr-3">
                        IN STOCK
                      </span>
                    </div>
                  </div>
                </div>

                <div className="product-price mt-3 mr-2">
                  <Price amount={productData?.price} />
                </div>
                <div className="d-flex align-items-center">
                  <span className="mb-3"> Giá gốc:</span>
                  <span className="original-price ml-4">
                    <div style={{ marginLeft: "9px" }}>
                      <Price amount={productData?.oldPrice} />
                    </div>
                  </span>
                  <span className="discount mr-auto">
                    -{productData?.discount} %
                  </span>
                </div>

                <div className="warranty ">
                  <span>Bảo hành:</span>
                  <span className="font-weight-bold ml-5">12 Tháng</span>
                </div>

                <div className="d-flex align-items-center mb-3">
                  <QuantityBox
                    quantity={quantity}
                    selectedItem={selectedItem}
                  />
                  &nbsp; &nbsp; &nbsp; &nbsp;
                  <Button
                    className="btn-add-to-cart mr-auto"
                    onClick={() => addtoCart()}
                  >
                    <FaCartPlus /> &nbsp;
                    {context.addingInCart === true
                      ? "adding..."
                      : "Thêm vào giỏ hàng"}
                  </Button>
                </div>
                <div className="details-table mt-4">
                  <h6 className="font-bold mb-3">THÔNG SỐ KỸ THUẬT</h6>
                  <table>
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
              <div className="gift-section">
                <Gift />
              </div>
            </div>
          </div>

          <br />

          <div className="card mt-5 p-5 detailsPageTabs">
            <div className="customTabs">
              <ul className="list list-inline">
                <li className="list-inline-item">
                  <Button
                    className={`${activeTabs === 0 ? "active" : ""}`}
                    onClick={() => setActiveTabs(0)}
                  >
                    Description
                  </Button>
                </li>
                <li className="list-inline-item">
                  <Button
                    className={`${activeTabs === 1 ? "active" : ""}`}
                    onClick={() => setActiveTabs(1)}
                  >
                    Additional info
                  </Button>
                </li>
                <li className="list-inline-item">
                  <Button
                    className={`${activeTabs === 2 ? "active" : ""}`}
                    onClick={() => setActiveTabs(2)}
                  >
                    Reviews (3)
                  </Button>
                </li>
              </ul>
              <br />
              {activeTabs === 0 && (
                <div className="tabContent">
                  <p>{productData?.description}</p>
                </div>
              )}
              {activeTabs === 1 && (
                <div className="tabContent">
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <tbody>
                        <tr className="stand-up">
                          <th>Stand Up</th>
                          <td>
                            <p>35"L x 24"W x 37-45"H (front to back wheel)</p>
                          </td>
                        </tr>
                        <tr className="folded-wo-wheels">
                          <th>Folded (w/o wheels)</th>
                          <td>
                            <p>32.5"L x 18.5"W x 16.5"H</p>
                          </td>
                        </tr>
                        <tr className="folded-w-wheels">
                          <th>Folded (w/ wheels)</th>
                          <td>
                            <p>32.5"L x 24"W x 18.5"H</p>
                          </td>
                        </tr>
                        <tr className="door-pass-through">
                          <th>Door Pass Through</th>
                          <td>
                            <p>24</p>
                          </td>
                        </tr>
                        <tr className="frame">
                          <th>Frame</th>
                          <td>
                            <p>Aluminum</p>
                          </td>
                        </tr>
                        <tr className="weight-wo-wheels">
                          <th>Weight (w/o wheels)</th>
                          <td>
                            <p>20 LBS</p>
                          </td>
                        </tr>
                        <tr className="weight-capacity">
                          <th>Weight Capacity</th>
                          <td>
                            <p>60 LBS</p>
                          </td>
                        </tr>
                        <tr className="width">
                          <th>Width</th>
                          <td>
                            <p>24"</p>
                          </td>
                        </tr>
                        <tr className="handle-height-ground-to-handle">
                          <th>Handle height (ground to handle)</th>
                          <td>
                            <p>37-45"</p>
                          </td>
                        </tr>
                        <tr className="wheels">
                          <th>Wheels</th>
                          <td>
                            <p>12" air / wide track slick tread</p>
                          </td>
                        </tr>
                        <tr className="seat-back-height">
                          <th>Seat back height</th>
                          <td>
                            <p>21.5"</p>
                          </td>
                        </tr>
                        <tr className="head-room-inside-canopy">
                          <th>Head room (inside canopy)</th>
                          <td>
                            <p>25"</p>
                          </td>
                        </tr>
                        <tr className="pa_color">
                          <th>Color</th>
                          <td>
                            <p>Black, Blue, Red, White</p>
                          </td>
                        </tr>
                        <tr className="pa_size">
                          <th>Size</th>
                          <td>
                            <p>M, S</p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              {activeTabs === 2 && (
                <div className="tabContent">
                  <div className="row">
                    <div className="col-md-8">
                      <h3>Customer questions & answers</h3>
                      <br />

                      {reviewData?.length !== 0 &&
                        reviewData?.slice(0)?.reverse()?.map((item, index) => {
                          return (
                            <div
                              className="card p-4 reviewsCard flex-row"
                              key={index}
                            >
                              {/* <div className="image">
                                <div className="rounded-circle"></div>
                                <span className="text-g d-block text-center font-weight-bold">
                                  {item?.customerName}
                                </span>
                              </div> */}
                              <div className="info">
                                <div className="d-flex align-items-center w-100">
                                <h5 className="">{item?.customerName}</h5>
                                 
                                  <div className="ml-auto">
                                    <Rating
                                      name="half-rating-read"
                                      value={item?.customerRating}
                                      readOnly
                                      size="small"
                                    />
                                  </div>
                                </div>
                                <h5 className="text-green-100">{item?.dateCreated}</h5>
                                <p>{item?.review}</p>
                              </div>
                            </div>
                          );
                        })}

                      <br className="res-hide" />
                      <form className="reviewForm" value={reviews.review} onSubmit={addReview}>
                        <h4>Add a review</h4>
                        <div className="form-group">
                          <textarea
                            className="form-control"
                            placeholder="Write a Review"
                            name="review"
                            onChange={onChangeInput}
                          ></textarea>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Name"
                                name="customerName"
                                onChange={onChangeInput}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <Rating
                                name="rating"
                                value={rating}
                                precision={0.5}
                                onChange={changeRating}
                              />
                            </div>
                          </div>
                        </div>
                        <br />
                        <div className="form-group">
                          <Button
                            type="submit"
                            className="btn-blue btn-lg btn-big btn-round"
                          >
                            {" "}
                            {isLoading === true ? (
                              <CircularProgress
                                color="inherit"
                                className="loader"
                              />
                            ) : (
                              "Submit Review"
                            )}
                          </Button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <br />
          {relatedProductData?.length > 0 && (
            <RelatedProduct title="Giảm giá sốc" data={relatedProductData} />
          )}

          {recentlyViewdProd.length > 0 && (
            <RelatedProduct
              title="Sản phẩm đã xem"
              itemView={recentlyViewdProd}
              data={recentlyViewdProd}
            />
          )}
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;
