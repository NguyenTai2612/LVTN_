import React, { useEffect, useState } from "react";
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

const ProductDetails = () => {
  const [activeSize, setActiveSize] = useState(null);
  const [activeTabs, setActiveTabs] = useState(0);
  const [productData, setProductData] = useState([]);
  const [relatedProductData, setRelatedProductData] = useState([]);
  const [recentlyViewdProd, setRecentlyViewdProd] = useState([]);

  const specifications = productData?.specifications || {};
  const { id } = useParams();

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

      fetchDataFromApi(`/api/products/recentlyViewd`).then((response) => {
        console.log("Recently Viewed Products Data:", response);
        setRecentlyViewdProd(response);
      });

      postData(`/api/products/recentlyViewd`, res);
    });
  }, [id]);

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
                  <QuantityBox />
                  &nbsp; &nbsp; &nbsp; &nbsp;
                  <Button className="btn-add-to-cart mr-auto">
                    <FaCartPlus /> &nbsp; Thêm vào giỏ hàng
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
                      <div className="card p-4 reviewsCard flex-row">
                        <div className="image">
                          <div className="rounded-circle">
                            <img
                              src="https://wp.alithemes.com/html/nest/demo/assets/imgs/blog/author-2.png"
                              alt="Customer"
                            />
                          </div>
                          <span className="text-g d-block text-center font-weight-bold">
                            Rinku Verma
                          </span>
                        </div>
                        <div className="info pl-5">
                          <div className="d-flex align-items-center w-100">
                            <h5 className="">01/03/1993</h5>
                            <div className="ml-auto">
                              <Rating
                                name="half-rating-read"
                                value={4.5}
                                precision={0.5}
                                readOnly
                                size="small"
                              />
                            </div>
                          </div>
                          <p>
                            Noodles & Company is an American fast-casual
                            restaurant that offers international and American
                            noodle dishes and pasta in addition to soups and
                            salads...
                          </p>
                        </div>
                      </div>
                      <br className="res-hide" />
                      <form className="reviewForm">
                        <h4>Add a review</h4>
                        <div className="form-group">
                          <textarea
                            className="form-control"
                            placeholder="Write a Review"
                            name="review"
                          ></textarea>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Name"
                                name="userName"
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <Rating
                                name="rating"
                                value={4.5}
                                precision={0.5}
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
                            Submit Review
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
