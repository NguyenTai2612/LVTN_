import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";

import React, { useState } from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [value, setValue] = useState([100, 60000]);
  const [value2, setValue2] = useState(0);

  return (
    <div className="sidebar">
      <div className="filterBox">
        <h6>Product Category</h6>

        <div className="scroll">
          <ul>
            <li>
              <FormControlLabel
                className="w-100"
                control={<Checkbox />}
                label="Piano"
              />
            </li>
            <li>
              <FormControlLabel
                className="w-100"
                control={<Checkbox />}
                label="Guitar"
              />
            </li>
            <li>
              <FormControlLabel
                className="w-100"
                control={<Checkbox />}
                label="Organ"
              />
            </li>
            <li>
              <FormControlLabel
                className="w-100"
                control={<Checkbox />}
                label="Violin"
              />
            </li>
            <li>
              <FormControlLabel
                className="w-100"
                control={<Checkbox />}
                label="Amplifier"
              />
            </li>
            <li>
              <FormControlLabel
                className="w-100"
                control={<Checkbox />}
                label="Uklele"
              />
            </li>
            <li>
              <FormControlLabel
                className="w-100"
                control={<Checkbox />}
                label="Kèn - Sáo - Tiêu"
              />
            </li>
            <li>
              <FormControlLabel
                className="w-100"
                control={<Checkbox />}
                label="Nhạc cụ dân tôc"
              />
            </li>
          </ul>
        </div>
      </div>

      <div className="filterBox">
        <h6>Filter by Price</h6>

        <RangeSlider
          value={value}
          onInput={setValue}
          min={10000}
          max={60000000}
          step={5}
        />

        <div className="d-flex pt-2 pb-2 priceRange" style={{fontSize:'Smaller'}}>
          <span>
            From: <strong className="text-dark">Rs:{value[0]}</strong>
          </span>
          <span className="ml-auto">
            From: <strong className="text-dark">Rs:{value[1]}</strong>
          </span>
        </div>
      </div>

      <div className="filterBox">
        <h6>Product Status</h6>

        <div className="scroll">
          <ul>
            <li>
              <FormControlLabel
                className="w-100"
                control={<Checkbox />}
                label="In Stock"
              />
            </li>
            <li>
              <FormControlLabel
                className="w-100"
                control={<Checkbox />}
                label="On Sale"
              />
            </li>
            
          </ul>
        </div>
      </div>

      <div className="filterBox">
        <h6>Brands</h6>

        <div className="scroll">
          <ul>
            <li>
              <FormControlLabel
                className="w-100"
                control={<Checkbox />}
                label="Yamaha"
              />
            </li>
            <li>
              <FormControlLabel
                className="w-100"
                control={<Checkbox />}
                label="Casio"
              />
            </li>
            <li>
              <FormControlLabel
                className="w-100"
                control={<Checkbox />}
                label="Kawai"
              />
            </li>
            <li>
              <FormControlLabel
                className="w-100"
                control={<Checkbox />}
                label="Roland"
              />
            </li>
            <li>
              <FormControlLabel
                className="w-100"
                control={<Checkbox />}
                label="Suzuki"
              />
            </li>
            <li>
              <FormControlLabel
                className="w-100"
                control={<Checkbox />}
                label="Hãng khác"
              />
            </li>
            
          </ul>
        </div>
      </div>

        <Link to={'#'}>
            <img 
                className="w-100"
                src="https://nhaccutiendat.vn/upload/images/category_banner/poster_category/nhaccukhac_danhmuc.jpg"/>
        </Link>
    </div>
  );
};

export default Sidebar;
