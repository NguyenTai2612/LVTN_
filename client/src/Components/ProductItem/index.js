import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import { TfiFullscreen } from "react-icons/tfi";
import { IoMdHeartEmpty } from "react-icons/io";
import ProductModal from "../ProductModal";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import { Link } from "react-router-dom";
import Price from "../Price";
import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css';

const ProductItem = (props) => {
  const context = useContext(MyContext);

  const viewProductDetails = (id) => {
    context.setIsOpenProductModal({
      id: id,
      open: true,
    });
  };

  const imageSrc = props.item?.images[0] ? `${props.item.images[0]}` : "";
  return (
    <>
      <div className={`productItem ${props.itemView}`}>
        <div className="imgWrapper">
          <Link to={`/product/${props.item?.id}`}>
            <LazyLoadImage
              alt={"image"}
               effect="blur"
              src={imageSrc} 
              className="w-100"
            />
          
          </Link>

          <span className="badge-custom">-{props.item?.discount} %</span>
          <div className="actions">
            <Button onClick={() => viewProductDetails(props.item?.id)}>
              <TfiFullscreen />
            </Button>
          </div>
        </div>
        <div className="info">
          <h4>{props?.item?.name?.substr(0, 200) + ""}</h4>
          <div className="d-flex align-items-center mt-2">
            <span className="badge bg-success text-white  d-block">
              In Stock
            </span>
          </div>
          <Rating
            className="mt-2 mb-2"
            name="read-only"
            value={props?.item?.rating}
            readOnly
            size="small"
            precision={0.5}
          />
          <div className="d-flex">
            <Price
              amount={props?.item?.price}
              className="netPrice text-danger ml-1"
            />
          </div>
          <div className="d-flex">
            <Price amount={props?.item?.oldPrice} className="oldPrice ml-1" />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductItem;
