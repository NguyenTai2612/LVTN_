import React, { useEffect, useState } from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import Rating from "@mui/material/Rating";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import Price from "../Price";
import { getAllSubCatByCatIdService } from "../../services";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ filterData, parentCategory, categoryId }) => {
  const [priceRange, setPriceRange] = useState([100000, 20000000]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedRating, setSelectedRating] = useState(null);
  const [subCategoryData, setSubCategoryData] = useState([]);
  const [categoryIdState, setCategoryId] = useState(
    localStorage.getItem("selectedCategoryId") || categoryId
  );

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const response = await getAllSubCatByCatIdService(categoryId);
        setSubCategoryData(response.response);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục phụ:", error);
      }
    };

    if (categoryId) {
      fetchSubCategories();
    }
  }, [categoryId]);

  useEffect(() => {
    filterData(categoryIdState, {
      priceRange,
      brands: selectedBrands,
      rating: selectedRating,
    });
  }, [priceRange, selectedBrands, selectedRating, categoryIdState]);

  const handleBrandChange = (event) => {
    const brand = event.target.value;
    setSelectedBrands((prevBrands) =>
      prevBrands.includes(brand)
        ? prevBrands.filter((b) => b !== brand)
        : [...prevBrands, brand]
    );
  };

  const handleRatingChange = (rating) => {
    setSelectedRating(rating);
  };

  const handleCategoryChange = (catId) => {
    setCategoryId(catId);
    localStorage.setItem("selectedCategoryId", catId); // Save selected category to localStorage
    navigate(`/listing/subcategory/${catId}`);
  };

  return (
    <div className="sidebar">
      <div className="filterBox">
        <h6>Product Category</h6>
        <RadioGroup
          aria-labelledby="product-category-radio-group"
          name="controlled-radio-buttons-group"
          value={categoryIdState}
          onChange={(event) => handleCategoryChange(event.target.value)}
        >
          {subCategoryData?.map((cat) => (
            <FormControlLabel
              key={cat.id}
              value={cat.id}
              control={<Radio />}
              label={cat.subCat}
            />
          ))}
        </RadioGroup>
      </div>

      <div className="filterBox">
        <h6>Filter by Price</h6>
        <RangeSlider
          value={priceRange}
          onInput={setPriceRange}
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
              <Price amount={priceRange[0]} />
            </strong>
          </span>
          <span className="ml-auto">
            <strong className="text-dark">
              <Price amount={priceRange[1]} />
            </strong>
          </span>
        </div>
      </div>

      <div className="filterBox">
        <h6>Filter by Rating</h6>
        <div className="scroll pl-0">
          {[5, 4, 3, 2, 1].map((rating) => (
            <li key={rating} onClick={() => handleRatingChange(rating)}>
              <Rating name="read-only" value={rating} readOnly size="small" />
            </li>
          ))}
        </div>
      </div>

      <div className="filterBox">
        <h6>Brands</h6>
        <div className="scroll">
          {["Yamaha", "Casio", "Kawai", "Roland", "Suzuki", "Hãng khác"].map(
            (brand) => (
              <FormControlLabel
                key={brand}
                className="w-100"
                control={
                  <Checkbox
                    value={brand}
                    checked={selectedBrands.includes(brand)}
                    onChange={handleBrandChange}
                  />
                }
                label={brand}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
