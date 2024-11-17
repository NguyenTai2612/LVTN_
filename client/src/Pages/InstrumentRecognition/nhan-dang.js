


import React, { useRef, useState } from "react";

function InstrumentRecognition() {
  const fileInputRef = useRef(null);
  const [selectedModel, setSelectedModel] = useState("vgg16_model"); // Default model
  const [result, setResult] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      setResult("");
    } else {
      setResult("Vui lòng chọn tệp hình ảnh.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const fileInput = fileInputRef.current;
    if (!fileInput || !fileInput.files[0]) {
      setResult("Vui lòng chọn một ảnh.");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);
    formData.append("model", selectedModel); // Gửi thông tin model

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Lỗi không xác định.");
      }

      const data = await response.json();
      setResult(
        `Kết quả: ${data.class} (Độ chính xác: ${Math.round(
          data.confidence * 100
        )}%)`
      );
    } catch (err) {
      setResult(`Lỗi: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="cartPage1">
      <div className="container pt-3">
        <div className="cartFormWrapper">
          <h1 className="formTitle">Nhận dạng nhạc cụ</h1>
          <form onSubmit={handleSubmit} className="uploadForm">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="modelSelect"
              aria-label="Chọn mô hình"
            >
              <option value="vgg16_model">VGG16</option>
              <option value="mobilenet_model">MobileNet</option>
              <option value="resnet_model">ResNet</option>
            </select>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              className="fileInput"
              aria-label="Chọn ảnh để nhận dạng"
            />
            <button type="submit" className="submitButton">
              Nhận dạng
            </button>
          </form>

          {imagePreview && (
            <div className="imagePreviewWrapper">
              <h3 className="imagePreviewTitle">Ảnh đã chọn:</h3>
              <img
                src={imagePreview}
                alt="Preview"
                className="imagePreview"
              />
            </div>
          )}

          {isLoading && <p className="loadingText">Đang nhận dạng...</p>}

          {result && <p className="resultText">{result}</p>}
        </div>
      </div>
    </div>
  );
}

export default InstrumentRecognition;