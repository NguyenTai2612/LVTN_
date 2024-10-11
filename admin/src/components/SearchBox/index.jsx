import React, { useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TbCameraSearch } from "react-icons/tb";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import './Header.css';

const SearchBox = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const suggestionsRef = useRef(null);

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

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
  };

  const handleSubmitImage = () => {
    if (selectedImage) {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", selectedImage);

      axios.post('http://localhost:5000/api/v1/search-image', formData)
        .then(response => {
          setLoading(false);
          closeModal();
          const similarProduct = response.data.similarProducts.similar_product;
          navigate(`/search?q=${similarProduct}`);
        })
        .catch(error => {
          setLoading(false);
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
      <div className="camera-icon" onClick={openModal}>
        <TbCameraSearch />
      </div>

      {/* Modal upload ảnh bằng MUI */}
      <Dialog open={isModalOpen} onClose={closeModal}>
        <DialogTitle>Upload Ảnh Tìm Kiếm</DialogTitle>
        <DialogContent>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          {selectedImage && (
            <div className="image-preview">
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="preview"
                style={{ width: "200px", marginTop: "10px" }}
              />
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal} color="primary">
            Đóng
          </Button>
          <Button onClick={handleSubmitImage} color="primary" disabled={loading}>
            {loading ? "Đang tải..." : "Tìm kiếm"}
          </Button>
        </DialogActions>
      </Dialog>

      {suggestions.length > 0 && (
        <ul className="suggestions-list" ref={suggestionsRef}>
          {suggestions.map((product) => (
            <Link to={`/product/detail/${product?.id}`} key={product.id}>
              <li onClick={() => handleSuggestionClick(product.id)}>
                <img src={product.ProductImages[0]?.imageUrl} alt={product.name} />
                <div>
                  <h4>{product.name}</h4>
                  <p>{product.price.toLocaleString()} VNĐ</p>
                </div>
              </li>
            </Link>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBox;
