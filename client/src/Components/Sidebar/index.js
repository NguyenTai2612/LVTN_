import React, { useEffect, useState } from "react";
import { FormControlLabel, Checkbox, RadioGroup, Radio, Rating } from "@mui/material";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import Price from "../Price";
import {
  getAllSubCatByCatIdService,
  apiGetChildSubCategoriesBySubCatId,
} from "../../services";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ filterData, categoryId }) => {
  const [priceRange, setPriceRange] = useState([100000, 20000000]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedRating, setSelectedRating] = useState(null);
  const [subCategoryData, setSubCategoryData] = useState([]);
  const [childSubCategoryData, setChildSubCategoryData] = useState([]);
  const [categoryIdState, setCategoryId] = useState(categoryId);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const response = await getAllSubCatByCatIdService(categoryId);
        setSubCategoryData(response.response);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
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
  }, [priceRange, selectedBrands, selectedRating, categoryIdState, filterData]);

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

  const handleCategoryChange = async (catId) => {
    setCategoryId(catId);
    navigate(`/listing/subcategory/${catId}`);
    try {
      const childResponse = await apiGetChildSubCategoriesBySubCatId(catId);
      setChildSubCategoryData(childResponse.data.data);
    } catch (error) {
      console.error("Error fetching child categories:", error);
    }
  };

  return (
    <div className="sidebar">
      {/* Subcategory Filter */}
      <div className="filterBox">
        <h6>Danh mục phụ</h6>
        <hr className="divider" />
        <RadioGroup
          aria-labelledby="product-category-radio-group"
          name="category-radio-group"
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

      {/* Child Subcategory Filter */}
      <div className="filterBox">
        <h6>Danh mục con</h6>
        <hr className="divider" />
        <div>
          {childSubCategoryData.length > 0 ? (
            childSubCategoryData.map((childCat) => (
              <FormControlLabel
                key={childCat.id}
                control={<Checkbox />}
                label={childCat.name}
                onChange={() => {}}
              />
            ))
          ) : (
            <p>Không có danh mục con nào.</p>
          )}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="filterBox">
        <h6>Filter by Price</h6>
        <RangeSlider
          value={priceRange}
          onInput={setPriceRange}
          min={100000}
          max={20000000}
          step={50000}
        />
        <div className="d-flex pt-2 pb-2 priceRange" style={{ fontSize: "Smaller" }}>
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

      {/* Rating Filter */}
      <div className="filterBox">
        <h6>Filter by Rating</h6>
        <div className="scroll pl-0">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} onClick={() => handleRatingChange(rating)}>
              <Rating name="read-only" value={rating} readOnly size="small" />
            </div>
          ))}
        </div>
      </div>

      {/* Brands Filter */}
      <div className="filterBox">
        <h6>Brands</h6>
        <div className="scroll">
          {["Yamaha", "Casio", "Kawai", "Roland", "Suzuki", "Hãng khác"].map((brand) => (
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
