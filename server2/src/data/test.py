import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.applications import VGG16
from tensorflow.keras.applications.vgg16 import preprocess_input
from tensorflow.keras.models import Model
from tensorflow.keras.preprocessing.image import load_img, img_to_array
import pymysql
import requests
from io import BytesIO
from PIL import Image

# 1. Kết nối với cơ sở dữ liệu
def get_connection():
    return pymysql.connect(
        host="127.0.0.1",
        user="root",
        password="",
        database="website_nhac",
        charset="utf8mb4",
        cursorclass=pymysql.cursors.DictCursor
    )

# 2. Tải mô hình VGG16
base_model = VGG16(weights='imagenet')
model = Model(inputs=base_model.input, outputs=base_model.get_layer('fc1').output)

# 3. Hàm trích xuất đặc trưng từ hình ảnh
def extract_features(image_path_or_url, is_url=False):
    try:
        if is_url:
            # Tải ảnh từ URL
            response = requests.get(image_path_or_url)
            response.raise_for_status()  # Kiểm tra lỗi HTTP
            img = Image.open(BytesIO(response.content))
        else:
            # Tải ảnh từ đường dẫn cục bộ
            img = load_img(image_path_or_url, target_size=(224, 224))

        # Tiền xử lý ảnh
        img = img.resize((224, 224))  # Đảm bảo kích thước
        img_array = img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = preprocess_input(img_array)

        # Trích xuất đặc trưng
        features = model.predict(img_array)
        return features.flatten()
    except Exception as e:
        print(f"Không thể xử lý ảnh {image_path_or_url}: {e}")
        return None

# 4. Cập nhật cột features trong bảng Product
def update_product_features(connection):
    try:
        cursor = connection.cursor()

        # Lấy danh sách sản phẩm và URL hình ảnh
        cursor.execute("SELECT p.id, pi.imageUrl FROM Products p JOIN ProductImages pi ON p.id = pi.product_id")
        product_images = cursor.fetchall()

        for product in product_images:
            product_id = product['id']
            image_url = product['imageUrl']

            # Trích xuất đặc trưng từ ảnh
            features = extract_features(image_url, is_url=True)
            if features is not None:
                features_str = ','.join(map(str, features))  # Chuyển thành chuỗi

                # Cập nhật cột features
                cursor.execute("UPDATE Products SET features = %s WHERE id = %s", (features_str, product_id))

        # Lưu thay đổi
        connection.commit()
        print("Cập nhật đặc trưng cho tất cả sản phẩm thành công!")
    except Exception as e:
        print(f"Lỗi khi cập nhật đặc trưng: {e}")


# 6. Chạy chương trình
if __name__ == "__main__":
    try:
        # Kết nối cơ sở dữ liệu
        connection = get_connection()

        # Cập nhật đặc trưng cho sản phẩm
        update_product_features(connection)

       

        # Đóng kết nối
        connection.close()
    except Exception as e:
        print(f"Lỗi hệ thống: {e}")
