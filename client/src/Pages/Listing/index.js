import React, { useEffect, useState } from "react";
import SideBar from "../../Components/Sidebar";
import { IoIosMenu } from "react-icons/io";
import { CgMenuGridR } from "react-icons/cg";
import ProductItem from "../../Components/ProductItem";
import Pagination from '@mui/material/Pagination';

import { TfiLayoutGrid4Alt } from "react-icons/tfi";
import { Button } from "@mui/material";
import { FaAngleDown } from "react-icons/fa6";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useParams } from "react-router-dom";
import {fetchDataFromApi} from "../../utils/api.js"
const Listing = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [productView, setProductView] = useState("four");
  const [productData, setProductData] = useState([]);
  const openDropDown = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const {id} = useParams()

  useEffect(()=>{
    fetchDataFromApi(`/api/products?subCatId=${id}`).then((res)=>{
      console.log(res)
      setProductData(res.products)
    })
  },[id])

  const filterData =(subCatId)=>{
    fetchDataFromApi(`/api/products?subCatId=${subCatId}`).then((res)=>{
      setProductData(res.products)
    })
  }

  const filterByPrice =(price,subCatId)=>{
    fetchDataFromApi(`/api/products?minPrice=${price[0]}&maxPrice=${price[1]}&subCatId=${subCatId}`).then((res)=>{
      setProductData(res.products)
    })
  }

  const filterByRating =(rating,subCatId)=>{
    fetchDataFromApi(`/api/products?rating=${rating}&subCatId=${subCatId}`).then((res)=>{
      setProductData(res.products)
    })
  }

  return (
    <div>
      <section className="product_Listing_Page">
        <div className="container">
          <div className="productListing d-flex">
            <SideBar filterData={filterData}  filterByPrice={filterByPrice} filterByRating={filterByRating}/>

            <div className="content-right">
              <div className="showBy mt-2 mb-3 d-flex align-items-center">
                <div className="d-flex align-items-center btnWrapper">
                  <Button className={productView==='one' && 'act'} onClick={() => setProductView("one")} >
                    <IoIosMenu />
                  </Button>
                  <Button className={productView==='three' && 'act'}  onClick={() => setProductView("three")} >
                    <CgMenuGridR/>
                  </Button>
                  <Button className={productView==='four' && 'act'}  onClick={() => setProductView("four")}>
                    <TfiLayoutGrid4Alt
                     
                    />
                  </Button>
                </div>

                <div className="ml-auto showByFilter">
                  <Button 
                    onClick={handleClick}>
                    Show 9 <FaAngleDown />
                  </Button>
                  <Menu
                    className="w-100 showPerPageDropdown"
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={openDropDown}
                    onClose={handleClose}
                    MenuListProps={{
                      "aria-labelledby": "basic-button",
                    }}
                  >
                    <MenuItem onClick={handleClose}>10</MenuItem>
                    <MenuItem onClick={handleClose}>20</MenuItem>
                    <MenuItem onClick={handleClose}>30</MenuItem>
                    <MenuItem onClick={handleClose}>40</MenuItem>
                    <MenuItem onClick={handleClose}>50</MenuItem>
                    <MenuItem onClick={handleClose}>60</MenuItem>
                  </Menu>
                </div>
              </div>

              <div className="productListing">
                {
                  productData?.map((item,index)=>{
                    return (
                      <ProductItem key={index} itemView={productView} item={item} />
                    )
                  })
                }
                
              </div>

                <div className="d-flex align-items-center justify-content-center mt-5">
                 <Pagination count={10} color="primary" size="large"/>
                </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Listing;
