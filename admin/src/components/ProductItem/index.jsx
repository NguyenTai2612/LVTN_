import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import { TfiFullscreen } from "react-icons/tfi";
import { IoMdHeartEmpty } from "react-icons/io";
import { Link } from "react-router-dom";
import Price from "../Price";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const ProductItem = (props) => {
  const { item } = props;

  const primaryImage = item?.ProductImages?.[0]?.imageUrl || "";

  return (
    <>
      <div className={`productItem ${props.itemView}`}>
        <div className="imgWrapper">
          <Link to={`/product/detail/${item?.id}`}>
            <LazyLoadImage
              alt={item?.name || "Product Image"}
              effect="blur"
              src={primaryImage}
              className="w-100"
            />
          </Link>

          {item?.discount > 0 && (
            <span className="badge-custom">-{Math.floor(item.discount)} %</span>
          )}


        </div>
        <div className="info">
          <h4>{item?.name?.substr(0, 200) + ""}</h4>
          <div className="d-flex align-items-center mt-2">
            <span
              className={`badge ${item?.countInStock > 0 ? "bg-success" : "bg-danger"
                } text-white d-block`}
            >
              {item?.countInStock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          <Rating
            className="mt-2 mb-2"
            name="read-only"
            value={item?.rating || 0} // Đảm bảo giá trị không phải là undefined hoặc null
            readOnly
            size="small"
            precision={0.5}
          />
          <div className="d-flex">
            {item?.price === 0 ? (
              <span className="text-danger">Vui lòng liên hệ</span>
            ) : (
              <Price
                amount={item?.price}
                className="netPrice text-danger ml-1"
              />
            )}
          </div>

          <div className="d-flex">
            <Price amount={item?.oldPrice} className="oldPrice ml-1" />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductItem;
