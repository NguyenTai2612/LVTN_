import os
import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.vgg16 import VGG16, preprocess_input
from flask import Flask, request, jsonify

# Đường dẫn đến file CSV và thư mục chứa ảnh
csv_file_path = 'C:\\Users\\Tai Nguyen\\Desktop\\fullstack-ecom\\server2\\src\\data\\product_images.csv'
image_folder = 'C:\\Users\\Tai Nguyen\\Desktop\\fullstack-ecom\\server2\\src\\data\\images'

# Khởi tạo mô hình VGG16
model = VGG16(weights='imagenet', include_top=False, pooling='avg')

app = Flask(__name__)

# Hàm tải và tiền xử lý ảnh
def load_and_preprocess_image(image_name):
    img_path = os.path.join(image_folder, image_name)
    if not os.path.exists(img_path):
        print(f"File {image_name} not found, skipping.")
        return None  # Bỏ qua ảnh này nếu không tìm thấy

    img = image.load_img(img_path, target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)  # Thêm chiều
    img_array = preprocess_input(img_array)  # Chuẩn hóa
    return img_array

# Tính toán độ tương đồng cosine
def find_similar_product(uploaded_image):
    db_features = load_features()
    if db_features is None:
        return None

    processed_image = load_and_preprocess_image(uploaded_image)
    if processed_image is None:
        return None

    # Trích xuất đặc trưng ảnh tải lên
    uploaded_image_features = model.predict(processed_image)
    
    # Tính độ tương đồng cosine
    similarities = cosine_similarity(uploaded_image_features.reshape(1, -1), db_features)
    
    # Tìm chỉ số có độ tương đồng cao nhất
    max_similarity_index = np.argmax(similarities)
    max_similarity_score = similarities[0, max_similarity_index]

    # Đặt ngưỡng tương đồng, ví dụ: 0.8
    if max_similarity_score < 0.8:
        return None  # Không trả về sản phẩm nếu không đủ tương đồng

    df = pd.read_csv(csv_file_path)
    return df.iloc[max_similarity_index]['Product Name']


# Tải các đặc trưng từ file numpy
def load_features():
    try:
        db_features = np.load('product_features.npy', allow_pickle=True)
        print(f"Database features loaded, shape: {db_features.shape}")
        return db_features
    except FileNotFoundError:
        print("Error: Could not load product_features.npy. Please ensure the file exists.")
        return None

@app.route('/find-similar', methods=['POST'])
def find_similar():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    file = request.files['image']
    
    # Lưu tệp hình ảnh tạm thời để xử lý
    uploaded_image_path = os.path.join(image_folder, file.filename)
    file.save(uploaded_image_path)

    # Tìm sản phẩm tương tự
    similar_product_name = find_similar_product(file.filename)

    if similar_product_name:
        return jsonify({'similar_product': similar_product_name}), 200
    else:
        return jsonify({'error': 'Failed to find similar product.'}), 500

if __name__ == '__main__':
    app.run(port=5001)
