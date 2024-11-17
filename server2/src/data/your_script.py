from flask import Flask, request, jsonify
from flask_cors import CORS
import pymysql
import numpy as np
from tensorflow.keras.models import Model
from tensorflow.keras.applications import VGG16
from tensorflow.keras.applications.vgg16 import preprocess_input
from tensorflow.keras.preprocessing.image import img_to_array
from PIL import Image
from scipy.spatial.distance import cosine

# Khởi tạo ứng dụng Flask
app = Flask(__name__)
CORS(app)  # Để cho phép giao tiếp giữa frontend (React) và backend

# Kết nối cơ sở dữ liệu
def get_connection():
    return pymysql.connect(
        host="127.0.0.1",
        user="root",
        password="",
        database="website_nhac",
        charset="utf8mb4",
        cursorclass=pymysql.cursors.DictCursor
    )

# Tải mô hình VGG16
base_model = VGG16(weights='imagenet')
model = Model(inputs=base_model.input, outputs=base_model.get_layer('fc1').output)

# Hàm trích xuất đặc trưng từ ảnh
def extract_features(image):
    img = image.resize((224, 224))  # Resize ảnh về đúng kích thước
    img_array = img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)  # Tiền xử lý ảnh
    features = model.predict(img_array)  # Trích xuất đặc trưng
    return features.flatten()

# API tìm kiếm sản phẩm bằng văn bản
@app.route('/api/v1/search-product', methods=['GET'])
def search_product():
    search_term = request.args.get('name', '').strip()  # Lấy từ khóa tìm kiếm từ query params
    if not search_term:
        return jsonify({"error": "Search term is required"}), 400

    try:
        connection = get_connection()
        cursor = connection.cursor()

        # Tìm sản phẩm bằng tên
        query = """
        SELECT p.id, p.name, p.price, pi.imageUrl 
        FROM Products p 
        JOIN ProductImages pi ON p.id = pi.product_id 
        WHERE p.name LIKE %s
        LIMIT 10
        """
        cursor.execute(query, (f"%{search_term}%",))
        products = cursor.fetchall()

        return jsonify(products)  # Trả về danh sách sản phẩm
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()

# API tìm kiếm sản phẩm bằng ảnh
@app.route('/api/v1/search-image', methods=['POST'])
def search_image():
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    try:
        image_file = request.files['image']
        image = Image.open(image_file)

        # Trích xuất đặc trưng từ ảnh đầu vào
        query_features = extract_features(image)

        connection = get_connection()
        cursor = connection.cursor()

        # Lấy danh sách đặc trưng sản phẩm từ cơ sở dữ liệu
        cursor.execute("SELECT id, features FROM Products WHERE features IS NOT NULL")
        products = cursor.fetchall()

        # So sánh đặc trưng với ảnh đầu vào
        results = []
        for product in products:
            product_id = product['id']
            features = np.array(list(map(float, product['features'].split(','))))
            similarity = 1 - cosine(query_features, features)  # Tính độ tương đồng
            results.append((product_id, similarity))

        # Sắp xếp sản phẩm theo độ tương đồng
        results.sort(key=lambda x: x[1], reverse=True)
        top_results = [{"product_id": r[0], "similarity": r[1]} for r in results[:10]]

        return jsonify({"similarProducts": top_results})  # Trả về kết quả
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()

# Khởi động server Flask
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
