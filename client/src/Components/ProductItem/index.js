import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import { TfiFullscreen } from "react-icons/tfi";
import { IoMdHeartEmpty } from "react-icons/io";
import ProductModal from "../ProductModal";
import {useContext, useState} from 'react'
import { MyContext } from "../../App";

const ProductItem = (props) => {

  const context= useContext(MyContext)

  const viewProductDetails=(id)=>{
    context.setIsOpenProductModal(true)
  }





  return (
    <>
      <div className={`productItem ${props.itemView}`}>
        <div className="imgWrapper">
          <img
            src="https://nhaccutiendat.vn/upload/img/dan-ukulele-valote-va-24m02_3062.jpg?width=200&height=200&quality=100"
            className="w-100"
          />
  
          <span className="badge">-23 %</span>
          <div className="actions">
            <Button 
              onClick={()=>viewProductDetails(1)}
            >
              <TfiFullscreen />
            </Button>
            <Button>
              <IoMdHeartEmpty style={{ fontSize: "20px" }} />
            </Button>
          </div>
        </div>
        <div className="info">
          <h4>ĐÀN ACOUSTIC GUITAR YAMAHA F310-MÀU GỖ TỰ NHIÊN</h4>
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
            <p className="netPrice text-danger ml-1">7.000.000 VND</p>
          </div>
          <div className="d-flex">
            <p className="oldPrice ml-1">8.500.000 VND</p>
          </div>
        </div>
      </div>

     
    </>
  );
};

export default ProductItem;
