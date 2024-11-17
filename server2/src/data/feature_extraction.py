import numpy as np
from tensorflow.keras.models import Model
from tensorflow.keras.applications import VGG16
from tensorflow.keras.applications.vgg16 import preprocess_input
from tensorflow.keras.preprocessing.image import img_to_array
from PIL import Image
from scipy.spatial.distance import cosine
import os

# Tải mô hình VGG16
base_model = VGG16(weights='imagenet')
model = Model(inputs=base_model.input, outputs=base_model.get_layer('fc1').output)

def extract_features(image):
    # Tiền xử lý ảnh
    img = image.resize((224, 224))
    img_array = img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)

    # Trích xuất đặc trưng
    features = model.predict(img_array)
    return features.flatten()

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

        # Lấy đặc trưng sản phẩm từ cơ sở dữ liệu
        cursor.execute("SELECT id, features FROM Products WHERE features IS NOT NULL")
        products = cursor.fetchall()

        # Tính khoảng cách Cosine
        results = []
        for product in products:
            product_id = product['id']
            features = np.array(list(map(float, product['features'].split(','))))
            similarity = 1 - cosine(query_features, features)
            results.append((product_id, similarity))

        # Sắp xếp theo độ tương đồng
        results.sort(key=lambda x: x[1], reverse=True)
        top_results = [{"product_id": r[0], "similarity": r[1]} for r in results[:10]]

        return jsonify({"similarProducts": top_results})
    except Exception as e:
        return jsonify({"error": str(e)}), 500