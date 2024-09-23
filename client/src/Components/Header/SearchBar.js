import React, { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TbCameraSearch } from "react-icons/tb"; 

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();
  const suggestionsRef = useRef(null); // Tham chiếu đến danh sách gợi ý

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm) {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/v1/search-product?name=${searchTerm}`
          );
          setSuggestions(response.data);
        } catch (error) {
          console.error("Error fetching suggestions:", error);
        }
      } else {
        setSuggestions([]);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchClick = () => {
    if (searchTerm.trim()) {
      navigate(`/search?q=${searchTerm}`);
    }
  };

  const handleSuggestionClick = (productId) => {
    navigate(`/product/${productId}`);
    setSuggestions([]);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSuggestions([]);
  };

  // Xử lý click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

    // Xử lý upload ảnh
    const handleImageUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("image", file);
        
        // Gọi API tìm kiếm bằng ảnh
        axios.post('http://localhost:5000/api/v1/search-image', formData)
          .then(response => {
            // Xử lý kết quả
            console.log(response.data);
            navigate(`/search?q=${response.data.searchTerm}`); // Ví dụ điều hướng đến trang tìm kiếm
          })
          .catch(error => {
            console.error("Error uploading image:", error);
          });
      }
    };

  return (
    <div className="search-wrap">
      <input
        type="text"
        placeholder="Tìm kiếm sản phẩm…"
        value={searchTerm}
        onChange={handleInputChange}
        id="search-input"
      />
      <button type="button" id="search-submit" onClick={handleSearchClick}>
        <FaSearch />
      </button>
      {searchTerm && (
        
        <button className="clear-button" onClick={clearSearch}>
          ×
        </button>

      )}
       {/* Nút upload ảnh */}
       <label htmlFor="image-upload" className="camera-icon">
        <div className="camemra"><TbCameraSearch /></div>
        <input
          type="file"
          id="image-upload"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }} // Ẩn input file
        />
      </label>
      {suggestions.length > 0 && (
        <ul className="suggestions-list" ref={suggestionsRef}>
          {suggestions.map((product) => (
            <li key={product.id} onClick={() => handleSuggestionClick(product.id)}>
              <img src={product.ProductImages[0]?.imageUrl} alt={product.name} />
              <div>
                <h4>{product.name}</h4>
                <p>{product.price.toLocaleString()} VNĐ</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
