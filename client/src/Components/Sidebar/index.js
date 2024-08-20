import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { useParams } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MyContext } from "../../App";
import Price from "../Price";
import Rating from "@mui/material/Rating";

const Sidebar = (props) => {
  const [value, setValue] = useState([100000, 20000000]);
  const [value2, setValue2] = useState(0);
  const [filterSubCat, setFilterSubCat] = React.useState();
  const context = useContext(MyContext);
  const [subCatId, setSubCatId] = useState("");
  const { id } = useParams();

  useEffect(() => {
    setSubCatId(id);
  }, [id]);

  const handleChange = (event) => {
    setFilterSubCat(event.target.value);
    props.filterData(event.target.value);
    setSubCatId(event.target.value);
  };

  const filterByRating = (rating) => {
    props.filterByRating(rating, subCatId);
  };

  useEffect(() => {
    props.filterByPrice(value, subCatId);
  }, [value]);

  return (
    <div className="sidebar">
      <div className="filterBox">
        <h6>Product Category</h6>

        <div className="scroll">
          <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={filterSubCat}
            onChange={handleChange}
          >
            {context.subCategoryData?.length > 0 &&
              context.subCategoryData?.map((cat, index) => {
                console.log(cat);
                return (
                  <FormControlLabel
                    value={cat?.id}
                    control={<Radio />}
                    label={cat?.subCat}
                  />
                );
              })}
          </RadioGroup>
          <ul></ul>
        </div>
      </div>

      <div className="filterBox">
        <h6>Filter by Price</h6>

        <RangeSlider
          value={value}
          onInput={setValue}
          min={100000}
          max={20000000}
          step={5}
        />

        <div
          className="d-flex pt-2 pb-2 priceRange"
          style={{ fontSize: "Smaller" }}
        >
          <span>
            <strong className="text-dark">
              <Price amount={value[0]} />
            </strong>
          </span>
          <span className="ml-auto">
            <strong className="text-dark">
              <Price amount={value[1]} />
            </strong>
          </span>
        </div>
      </div>
      <div className="filterBox">
        <h6>Filter by Rating</h6>

        <div className="scroll pl-0">
          <ul>
            <li onClick={() => filterByRating(5)}>
              <Rating
                name="read-only"
                value={5}
                readOnly
                size="small"
                
              />
            </li>
          </ul>
          <ul>
            <li onClick={() => filterByRating(4)}>
              <Rating
                name="read-only"
                value={4}
                readOnly
                size="small"
                
              />
            </li>
          </ul>
          <ul>
            <li onClick={() => filterByRating(3)}>
              <Rating
                name="read-only"
                value={3}
                readOnly
                size="small"
                
              />
            </li>
          </ul>
          <ul>
            <li onClick={() => filterByRating(2)}>
              <Rating
                name="read-only"
                value={2}
                readOnly
                size="small"
                
              />
            </li>
          </ul>
          <ul>
            <li onClick={() => filterByRating(1)}>
              <Rating
                name="read-only"
                value={1}
                readOnly
                size="small"
                
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

      <Link to={"#"}>
        <img
          className="w-100"
          src="https://nhaccutiendat.vn/upload/images/category_banner/poster_category/nhaccukhac_danhmuc.jpg"
        />
      </Link>
    </div>
  );
};

export default Sidebar;
