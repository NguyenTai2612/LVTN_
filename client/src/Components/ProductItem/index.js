import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import { TfiFullscreen } from "react-icons/tfi";
import { IoMdHeartEmpty } from "react-icons/io";
import ProductModal from "../ProductModal";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import { Link } from "react-router-dom";
import Price from "../Price";

const ProductItem = (props) => {
  const context = useContext(MyContext);

  const viewProductDetails = (id) => {
    context.setIsOpenProductModal(true);
  };
  useEffect(() => {
    console.log(props.item?.images);
  }, []);
  const imageSrc = props.item?.images[0]
    ? `http://localhost:4000/uploads/${props.item.images[0]}`
    : "";
  return (
    <>
      <div className={`productItem ${props.itemView}`}>
        <div className="imgWrapper">
          <Link to={`/product/${props.item?.id}`}>
            <img
              src={imageSrc}
              className="w-100"
              // alt={props.item?.name || "Product"}
            />
          </Link>

          <span className="badge">-23 %</span>
          <div className="actions">
            <Button onClick={() => viewProductDetails(1)}>
              <TfiFullscreen />
            </Button>
            <Button>
              <IoMdHeartEmpty style={{ fontSize: "20px" }} />
            </Button>
          </div>
        </div>
        <div className="info">
          <h4>{props?.item?.name?.substr(0,30)+'...'}</h4>
          <span className="text-success d-block">In Stock</span>
          <Rating
            className="mt-2 mb-2"
            name="read-only"
            value={5}
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
