import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaMicrophone } from "react-icons/fa"; // Thêm icon microphone
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TbCameraSearch } from "react-icons/tb";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isListening, setIsListening] = useState(false); // Quản lý trạng thái ghi âm
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const suggestionsRef = useRef(null);
  const recognitionRef = useRef(null); // Tham chiếu đến đối tượng nhận dạng giọng nói

  const handleClickOutside = (event) => {
    if (
      suggestionsRef.current &&
      !suggestionsRef.current.contains(event.target)
    ) {
      setSuggestions([]); // Ẩn gợi ý khi click bên ngoài
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Tạo đối tượng SpeechRecognition khi component được mount
    if ("webkitSpeechRecognition" in window) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = "vi-VN"; // Thiết lập ngôn ngữ
      recognition.continuous = false; // Không ghi âm liên tục
      recognition.interimResults = false; // Chỉ nhận kết quả cuối cùng

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchTerm(transcript);
        handleSearchClick(transcript); // Gọi tìm kiếm ngay lập tức
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error("Error with speech recognition:", event.error);
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchClick = (term) => {
    // Đảm bảo term là một chuỗi
    const searchQuery = (typeof term === 'string' ? term : searchTerm || "").trim();
    
    if (searchQuery) {
      navigate(`/search?q=${searchQuery}`);
    } else {
      console.warn("Please enter a valid search term");
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

  // Bắt đầu hoặc dừng ghi âm
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.trim()) {
        // Thêm check cho searchTerm
        try {
          const response = await axios.get(
            `http://localhost:5000/api/v1/search-product?name=${searchTerm}`
          );
          setSuggestions(response.data); // Đảm bảo dữ liệu từ API được cập nhật vào suggestions
        } catch (error) {
          console.error("Error fetching suggestions:", error);
        }
      } else {
        setSuggestions([]); // Nếu không có từ khóa thì xóa danh sách gợi ý
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]); // Luôn theo dõi searchTerm

  // Mở modal khi click icon camera
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Đóng modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  // Xử lý chọn ảnh
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
  };

  // Xử lý submit ảnh
  const handleSubmitImage = () => {
    if (selectedImage) {
      setLoading(true); // Bắt đầu loading
      const formData = new FormData();
      formData.append("image", selectedImage);

      // Gọi API tìm kiếm bằng ảnh
      axios.post('http://localhost:5000/api/v1/search-image', formData)
        .then(response => {
          setLoading(false); // Kết thúc loading
          closeModal(); // Đóng modal sau khi thành công
          const similarProduct = response.data.similarProducts.similar_product;
          navigate(`/search?q=${similarProduct}`); // Điều hướng đến trang tìm kiếm
        })
        .catch(error => {
          setLoading(false); // Kết thúc loading nếu gặp lỗi
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
      <button type="button" className="mic-button" onClick={toggleListening}>
        <FaMicrophone color={isListening ? "red" : "black"} />
      </button>
      {searchTerm && (
        <button className="clear-button" onClick={clearSearch}>
          ×
        </button>
      )}
       {/* Nút mở modal upload ảnh */}
       <div className="camera-icon" onClick={openModal}>
        <TbCameraSearch />
      </div>

      {/* Modal upload ảnh */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Upload Ảnh Tìm Kiếm</h3>
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
            <div className="modal-actions">
              <button onClick={closeModal}>Đóng</button>
              <button onClick={handleSubmitImage} disabled={loading}>
                {loading ? "Đang tải..." : "Tìm kiếm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Các chức năng khác như tìm kiếm bằng ảnh và gợi ý sản phẩm vẫn giữ nguyên */}
      {suggestions.length > 0 && (
        <ul className="suggestions-list" ref={suggestionsRef}>
          {suggestions.map((product) => (
            <li
              key={product.id}
              onClick={() => handleSuggestionClick(product.id)}
            >
              <img
                src={product.ProductImages[0]?.imageUrl}
                alt={product.name}
              />
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
// ok